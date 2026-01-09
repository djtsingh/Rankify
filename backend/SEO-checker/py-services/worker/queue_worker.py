"""
Azure Storage Queue Worker for SEO Scans
Consumes scan jobs from Azure Storage Queue, processes them, and updates the database
"""

import os
import sys
import json
import time
import base64
import logging
import asyncio
import traceback
from datetime import datetime, timezone
from typing import Optional

import httpx
import psycopg2
from psycopg2.extras import RealDictCursor
from azure.storage.queue import QueueClient, QueueMessage
from azure.core.exceptions import ResourceNotFoundError

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from extractor.comprehensive_extractor import ComprehensiveMetricsExtractor

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('seo-worker')

logging.getLogger('azure.core.pipeline.policies.http_logging_policy').setLevel(logging.WARNING)
logging.getLogger('azure').setLevel(logging.WARNING)


class Config:
    """Configuration from environment variables"""
    
    STORAGE_CONNECTION_STRING = os.environ.get('AZURE_STORAGE_CONNECTION_STRING', '')
    QUEUE_NAME = os.environ.get('QUEUE_NAME', 'scan-jobs')
    
    DATABASE_URL = os.environ.get('DATABASE_URL', '')
    
    POLL_INTERVAL = int(os.environ.get('POLL_INTERVAL', '5'))  # seconds
    VISIBILITY_TIMEOUT = int(os.environ.get('VISIBILITY_TIMEOUT', '300'))  # 5 minutes
    MAX_RETRIES = int(os.environ.get('MAX_RETRIES', '3'))
    
    REQUEST_TIMEOUT = int(os.environ.get('REQUEST_TIMEOUT', '30'))
    USER_AGENT = os.environ.get(
        'USER_AGENT', 
        'Mozilla/5.0 (compatible; RankifyBot/1.0; +https://rankify.app/bot)'
    )
    
    @classmethod
    def validate(cls):
        """Validate required configuration"""
        if not cls.STORAGE_CONNECTION_STRING:
            raise ValueError("AZURE_STORAGE_CONNECTION_STRING environment variable is required")
        if not cls.DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable is required")


class DatabaseClient:
    """Database operations"""
    
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self._conn = None
    
    def connect(self):
        """Establish database connection"""
        if self._conn is None or self._conn.closed:
            self._conn = psycopg2.connect(self.connection_string)
        if self._conn.status == psycopg2.extensions.TRANSACTION_STATUS_INERROR:
            self._conn.rollback()
        return self._conn
    
    def close(self):
        """Close database connection"""
        if self._conn and not self._conn.closed:
            self._conn.close()
    
    def get_scan(self, scan_id: str) -> Optional[dict]:
        """Get scan by ID"""
        conn = self.connect()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT * FROM scans WHERE id = %s', (scan_id,))
            return cur.fetchone()
    
    def update_scan_status(self, scan_id: str, status: str):
        """Update scan status"""
        conn = self.connect()
        with conn.cursor() as cur:
            cur.execute(
                'UPDATE scans SET status = %s, updated_at = NOW() WHERE id = %s::uuid',
                (status, scan_id)
            )
            conn.commit()
        logger.info(f"Updated scan {scan_id} status to {status}")
    
    def update_scan_results(self, scan_id: str, results: dict, status: str = 'completed'):
        """Update scan with results"""
        conn = self.connect()
        with conn.cursor() as cur:
            category_scores = results.get('categoryScores', {})
            overall_score = int(sum(category_scores.values()) / max(len(category_scores), 1))
            
            cur.execute('''
                UPDATE scans 
                SET status = %s,
                    completed_at = NOW(),
                    updated_at = NOW()
                WHERE id = %s::uuid
            ''', (status, scan_id))
            
            cur.execute('''
                INSERT INTO scan_results (id, scan_id, score, metrics, category_scores, created_at)
                VALUES (gen_random_uuid(), %s::uuid, %s, %s, %s, NOW())
                ON CONFLICT (scan_id) DO UPDATE 
                SET score = EXCLUDED.score,
                    metrics = EXCLUDED.metrics,
                    category_scores = EXCLUDED.category_scores
            ''', (scan_id, overall_score, json.dumps(results), json.dumps(category_scores)))
            
            recommendations = results.get('recommendations', {})
            self._insert_issues(cur, scan_id, recommendations)
            
            conn.commit()
        logger.info(f"Updated scan {scan_id} with results (score: {overall_score})")
    
    def _insert_issues(self, cursor, scan_id: str, recommendations: dict):
        """Insert issues from recommendations"""
        priority = 1
        
        for fix in recommendations.get('priorityFixes', []):
            cursor.execute('''
                INSERT INTO issues (id, scan_id, type, category, severity, title, description, recommendation, impact_score, priority, created_at)
                VALUES (gen_random_uuid(), %s::uuid, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            ''', (
                scan_id,
                'fix',
                'critical',
                'error',
                fix.get('issue', 'Unknown issue'),
                fix.get('issue'),
                fix.get('recommendation'),
                90,
                priority
            ))
            priority += 1
        
        for win in recommendations.get('quickWins', []):
            cursor.execute('''
                INSERT INTO issues (id, scan_id, type, category, severity, title, description, recommendation, impact_score, priority, created_at)
                VALUES (gen_random_uuid(), %s::uuid, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            ''', (
                scan_id,
                'improvement',
                'warning',
                'warning',
                win.get('issue', 'Unknown issue'),
                win.get('issue'),
                win.get('recommendation'),
                60,
                priority
            ))
            priority += 1
        
        for item in recommendations.get('longTerm', []):
            cursor.execute('''
                INSERT INTO issues (id, scan_id, type, category, severity, title, description, recommendation, impact_score, priority, created_at)
                VALUES (gen_random_uuid(), %s::uuid, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            ''', (
                scan_id,
                'suggestion',
                'improvement',
                'info',
                item.get('issue', 'Unknown issue'),
                item.get('issue'),
                item.get('recommendation'),
                40,
                priority
            ))
            priority += 1
    
    def update_scan_error(self, scan_id: str, error: str):
        """Update scan with error"""
        conn = self.connect()
        with conn.cursor() as cur:
            cur.execute('''
                UPDATE scans 
                SET status = %s,
                    error_message = %s,
                    completed_at = NOW(),
                    updated_at = NOW()
                WHERE id = %s::uuid
            ''', ('failed', error, scan_id))
            conn.commit()
        logger.info(f"Updated scan {scan_id} with error: {error}")


class SEOScanner:
    """SEO scanning operations"""
    
    def __init__(self, config: Config):
        self.config = config
    
    async def fetch_page(self, url: str) -> tuple[str, int, int]:
        """
        Fetch a page and return (html, load_time_ms, size_bytes)
        """
        headers = {
            'User-Agent': self.config.USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        start_time = time.time()
        
        async with httpx.AsyncClient(
            timeout=self.config.REQUEST_TIMEOUT,
            follow_redirects=True
        ) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            
            html = response.text
            load_time_ms = int((time.time() - start_time) * 1000)
            size_bytes = len(response.content)
            
            return html, load_time_ms, size_bytes
    
    async def scan(self, url: str) -> dict:
        """
        Perform a comprehensive SEO scan on a URL
        """
        logger.info(f"Scanning URL: {url}")
        
        if not url.startswith(('http://', 'https://')):
            url = f'https://{url}'
        
        html, load_time_ms, size_bytes = await self.fetch_page(url)
        logger.info(f"Fetched {url} in {load_time_ms}ms ({size_bytes} bytes)")
        
        extractor = ComprehensiveMetricsExtractor(
            html=html,
            url=url,
            load_time_ms=load_time_ms,
            page_size_bytes=size_bytes
        )
        
        results = extractor.extract_all()
        results['scanDate'] = datetime.now(timezone.utc).isoformat()
        
        category_scores = results.get('categoryScores', {})
        results['overallScore'] = int(sum(category_scores.values()) / max(len(category_scores), 1))
        
        results['recommendations'] = self._generate_recommendations(results)
        
        logger.info(f"Scan complete for {url}. Overall score: {results['overallScore']}")
        
        return results
    
    def _generate_recommendations(self, results: dict) -> dict:
        """Generate recommendations based on scan results"""
        quick_wins = []
        priority_fixes = []
        long_term = []
        
        on_page = results.get('onPage', {})
        title_info = on_page.get('title', {})
        if not title_info.get('exists'):
            priority_fixes.append({
                'issue': 'Missing page title',
                'recommendation': 'Add a unique, descriptive title tag between 30-60 characters',
                'impact': 'high',
                'effort': 'low'
            })
        elif not title_info.get('optimal'):
            quick_wins.append({
                'issue': 'Title length not optimal',
                'recommendation': f'Adjust title length to 30-60 characters (current: {title_info.get("length", 0)})',
                'impact': 'medium',
                'effort': 'low'
            })
        
        meta_info = on_page.get('metaDescription', {})
        if not meta_info.get('exists'):
            priority_fixes.append({
                'issue': 'Missing meta description',
                'recommendation': 'Add a compelling meta description between 120-160 characters',
                'impact': 'high',
                'effort': 'low'
            })
        elif not meta_info.get('optimal'):
            quick_wins.append({
                'issue': 'Meta description length not optimal',
                'recommendation': f'Adjust meta description to 120-160 characters (current: {meta_info.get("length", 0)})',
                'impact': 'medium',
                'effort': 'low'
            })
        
        headings = on_page.get('headings', {})
        h1_info = headings.get('h1', {})
        if h1_info.get('count', 0) == 0:
            priority_fixes.append({
                'issue': 'Missing H1 heading',
                'recommendation': 'Add a single, descriptive H1 heading at the top of your content',
                'impact': 'high',
                'effort': 'low'
            })
        elif h1_info.get('count', 0) > 1:
            quick_wins.append({
                'issue': f'Multiple H1 headings ({h1_info.get("count")} found)',
                'recommendation': 'Use only one H1 heading per page',
                'impact': 'medium',
                'effort': 'low'
            })
        
        images = on_page.get('images', {})
        if images.get('withoutAlt', 0) > 0:
            priority_fixes.append({
                'issue': f'{images.get("withoutAlt")} images missing alt text',
                'recommendation': 'Add descriptive alt text to all images for accessibility and SEO',
                'impact': 'high',
                'effort': 'medium'
            })
        
        technical = results.get('technical', {})
        security = technical.get('security', {})
        if not security.get('https'):
            priority_fixes.append({
                'issue': 'Site not using HTTPS',
                'recommendation': 'Enable HTTPS with an SSL certificate for security and SEO',
                'impact': 'critical',
                'effort': 'medium'
            })
        
        mobile = technical.get('mobile', {})
        if not mobile.get('viewportConfigured'):
            priority_fixes.append({
                'issue': 'Viewport not configured',
                'recommendation': 'Add a viewport meta tag for mobile responsiveness',
                'impact': 'high',
                'effort': 'low'
            })
        
        sd = technical.get('structuredData', {})
        if not sd.get('present'):
            long_term.append({
                'issue': 'No structured data found',
                'recommendation': 'Add JSON-LD structured data to enhance search appearance',
                'impact': 'medium',
                'effort': 'medium'
            })
        
        social = results.get('social', {})
        og = social.get('openGraph', {})
        if not og.get('present'):
            quick_wins.append({
                'issue': 'Missing Open Graph tags',
                'recommendation': 'Add Open Graph meta tags for better social media sharing',
                'impact': 'medium',
                'effort': 'low'
            })
        
        content = on_page.get('content', {})
        word_count = content.get('wordCount', 0)
        if word_count < 300:
            long_term.append({
                'issue': f'Low content volume ({word_count} words)',
                'recommendation': 'Add more comprehensive content (aim for 1000+ words for important pages)',
                'impact': 'high',
                'effort': 'high'
            })
        
        performance = results.get('performance', {})
        load_time = performance.get('pageLoadTime', 0)
        if load_time > 3000:
            priority_fixes.append({
                'issue': f'Slow page load time ({load_time}ms)',
                'recommendation': 'Optimize images, enable caching, and minimize render-blocking resources',
                'impact': 'high',
                'effort': 'medium'
            })
        
        return {
            'quickWins': quick_wins,
            'priorityFixes': priority_fixes,
            'longTerm': long_term,
            'totalIssues': len(quick_wins) + len(priority_fixes) + len(long_term)
        }


class QueueWorker:
    """Azure Storage Queue Worker"""
    
    def __init__(self):
        Config.validate()
        
        self.queue_client = QueueClient.from_connection_string(
            Config.STORAGE_CONNECTION_STRING,
            Config.QUEUE_NAME
        )
        self.db = DatabaseClient(Config.DATABASE_URL)
        self.scanner = SEOScanner(Config)
        self.running = False
    
    def decode_message(self, message: QueueMessage) -> dict:
        """Decode a queue message (handles base64 encoding)"""
        try:
            content = message.content
            
            try:
                decoded = base64.b64decode(content).decode('utf-8')
                return json.loads(decoded)
            except:
                return json.loads(content)
        except Exception as e:
            logger.error(f"Failed to decode message: {e}")
            raise
    
    async def process_message(self, message: QueueMessage):
        """Process a single queue message"""
        message_id = message.id
        print(f"PROCESSING MESSAGE: {message_id}", flush=True)
        logger.info(f"Processing message: {message_id}")
        
        try:
            job = self.decode_message(message)
            print(f"JOB DECODED: {job}", flush=True)
            scan_id = job.get('scanId')
            url = job.get('url')
            
            if not scan_id or not url:
                print(f"INVALID JOB: {job}", flush=True)
                logger.error(f"Invalid job message: {job}")
                self.queue_client.delete_message(message)
                return
            
            print(f"SCANNING: scan_id={scan_id}, url={url}", flush=True)
            logger.info(f"Processing scan {scan_id} for URL: {url}")
            
            self.db.update_scan_status(scan_id, 'processing')
            
            results = await self.scanner.scan(url)
            
            self.db.update_scan_results(scan_id, results)
            
            self.queue_client.delete_message(message)
            logger.info(f"Successfully processed scan {scan_id}")
            
        except httpx.HTTPStatusError as e:
            error_msg = f"HTTP error fetching URL: {e.response.status_code}"
            logger.error(f"HTTP error processing message {message_id}: {error_msg}")
            
            job = self.decode_message(message)
            scan_id = job.get('scanId')
            if scan_id:
                self.db.update_scan_error(scan_id, error_msg)
            
            self.queue_client.delete_message(message)
            
        except httpx.RequestError as e:
            error_msg = f"Request error: {str(e)}"
            logger.error(f"Request error processing message {message_id}: {error_msg}")
            
            job = self.decode_message(message)
            scan_id = job.get('scanId')
            
            if message.dequeue_count < Config.MAX_RETRIES:
                logger.info(f"Will retry message {message_id} (attempt {message.dequeue_count})")
            else:
                logger.error(f"Max retries reached for message {message_id}")
                if scan_id:
                    self.db.update_scan_error(scan_id, f"{error_msg} (after {Config.MAX_RETRIES} attempts)")
                self.queue_client.delete_message(message)
                
        except Exception as e:
            error_msg = f"Unexpected error: {str(e)}"
            logger.error(f"Error processing message {message_id}: {error_msg}")
            logger.error(traceback.format_exc())
            
            try:
                job = self.decode_message(message)
                scan_id = job.get('scanId')
                if scan_id:
                    self.db.update_scan_error(scan_id, error_msg)
            except:
                pass
            
            try:
                self.queue_client.delete_message(message)
            except:
                pass
    
    async def run(self):
        """Main worker loop"""
        print("=" * 60, flush=True)
        print("SEO SCANNER WORKER STARTING", flush=True)
        print("=" * 60, flush=True)
        logger.info("Starting SEO Scanner Worker...")
        logger.info(f"Queue: {Config.QUEUE_NAME}")
        logger.info(f"Poll interval: {Config.POLL_INTERVAL}s")
        print(f"Queue: {Config.QUEUE_NAME}", flush=True)
        print(f"Poll interval: {Config.POLL_INTERVAL}s", flush=True)
        
        self.running = True
        
        while self.running:
            try:
                messages = self.queue_client.receive_messages(
                    visibility_timeout=Config.VISIBILITY_TIMEOUT,
                    max_messages=1  # Process one at a time for simplicity
                )
                
                message_list = list(messages)
                if message_list:
                    print(f"RECEIVED {len(message_list)} MESSAGE(S)", flush=True)
                    for message in message_list:
                        await self.process_message(message)
                
                await asyncio.sleep(Config.POLL_INTERVAL)
                
            except ResourceNotFoundError:
                logger.error(f"Queue '{Config.QUEUE_NAME}' not found. Will retry...")
                await asyncio.sleep(30)
                
            except Exception as e:
                logger.error(f"Error in worker loop: {e}")
                logger.error(traceback.format_exc())
                await asyncio.sleep(10)
        
        logger.info("Worker stopped")
    
    def stop(self):
        """Stop the worker"""
        self.running = False
        self.db.close()


async def main():
    """Main entry point"""
    worker = QueueWorker()
    
    try:
        await worker.run()
    except KeyboardInterrupt:
        logger.info("Shutting down...")
        worker.stop()


if __name__ == '__main__':
    asyncio.run(main())

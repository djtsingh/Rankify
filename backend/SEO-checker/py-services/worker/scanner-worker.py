"""
NATS Worker - REAL IMPLEMENTATION
Listens for scan jobs and processes them with REAL analysis
"""

import asyncio
import json
import os
import sys

# ---------------------------------------------------------
# PATH CONFIGURATION
# ---------------------------------------------------------
# Add parent directory to path so we can import 'database', 'scraper', etc.
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# ---------------------------------------------------------
# IMPORTS
# ---------------------------------------------------------
from nats.aio.client import Client as NATS
from database.save_results import save_complete_scan_results
from database.operations import update_scan_status

# Ensure these imports match your actual folder structure
from scraper.web_scraper import WebScraper
from parser.html_parser import HTMLParser
from analyzer.issue_detector import IssueDetector
from analyzer.scorer import Scorer


async def analyze_website(url):
    """
    REAL website analysis using all components
    """
    print(f"   🔍 Starting real analysis for: {url}")
    
    try:
        # Step 1: Scrape website (ASYNC)
        print(f"   📡 Step 1/4: Scraping website...")
        scraper = WebScraper(timeout=30000)
        
        # CRITICAL FIX: We must 'await' the async scraper
        scrape_result = await scraper.scrape(url)
        
        # DEBUG CHECK: Ensure we got a dictionary, not a coroutine
        if asyncio.iscoroutine(scrape_result):
            raise Exception("CRITICAL ERROR: 'scrape_result' is a coroutine! You might have missed an 'await' inside WebScraper.scrape()")
            
        if not scrape_result['success']:
            raise Exception(f"Scraping failed: {scrape_result.get('error', 'Unknown error')}")
        
        print(f"      ✅ Scraping complete ({scrape_result['load_time_ms']}ms)")
        
        # Step 2: Parse HTML (SYNC)
        print(f"   🔬 Step 2/4: Parsing HTML...")
        parser = HTMLParser(scrape_result['html'], url)
        
        # Note: If you made parser.parse() async, add 'await' here. 
        # Otherwise, keep it as is.
        metrics = parser.parse()
        
        if asyncio.iscoroutine(metrics):
            print("   ⚠️ WARNING: parser.parse() returned a coroutine. You made it async but didn't await it.")
            metrics = await metrics
            
        print(f"      ✅ Parsing complete (extracted {len(metrics)} metrics)")
        
        # Step 3: Detect issues (SYNC)
        print(f"   🚨 Step 3/4: Detecting SEO issues...")
        detector = IssueDetector(metrics)
        issues = detector.detect_all_issues()
        print(f"      ✅ Detected {len(issues)} issues")
        
        # Step 4: Calculate score (SYNC)
        print(f"   📊 Step 4/4: Calculating SEO score...")
        scorer = Scorer(metrics)
        score = scorer.calculate_score()
        print(f"      ✅ Score calculated: {score}/100")
        
        # Prepare analysis data
        analysis_data = {
            'score': score,
            'metrics': metrics,
            'issues': issues
        }
        
        print(f"   ✅ Analysis complete! Score: {score}/100, Issues: {len(issues)}")
        return analysis_data
        
    except Exception as e:
        print(f"   ❌ Analysis failed: {e}")
        # Re-raise so the worker knows it failed
        raise


async def process_scan_job(msg):
    """
    Process a single scan job from NATS
    """
    scan_id = None
    
    try:
        # Decode message
        job_data = json.loads(msg.data.decode())
        scan_id = job_data['scan_id']
        url = job_data['url']
        
        print(f"\n{'='*60}")
        print(f"📬 NEW JOB RECEIVED")
        print(f"   Scan ID: {scan_id}")
        print(f"   URL: {url}")
        print(f"{'='*60}")
        
        # Update status to processing
        update_scan_status(scan_id, 'processing')
        print(f"   📝 Status: processing")
        
        # Perform REAL analysis
        analysis_data = await analyze_website(url)
        
        # Save results to database
        print(f"   💾 Saving results to database...")
        save_complete_scan_results(scan_id, analysis_data)
        
        print(f"\n   ✅ JOB COMPLETED SUCCESSFULLY!")
        print(f"   📊 Final Score: {analysis_data['score']}/100")
        print(f"   🚨 Issues Found: {len(analysis_data['issues'])}")
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"\n   ❌ ERROR: {e}")
        print(f"{'='*60}\n")
        
        # Update scan status to failed
        if scan_id:
            try:
                update_scan_status(scan_id, 'failed', str(e))
            except:
                pass


async def run_worker():
    """
    Main worker loop
    """
    nats_url = os.getenv('NATS_URL', 'nats://localhost:4222')
    nc = NATS()
    
    try:
        await nc.connect(nats_url)
        print("\n" + "="*60)
        print("🚀 REAL SEO SCANNER WORKER STARTED")
        print(f"   Connected to NATS: {nats_url}")
        print("="*60 + "\n")
        
        await nc.subscribe("scan.jobs", cb=process_scan_job)
        print("⏳ Waiting for jobs... (Press Ctrl+C to stop)\n")
        
        while True:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\n👋 Worker shutting down...")
    except Exception as e:
        print(f"\n❌ Worker error: {e}")
    finally:
        await nc.close()
        print("✅ Worker stopped\n")


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    asyncio.run(run_worker())
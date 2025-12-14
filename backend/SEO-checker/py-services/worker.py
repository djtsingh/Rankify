# worker.py (Python Celery Worker)
from celery import Celery
import nats
import asyncio
import json
from seo_checker.scraper import scrape_url

app = Celery('rankify', broker='nats://localhost:4222')

# NATS subscriber
async def listen_for_jobs():
    nc = await nats.connect("nats://localhost:4222")
    
    async def message_handler(msg):
        job = json.loads(msg.data)
        
        # Trigger Celery task
        scan_website.delay(job['scan_id'], job['url'])
    
    await nc.subscribe("scan-jobs", cb=message_handler)

@app.task
def scan_website(scan_id, url):
    """
    Main orchestration function
    """
    try:
        # Update status
        update_scan_status(scan_id, "processing")
        
        # Step 1: Scrape website
        html, metrics = scrape_url(url)
        
        # Step 2: Parse HTML
        parsed_data = parse_html(html)
        
        # Step 3: Run checks
        check_results = run_seo_checks(parsed_data, metrics)
        
        # Step 4: Calculate score
        score = calculate_score(check_results)
        
        # Step 5: Prioritize issues
        priority_issues = prioritize_issues(check_results)
        
        # Step 6: Save results
        save_results(scan_id, score, priority_issues)
        
        # Step 7: Update status
        update_scan_status(scan_id, "completed")
        
        # Step 8: Cache result
        cache_result(url, score, priority_issues)
        
    except Exception as e:
        update_scan_status(scan_id, "failed", str(e))
        raise
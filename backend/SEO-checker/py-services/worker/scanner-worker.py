import sys
import os

# 1. Get the path to the current file (scanner-worker.py)
current_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Get the path to 'py-services' (parent of 'worker')
py_services_dir = os.path.dirname(current_dir)

# 3. Add 'py-services' to the Python search path
if py_services_dir not in sys.path:
    sys.path.insert(0, py_services_dir)

# Now Python can see the 'database' folder sitting inside py-services
from database.save_results import save_complete_scan_results

"""
NATS Worker - Listens for scan jobs and processes them
"""

import asyncio
import json
from nats.aio.client import Client as NATS
from database.save_results import save_complete_scan_results
from database.operations import update_scan_status


# Dummy analysis function (will be replaced with real analysis later)
def analyze_website(url):
    """
    Dummy analysis - simulates real analysis
    In Phase 2, this will be replaced with real Playwright + AI analysis
    """
    print(f"   🔍 Analyzing: {url}")
    print(f"   ⏳ Simulating 3 seconds of work...")
    import time
    time.sleep(3)  # Simulate processing time
    
    # Generate dummy results
    analysis_data = {
        'score': 72,
        'metrics': {
            'url': url,
            'title': 'Example Page',
            'title_length': 12,
            'meta_description': 'A sample description',
            'meta_description_length': 20,
            'h1_tags': ['Main Heading'],
            'h1_count': 1,
            'h2_count': 4,
            'word_count': 320,
            'image_count': 6,
            'images_without_alt': 2,
            'internal_links_count': 12,
            'page_speed_lcp': 2.8,
            'page_speed_fid': 120,
            'page_speed_cls': 0.05,
            'mobile_friendly': True,
            'https_enabled': True,
            'has_canonical': True,
            'broken_links_count': 1
        },
        'issues': [
            {
                'type': 'page_speed',
                'severity': 'warning',
                'title': 'Page speed could be improved',
                'description': 'LCP is 2.8 seconds (target: < 2.5s)',
                'recommendation': 'Optimize images, enable compression',
                'impact_score': 0.75,
                'expected_improvement': '+10% traffic',
                'time_to_fix_hours': 3,
                'data': {'current_lcp': 2.8, 'target_lcp': 2.5}
            },
            {
                'type': 'image_alt',
                'severity': 'warning',
                'title': 'Some images missing alt text',
                'description': '2 out of 6 images lack alt text',
                'recommendation': 'Add descriptive alt text',
                'impact_score': 0.60,
                'expected_improvement': '+5% accessibility',
                'time_to_fix_hours': 1,
                'data': {'missing_alt': 2, 'total_images': 6}
            }
        ]
    }
    
    print(f"   ✅ Analysis complete! Score: {analysis_data['score']}")
    return analysis_data


async def process_scan_job(msg):
    """
    Process a single scan job from NATS
    """
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
        print(f"   📝 Status updated: processing")
        
        # Perform analysis (dummy for now)
        analysis_data = analyze_website(url)
        
        # Save results to database
        print(f"   💾 Saving results to database...")
        save_complete_scan_results(scan_id, analysis_data)
        
        print(f"   ✅ JOB COMPLETED SUCCESSFULLY!")
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
        # Update scan status to failed
        try:
            update_scan_status(scan_id, 'failed', str(e))
        except:
            pass


async def run_worker():
    """
    Main worker loop - connects to NATS and listens for jobs
    """
    # Get NATS URL from environment
    nats_url = os.getenv('NATS_URL', 'nats://localhost:4222')
    
    # Connect to NATS
    nc = NATS()
    
    try:
        await nc.connect(nats_url)
        print("\n" + "="*60)
        print("🚀 WORKER STARTED")
        print(f"   Connected to NATS: {nats_url}")
        print(f"   Listening on subject: scan.jobs")
        print("="*60 + "\n")
        
        # Subscribe to scan.jobs
        await nc.subscribe("scan.jobs", cb=process_scan_job)
        
        # Keep worker running
        print("⏳ Waiting for jobs... (Press Ctrl+C to stop)\n")
        
        # Run forever
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
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Run worker
    asyncio.run(run_worker())# python-services/database/save_results.py
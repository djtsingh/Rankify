# scraper.py (Python)
from playwright.async_api import async_playwright
import asyncio

async def scrape_url(url):
    """
    Launch browser, navigate, extract data
    """
    async with async_playwright() as p:
        # Launch headless Chrome
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='RankifyBot/1.0'
        )
        page = await context.new_page()
        
        # Navigate
        response = await page.goto(url, wait_until='networkidle')
        
        # Extract HTML
        html = await page.content()
        
        # Measure Core Web Vitals
        metrics = await page.evaluate('''() => {
            return {
                lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.renderTime || 0,
                fid: performance.getEntriesByType('first-input')[0]?.processingStart || 0,
                cls: performance.getEntriesByType('layout-shift').reduce((sum, entry) => sum + entry.value, 0)
            }
        }''')
        
        # Capture screenshot
        await page.screenshot(path=f'/tmp/{scan_id}.png')
        
        # Close
        await browser.close()
        
        return html, {
            'status_code': response.status,
            'headers': dict(response.headers),
            'load_time': metrics.get('loadEventEnd', 0),
            'lcp': metrics['lcp'],
            'fid': metrics['fid'],
            'cls': metrics['cls']
        }
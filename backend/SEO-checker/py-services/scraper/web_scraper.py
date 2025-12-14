import asyncio
import time
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

class WebScraper:
    def __init__(self, timeout=30000):
        """
        Initialize web scraper
        
        Args:
            timeout (int): Page load timeout in milliseconds (default: 30s)
        """
        self.timeout = timeout
    
    async def scrape(self, url):
        """
        Scrape a website asynchronously and return all relevant data
        """
        result = {
            'success': False,
            'url': url,
            'html': None,
            'status_code': None,
            'load_time_ms': None,
            'page_title': None,
            'screenshot': None,
            'error': None
        }
        
        try:
            # Use async_playwright instead of sync_playwright
            async with async_playwright() as p:
                # Launch browser (headless mode) -> Must await this
                browser = await p.chromium.launch(headless=True)
                
                # Create new page -> Must await this
                page = await browser.new_page()
                
                # Track load time
                start_time = time.time()
                
                # Navigate to URL -> Must await this
                response = await page.goto(url, timeout=self.timeout, wait_until='networkidle')
                
                # Calculate load time
                load_time = (time.time() - start_time) * 1000  # Convert to ms
                
                # Get status code
                status_code = response.status if response else None
                
                # Check if page loaded successfully
                if status_code and 200 <= status_code < 300:
                    # Get HTML content -> Must await this
                    html = await page.content()
                    
                    # Get page title -> Must await this
                    page_title = await page.title()
                    
                    # Take screenshot -> Must await this
                    screenshot = await page.screenshot(full_page=False)
                    
                    result.update({
                        'success': True,
                        'html': html,
                        'status_code': status_code,
                        'load_time_ms': round(load_time, 2),
                        'page_title': page_title,
                        'screenshot': screenshot
                    })
                    
                    print(f"   ✅ Page loaded successfully")
                    print(f"      Status: {status_code}")
                    print(f"      Load time: {load_time:.2f}ms")
                    print(f"      Title: {page_title[:50]}...")
                    
                else:
                    result['error'] = f"HTTP {status_code}"
                    print(f"   ❌ Page returned status code: {status_code}")
                
                # Close browser -> Must await this
                await browser.close()
                
        except PlaywrightTimeout:
            result['error'] = f"Timeout: Page took longer than {self.timeout}ms to load"
            print(f"   ❌ Timeout: {url}")
            
        except Exception as e:
            result['error'] = str(e)
            print(f"   ❌ Scraping error: {e}")
        
        return result


# ============================================
# TEST FUNCTION (UPDATED FOR ASYNC)
# ============================================

async def test_scraper():
    """
    Test the async web scraper with real websites
    """
    print("\n" + "="*60)
    print("🧪 TESTING REAL WEB SCRAPER (ASYNC)")
    print("="*60)
    
    scraper = WebScraper(timeout=30000)
    
    # Test URLs
    test_urls = [
        "https://example.com",
        "https://google.com",
        "https://github.com"
    ]
    
    for i, url in enumerate(test_urls, 1):
        print(f"\n📝 Test {i}/{len(test_urls)}: {url}")
        
        # Must await the scrape method
        result = await scraper.scrape(url)
        
        if result['success']:
            print(f"   ✅ SUCCESS")
            print(f"   📊 HTML length: {len(result['html'])} chars")
            print(f"   ⏱️  Load time: {result['load_time_ms']}ms")
            print(f"   📄 Title: {result['page_title']}")
        else:
            print(f"   ❌ FAILED: {result['error']}")
    
    print("\n" + "="*60)
    print("✅ SCRAPER TEST COMPLETE")
    print("="*60 + "\n")


if __name__ == "__main__":
    # Run the async test function using asyncio
    asyncio.run(test_scraper())
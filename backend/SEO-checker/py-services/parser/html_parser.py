# py-services/parser/html_parser.py

"""
Real HTML Parser using BeautifulSoup
Extracts all SEO-relevant data from HTML
"""

from bs4 import BeautifulSoup
from urllib.parse import urlparse
import re


class HTMLParser:
    def __init__(self, html, url):
        """
        Initialize HTML parser
        
        Args:
            html (str): HTML content
            url (str): Original URL (for link validation)
        """
        self.soup = BeautifulSoup(html, 'lxml')
        self.url = url
        self.domain = urlparse(url).netloc
    
    def parse(self):
        """
        Parse HTML and extract all SEO metrics
        
        Returns:
            dict: All extracted metrics
        """
        metrics = {
            'url': self.url,
            
            # Title
            'title': self._get_title(),
            'title_length': self._get_title_length(),
            
            # Meta Description
            'meta_description': self._get_meta_description(),
            'meta_description_length': self._get_meta_description_length(),
            
            # Headings
            'h1_tags': self._get_h1_tags(),
            'h1_count': self._get_h1_count(),
            'h2_count': self._get_h2_count(),
            
            # Content
            'word_count': self._get_word_count(),
            
            # Images
            'image_count': self._get_image_count(),
            'images_without_alt': self._get_images_without_alt(),
            
            # Links
            'internal_links_count': self._get_internal_links_count(),
            'external_links_count': self._get_external_links_count(),
            
            # Technical
            'https_enabled': self._is_https(),
            'has_canonical': self._has_canonical(),
            'canonical_url': self._get_canonical_url(),
            
            # Open Graph (Social Media)
            'has_og_tags': self._has_og_tags(),
            'og_title': self._get_og_tag('og:title'),
            'og_description': self._get_og_tag('og:description'),
            'og_image': self._get_og_tag('og:image'),
        }
        
        return metrics
    
    # ============================================
    # TITLE METHODS
    # ============================================
    
    def _get_title(self):
        """Get page title"""
        title_tag = self.soup.find('title')
        return title_tag.get_text().strip() if title_tag else None
    
    def _get_title_length(self):
        """Get title length"""
        title = self._get_title()
        return len(title) if title else 0
    
    # ============================================
    # META DESCRIPTION METHODS
    # ============================================
    
    def _get_meta_description(self):
        """Get meta description"""
        meta_tag = self.soup.find('meta', attrs={'name': 'description'})
        if meta_tag and meta_tag.get('content'):
            return meta_tag['content'].strip()
        return None
    
    def _get_meta_description_length(self):
        """Get meta description length"""
        desc = self._get_meta_description()
        return len(desc) if desc else 0
    
    # ============================================
    # HEADING METHODS
    # ============================================
    
    def _get_h1_tags(self):
        """Get all H1 tags"""
        h1_tags = self.soup.find_all('h1')
        return [h1.get_text().strip() for h1 in h1_tags]
    
    def _get_h1_count(self):
        """Count H1 tags"""
        return len(self._get_h1_tags())
    
    def _get_h2_count(self):
        """Count H2 tags"""
        return len(self.soup.find_all('h2'))
    
    # ============================================
    # CONTENT METHODS
    # ============================================
    
    def _get_word_count(self):
        """Count words in visible text"""
        # Get all text
        text = self.soup.get_text()
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Split into words
        words = text.split()
        
        return len(words)
    
    # ============================================
    # IMAGE METHODS
    # ============================================
    
    def _get_image_count(self):
        """Count all images"""
        return len(self.soup.find_all('img'))
    
    def _get_images_without_alt(self):
        """Count images without alt text"""
        images = self.soup.find_all('img')
        count = 0
        for img in images:
            alt = img.get('alt', '').strip()
            if not alt:
                count += 1
        return count
    
    # ============================================
    # LINK METHODS
    # ============================================
    
    def _get_internal_links_count(self):
        """Count internal links"""
        links = self.soup.find_all('a', href=True)
        count = 0
        for link in links:
            href = link['href']
            # Check if internal link
            if href.startswith('/') or self.domain in href:
                count += 1
        return count
    
    def _get_external_links_count(self):
        """Count external links"""
        links = self.soup.find_all('a', href=True)
        count = 0
        for link in links:
            href = link['href']
            # Check if external link
            if href.startswith('http') and self.domain not in href:
                count += 1
        return count
    
    # ============================================
    # TECHNICAL METHODS
    # ============================================
    
    def _is_https(self):
        """Check if URL uses HTTPS"""
        return self.url.startswith('https://')
    
    def _has_canonical(self):
        """Check if page has canonical tag"""
        canonical = self.soup.find('link', attrs={'rel': 'canonical'})
        return canonical is not None
    
    def _get_canonical_url(self):
        """Get canonical URL"""
        canonical = self.soup.find('link', attrs={'rel': 'canonical'})
        if canonical and canonical.get('href'):
            return canonical['href']
        return None
    
    # ============================================
    # OPEN GRAPH METHODS
    # ============================================
    
    def _has_og_tags(self):
        """Check if page has Open Graph tags"""
        og_tags = self.soup.find_all('meta', attrs={'property': re.compile(r'^og:')})
        return len(og_tags) > 0
    
    def _get_og_tag(self, property_name):
        """Get specific Open Graph tag value"""
        og_tag = self.soup.find('meta', attrs={'property': property_name})
        if og_tag and og_tag.get('content'):
            return og_tag['content']
        return None


# ============================================
# TEST FUNCTION
# ============================================

def test_parser():
    """
    Test the HTML parser with real HTML
    """
    print("\n" + "="*60)
    print("🧪 TESTING REAL HTML PARSER")
    print("="*60)
    
    # Sample HTML (you can replace with real scraped HTML)
    sample_html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Page - SEO Example</title>
        <meta name="description" content="This is a test page for SEO analysis with a proper meta description that is long enough.">
        <link rel="canonical" href="https://example.com/test">
        <meta property="og:title" content="Test Page OG Title">
        <meta property="og:description" content="OG Description">
    </head>
    <body>
        <h1>Main Heading</h1>
        <h2>Subheading 1</h2>
        <h2>Subheading 2</h2>
        <p>This is a paragraph with some content. It has multiple words for word counting.</p>
        <img src="image1.jpg" alt="Image with alt text">
        <img src="image2.jpg">
        <a href="/internal-page">Internal Link</a>
        <a href="https://external.com">External Link</a>
    </body>
    </html>
    """
    
    parser = HTMLParser(sample_html, "https://example.com/test")
    metrics = parser.parse()
    
    print("\n📊 EXTRACTED METRICS:")
    print(f"   Title: {metrics['title']}")
    print(f"   Title Length: {metrics['title_length']} chars")
    print(f"   Meta Description: {metrics['meta_description'][:50]}...")
    print(f"   Meta Length: {metrics['meta_description_length']} chars")
    print(f"   H1 Tags: {metrics['h1_tags']}")
    print(f"   H1 Count: {metrics['h1_count']}")
    print(f"   H2 Count: {metrics['h2_count']}")
    print(f"   Word Count: {metrics['word_count']}")
    print(f"   Images: {metrics['image_count']}")
    print(f"   Images without alt: {metrics['images_without_alt']}")
    print(f"   Internal Links: {metrics['internal_links_count']}")
    print(f"   External Links: {metrics['external_links_count']}")
    print(f"   HTTPS: {metrics['https_enabled']}")
    print(f"   Has Canonical: {metrics['has_canonical']}")
    print(f"   Canonical URL: {metrics['canonical_url']}")
    print(f"   Has OG Tags: {metrics['has_og_tags']}")
    
    print("\n" + "="*60)
    print("✅ PARSER TEST COMPLETE")
    print("="*60 + "\n")


if __name__ == "__main__":
    test_parser()
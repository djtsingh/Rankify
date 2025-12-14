# parser.py (Python)
from bs4 import BeautifulSoup
from lxml import html as lxml_html

def parse_html(html_content):
    """
    Extract all SEO-relevant elements
    """
    soup = BeautifulSoup(html_content, 'lxml')
    
    # Extract title
    title_tag = soup.find('title')
    title = title_tag.string if title_tag else None
    
    # Extract meta description
    meta_desc = soup.find('meta', attrs={'name': 'description'})
    description = meta_desc.get('content') if meta_desc else None
    
    # Extract headings
    headings = {
        'h1': [h.get_text(strip=True) for h in soup.find_all('h1')],
        'h2': [h.get_text(strip=True) for h in soup.find_all('h2')],
        'h3': [h.get_text(strip=True) for h in soup.find_all('h3')],
        'h4': [h.get_text(strip=True) for h in soup.find_all('h4')],
        'h5': [h.get_text(strip=True) for h in soup.find_all('h5')],
        'h6': [h.get_text(strip=True) for h in soup.find_all('h6')]
    }
    
    # Extract images
    images = []
    for img in soup.find_all('img'):
        images.append({
            'src': img.get('src'),
            'alt': img.get('alt'),
            'width': img.get('width'),
            'height': img.get('height')
        })
    
    # Extract links
    internal_links = []
    external_links = []
    base_domain = extract_domain(url)
    
    for link in soup.find_all('a', href=True):
        href = link.get('href')
        if base_domain in href or href.startswith('/'):
            internal_links.append({
                'href': href,
                'text': link.get_text(strip=True),
                'rel': link.get('rel')
            })
        else:
            external_links.append({
                'href': href,
                'text': link.get_text(strip=True),
                'rel': link.get('rel')
            })
    
    # Extract text content
    text_content = soup.get_text(separator=' ', strip=True)
    word_count = len(text_content.split())
    
    # Extract canonical
    canonical = soup.find('link', attrs={'rel': 'canonical'})
    canonical_url = canonical.get('href') if canonical else None
    
    # Extract schema markup
    schema_scripts = soup.find_all('script', type='application/ld+json')
    schemas = [json.loads(s.string) for s in schema_scripts if s.string]
    
    return {
        'title': title,
        'meta_description': description,
        'headings': headings,
        'images': images,
        'internal_links': internal_links,
        'external_links': external_links,
        'word_count': word_count,
        'canonical_url': canonical_url,
        'schemas': schemas,
        'html_size': len(html_content)
    }
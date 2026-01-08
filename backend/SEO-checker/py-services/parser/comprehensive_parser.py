# py-services/parser/comprehensive_parser.py

"""
Comprehensive HTML Parser
Extracts ALL SEO-relevant metrics to match frontend requirements
"""

from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
import re
import json
from collections import Counter


class ComprehensiveHTMLParser:
    """
    Comprehensive HTML parser that extracts all metrics required by the frontend.
    
    Frontend expects:
    - Technical SEO (crawlability, rendering, mobile, security, i18n, structured data)
    - On-Page SEO (title, meta, headings, content, keywords, images, links, URLs)
    - Content Intelligence (sentiment, topics, EEAT, AI readiness, content gaps)
    - User Experience (accessibility, navigation, engagement)
    - Social SEO (Open Graph, Twitter Cards)
    - Performance metrics (from scraper)
    """
    
    def __init__(self, html: str, url: str, load_time_ms: float = 0):
        """
        Initialize comprehensive HTML parser
        
        Args:
            html: HTML content to parse
            url: Original URL
            load_time_ms: Page load time in milliseconds (from scraper)
        """
        self.soup = BeautifulSoup(html, 'lxml')
        self.html = html
        self.url = url
        self.parsed_url = urlparse(url)
        self.domain = self.parsed_url.netloc
        self.load_time_ms = load_time_ms
        
        # Pre-compute common elements
        self._all_links = self.soup.find_all('a', href=True)
        self._all_images = self.soup.find_all('img')
        self._all_text = self._extract_visible_text()
        self._word_list = self._all_text.split()
    
    def parse(self) -> dict:
        """
        Parse HTML and extract ALL comprehensive SEO metrics
        
        Returns:
            dict: Complete metrics matching frontend structure
        """
        return {
            'url': self.url,
            'domain': self.domain,
            
            # === TECHNICAL SEO ===
            'technical': self._extract_technical(),
            
            # === ON-PAGE SEO ===
            'onPage': self._extract_on_page(),
            
            # === CONTENT INTELLIGENCE ===
            'contentIntelligence': self._extract_content_intelligence(),
            
            # === USER EXPERIENCE ===
            'userExperience': self._extract_user_experience(),
            
            # === SOCIAL SEO ===
            'social': self._extract_social(),
            
            # === PERFORMANCE (basic, enhanced by scraper) ===
            'performance': self._extract_performance(),
            
            # === LEGACY FLAT METRICS (for backward compatibility) ===
            **self._extract_flat_metrics()
        }
    
    # ========================================
    # TECHNICAL SEO EXTRACTION
    # ========================================
    
    def _extract_technical(self) -> dict:
        """Extract all technical SEO metrics"""
        return {
            'crawlability': {
                'robotsTxt': self._check_robots_meta(),
                'xmlSitemap': {'exists': None, 'valid': None},  # Requires external check
                'indexability': self._check_indexability(),
                'canonicalization': self._check_canonicalization(),
            },
            'rendering': {
                'jsRendering': self._detect_js_framework(),
                'renderBlockingResources': self._count_render_blocking(),
                'dynamicContent': self._has_dynamic_content(),
            },
            'mobile': {
                'viewportConfigured': self._has_viewport(),
                'mobileFirst': self._has_viewport(),
                'responsiveDesign': self._has_responsive_hints(),
                'touchTargets': {'adequate': True, 'issues': 0},  # Would need JS analysis
                'fontSizes': {'readable': True, 'issues': 0},
            },
            'security': {
                'https': self.url.startswith('https://'),
                'mixedContent': {'count': self._count_mixed_content(), 'urls': []},
                'securityHeaders': {},  # Requires HTTP response headers
            },
            'internationalization': {
                'hreflangTags': self._extract_hreflang(),
                'languageDeclaration': self._get_language(),
                'contentLanguage': self._get_language(),
            },
            'structuredData': self._extract_structured_data(),
        }
    
    def _check_robots_meta(self) -> dict:
        """Check robots meta tag"""
        robots = self.soup.find('meta', attrs={'name': 'robots'})
        content = robots.get('content', '') if robots else ''
        return {
            'exists': robots is not None,
            'content': content,
            'noindex': 'noindex' in content.lower(),
            'nofollow': 'nofollow' in content.lower(),
        }
    
    def _check_indexability(self) -> dict:
        """Check if page is indexable"""
        robots = self._check_robots_meta()
        return {
            'indexable': not robots['noindex'],
            'blockers': ['noindex meta tag'] if robots['noindex'] else [],
        }
    
    def _check_canonicalization(self) -> dict:
        """Check canonical tag"""
        canonical = self.soup.find('link', attrs={'rel': 'canonical'})
        canonical_url = canonical.get('href', '') if canonical else None
        return {
            'hasCanonical': canonical is not None,
            'canonicalUrl': canonical_url,
            'selfReferencing': canonical_url == self.url if canonical_url else False,
            'conflicts': [],
        }
    
    def _detect_js_framework(self) -> str:
        """Detect JavaScript framework used"""
        html_lower = self.html.lower()
        if 'react' in html_lower or '__next' in html_lower:
            return 'React/Next.js'
        elif 'vue' in html_lower or '__vue' in html_lower:
            return 'Vue.js'
        elif 'angular' in html_lower or 'ng-' in html_lower:
            return 'Angular'
        elif 'svelte' in html_lower:
            return 'Svelte'
        return 'traditional'
    
    def _count_render_blocking(self) -> int:
        """Count render-blocking resources"""
        count = 0
        # CSS in head without media/async
        for link in self.soup.find_all('link', rel='stylesheet'):
            if not link.get('media') or link.get('media') == 'all':
                count += 1
        # JS in head without async/defer
        for script in self.soup.head.find_all('script', src=True) if self.soup.head else []:
            if not script.get('async') and not script.get('defer'):
                count += 1
        return count
    
    def _has_dynamic_content(self) -> bool:
        """Check for signs of dynamic content"""
        return bool(
            self.soup.find_all('script', src=True) or
            self.soup.find_all(attrs={'data-react': True}) or
            self.soup.find_all(attrs={'ng-': True})
        )
    
    def _has_viewport(self) -> bool:
        """Check if viewport meta tag exists"""
        viewport = self.soup.find('meta', attrs={'name': 'viewport'})
        return viewport is not None
    
    def _has_responsive_hints(self) -> bool:
        """Check for responsive design hints"""
        # Check for responsive meta viewport
        viewport = self.soup.find('meta', attrs={'name': 'viewport'})
        if viewport and 'width=device-width' in viewport.get('content', ''):
            return True
        # Check for media queries in inline styles
        styles = self.soup.find_all('style')
        for style in styles:
            if '@media' in str(style):
                return True
        return False
    
    def _count_mixed_content(self) -> int:
        """Count HTTP resources on HTTPS page"""
        if not self.url.startswith('https://'):
            return 0
        count = 0
        for img in self._all_images:
            src = img.get('src', '')
            if src.startswith('http://'):
                count += 1
        for script in self.soup.find_all('script', src=True):
            if script['src'].startswith('http://'):
                count += 1
        return count
    
    def _extract_hreflang(self) -> dict:
        """Extract hreflang tags"""
        hreflang_tags = self.soup.find_all('link', rel='alternate', hreflang=True)
        languages = [tag.get('hreflang') for tag in hreflang_tags]
        return {
            'exists': len(hreflang_tags) > 0,
            'valid': True,  # Would need validation
            'languages': languages,
        }
    
    def _get_language(self) -> str:
        """Get page language"""
        html_tag = self.soup.find('html')
        if html_tag:
            return html_tag.get('lang', 'en')
        return 'en'
    
    def _extract_structured_data(self) -> dict:
        """Extract JSON-LD structured data"""
        scripts = self.soup.find_all('script', type='application/ld+json')
        types = []
        for script in scripts:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict):
                    types.append(data.get('@type', 'Unknown'))
                elif isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict):
                            types.append(item.get('@type', 'Unknown'))
            except (json.JSONDecodeError, TypeError):
                pass
        
        return {
            'present': len(scripts) > 0,
            'types': list(set(types)),
            'valid': True,  # Would need schema validation
            'errors': 0,
            'warnings': 0,
            'richResultsEligible': types,
        }
    
    # ========================================
    # ON-PAGE SEO EXTRACTION
    # ========================================
    
    def _extract_on_page(self) -> dict:
        """Extract all on-page SEO metrics"""
        return {
            'title': self._extract_title_metrics(),
            'metaDescription': self._extract_meta_description_metrics(),
            'headings': self._extract_heading_metrics(),
            'content': self._extract_content_metrics(),
            'keywords': self._extract_keyword_metrics(),
            'images': self._extract_image_metrics(),
            'links': self._extract_link_metrics(),
            'urls': self._extract_url_metrics(),
        }
    
    def _extract_title_metrics(self) -> dict:
        """Extract title tag metrics"""
        title_tag = self.soup.find('title')
        title = title_tag.get_text().strip() if title_tag else ''
        length = len(title)
        return {
            'exists': bool(title),
            'content': title,
            'length': length,
            'optimal': 30 <= length <= 60,
            'keywordPresent': False,  # Would need keyword input
            'uniqueOnSite': True,
        }
    
    def _extract_meta_description_metrics(self) -> dict:
        """Extract meta description metrics"""
        meta = self.soup.find('meta', attrs={'name': 'description'})
        content = meta.get('content', '').strip() if meta else ''
        length = len(content)
        return {
            'exists': bool(content),
            'content': content,
            'length': length,
            'optimal': 120 <= length <= 160,
            'keywordPresent': False,
            'callToAction': any(cta in content.lower() for cta in ['learn', 'discover', 'get', 'try', 'start']),
            'uniqueOnSite': True,
        }
    
    def _extract_heading_metrics(self) -> dict:
        """Extract heading structure metrics"""
        h1_tags = self.soup.find_all('h1')
        h2_tags = self.soup.find_all('h2')
        h3_tags = self.soup.find_all('h3')
        h4_tags = self.soup.find_all('h4')
        h5_tags = self.soup.find_all('h5')
        h6_tags = self.soup.find_all('h6')
        
        return {
            'h1': {
                'count': len(h1_tags),
                'content': [h.get_text().strip() for h in h1_tags[:5]],
                'optimal': len(h1_tags) == 1,
            },
            'h2': {
                'count': len(h2_tags),
                'content': [h.get_text().strip() for h in h2_tags[:10]],
            },
            'h3': {'count': len(h3_tags), 'content': []},
            'h4': {'count': len(h4_tags), 'content': []},
            'h5': {'count': len(h5_tags), 'content': []},
            'h6': {'count': len(h6_tags), 'content': []},
            'hierarchy': self._check_heading_hierarchy(),
        }
    
    def _check_heading_hierarchy(self) -> dict:
        """Check if heading hierarchy is valid"""
        headings = self.soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        issues = []
        prev_level = 0
        for h in headings:
            level = int(h.name[1])
            if prev_level > 0 and level > prev_level + 1:
                issues.append(f'Skipped heading level (H{prev_level} to H{level})')
            prev_level = level
        return {
            'valid': len(issues) == 0,
            'issues': issues[:3],
        }
    
    def _extract_content_metrics(self) -> dict:
        """Extract content metrics"""
        paragraphs = self.soup.find_all('p')
        sentences = re.split(r'[.!?]+', self._all_text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        word_count = len(self._word_list)
        sentence_count = len(sentences)
        
        return {
            'wordCount': word_count,
            'paragraphCount': len(paragraphs),
            'sentenceCount': sentence_count,
            'avgWordsPerSentence': round(word_count / max(sentence_count, 1), 1),
            'avgSentencesPerParagraph': round(sentence_count / max(len(paragraphs), 1), 1),
            'readabilityScore': self._calculate_readability(),
            'uniqueWords': len(set(self._word_list)),
            'textToHtmlRatio': round(len(self._all_text) / max(len(self.html), 1) * 100, 2),
        }
    
    def _calculate_readability(self) -> int:
        """Calculate Flesch Reading Ease score (simplified)"""
        words = len(self._word_list)
        sentences = len(re.split(r'[.!?]+', self._all_text))
        syllables = sum(self._count_syllables(word) for word in self._word_list)
        
        if words == 0 or sentences == 0:
            return 0
        
        # Flesch Reading Ease formula
        score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
        return max(0, min(100, int(score)))
    
    def _count_syllables(self, word: str) -> int:
        """Count syllables in a word (simplified)"""
        word = word.lower()
        vowels = 'aeiouy'
        count = 0
        prev_vowel = False
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not prev_vowel:
                count += 1
            prev_vowel = is_vowel
        if word.endswith('e'):
            count -= 1
        return max(1, count)
    
    def _extract_keyword_metrics(self) -> dict:
        """Extract keyword-related metrics"""
        # Get most common words (potential keywords)
        words_lower = [w.lower() for w in self._word_list if len(w) > 3]
        common = Counter(words_lower).most_common(10)
        
        return {
            'topWords': [{'word': w, 'count': c, 'density': round(c / max(len(words_lower), 1) * 100, 2)} for w, c in common],
            'keywordStuffing': any(c / max(len(words_lower), 1) > 0.05 for _, c in common),
        }
    
    def _extract_image_metrics(self) -> dict:
        """Extract image metrics"""
        images = self._all_images
        without_alt = sum(1 for img in images if not img.get('alt', '').strip())
        lazy_loaded = sum(1 for img in images if img.get('loading') == 'lazy')
        
        return {
            'total': len(images),
            'withAlt': len(images) - without_alt,
            'withoutAlt': without_alt,
            'lazyLoaded': lazy_loaded,
            'missingDimensions': sum(1 for img in images if not (img.get('width') and img.get('height'))),
        }
    
    def _extract_link_metrics(self) -> dict:
        """Extract link metrics"""
        internal = []
        external = []
        
        for link in self._all_links:
            href = link.get('href', '')
            if href.startswith('#') or href.startswith('javascript:'):
                continue
            
            # Normalize URL
            full_url = urljoin(self.url, href)
            parsed = urlparse(full_url)
            
            if parsed.netloc == self.domain or not parsed.netloc:
                internal.append(href)
            else:
                external.append({
                    'url': full_url,
                    'nofollow': 'nofollow' in link.get('rel', []),
                })
        
        nofollow_count = sum(1 for e in external if e['nofollow'])
        
        return {
            'internal': {
                'count': len(internal),
                'unique': len(set(internal)),
                'broken': 0,  # Would need HTTP checks
            },
            'external': {
                'count': len(external),
                'unique': len(set(e['url'] for e in external)),
                'nofollow': nofollow_count,
            },
        }
    
    def _extract_url_metrics(self) -> dict:
        """Extract URL metrics"""
        return {
            'current': self.url,
            'length': len(self.url),
            'optimal': len(self.url) < 75,
            'depth': len(self.parsed_url.path.strip('/').split('/')) if self.parsed_url.path.strip('/') else 0,
            'readable': not re.search(r'[A-Z]|%|[0-9]{5,}', self.url),
            'https': self.url.startswith('https://'),
            'trailingSlash': self.url.endswith('/'),
            'lowercase': self.url == self.url.lower(),
        }
    
    # ========================================
    # CONTENT INTELLIGENCE
    # ========================================
    
    def _extract_content_intelligence(self) -> dict:
        """Extract content intelligence metrics"""
        return {
            'sentiment': self._analyze_sentiment(),
            'topics': self._extract_topics(),
            'eeat': self._analyze_eeat(),
        }
    
    def _analyze_sentiment(self) -> dict:
        """Basic sentiment analysis"""
        positive_words = ['great', 'excellent', 'amazing', 'best', 'good', 'love', 'wonderful', 'fantastic', 'perfect', 'awesome']
        negative_words = ['bad', 'worst', 'terrible', 'poor', 'hate', 'awful', 'horrible', 'disappointing', 'fail', 'problem']
        
        text_lower = self._all_text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        total = positive_count + negative_count
        if total == 0:
            return {'overall': 'neutral', 'score': 0.5}
        
        score = positive_count / total
        overall = 'positive' if score > 0.6 else 'negative' if score < 0.4 else 'neutral'
        
        return {
            'overall': overall,
            'score': round(score, 2),
            'breakdown': {
                'positive': positive_count,
                'negative': negative_count,
                'neutral': len(self._word_list) - positive_count - negative_count,
            }
        }
    
    def _extract_topics(self) -> dict:
        """Extract main topics from content"""
        # Simple topic extraction based on headings and frequent words
        h1_text = ' '.join(h.get_text() for h in self.soup.find_all('h1'))
        h2_text = ' '.join(h.get_text() for h in self.soup.find_all('h2'))
        
        return {
            'primary': h1_text[:100] if h1_text else 'Unknown',
            'secondary': [h.get_text().strip()[:50] for h in self.soup.find_all('h2')[:5]],
        }
    
    def _analyze_eeat(self) -> dict:
        """Analyze E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)"""
        signals = {
            'experience': [],
            'expertise': [],
            'authoritativeness': [],
            'trustworthiness': [],
        }
        
        # Check for author information
        author = self.soup.find(attrs={'class': re.compile(r'author|byline', re.I)})
        if author:
            signals['expertise'].append('Author information present')
        
        # Check for contact information
        contact_links = self.soup.find_all('a', href=re.compile(r'contact|about|mailto:', re.I))
        if contact_links:
            signals['trustworthiness'].append('Contact information visible')
        
        # Check for privacy/terms links
        legal_links = self.soup.find_all('a', href=re.compile(r'privacy|terms|policy', re.I))
        if legal_links:
            signals['trustworthiness'].append('Privacy policy present')
        
        # Check for HTTPS
        if self.url.startswith('https://'):
            signals['trustworthiness'].append('HTTPS enabled')
        
        # Check for testimonials/reviews
        if self.soup.find(attrs={'class': re.compile(r'testimonial|review|rating', re.I)}):
            signals['authoritativeness'].append('Social proof present')
        
        return {
            'experience': {'score': 70, 'signals': signals['experience']},
            'expertise': {'score': 60, 'signals': signals['expertise']},
            'authoritativeness': {'score': 50, 'signals': signals['authoritativeness']},
            'trustworthiness': {'score': 80, 'signals': signals['trustworthiness']},
            'overallScore': 65,
        }
    
    # ========================================
    # USER EXPERIENCE
    # ========================================
    
    def _extract_user_experience(self) -> dict:
        """Extract user experience metrics"""
        return {
            'accessibility': self._analyze_accessibility(),
            'navigation': self._analyze_navigation(),
            'engagement': self._analyze_engagement_elements(),
        }
    
    def _analyze_accessibility(self) -> dict:
        """Analyze accessibility features"""
        issues = []
        
        # Check images without alt
        imgs_without_alt = sum(1 for img in self._all_images if not img.get('alt', '').strip())
        if imgs_without_alt > 0:
            issues.append({'type': 'Missing alt text', 'count': imgs_without_alt, 'severity': 'serious'})
        
        # Check form labels
        inputs = self.soup.find_all('input')
        inputs_without_label = sum(1 for inp in inputs if not inp.get('id') or not self.soup.find('label', attrs={'for': inp.get('id')}))
        if inputs_without_label > 0:
            issues.append({'type': 'Missing form labels', 'count': inputs_without_label, 'severity': 'serious'})
        
        # Check heading structure
        if not self.soup.find('h1'):
            issues.append({'type': 'Missing H1', 'count': 1, 'severity': 'moderate'})
        
        return {
            'score': max(0, 100 - len(issues) * 10),
            'issues': issues,
            'keyboardNav': True,  # Would need JS analysis
            'screenReaderFriendly': len(issues) < 3,
        }
    
    def _analyze_navigation(self) -> dict:
        """Analyze navigation structure"""
        nav = self.soup.find('nav')
        breadcrumbs = self.soup.find(attrs={'class': re.compile(r'breadcrumb', re.I)})
        search = self.soup.find('input', attrs={'type': 'search'}) or self.soup.find(attrs={'class': re.compile(r'search', re.I)})
        footer = self.soup.find('footer')
        
        return {
            'menuPresent': nav is not None,
            'breadcrumbs': breadcrumbs is not None,
            'searchFunction': search is not None,
            'footerLinks': footer is not None and len(footer.find_all('a')) > 0,
        }
    
    def _analyze_engagement_elements(self) -> dict:
        """Analyze engagement elements"""
        # Count CTAs
        cta_patterns = re.compile(r'(btn|button|cta|action)', re.I)
        ctas = self.soup.find_all(attrs={'class': cta_patterns})
        
        # Check for forms
        forms = self.soup.find_all('form')
        
        return {
            'ctaCount': len(ctas),
            'formPresent': len(forms) > 0,
            'interactiveElements': len(ctas) + len(forms),
        }
    
    # ========================================
    # SOCIAL SEO
    # ========================================
    
    def _extract_social(self) -> dict:
        """Extract social media SEO elements"""
        return {
            'openGraph': self._extract_open_graph(),
            'twitterCards': self._extract_twitter_cards(),
        }
    
    def _extract_open_graph(self) -> dict:
        """Extract Open Graph tags"""
        og_tags = {}
        for meta in self.soup.find_all('meta', property=re.compile(r'^og:')):
            prop = meta.get('property', '').replace('og:', '')
            og_tags[prop] = meta.get('content', '')
        
        return {
            'present': len(og_tags) > 0,
            'title': og_tags.get('title', ''),
            'description': og_tags.get('description', ''),
            'image': {
                'url': og_tags.get('image', ''),
                'valid': bool(og_tags.get('image')),
            },
            'type': og_tags.get('type', 'website'),
            'url': og_tags.get('url', ''),
            'siteName': og_tags.get('site_name', ''),
        }
    
    def _extract_twitter_cards(self) -> dict:
        """Extract Twitter Card tags"""
        twitter_tags = {}
        for meta in self.soup.find_all('meta', attrs={'name': re.compile(r'^twitter:')}):
            name = meta.get('name', '').replace('twitter:', '')
            twitter_tags[name] = meta.get('content', '')
        
        return {
            'present': len(twitter_tags) > 0,
            'cardType': twitter_tags.get('card', 'summary'),
            'title': twitter_tags.get('title', ''),
            'description': twitter_tags.get('description', ''),
            'image': twitter_tags.get('image', ''),
            'creator': twitter_tags.get('creator', ''),
        }
    
    # ========================================
    # PERFORMANCE
    # ========================================
    
    def _extract_performance(self) -> dict:
        """Extract basic performance metrics"""
        return {
            'pageLoadTime': self.load_time_ms,
            'totalPageSize': len(self.html),
            'htmlSize': len(self.html),
            'resourceCount': len(self.soup.find_all(['script', 'link', 'img'])),
        }
    
    # ========================================
    # LEGACY FLAT METRICS
    # ========================================
    
    def _extract_flat_metrics(self) -> dict:
        """Extract flat metrics for backward compatibility with existing code"""
        title_tag = self.soup.find('title')
        title = title_tag.get_text().strip() if title_tag else None
        
        meta = self.soup.find('meta', attrs={'name': 'description'})
        meta_desc = meta.get('content', '').strip() if meta else None
        
        h1_tags = [h.get_text().strip() for h in self.soup.find_all('h1')]
        
        return {
            # Title
            'title': title,
            'title_length': len(title) if title else 0,
            
            # Meta Description
            'meta_description': meta_desc,
            'meta_description_length': len(meta_desc) if meta_desc else 0,
            
            # Headings
            'h1_tags': h1_tags,
            'h1_count': len(h1_tags),
            'h2_count': len(self.soup.find_all('h2')),
            'h3_count': len(self.soup.find_all('h3')),
            
            # Content
            'word_count': len(self._word_list),
            'paragraph_count': len(self.soup.find_all('p')),
            'text_to_html_ratio': round(len(self._all_text) / max(len(self.html), 1) * 100, 2),
            
            # Images
            'image_count': len(self._all_images),
            'images_without_alt': sum(1 for img in self._all_images if not img.get('alt', '').strip()),
            
            # Links
            'internal_links_count': len([l for l in self._all_links if self.domain in urljoin(self.url, l.get('href', ''))]),
            'external_links_count': len([l for l in self._all_links if self.domain not in urljoin(self.url, l.get('href', '')) and l.get('href', '').startswith('http')]),
            
            # Technical
            'https_enabled': self.url.startswith('https://'),
            'has_canonical': self.soup.find('link', rel='canonical') is not None,
            'canonical_url': (self.soup.find('link', rel='canonical') or {}).get('href'),
            'has_og_tags': len(self.soup.find_all('meta', property=re.compile(r'^og:'))) > 0,
            'has_twitter_cards': len(self.soup.find_all('meta', attrs={'name': re.compile(r'^twitter:')})) > 0,
            'has_structured_data': len(self.soup.find_all('script', type='application/ld+json')) > 0,
            'viewport_configured': self._has_viewport(),
            
            # Language
            'language': self._get_language(),
        }
    
    def _extract_visible_text(self) -> str:
        """Extract visible text from HTML"""
        # Remove script and style elements
        for element in self.soup(['script', 'style', 'noscript', 'header', 'footer', 'nav']):
            element.decompose()
        
        text = self.soup.get_text(separator=' ')
        text = re.sub(r'\s+', ' ', text).strip()
        return text


# ============================================
# TEST
# ============================================

if __name__ == "__main__":
    import json
    
    sample_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Page - SEO Analysis Example</title>
        <meta name="description" content="This is a comprehensive test page for SEO analysis. We test all major SEO factors including meta tags, headings, and content.">
        <link rel="canonical" href="https://example.com/test">
        <meta property="og:title" content="Test Page OG Title">
        <meta property="og:description" content="OG Description for sharing">
        <meta property="og:image" content="https://example.com/image.jpg">
        <meta name="twitter:card" content="summary_large_image">
        <script type="application/ld+json">{"@type": "WebPage", "name": "Test"}</script>
    </head>
    <body>
        <nav><a href="/">Home</a><a href="/about">About</a></nav>
        <main>
            <h1>Main Heading for Test Page</h1>
            <p>This is the first paragraph with important content about SEO.</p>
            <h2>Subheading About Features</h2>
            <p>Another paragraph explaining features in detail.</p>
            <img src="image1.jpg" alt="Descriptive alt text">
            <img src="image2.jpg">
            <a href="/internal-page">Internal Link</a>
            <a href="https://external.com">External Link</a>
        </main>
        <footer><a href="/privacy">Privacy</a></footer>
    </body>
    </html>
    """
    
    parser = ComprehensiveHTMLParser(sample_html, "https://example.com/test", 1500)
    metrics = parser.parse()
    
    print(json.dumps(metrics, indent=2, default=str))

"""
Comprehensive SEO Metrics Extractor
Extracts all metrics required by the frontend comprehensive-mock.ts structure
"""

import re
import hashlib
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from collections import Counter
import json

# Import text analyzer for advanced NLP
try:
    from .text_analyzer import TextAnalyzer
    HAS_TEXT_ANALYZER = True
except ImportError:
    try:
        from text_analyzer import TextAnalyzer
        HAS_TEXT_ANALYZER = True
    except ImportError:
        HAS_TEXT_ANALYZER = False

# Import security headers analyzer
try:
    from .security_headers import get_security_quick_check
    HAS_SECURITY_ANALYZER = True
except ImportError:
    try:
        from security_headers import get_security_quick_check
        HAS_SECURITY_ANALYZER = True
    except ImportError:
        HAS_SECURITY_ANALYZER = False

# Import PageSpeed Insights for real Core Web Vitals
try:
    from .pagespeed_insights import get_core_web_vitals, format_cwv_for_frontend
    HAS_PAGESPEED = True
except ImportError:
    try:
        from pagespeed_insights import get_core_web_vitals, format_cwv_for_frontend
        HAS_PAGESPEED = True
    except ImportError:
        HAS_PAGESPEED = False


class ComprehensiveMetricsExtractor:
    """
    Extracts comprehensive SEO metrics matching the frontend data structure
    """
    
    def __init__(self, html: str, url: str, load_time_ms: int = 0, page_size_bytes: int = 0):
        self.soup = BeautifulSoup(html, 'lxml')
        self.html = html
        self.url = url
        self.parsed_url = urlparse(url)
        self.domain = self.parsed_url.netloc
        self.load_time_ms = load_time_ms
        self.page_size_bytes = page_size_bytes
        
    def extract_all(self) -> dict:
        """Extract all metrics in the comprehensive structure"""
        return {
            # Meta info
            'url': self.url,
            'domain': self.domain,
            'scanDate': None,  # Will be set by caller
            'scanDuration': self.load_time_ms,
            'pagesScanned': 1,
            
            # Scores - calculated based on metrics
            'categoryScores': self._calculate_category_scores(),
            
            # Core Web Vitals (estimates from page analysis)
            'coreWebVitals': self._extract_core_web_vitals(),
            
            # Performance
            'performance': self._extract_performance_metrics(),
            
            # Technical SEO
            'technical': self._extract_technical_seo(),
            
            # On-Page SEO
            'onPage': self._extract_on_page_seo(),
            
            # Content Intelligence
            'contentIntelligence': self._extract_content_intelligence(),
            
            # User Experience
            'userExperience': self._extract_user_experience(),
            
            # Social SEO
            'social': self._extract_social_seo(),
        }
    
    def _calculate_category_scores(self) -> dict:
        """Calculate category scores based on various factors"""
        # Technical score based on HTTPS, viewport, canonical, etc.
        technical_factors = [
            self._is_https() * 15,
            self._has_viewport() * 15,
            self._has_canonical() * 10,
            self._has_robots_meta() * 10,
            self._has_sitemap_link() * 10,
            (1 - min(self._count_render_blocking() / 10, 1)) * 20,
            self._has_structured_data() * 20,
        ]
        technical = min(100, sum(technical_factors))
        
        # On-page score
        title_score = self._score_title()
        meta_score = self._score_meta_description()
        heading_score = self._score_headings()
        on_page = int((title_score + meta_score + heading_score) / 3)
        
        # Content score
        word_count = self._get_word_count()
        content_factors = [
            min(word_count / 1500 * 40, 40),  # Word count up to 40 points
            self._score_readability() * 0.3,
            self._score_keyword_usage() * 0.3,
        ]
        content = min(100, sum(content_factors))
        
        # UX score
        ux_factors = [
            self._has_viewport() * 25,
            (1 - min(self._count_images_without_alt() / 10, 1)) * 25,
            self._has_proper_links() * 25,
            (100 - min(self.load_time_ms / 50, 100)) * 0.25,
        ]
        user_experience = min(100, sum(ux_factors))
        
        # Performance score
        perf_factors = [
            max(0, 100 - self.load_time_ms / 50),  # Load time penalty
            max(0, 100 - self.page_size_bytes / 30000),  # Size penalty
            (1 - min(self._count_render_blocking() / 5, 1)) * 100 * 0.3,
        ]
        performance = min(100, sum(perf_factors) / 3)
        
        # Social score
        social_factors = [
            self._has_og_tags() * 40,
            self._has_twitter_cards() * 30,
            len(self._get_social_links()) * 5,
        ]
        social = min(100, sum(social_factors))
        
        # Security score
        security_factors = [
            self._is_https() * 50,
            self._has_csp_header() * 20,
            self._has_xframe_options() * 15,
            (not self._has_mixed_content()) * 15,
        ]
        security = min(100, sum(security_factors))
        
        return {
            'technical': int(technical),
            'onPage': int(on_page),
            'content': int(content),
            'userExperience': int(user_experience),
            'performance': int(performance),
            'social': int(social),
            'security': int(security),
        }
    
    def _extract_core_web_vitals(self) -> dict:
        """Extract/estimate Core Web Vitals - uses real PageSpeed data when available"""
        
        # Try to get real Core Web Vitals from PageSpeed Insights
        if HAS_PAGESPEED:
            try:
                pagespeed_result = get_core_web_vitals(self.url, strategy='mobile')
                if pagespeed_result.get('success', False):
                    cwv = format_cwv_for_frontend(pagespeed_result)
                    # Add source information
                    cwv['_source'] = 'pagespeed_insights'
                    cwv['_performanceScore'] = pagespeed_result.get('performanceScore', 0)
                    
                    # Check if field data is available
                    if pagespeed_result.get('fieldData'):
                        cwv['_hasFieldData'] = True
                        cwv['_fieldDataSource'] = 'Chrome User Experience Report'
                    else:
                        cwv['_hasFieldData'] = False
                    
                    return cwv
            except Exception:
                # Fall through to estimated values
                pass
        
        # Fallback to estimates based on page structure
        largest_image = self._get_largest_image()
        estimated_lcp = (self.load_time_ms / 1000) * 1.5 if self.load_time_ms else 2.5
        
        # Estimate CLS based on images without dimensions
        images_without_dims = len([img for img in self.soup.find_all('img') 
                                   if not img.get('width') or not img.get('height')])
        estimated_cls = min(0.25, images_without_dims * 0.03)
        
        return {
            '_source': 'estimated',
            '_hasFieldData': False,
            'lcp': {
                'value': round(estimated_lcp, 2),
                'rating': 'good' if estimated_lcp < 2.5 else 'needs-improvement' if estimated_lcp < 4 else 'poor',
                'target': 2.5,
                'estimated': True
            },
            'fid': {
                'value': 100,  # Placeholder - needs real measurement
                'rating': 'good',
                'target': 100,
                'estimated': True
            },
            'cls': {
                'value': round(estimated_cls, 3),
                'rating': 'good' if estimated_cls < 0.1 else 'needs-improvement' if estimated_cls < 0.25 else 'poor',
                'target': 0.1,
                'estimated': True
            },
            'inp': {
                'value': 200,  # Placeholder
                'rating': 'good',
                'target': 200,
                'estimated': True
            },
            'ttfb': {
                'value': int(self.load_time_ms * 0.3) if self.load_time_ms else 400,
                'rating': 'good',
                'target': 800,
                'estimated': True
            },
            'fcp': {
                'value': round(estimated_lcp * 0.6, 2),
                'rating': 'good' if estimated_lcp * 0.6 < 1.8 else 'needs-improvement',
                'target': 1.8,
                'estimated': True
            },
        }
    
    def _extract_performance_metrics(self) -> dict:
        """Extract performance-related metrics"""
        scripts = self.soup.find_all('script')
        stylesheets = self.soup.find_all('link', rel='stylesheet')
        images = self.soup.find_all('img')
        
        # Estimate sizes (would need actual requests for real data)
        html_size = len(self.html.encode('utf-8'))
        
        return {
            'pageLoadTime': self.load_time_ms or 2000,
            'domContentLoaded': int((self.load_time_ms or 2000) * 0.6),
            'fullyLoaded': int((self.load_time_ms or 2000) * 1.2),
            'speedIndex': int((self.load_time_ms or 2000) * 1.5),
            'timeToInteractive': int((self.load_time_ms or 2000) * 1.3),
            'totalBlockingTime': self._estimate_blocking_time(),
            'serverResponseTime': int((self.load_time_ms or 2000) * 0.2),
            'resourceCount': len(scripts) + len(stylesheets) + len(images),
            'totalPageSize': self.page_size_bytes or html_size * 3,
            'htmlSize': html_size,
            'cssSize': len(stylesheets) * 30000,  # Estimate
            'jsSize': len(scripts) * 50000,  # Estimate
            'imageSize': len(images) * 100000,  # Estimate
            'fontSize': 20000,  # Estimate
            'thirdPartySize': self._count_third_party_resources() * 50000,
            'cacheHitRatio': 0.75,  # Would need actual cache analysis
            'compressionRatio': 0.7,  # Would need headers
        }
    
    def _extract_technical_seo(self) -> dict:
        """Extract technical SEO metrics"""
        return {
            'crawlability': {
                'score': self._calculate_crawlability_score(),
                'robotsTxt': {
                    'exists': True,  # Would need to fetch /robots.txt
                    'valid': True,
                    'issues': []
                },
                'xmlSitemap': {
                    'exists': self._has_sitemap_link(),
                    'valid': True,
                    'urlCount': 0,
                    'lastModified': None
                },
                'indexability': {
                    'indexable': self._is_indexable(),
                    'blockers': self._get_indexability_blockers()
                },
                'canonicalization': {
                    'hasCanonical': self._has_canonical(),
                    'selfReferencing': self._is_self_referencing_canonical(),
                    'conflicts': []
                },
            },
            'rendering': {
                'jsRendering': 'full',
                'criticalRenderingPath': int((self.load_time_ms or 2000) * 0.5),
                'renderBlockingResources': self._count_render_blocking(),
                'dynamicContent': self._has_dynamic_content(),
                'hydrationTime': 200,
            },
            'mobile': {
                'mobileFirst': True,
                'responsiveDesign': self._has_viewport(),
                'viewportConfigured': self._has_viewport(),
                'touchTargets': {
                    'adequate': self._check_touch_targets(),
                    'issues': self._count_small_touch_targets()
                },
                'fontSizes': {
                    'readable': self._check_font_sizes(),
                    'issues': 0
                },
                'contentWidth': {
                    'fits': True,
                    'overflow': False
                },
            },
            'security': self._extract_security_info(),
            'internationalization': {
                'hreflangTags': {
                    'exists': self._has_hreflang(),
                    'valid': True,
                    'languages': self._get_hreflang_languages()
                },
                'languageDeclaration': self._has_lang_attribute(),
                'contentLanguage': self._get_content_language(),
                'regionTargeting': [],
            },
            'structuredData': {
                'present': self._has_structured_data(),
                'types': self._get_structured_data_types(),
                'valid': True,
                'errors': 0,
                'warnings': 0,
                'richResultsEligible': self._get_rich_results_eligible(),
            },
        }
    
    def _extract_on_page_seo(self) -> dict:
        """Extract on-page SEO metrics"""
        title = self._get_title()
        meta_desc = self._get_meta_description()
        
        return {
            'title': {
                'exists': bool(title),
                'content': title,
                'length': len(title) if title else 0,
                'optimal': 30 <= len(title or '') <= 60,
                'keywordPresent': False,  # Would need keyword input
                'brandingPosition': 'end' if title and '|' in title else 'none',
                'emotionalTriggers': [],
                'powerWords': self._find_power_words(title or ''),
                'uniqueOnSite': True,
            },
            'metaDescription': {
                'exists': bool(meta_desc),
                'content': meta_desc,
                'length': len(meta_desc) if meta_desc else 0,
                'optimal': 120 <= len(meta_desc or '') <= 160,
                'keywordPresent': False,
                'callToAction': self._has_cta(meta_desc or ''),
                'uniqueOnSite': True,
            },
            'headings': self._extract_headings(),
            'content': self._extract_content_metrics(),
            'keywords': self._extract_keyword_metrics(),
            'images': self._extract_image_metrics(),
            'links': self._extract_link_metrics(),
            'urls': self._extract_url_metrics(),
        }
    
    def _extract_content_intelligence(self) -> dict:
        """Extract content intelligence metrics"""
        text = self._get_visible_text()
        
        return {
            'sentiment': {
                'overall': 'neutral',
                'score': 0.5,
                'breakdown': {'positive': 40, 'neutral': 50, 'negative': 10},
            },
            'topics': {
                'primary': self._detect_primary_topic(),
                'secondary': self._detect_secondary_topics(),
                'entities': self._extract_entities(),
                'categories': self._detect_categories(),
            },
            'eeat': {
                'experience': {'score': 60, 'signals': self._detect_experience_signals()},
                'expertise': {'score': 65, 'signals': self._detect_expertise_signals()},
                'authoritativeness': {'score': 55, 'signals': self._detect_authority_signals()},
                'trustworthiness': {'score': 70, 'signals': self._detect_trust_signals()},
                'overallScore': 62,
            },
            'aiReadiness': {
                'score': 60,
                'voiceSearchOptimized': self._is_voice_search_optimized(),
                'featuredSnippetPotential': self._featured_snippet_potential(),
                'questionAnswering': {
                    'questions': self._find_questions(),
                    'answered': len(self._find_questions()) > 0
                },
                'conversationalReady': False,
                'structuredContent': self._has_structured_content(),
            },
            'contentGaps': {
                'missingTopics': [],
                'competitorAdvantages': [],
                'suggestedAdditions': self._suggest_content_additions(),
                'relatedQuestions': self._find_related_questions(),
            },
            'plagiarism': {
                'uniquenessScore': 95,
                'matchedSources': [],
                'duplicateContent': False,
            },
        }
    
    def _extract_user_experience(self) -> dict:
        """Extract UX metrics"""
        return {
            'accessibility': {
                'score': self._calculate_accessibility_score(),
                'wcagLevel': 'A',
                'issues': self._get_accessibility_issues(),
                'colorContrast': {'passes': 30, 'fails': 5},
                'ariaLabels': {
                    'present': len(self.soup.find_all(attrs={'aria-label': True})),
                    'missing': self._count_missing_aria_labels()
                },
                'keyboardNav': True,
                'screenReaderFriendly': self._is_screen_reader_friendly(),
            },
            'navigation': {
                'menuPresent': self._has_navigation_menu(),
                'breadcrumbs': self._has_breadcrumbs(),
                'searchFunction': self._has_search(),
                'footerLinks': self._has_footer_links(),
                'siteDepth': self._get_url_depth(),
                'clicksToContent': 2,
            },
            'engagement': {
                'estimatedReadTime': self._estimate_read_time(),
                'scrollDepthPotential': 70,
                'interactiveElements': self._count_interactive_elements(),
                'ctaCount': self._count_ctas(),
                'ctaVisibility': 80,
                'formPresent': bool(self.soup.find('form')),
                'bounceRate': 45,
                'avgTimeOnPage': 90,
            },
            'pageExperience': {
                'coreWebVitalsPass': True,
                'mobileUsability': self._has_viewport(),
                'safeBrowsing': True,
                'noIntrusiveInterstitials': not self._has_popups(),
                'httpsSecure': self._is_https(),
            },
        }
    
    def _extract_social_seo(self) -> dict:
        """Extract social SEO metrics"""
        og_image = self._get_og_tag('og:image')
        
        return {
            'openGraph': {
                'present': self._has_og_tags(),
                'title': self._get_og_tag('og:title'),
                'description': self._get_og_tag('og:description'),
                'image': {
                    'url': og_image,
                    'dimensions': {'width': 1200, 'height': 630} if og_image else None,
                    'valid': bool(og_image)
                },
                'type': self._get_og_tag('og:type') or 'website',
                'url': self._get_og_tag('og:url'),
                'siteName': self._get_og_tag('og:site_name'),
            },
            'twitterCards': {
                'present': self._has_twitter_cards(),
                'cardType': self._get_twitter_card_type(),
                'title': self._get_meta_property('twitter:title'),
                'description': self._get_meta_property('twitter:description'),
                'image': self._get_meta_property('twitter:image'),
                'creator': self._get_meta_property('twitter:creator'),
            },
            'socialProfiles': {
                'facebook': 'facebook.com' in self.html.lower(),
                'twitter': 'twitter.com' in self.html.lower() or 'x.com' in self.html.lower(),
                'linkedin': 'linkedin.com' in self.html.lower(),
                'instagram': 'instagram.com' in self.html.lower(),
                'youtube': 'youtube.com' in self.html.lower(),
                'pinterest': 'pinterest.com' in self.html.lower(),
                'tiktok': 'tiktok.com' in self.html.lower(),
            },
            'shareability': {
                'score': 70 if self._has_og_tags() else 40,
                'socialProof': self._has_social_proof(),
                'shareButtons': self._has_share_buttons(),
                'viralPotential': 40,
            },
        }
    
    # ==================== Helper Methods ====================
    
    def _get_title(self):
        tag = self.soup.find('title')
        return tag.get_text().strip() if tag else None
    
    def _get_meta_description(self):
        tag = self.soup.find('meta', attrs={'name': 'description'})
        return tag.get('content', '').strip() if tag else None
    
    def _get_og_tag(self, property_name: str):
        tag = self.soup.find('meta', attrs={'property': property_name})
        return tag.get('content', '') if tag else None
    
    def _get_meta_property(self, name: str):
        tag = self.soup.find('meta', attrs={'name': name}) or self.soup.find('meta', attrs={'property': name})
        return tag.get('content', '') if tag else None
    
    def _is_https(self):
        return self.url.startswith('https://')
    
    def _has_viewport(self):
        return bool(self.soup.find('meta', attrs={'name': 'viewport'}))
    
    def _has_canonical(self):
        return bool(self.soup.find('link', attrs={'rel': 'canonical'}))
    
    def _has_robots_meta(self):
        return bool(self.soup.find('meta', attrs={'name': 'robots'}))
    
    def _has_og_tags(self):
        return bool(self.soup.find('meta', attrs={'property': re.compile(r'^og:')}))
    
    def _has_twitter_cards(self):
        return bool(self.soup.find('meta', attrs={'name': re.compile(r'^twitter:')}))
    
    def _get_twitter_card_type(self):
        tag = self.soup.find('meta', attrs={'name': 'twitter:card'})
        return tag.get('content', 'summary') if tag else 'summary'
    
    def _has_sitemap_link(self):
        # Check for sitemap link in HTML
        return bool(self.soup.find('a', href=re.compile(r'sitemap', re.I)))
    
    def _has_structured_data(self):
        # Check for JSON-LD or microdata
        json_ld = self.soup.find('script', attrs={'type': 'application/ld+json'})
        microdata = self.soup.find(attrs={'itemscope': True})
        return bool(json_ld or microdata)
    
    def _get_structured_data_types(self):
        types = []
        for script in self.soup.find_all('script', attrs={'type': 'application/ld+json'}):
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and '@type' in data:
                    types.append(data['@type'])
                elif isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict) and '@type' in item:
                            types.append(item['@type'])
            except:
                pass
        return types if types else ['WebPage']
    
    def _count_render_blocking(self):
        # Count CSS in head without media="print" and sync JS in head
        blocking_css = len([link for link in self.soup.find_all('link', rel='stylesheet') 
                          if not link.get('media') == 'print'])
        blocking_js = len([script for script in self.soup.find_all('script', src=True)
                         if not script.get('async') and not script.get('defer')])
        return blocking_css + blocking_js
    
    def _get_word_count(self):
        text = self._get_visible_text()
        return len(text.split())
    
    def _get_visible_text(self):
        # Remove script and style elements
        for element in self.soup(['script', 'style', 'noscript']):
            element.decompose()
        text = self.soup.get_text(separator=' ', strip=True)
        return re.sub(r'\s+', ' ', text)
    
    def _count_images_without_alt(self):
        images = self.soup.find_all('img')
        return len([img for img in images if not img.get('alt')])
    
    def _get_largest_image(self):
        images = self.soup.find_all('img')
        largest = None
        max_size = 0
        for img in images:
            width = int(img.get('width', 0) or 0)
            height = int(img.get('height', 0) or 0)
            size = width * height
            if size > max_size:
                max_size = size
                largest = img
        return largest
    
    def _extract_headings(self):
        h1_tags = self.soup.find_all('h1')
        h2_tags = self.soup.find_all('h2')
        h3_tags = self.soup.find_all('h3')
        h4_tags = self.soup.find_all('h4')
        h5_tags = self.soup.find_all('h5')
        h6_tags = self.soup.find_all('h6')
        
        return {
            'h1': {
                'count': len(h1_tags),
                'content': [h.get_text().strip() for h in h1_tags],
                'optimal': len(h1_tags) == 1
            },
            'h2': {
                'count': len(h2_tags),
                'content': [h.get_text().strip() for h in h2_tags[:5]]
            },
            'h3': {
                'count': len(h3_tags),
                'content': [h.get_text().strip() for h in h3_tags[:3]]
            },
            'h4': {'count': len(h4_tags), 'content': []},
            'h5': {'count': len(h5_tags), 'content': []},
            'h6': {'count': len(h6_tags), 'content': []},
            'hierarchy': {
                'valid': self._check_heading_hierarchy(),
                'issues': self._get_heading_issues()
            },
            'keywordDistribution': 70,
        }
    
    def _extract_content_metrics(self):
        text = self._get_visible_text()
        words = text.split()
        sentences = re.split(r'[.!?]+', text)
        paragraphs = self.soup.find_all('p')
        
        word_count = len(words)
        sentence_count = len([s for s in sentences if s.strip()])
        
        # Use advanced text analyzer if available
        if HAS_TEXT_ANALYZER:
            try:
                analyzer = TextAnalyzer(
                    text, 
                    self._get_title() or '', 
                    self._get_meta_description() or ''
                )
                readability = analyzer.analyze_readability()
                content_quality = analyzer.analyze_content_quality()
                
                return {
                    'wordCount': word_count,
                    'paragraphCount': len(paragraphs),
                    'sentenceCount': sentence_count,
                    'avgWordsPerSentence': round(word_count / max(sentence_count, 1), 1),
                    'avgSentencesPerParagraph': round(sentence_count / max(len(paragraphs), 1), 1),
                    'readabilityScore': readability['fleschReadingEase']['score'],
                    'readabilityGrade': readability['fleschKincaidGrade']['gradeLevel'],
                    'fleschKincaid': {
                        'readingEase': readability['fleschReadingEase'],
                        'gradeLevel': readability['fleschKincaidGrade'],
                        'gunningFog': readability['gunningFog'],
                        'smogIndex': readability['smogIndex'],
                        'difficulty': readability['difficulty'],
                        'readingTime': readability['readingTime']
                    },
                    'gunningFog': readability['gunningFog']['score'],
                    'uniqueWords': content_quality['uniqueWords'],
                    'vocabularyRichness': content_quality['vocabularyRichness'],
                    'contentDepth': content_quality['contentDepth']['level'],
                    'contentDepthScore': content_quality['contentDepth']['score'],
                }
            except Exception:
                pass
        
        # Fallback to basic metrics
        return {
            'wordCount': word_count,
            'paragraphCount': len(paragraphs),
            'sentenceCount': sentence_count,
            'avgWordsPerSentence': round(word_count / max(sentence_count, 1), 1),
            'avgSentencesPerParagraph': round(sentence_count / max(len(paragraphs), 1), 1),
            'readabilityScore': self._calculate_readability(text),
            'readabilityGrade': self._get_readability_grade(text),
            'fleschKincaid': self._flesch_kincaid(text),
            'gunningFog': self._gunning_fog(text),
            'uniqueWords': len(set(words)),
            'contentDepth': 'moderate' if word_count < 1000 else 'comprehensive' if word_count < 2000 else 'expert',
        }
    
    def _extract_keyword_metrics(self):
        text = self._get_visible_text()
        title = self._get_title() or ''
        meta_desc = self._get_meta_description() or ''
        
        # Use advanced TF-IDF if available
        if HAS_TEXT_ANALYZER:
            try:
                analyzer = TextAnalyzer(text, title, meta_desc)
                tfidf_keywords = analyzer.extract_keywords_tfidf(10)
                bigrams = analyzer.extract_bigrams(5)
                
                primary = tfidf_keywords[0] if tfidf_keywords else {
                    'keyword': '', 'score': 0, 'count': 0, 'density': 0,
                    'inTitle': False, 'inMeta': False, 'prominence': 'low'
                }
                secondary = tfidf_keywords[1:4] if len(tfidf_keywords) > 1 else []
                
                return {
                    'primary': {
                        'keyword': primary.get('keyword', ''),
                        'density': primary.get('density', 0),
                        'count': primary.get('count', 0),
                        'inTitle': primary.get('inTitle', False),
                        'inH1': primary.get('keyword', '').lower() in ' '.join([h.get_text().lower() for h in self.soup.find_all('h1')]),
                        'inMeta': primary.get('inMeta', False),
                        'prominence': primary.get('prominence', 'low'),
                        'tfidfScore': primary.get('score', 0),
                    },
                    'secondary': [
                        {
                            'keyword': kw.get('keyword', ''),
                            'density': kw.get('density', 0),
                            'count': kw.get('count', 0),
                            'prominence': kw.get('prominence', 'low'),
                            'tfidfScore': kw.get('score', 0),
                        }
                        for kw in secondary
                    ],
                    'tfidfKeywords': tfidf_keywords,
                    'bigrams': bigrams,
                    'lsiKeywords': [kw.get('keyword', '') for kw in tfidf_keywords[4:8]],
                    'keywordStuffing': any(kw.get('density', 0) > 3.0 for kw in tfidf_keywords),
                    'topicRelevance': min(100, 60 + len([kw for kw in tfidf_keywords if kw.get('inTitle') or kw.get('inMeta')]) * 10),
                }
            except Exception:
                pass
        
        # Fallback to basic keyword extraction
        text_lower = text.lower()
        words = text_lower.split()
        word_freq = Counter(words)
        
        # Get most common words (excluding stop words)
        stop_words = {'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
                     'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
                     'should', 'may', 'might', 'must', 'shall', 'can', 'to', 'of', 'in',
                     'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
                     'and', 'or', 'but', 'if', 'because', 'so', 'this', 'that', 'these',
                     'those', 'it', 'its', 'you', 'your', 'we', 'our', 'they', 'their'}
        
        filtered = {k: v for k, v in word_freq.items() if k not in stop_words and len(k) > 3}
        top_keywords = sorted(filtered.items(), key=lambda x: x[1], reverse=True)[:5]
        
        primary = top_keywords[0] if top_keywords else ('', 0)
        secondary = [{'keyword': k, 'density': round(v / len(words) * 100, 2), 'count': v} 
                    for k, v in top_keywords[1:4]]
        
        return {
            'primary': {
                'keyword': primary[0],
                'density': round(primary[1] / max(len(words), 1) * 100, 2),
                'count': primary[1],
                'inTitle': primary[0] in (self._get_title() or '').lower(),
                'inH1': primary[0] in ' '.join([h.get_text().lower() for h in self.soup.find_all('h1')]),
                'inMeta': primary[0] in (self._get_meta_description() or '').lower(),
            },
            'secondary': secondary,
            'lsiKeywords': [k for k, v in top_keywords[1:6]],
            'keywordStuffing': any(v / len(words) > 0.05 for k, v in top_keywords if k),
            'topicRelevance': 75,
        }
    
    def _extract_image_metrics(self):
        images = self.soup.find_all('img')
        
        with_alt = len([img for img in images if img.get('alt')])
        without_alt = len(images) - with_alt
        lazy_loaded = len([img for img in images if img.get('loading') == 'lazy'])
        webp = len([img for img in images if '.webp' in (img.get('src') or '')])
        missing_dims = len([img for img in images if not img.get('width') or not img.get('height')])
        
        return {
            'total': len(images),
            'withAlt': with_alt,
            'withoutAlt': without_alt,
            'optimized': webp + lazy_loaded,
            'lazyLoaded': lazy_loaded,
            'webpFormat': webp,
            'avgSize': 100000,  # Would need actual image fetching
            'largestImage': {
                'url': self._get_largest_image().get('src') if self._get_largest_image() else None,
                'size': 500000
            },
            'missingDimensions': missing_dims,
        }
    
    def _extract_link_metrics(self):
        links = self.soup.find_all('a', href=True)
        
        internal = []
        external = []
        broken = 0
        
        for link in links:
            href = link.get('href', '')
            if href.startswith('#') or href.startswith('javascript:'):
                continue
            
            # Check if internal or external
            if href.startswith('/') or self.domain in href:
                internal.append(link)
            elif href.startswith('http'):
                external.append(link)
        
        nofollow = len([l for l in external if 'nofollow' in (l.get('rel') or [])])
        
        return {
            'internal': {
                'count': len(internal),
                'unique': len(set(l.get('href') for l in internal)),
                'broken': broken
            },
            'external': {
                'count': len(external),
                'unique': len(set(l.get('href') for l in external)),
                'nofollow': nofollow,
                'sponsored': 0,
                'ugc': 0
            },
            'anchors': {
                'descriptive': len([l for l in links if len(l.get_text().strip()) > 10]),
                'generic': len([l for l in links if l.get_text().strip().lower() in ['click here', 'read more', 'learn more']]),
                'naked': len([l for l in links if l.get_text().strip().startswith('http')])
            },
            'depth': self._get_url_depth(),
            'orphanPages': 0,
        }
    
    def _extract_url_metrics(self):
        return {
            'current': self.url,
            'length': len(self.url),
            'optimal': len(self.url) < 75,
            'hasKeyword': False,
            'parameters': len(self.parsed_url.query.split('&')) if self.parsed_url.query else 0,
            'depth': self._get_url_depth(),
            'readable': self._is_url_readable(),
            'httpsRedirect': self._is_https(),
            'trailingSlash': self.url.endswith('/'),
            'lowercase': self.url == self.url.lower(),
        }
    
    def _get_url_depth(self):
        path = self.parsed_url.path.strip('/')
        return len(path.split('/')) if path else 0
    
    def _is_url_readable(self):
        path = self.parsed_url.path
        # Check for underscores, excessive numbers, or random strings
        return not bool(re.search(r'[_]{2,}|[0-9]{8,}|[a-f0-9]{32}', path))
    
    # Scoring helpers
    def _score_title(self):
        title = self._get_title()
        if not title:
            return 0
        length = len(title)
        if 30 <= length <= 60:
            return 100
        elif 20 <= length <= 70:
            return 70
        else:
            return 40
    
    def _score_meta_description(self):
        desc = self._get_meta_description()
        if not desc:
            return 0
        length = len(desc)
        if 120 <= length <= 160:
            return 100
        elif 80 <= length <= 200:
            return 70
        else:
            return 40
    
    def _score_headings(self):
        h1_count = len(self.soup.find_all('h1'))
        if h1_count == 1:
            return 100
        elif h1_count == 0:
            return 30
        else:
            return 60
    
    def _score_readability(self):
        return 70  # Placeholder
    
    def _score_keyword_usage(self):
        return 70  # Placeholder
    
    def _calculate_readability(self, text):
        # Simplified Flesch Reading Ease
        words = text.split()
        sentences = re.split(r'[.!?]+', text)
        syllables = sum(self._count_syllables(w) for w in words)
        
        if len(words) == 0 or len(sentences) == 0:
            return 50
        
        score = 206.835 - 1.015 * (len(words) / len(sentences)) - 84.6 * (syllables / len(words))
        return max(0, min(100, score))
    
    def _get_readability_grade(self, text):
        score = self._calculate_readability(text)
        if score >= 80:
            return '6th Grade'
        elif score >= 60:
            return '8th Grade'
        elif score >= 40:
            return '10th Grade'
        else:
            return 'College'
    
    def _flesch_kincaid(self, text):
        return self._calculate_readability(text)
    
    def _gunning_fog(self, text):
        return 10  # Placeholder
    
    def _count_syllables(self, word):
        word = word.lower()
        count = 0
        vowels = 'aeiouy'
        if word[0] in vowels:
            count += 1
        for i in range(1, len(word)):
            if word[i] in vowels and word[i-1] not in vowels:
                count += 1
        if word.endswith('e'):
            count -= 1
        return max(1, count)
    
    def _has_proper_links(self):
        links = self.soup.find_all('a', href=True)
        return len(links) > 0
    
    def _count_third_party_resources(self):
        scripts = self.soup.find_all('script', src=True)
        links = self.soup.find_all('link', href=True)
        
        count = 0
        for elem in scripts + links:
            src = elem.get('src') or elem.get('href') or ''
            if src.startswith('http') and self.domain not in src:
                count += 1
        return count
    
    def _estimate_blocking_time(self):
        return self._count_render_blocking() * 100
    
    def _calculate_crawlability_score(self):
        score = 50
        if self._is_indexable():
            score += 20
        if self._has_canonical():
            score += 15
        if self._has_sitemap_link():
            score += 15
        return min(100, score)
    
    def _is_indexable(self):
        robots = self.soup.find('meta', attrs={'name': 'robots'})
        if robots:
            content = robots.get('content', '').lower()
            if 'noindex' in content:
                return False
        return True
    
    def _get_indexability_blockers(self):
        blockers = []
        robots = self.soup.find('meta', attrs={'name': 'robots'})
        if robots:
            content = robots.get('content', '').lower()
            if 'noindex' in content:
                blockers.append('noindex meta tag')
            if 'nofollow' in content:
                blockers.append('nofollow meta tag')
        return blockers
    
    def _is_self_referencing_canonical(self):
        canonical = self.soup.find('link', attrs={'rel': 'canonical'})
        if canonical:
            return canonical.get('href', '').rstrip('/') == self.url.rstrip('/')
        return False
    
    def _has_dynamic_content(self):
        # Check for common SPA frameworks
        return bool(self.soup.find(id='app') or self.soup.find(id='root') or 
                   self.soup.find(attrs={'ng-app': True}) or self.soup.find(attrs={'data-reactroot': True}))
    
    def _check_touch_targets(self):
        # Would need actual CSS analysis
        return True
    
    def _count_small_touch_targets(self):
        return 0
    
    def _check_font_sizes(self):
        return True
    
    def _count_mixed_content(self):
        if not self._is_https():
            return 0
        
        count = 0
        for img in self.soup.find_all('img', src=True):
            if img['src'].startswith('http://'):
                count += 1
        for script in self.soup.find_all('script', src=True):
            if script['src'].startswith('http://'):
                count += 1
        return count
    
    def _extract_security_info(self) -> dict:
        """Extract security information including real HTTP headers when possible."""
        # Base security info from HTML analysis
        base_security = {
            'https': self._is_https(),
            'hsts': False,
            'mixedContent': {
                'count': self._count_mixed_content(),
                'urls': []
            },
            'securityHeaders': {
                'contentSecurityPolicy': False,
                'strictTransportSecurity': False,
                'xFrameOptions': False,
                'xContentTypeOptions': False,
                'referrerPolicy': False,
                'permissionsPolicy': False,
            },
            'securityScore': 0,
            'securityGrade': 'F',
            'sslCertificate': {
                'valid': self._is_https(),
                'issuer': 'Unknown',
                'expiresAt': None,
                'daysUntilExpiry': 90,
            },
        }
        
        # Try to get real security headers
        if HAS_SECURITY_ANALYZER:
            try:
                security_check = get_security_quick_check(self.url, timeout=5.0)
                
                base_security['securityHeaders'] = security_check.get('headers', base_security['securityHeaders'])
                base_security['securityScore'] = security_check.get('score', 0)
                base_security['securityGrade'] = security_check.get('grade', 'F')
                base_security['hsts'] = security_check.get('headers', {}).get('strictTransportSecurity', False)
                
                # Add top security issues
                base_security['topSecurityIssues'] = security_check.get('topIssues', [])
                base_security['securitySummary'] = {
                    'passed': security_check.get('passed', 0),
                    'critical': security_check.get('critical', 0),
                    'warnings': security_check.get('warnings', 0),
                }
            except Exception:
                # Fallback to basic security check based on HTTPS only
                base_security['securityScore'] = 50 if self._is_https() else 10
                base_security['securityGrade'] = 'D' if self._is_https() else 'F'
        else:
            # Basic scoring without header analysis
            base_security['securityScore'] = 50 if self._is_https() else 10
            base_security['securityGrade'] = 'D' if self._is_https() else 'F'
        
        return base_security
    
    def _has_hreflang(self):
        return bool(self.soup.find('link', attrs={'hreflang': True}))
    
    def _get_hreflang_languages(self):
        langs = []
        for link in self.soup.find_all('link', attrs={'hreflang': True}):
            langs.append(link.get('hreflang'))
        return langs if langs else ['en']
    
    def _has_lang_attribute(self):
        html = self.soup.find('html')
        return bool(html and html.get('lang'))
    
    def _get_content_language(self):
        html = self.soup.find('html')
        return html.get('lang', 'en') if html else 'en'
    
    def _get_rich_results_eligible(self):
        eligible = []
        if self._has_structured_data():
            types = self._get_structured_data_types()
            if 'FAQPage' in types:
                eligible.append('FAQ')
            if 'BreadcrumbList' in types:
                eligible.append('Breadcrumbs')
            if 'Article' in types:
                eligible.append('Article')
        return eligible
    
    def _check_heading_hierarchy(self):
        headings = []
        for i in range(1, 7):
            for h in self.soup.find_all(f'h{i}'):
                headings.append(i)
        
        # Check for skipped levels
        for i in range(len(headings) - 1):
            if headings[i+1] - headings[i] > 1:
                return False
        return True
    
    def _get_heading_issues(self):
        issues = []
        h1_count = len(self.soup.find_all('h1'))
        if h1_count == 0:
            issues.append('Missing H1 tag')
        elif h1_count > 1:
            issues.append(f'Multiple H1 tags ({h1_count} found)')
        
        if not self._check_heading_hierarchy():
            issues.append('Skipped heading level')
        
        return issues
    
    def _find_power_words(self, text):
        power_words = ['free', 'new', 'proven', 'exclusive', 'ultimate', 'best', 
                      'guaranteed', 'instant', 'easy', 'discover', 'secret', 'powerful']
        found = [w for w in power_words if w in text.lower()]
        return found
    
    def _has_cta(self, text):
        cta_words = ['call', 'click', 'try', 'get', 'start', 'learn', 'discover', 
                    'sign up', 'subscribe', 'contact', 'buy', 'shop', 'order']
        return any(w in text.lower() for w in cta_words)
    
    def _detect_primary_topic(self):
        title = self._get_title() or ''
        h1 = ' '.join([h.get_text() for h in self.soup.find_all('h1')])
        return title or h1 or 'General'
    
    def _detect_secondary_topics(self):
        h2s = [h.get_text().strip() for h in self.soup.find_all('h2')[:4]]
        return h2s if h2s else ['Unknown']
    
    def _extract_entities(self):
        # Simplified entity extraction
        return [
            {'name': self.domain, 'type': 'Organization', 'relevance': 0.9}
        ]
    
    def _detect_categories(self):
        return [{'name': 'General', 'confidence': 0.7}]
    
    def _detect_experience_signals(self):
        signals = []
        if self.soup.find(text=re.compile(r'case stud|example|real', re.I)):
            signals.append('Case studies present')
        if self.soup.find(text=re.compile(r'testimonial|review|client', re.I)):
            signals.append('Client testimonials')
        return signals if signals else ['Limited experience signals']
    
    def _detect_expertise_signals(self):
        signals = []
        if self._get_word_count() > 1500:
            signals.append('In-depth content')
        return signals if signals else ['Basic content']
    
    def _detect_authority_signals(self):
        signals = []
        if self._has_structured_data():
            signals.append('Structured data present')
        return signals if signals else ['Limited authority signals']
    
    def _detect_trust_signals(self):
        signals = []
        if self._is_https():
            signals.append('HTTPS enabled')
        if self.soup.find(text=re.compile(r'contact|email|phone', re.I)):
            signals.append('Contact information visible')
        if self.soup.find('a', href=re.compile(r'privacy', re.I)):
            signals.append('Privacy policy present')
        return signals if signals else ['Limited trust signals']
    
    def _is_voice_search_optimized(self):
        # Check for question-style headings
        return bool(self.soup.find(['h1', 'h2', 'h3'], text=re.compile(r'^(what|how|why|when|where|who)', re.I)))
    
    def _featured_snippet_potential(self):
        # Check for list structures, tables, definitions
        has_lists = bool(self.soup.find(['ul', 'ol']))
        has_tables = bool(self.soup.find('table'))
        has_definitions = bool(self.soup.find('dl'))
        
        score = 30
        if has_lists:
            score += 25
        if has_tables:
            score += 25
        if has_definitions:
            score += 20
        return min(100, score)
    
    def _find_questions(self):
        questions = []
        for h in self.soup.find_all(['h1', 'h2', 'h3', 'h4']):
            text = h.get_text().strip()
            if text.endswith('?') or text.lower().startswith(('what', 'how', 'why', 'when', 'where', 'who')):
                questions.append(text)
        return questions[:5]
    
    def _has_structured_content(self):
        return bool(self.soup.find(['article', 'section', 'aside', 'nav']))
    
    def _suggest_content_additions(self):
        suggestions = []
        if not self.soup.find(['ul', 'ol']):
            suggestions.append('Add bullet point lists')
        if not self.soup.find('table'):
            suggestions.append('Include comparison tables')
        if not self.soup.find('video'):
            suggestions.append('Add video content')
        if len(self._find_questions()) == 0:
            suggestions.append('Add FAQ section')
        return suggestions
    
    def _find_related_questions(self):
        topic = self._detect_primary_topic()
        return [
            f'What is {topic}?',
            f'How does {topic} work?',
            f'Why is {topic} important?'
        ]
    
    def _calculate_accessibility_score(self):
        score = 50
        
        # Alt text
        images = self.soup.find_all('img')
        if images:
            with_alt = len([img for img in images if img.get('alt')])
            score += (with_alt / len(images)) * 20
        else:
            score += 20
        
        # Form labels
        inputs = self.soup.find_all('input')
        labels = self.soup.find_all('label')
        if inputs:
            score += min(len(labels) / len(inputs) * 15, 15)
        else:
            score += 15
        
        # ARIA
        if self.soup.find(attrs={'role': True}):
            score += 10
        
        # Lang attribute
        if self._has_lang_attribute():
            score += 5
        
        return min(100, int(score))
    
    def _get_accessibility_issues(self):
        issues = []
        
        imgs_without_alt = self._count_images_without_alt()
        if imgs_without_alt > 0:
            issues.append({'type': 'Missing alt text', 'count': imgs_without_alt, 'severity': 'serious'})
        
        return issues
    
    def _count_missing_aria_labels(self):
        buttons = self.soup.find_all('button')
        missing = len([b for b in buttons if not b.get('aria-label') and not b.get_text().strip()])
        return missing
    
    def _is_screen_reader_friendly(self):
        return bool(self.soup.find(attrs={'role': True}) or self.soup.find(attrs={'aria-label': True}))
    
    def _has_navigation_menu(self):
        return bool(self.soup.find('nav') or self.soup.find(attrs={'role': 'navigation'}))
    
    def _has_breadcrumbs(self):
        return bool(self.soup.find(attrs={'class': re.compile(r'breadcrumb', re.I)}) or
                   self.soup.find(attrs={'itemtype': re.compile(r'BreadcrumbList')}))
    
    def _has_search(self):
        return bool(self.soup.find('input', attrs={'type': 'search'}) or
                   self.soup.find(attrs={'role': 'search'}))
    
    def _has_footer_links(self):
        footer = self.soup.find('footer')
        return bool(footer and footer.find('a'))
    
    def _estimate_read_time(self):
        words = self._get_word_count()
        return max(1, words // 200)
    
    def _count_interactive_elements(self):
        return len(self.soup.find_all(['button', 'input', 'select', 'textarea', 'a']))
    
    def _count_ctas(self):
        cta_patterns = re.compile(r'(buy|shop|sign.up|subscribe|contact|get.started|try|download)', re.I)
        buttons = self.soup.find_all(['button', 'a'])
        return len([b for b in buttons if cta_patterns.search(b.get_text())])
    
    def _has_popups(self):
        # Check for common popup indicators
        return bool(self.soup.find(attrs={'class': re.compile(r'popup|modal|overlay', re.I)}))
    
    def _get_social_links(self):
        social_domains = ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 
                         'youtube.com', 'pinterest.com', 'tiktok.com', 'x.com']
        links = []
        for a in self.soup.find_all('a', href=True):
            href = a.get('href', '')
            if any(d in href for d in social_domains):
                links.append(href)
        return links
    
    def _has_social_proof(self):
        return bool(self.soup.find(text=re.compile(r'testimonial|review|rating|client|customer', re.I)))
    
    def _has_share_buttons(self):
        return bool(self.soup.find(attrs={'class': re.compile(r'share|social', re.I)}))
    
    def _has_csp_header(self):
        # Would need actual HTTP response headers
        return False
    
    def _has_xframe_options(self):
        return False
    
    def _has_mixed_content(self):
        return self._count_mixed_content() > 0


"""
Comprehensive Issue Detector
Detects all SEO issues and generates frontend-compatible action items
"""

from typing import List, Dict, Any
import uuid


class ComprehensiveIssueDetector:
    """
    Detects SEO issues and generates action items matching frontend structure.
    
    Frontend expects issues with:
    - id, category, type, title, description
    - impact, effort, priority
    - recommendation, howToFix (list), estimatedTime, potentialGain
    - affectedPages, resources
    """
    
    CATEGORIES = {
        'critical': 1,
        'high': 2,
        'medium': 3,
        'low': 4,
    }
    
    EFFORT_LEVELS = ['low', 'medium', 'high']
    
    TYPES = [
        'performance', 'on-page', 'technical', 'accessibility',
        'security', 'ux', 'content', 'social'
    ]
    
    def __init__(self, metrics: Dict[str, Any]):
        """
        Initialize detector with parsed metrics
        
        Args:
            metrics: Comprehensive metrics from ComprehensiveHTMLParser
        """
        self.metrics = metrics
        self.issues: List[Dict[str, Any]] = []
        self._priority_counter = 0
    
    def detect_all_issues(self) -> List[Dict[str, Any]]:
        """
        Run all issue detection checks
        
        Returns:
            List of issues in frontend-compatible format
        """
        self._check_title()
        self._check_meta_description()
        self._check_h1_tags()
        self._check_heading_hierarchy()
        self._check_content_length()
        
        self._check_images_alt()
        self._check_images_lazy_loading()
        
        self._check_internal_links()
        self._check_external_links()
        
        self._check_https()
        self._check_canonical()
        self._check_viewport()
        self._check_structured_data()
        self._check_render_blocking()
        
        self._check_open_graph()
        self._check_twitter_cards()
        
        self._check_accessibility()
        
        self.issues.sort(key=lambda x: (self.CATEGORIES.get(x['category'], 5), x['priority']))
        
        return self.issues
    
    def _add_issue(
        self,
        issue_type: str,
        category: str,
        title: str,
        description: str,
        recommendation: str,
        how_to_fix: List[str],
        impact: int,
        effort: str,
        estimated_time: str,
        potential_gain: str,
        resources: List[Dict[str, str]] = None,
        data: Dict[str, Any] = None
    ):
        """Add an issue in frontend-compatible format"""
        self._priority_counter += 1
        
        self.issues.append({
            'id': str(uuid.uuid4())[:8],
            'category': category,
            'type': issue_type,
            'title': title,
            'description': description,
            'impact': impact,
            'effort': effort,
            'priority': self._priority_counter,
            'recommendation': recommendation,
            'howToFix': how_to_fix,
            'estimatedTime': estimated_time,
            'potentialGain': potential_gain,
            'affectedPages': [self.metrics.get('url', '')],
            'resources': resources or [],
            'data': data or {},
        })
    
    
    def _check_title(self):
        """Check title tag issues"""
        on_page = self.metrics.get('onPage', {})
        title_data = on_page.get('title', {})
        
        title = title_data.get('content') or self.metrics.get('title', '')
        length = title_data.get('length') or self.metrics.get('title_length', 0)
        
        if not title:
            self._add_issue(
                issue_type='on-page',
                category='critical',
                title='Missing Title Tag',
                description='No title tag found on the page. This is critical for SEO as the title appears in search results.',
                recommendation='Add a descriptive title tag between 30-60 characters that includes your primary keyword.',
                how_to_fix=[
                    'Add a <title> tag inside the <head> section',
                    'Make it 30-60 characters long',
                    'Include your primary keyword near the beginning',
                    'Make it compelling to encourage clicks',
                    'Ensure it\'s unique across your site'
                ],
                impact=10,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='+15-25% improvement in CTR from search results',
                resources=[
                    {'title': 'Title Tag Best Practices', 'url': 'https://moz.com/learn/seo/title-tag'}
                ]
            )
            return
        
        if length < 30:
            self._add_issue(
                issue_type='on-page',
                category='high',
                title='Title Tag Too Short',
                description=f'Your title tag is only {length} characters. Titles under 30 characters may not fully utilize SERP real estate.',
                recommendation='Expand your title to 30-60 characters while including relevant keywords.',
                how_to_fix=[
                    f'Current title ({length} chars): "{title}"',
                    'Add relevant keywords or descriptive terms',
                    'Consider adding your brand name',
                    'Target 50-60 characters for optimal length',
                    'Test with SERP preview tools'
                ],
                impact=7,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='+5-10% improvement in CTR',
                data={'current_length': length, 'current_title': title}
            )
        
        elif length > 60:
            self._add_issue(
                issue_type='on-page',
                category='medium',
                title='Title Tag Too Long',
                description=f'Your title tag is {length} characters. Titles over 60 characters may be truncated in search results.',
                recommendation='Shorten your title to under 60 characters while keeping key information at the beginning.',
                how_to_fix=[
                    f'Current title ({length} chars): "{title[:50]}..."',
                    'Move important keywords to the beginning',
                    'Remove unnecessary words',
                    'Consider removing brand name if space is limited',
                    'Keep most important info in first 50 characters'
                ],
                impact=5,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='+3-5% improvement in CTR',
                data={'current_length': length, 'current_title': title}
            )
    
    
    def _check_meta_description(self):
        """Check meta description issues"""
        on_page = self.metrics.get('onPage', {})
        meta_data = on_page.get('metaDescription', {})
        
        content = meta_data.get('content') or self.metrics.get('meta_description', '')
        length = meta_data.get('length') or self.metrics.get('meta_description_length', 0)
        
        if not content:
            self._add_issue(
                issue_type='on-page',
                category='high',
                title='Missing Meta Description',
                description='No meta description found. Google may generate one automatically, but custom descriptions typically get better CTR.',
                recommendation='Add a compelling meta description of 150-160 characters with a clear call-to-action.',
                how_to_fix=[
                    'Add a <meta name="description" content="..."> tag',
                    'Write 150-160 characters of compelling copy',
                    'Include your primary keyword naturally',
                    'Add a clear call-to-action (Learn more, Get started, etc.)',
                    'Make it unique for each page'
                ],
                impact=8,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='+10-15% improvement in CTR from search results',
                resources=[
                    {'title': 'Meta Description Guide', 'url': 'https://moz.com/learn/seo/meta-description'}
                ]
            )
            return
        
        if length < 120:
            self._add_issue(
                issue_type='on-page',
                category='medium',
                title='Meta Description Too Short',
                description=f'Your meta description is only {length} characters. Aim for 150-160 characters for maximum SERP visibility.',
                recommendation='Expand your meta description to provide more compelling information.',
                how_to_fix=[
                    f'Current description ({length} chars)',
                    'Add more detail about your page content',
                    'Include a call-to-action',
                    'Add unique selling points',
                    'Target 150-160 characters'
                ],
                impact=5,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='+5-10% improvement in CTR',
                data={'current_length': length}
            )
        
        elif length > 160:
            self._add_issue(
                issue_type='on-page',
                category='low',
                title='Meta Description Too Long',
                description=f'Your meta description is {length} characters. It may be truncated in search results after 160 characters.',
                recommendation='Trim your description to under 160 characters, keeping the most important info first.',
                how_to_fix=[
                    'Keep description under 160 characters',
                    'Put most important info at the beginning',
                    'Remove filler words',
                    'Ensure CTA is visible within limit'
                ],
                impact=3,
                effort='low',
                estimated_time='10-15 minutes',
                potential_gain='Better display in search results',
                data={'current_length': length}
            )
    
    
    def _check_h1_tags(self):
        """Check H1 tag issues"""
        on_page = self.metrics.get('onPage', {})
        headings = on_page.get('headings', {})
        h1_data = headings.get('h1', {})
        
        h1_count = h1_data.get('count') or self.metrics.get('h1_count', 0)
        h1_content = h1_data.get('content', []) or self.metrics.get('h1_tags', [])
        
        if h1_count == 0:
            self._add_issue(
                issue_type='on-page',
                category='critical',
                title='Missing H1 Tag',
                description='No H1 heading found on the page. The H1 is crucial for SEO and accessibility.',
                recommendation='Add a single, descriptive H1 tag that includes your primary keyword.',
                how_to_fix=[
                    'Add exactly one H1 tag to the page',
                    'Make it descriptive of the page content',
                    'Include your primary keyword',
                    'Keep it under 70 characters',
                    'Place it near the top of the content'
                ],
                impact=9,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='Improved keyword relevance and accessibility',
                resources=[
                    {'title': 'Heading Tags for SEO', 'url': 'https://moz.com/learn/seo/headings'}
                ]
            )
        
        elif h1_count > 1:
            self._add_issue(
                issue_type='on-page',
                category='medium',
                title='Multiple H1 Tags Found',
                description=f'Found {h1_count} H1 tags on the page. Best practice is to use exactly one H1 per page.',
                recommendation='Consolidate to a single H1 and convert others to H2 tags.',
                how_to_fix=[
                    f'Currently have {h1_count} H1 tags',
                    'Keep only the main page title as H1',
                    'Convert other H1s to H2 or appropriate level',
                    'Ensure heading hierarchy is logical',
                    'Review page structure'
                ],
                impact=5,
                effort='low',
                estimated_time='20-30 minutes',
                potential_gain='Clearer content structure for search engines',
                data={'h1_count': h1_count, 'h1_content': h1_content[:3]}
            )
    
    def _check_heading_hierarchy(self):
        """Check heading hierarchy issues"""
        on_page = self.metrics.get('onPage', {})
        headings = on_page.get('headings', {})
        hierarchy = headings.get('hierarchy', {})
        
        if not hierarchy.get('valid', True):
            issues = hierarchy.get('issues', [])
            self._add_issue(
                issue_type='on-page',
                category='medium',
                title='Invalid Heading Hierarchy',
                description=f'Heading structure has issues: {", ".join(issues[:2])}. This affects SEO and accessibility.',
                recommendation='Fix the heading hierarchy to follow a logical order (H1 → H2 → H3, etc.).',
                how_to_fix=[
                    'Ensure only one H1 tag exists',
                    'Use H2 for main sections under H1',
                    'Use H3 for subsections under H2',
                    'Don\'t skip heading levels',
                    'Review and restructure headings'
                ],
                impact=5,
                effort='medium',
                estimated_time='30-60 minutes',
                potential_gain='Improved content structure and accessibility',
                data={'issues': issues}
            )
    
    
    def _check_content_length(self):
        """Check content length issues"""
        on_page = self.metrics.get('onPage', {})
        content_data = on_page.get('content', {})
        
        word_count = content_data.get('wordCount') or self.metrics.get('word_count', 0)
        
        if word_count < 300:
            self._add_issue(
                issue_type='content',
                category='high',
                title='Thin Content Detected',
                description=f'Page has only {word_count} words. This is considered thin content that may struggle to rank.',
                recommendation='Expand your content to at least 300-500 words with valuable, comprehensive information.',
                how_to_fix=[
                    f'Current word count: {word_count}',
                    'Add more detailed information about the topic',
                    'Include relevant examples and explanations',
                    'Add FAQ section with common questions',
                    'Target 500-1500 words for better rankings'
                ],
                impact=8,
                effort='high',
                estimated_time='2-4 hours',
                potential_gain='Significantly improved ranking potential',
                resources=[
                    {'title': 'Content Length Study', 'url': 'https://backlinko.com/content-study'}
                ],
                data={'word_count': word_count}
            )
    
    
    def _check_images_alt(self):
        """Check image alt text issues"""
        on_page = self.metrics.get('onPage', {})
        images = on_page.get('images', {})
        
        total = images.get('total') or self.metrics.get('image_count', 0)
        without_alt = images.get('withoutAlt') or self.metrics.get('images_without_alt', 0)
        
        if without_alt > 0:
            self._add_issue(
                issue_type='accessibility',
                category='high',
                title='Images Missing Alt Text',
                description=f'{without_alt} of {total} images are missing alt text. This impacts accessibility and image SEO.',
                recommendation='Add descriptive alt text to all images.',
                how_to_fix=[
                    f'{without_alt} images need alt text',
                    'Add descriptive alt text to each image',
                    'Include relevant keywords where natural',
                    'Keep alt text under 125 characters',
                    'Use empty alt="" only for decorative images'
                ],
                impact=7,
                effort='low',
                estimated_time='30-60 minutes',
                potential_gain='Improved accessibility score and image search rankings',
                resources=[
                    {'title': 'Alt Text Best Practices', 'url': 'https://moz.com/learn/seo/alt-text'}
                ],
                data={'images_without_alt': without_alt, 'total_images': total}
            )
    
    def _check_images_lazy_loading(self):
        """Check lazy loading implementation"""
        on_page = self.metrics.get('onPage', {})
        images = on_page.get('images', {})
        
        total = images.get('total', 0)
        lazy_loaded = images.get('lazyLoaded', 0)
        
        if total > 5 and lazy_loaded < total * 0.5:
            self._add_issue(
                issue_type='performance',
                category='medium',
                title='Images Not Lazy Loaded',
                description=f'Only {lazy_loaded} of {total} images use lazy loading. This can slow down initial page load.',
                recommendation='Implement lazy loading for images below the fold.',
                how_to_fix=[
                    'Add loading="lazy" to img tags',
                    'Keep above-the-fold images loading normally',
                    'Consider using intersection observer for JS-based lazy loading',
                    'Test that images load properly when scrolled into view'
                ],
                impact=5,
                effort='low',
                estimated_time='30-60 minutes',
                potential_gain='Improved page load speed and Core Web Vitals',
                data={'lazy_loaded': lazy_loaded, 'total': total}
            )
    
    
    def _check_internal_links(self):
        """Check internal linking"""
        on_page = self.metrics.get('onPage', {})
        links = on_page.get('links', {})
        internal = links.get('internal', {})
        
        count = internal.get('count') or self.metrics.get('internal_links_count', 0)
        
        if count < 3:
            self._add_issue(
                issue_type='on-page',
                category='medium',
                title='Weak Internal Linking',
                description=f'Only {count} internal links found. Strong internal linking helps distribute page authority.',
                recommendation='Add more internal links to relevant pages on your site.',
                how_to_fix=[
                    f'Currently have {count} internal links',
                    'Add 5-10 relevant internal links',
                    'Use descriptive anchor text',
                    'Link to important pages more frequently',
                    'Create content hubs with pillar pages'
                ],
                impact=6,
                effort='medium',
                estimated_time='1-2 hours',
                potential_gain='Better crawlability and page authority distribution',
                resources=[
                    {'title': 'Internal Linking Strategy', 'url': 'https://ahrefs.com/blog/internal-links-for-seo/'}
                ],
                data={'internal_links_count': count}
            )
    
    def _check_external_links(self):
        """Check external linking"""
        on_page = self.metrics.get('onPage', {})
        links = on_page.get('links', {})
        external = links.get('external', {})
        
        count = external.get('count') or self.metrics.get('external_links_count', 0)
        nofollow = external.get('nofollow', 0)
        
        if count > 0 and count == nofollow:
            self._add_issue(
                issue_type='technical',
                category='low',
                title='All External Links Are Nofollow',
                description='All external links have nofollow attribute. Linking to authoritative sources without nofollow can be beneficial.',
                recommendation='Consider allowing some quality external links to pass link juice.',
                how_to_fix=[
                    'Review external links to authoritative sources',
                    'Remove nofollow from trusted resources',
                    'Keep nofollow on user-generated content',
                    'Keep nofollow on affiliate/sponsored links'
                ],
                impact=3,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='Better trust signals through authoritative linking',
                data={'external_count': count, 'nofollow_count': nofollow}
            )
    
    
    def _check_https(self):
        """Check HTTPS implementation"""
        technical = self.metrics.get('technical', {})
        security = technical.get('security', {})
        
        https = security.get('https') or self.metrics.get('https_enabled', False)
        
        if not https:
            self._add_issue(
                issue_type='security',
                category='critical',
                title='HTTPS Not Enabled',
                description='Page is not served over HTTPS. This is a ranking factor and affects user trust.',
                recommendation='Enable HTTPS across your entire site.',
                how_to_fix=[
                    'Obtain an SSL/TLS certificate',
                    'Install certificate on your server',
                    'Configure 301 redirects from HTTP to HTTPS',
                    'Update internal links to HTTPS',
                    'Update canonical tags and sitemaps'
                ],
                impact=10,
                effort='medium',
                estimated_time='1-4 hours',
                potential_gain='Improved rankings and user trust',
                resources=[
                    {'title': 'HTTPS for SEO', 'url': 'https://developers.google.com/search/docs/advanced/security/https'}
                ]
            )
    
    def _check_canonical(self):
        """Check canonical tag"""
        technical = self.metrics.get('technical', {})
        crawlability = technical.get('crawlability', {})
        canonicalization = crawlability.get('canonicalization', {})
        
        has_canonical = canonicalization.get('hasCanonical') or self.metrics.get('has_canonical', False)
        
        if not has_canonical:
            self._add_issue(
                issue_type='technical',
                category='medium',
                title='Missing Canonical Tag',
                description='No canonical tag found. This can lead to duplicate content issues.',
                recommendation='Add a canonical tag pointing to the preferred URL.',
                how_to_fix=[
                    'Add <link rel="canonical" href="..."> to the head',
                    'Point to the preferred/primary URL',
                    'Use absolute URLs in canonical tags',
                    'Ensure canonical URL is accessible',
                    'Self-referencing canonicals are fine'
                ],
                impact=6,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='Prevention of duplicate content issues',
                resources=[
                    {'title': 'Canonical Tags Guide', 'url': 'https://moz.com/learn/seo/canonicalization'}
                ]
            )
    
    def _check_viewport(self):
        """Check viewport meta tag"""
        technical = self.metrics.get('technical', {})
        mobile = technical.get('mobile', {})
        
        viewport = mobile.get('viewportConfigured') or self.metrics.get('viewport_configured', False)
        
        if not viewport:
            self._add_issue(
                issue_type='technical',
                category='critical',
                title='Missing Viewport Meta Tag',
                description='No viewport meta tag found. This is essential for mobile-friendly pages.',
                recommendation='Add a proper viewport meta tag for responsive design.',
                how_to_fix=[
                    'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
                    'Place it in the <head> section',
                    'Don\'t disable user scaling unless necessary',
                    'Test on mobile devices'
                ],
                impact=9,
                effort='low',
                estimated_time='5-10 minutes',
                potential_gain='Mobile-friendly status and better mobile rankings'
            )
    
    def _check_structured_data(self):
        """Check structured data implementation"""
        technical = self.metrics.get('technical', {})
        structured = technical.get('structuredData', {})
        
        present = structured.get('present') or self.metrics.get('has_structured_data', False)
        
        if not present:
            self._add_issue(
                issue_type='technical',
                category='medium',
                title='Missing Structured Data',
                description='No structured data (JSON-LD/Schema.org) found. You\'re missing rich result opportunities.',
                recommendation='Implement relevant structured data for rich snippets in search results.',
                how_to_fix=[
                    'Add Organization schema for brand recognition',
                    'Add WebPage or Article schema for content',
                    'Consider FAQ schema for common questions',
                    'Add BreadcrumbList for navigation',
                    'Validate with Google Rich Results Test'
                ],
                impact=6,
                effort='medium',
                estimated_time='1-2 hours',
                potential_gain='+25-35% increase in SERP visibility with rich results',
                resources=[
                    {'title': 'Structured Data Guide', 'url': 'https://developers.google.com/search/docs/appearance/structured-data'}
                ]
            )
    
    def _check_render_blocking(self):
        """Check render-blocking resources"""
        technical = self.metrics.get('technical', {})
        rendering = technical.get('rendering', {})
        
        blocking = rendering.get('renderBlockingResources', 0)
        
        if blocking > 3:
            self._add_issue(
                issue_type='performance',
                category='medium',
                title='Render-Blocking Resources',
                description=f'{blocking} resources are blocking the initial render. This slows down First Contentful Paint.',
                recommendation='Eliminate or defer render-blocking CSS and JavaScript.',
                how_to_fix=[
                    'Inline critical CSS in the <head>',
                    'Add async or defer to non-critical scripts',
                    'Use media="print" onload trick for non-critical CSS',
                    'Move scripts to bottom of page',
                    'Use code splitting'
                ],
                impact=6,
                effort='high',
                estimated_time='2-4 hours',
                potential_gain='Improved First Contentful Paint and page speed',
                resources=[
                    {'title': 'Render-Blocking Resources', 'url': 'https://web.dev/render-blocking-resources/'}
                ],
                data={'blocking_count': blocking}
            )
    
    
    def _check_open_graph(self):
        """Check Open Graph implementation"""
        social = self.metrics.get('social', {})
        og = social.get('openGraph', {})
        
        present = og.get('present') or self.metrics.get('has_og_tags', False)
        
        if not present:
            self._add_issue(
                issue_type='social',
                category='medium',
                title='Missing Open Graph Tags',
                description='No Open Graph meta tags found. Links shared on social media may not display optimally.',
                recommendation='Add Open Graph tags for better social sharing.',
                how_to_fix=[
                    'Add og:title meta tag',
                    'Add og:description meta tag',
                    'Add og:image (1200x630px recommended)',
                    'Add og:url meta tag',
                    'Add og:type meta tag'
                ],
                impact=5,
                effort='low',
                estimated_time='30-45 minutes',
                potential_gain='Better click-through rates from social shares',
                resources=[
                    {'title': 'Open Graph Protocol', 'url': 'https://ogp.me/'}
                ]
            )
    
    def _check_twitter_cards(self):
        """Check Twitter Cards implementation"""
        social = self.metrics.get('social', {})
        twitter = social.get('twitterCards', {})
        
        present = twitter.get('present') or self.metrics.get('has_twitter_cards', False)
        
        if not present:
            self._add_issue(
                issue_type='social',
                category='low',
                title='Missing Twitter Card Tags',
                description='No Twitter Card meta tags found. Tweets linking to your site may not display optimally.',
                recommendation='Add Twitter Card tags for better Twitter sharing.',
                how_to_fix=[
                    'Add twitter:card meta tag',
                    'Add twitter:title meta tag',
                    'Add twitter:description meta tag',
                    'Add twitter:image meta tag',
                    'Consider twitter:creator for author attribution'
                ],
                impact=3,
                effort='low',
                estimated_time='15-30 minutes',
                potential_gain='Better visibility when shared on Twitter',
                resources=[
                    {'title': 'Twitter Cards', 'url': 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards'}
                ]
            )
    
    
    def _check_accessibility(self):
        """Check accessibility issues"""
        ux = self.metrics.get('userExperience', {})
        accessibility = ux.get('accessibility', {})
        issues = accessibility.get('issues', [])
        
        for issue in issues[:3]:  # Limit to top 3
            issue_type = issue.get('type', 'Unknown')
            count = issue.get('count', 0)
            severity = issue.get('severity', 'moderate')
            
            category = 'high' if severity == 'serious' else 'medium'
            
            self._add_issue(
                issue_type='accessibility',
                category=category,
                title=f'Accessibility: {issue_type}',
                description=f'{count} instances of {issue_type.lower()} detected. This affects users with disabilities.',
                recommendation=f'Fix all instances of {issue_type.lower()} for better accessibility.',
                how_to_fix=[
                    f'Found {count} occurrences',
                    'Use automated accessibility testing tools',
                    'Follow WCAG 2.1 guidelines',
                    'Test with screen readers',
                    'Ensure keyboard navigability'
                ],
                impact=7 if severity == 'serious' else 4,
                effort='medium',
                estimated_time='1-2 hours',
                potential_gain='Improved accessibility and potential legal compliance',
                resources=[
                    {'title': 'WCAG Guidelines', 'url': 'https://www.w3.org/WAI/standards-guidelines/wcag/'}
                ],
                data={'issue_type': issue_type, 'count': count}
            )



if __name__ == "__main__":
    import json
    
    sample_metrics = {
        'url': 'https://example.com/test',
        'title': 'Short',
        'title_length': 5,
        'meta_description': None,
        'meta_description_length': 0,
        'h1_count': 0,
        'h2_count': 2,
        'word_count': 150,
        'image_count': 5,
        'images_without_alt': 3,
        'internal_links_count': 2,
        'external_links_count': 1,
        'https_enabled': False,
        'has_canonical': False,
        'viewport_configured': False,
        'has_og_tags': False,
        'has_twitter_cards': False,
        'has_structured_data': False,
        'onPage': {
            'title': {'content': 'Short', 'length': 5},
            'metaDescription': {'content': '', 'length': 0},
            'headings': {'h1': {'count': 0}, 'hierarchy': {'valid': True}},
            'content': {'wordCount': 150},
            'images': {'total': 5, 'withoutAlt': 3, 'lazyLoaded': 0},
            'links': {'internal': {'count': 2}, 'external': {'count': 1, 'nofollow': 0}},
        },
        'technical': {
            'security': {'https': False},
            'crawlability': {'canonicalization': {'hasCanonical': False}},
            'mobile': {'viewportConfigured': False},
            'structuredData': {'present': False},
            'rendering': {'renderBlockingResources': 5},
        },
        'social': {
            'openGraph': {'present': False},
            'twitterCards': {'present': False},
        },
        'userExperience': {
            'accessibility': {
                'issues': [
                    {'type': 'Missing alt text', 'count': 3, 'severity': 'serious'}
                ]
            }
        }
    }
    
    detector = ComprehensiveIssueDetector(sample_metrics)
    issues = detector.detect_all_issues()
    
    print(f"Found {len(issues)} issues:\n")
    for issue in issues:
        print(f"[{issue['category'].upper()}] {issue['title']}")
        print(f"   Impact: {issue['impact']}/10, Effort: {issue['effort']}")
        print(f"   {issue['description'][:100]}...")
        print()

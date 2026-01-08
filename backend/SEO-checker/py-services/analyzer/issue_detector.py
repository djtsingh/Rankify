# py-services/analyzer/issue_detector.py

"""
Real Issue Detector
Analyzes metrics and detects actual SEO issues based on best practices
"""

import uuid


class IssueDetector:
    def __init__(self, metrics):
        """
        Initialize issue detector
        
        Args:
            metrics (dict): Parsed metrics from HTMLParser
        """
        self.metrics = metrics
        self.issues = []
        self._issue_counter = 0
    
    def detect_all_issues(self):
        """
        Run all issue detection checks
        
        Returns:
            list: List of detected issues
        """
        # Run all checks
        self._check_title()
        self._check_meta_description()
        self._check_h1_tags()
        self._check_h2_tags()
        self._check_https()
        self._check_canonical()
        self._check_images()
        self._check_word_count()
        self._check_links()
        self._check_og_tags()
        
        return self.issues
    
    def _severity_to_category(self, severity):
        """Map severity to category for frontend compatibility"""
        mapping = {
            'critical': 'critical',
            'warning': 'important',
            'info': 'moderate'
        }
        return mapping.get(severity, 'minor')
    
    def _add_issue(self, issue_type, severity, title, description, recommendation, impact_score, expected_improvement, time_to_fix_hours, data=None):
        """
        Helper method to add an issue
        
        Args:
            issue_type (str): Type of issue (e.g., 'title_tag')
            severity (str): 'critical', 'warning', or 'info'
            title (str): Short title
            description (str): Detailed description
            recommendation (str): How to fix it
            impact_score (float): 0.0-1.0 (how important this is) - will be scaled to 0-10 for frontend
            expected_improvement (str): Expected impact
            time_to_fix_hours (int): Estimated time to fix
            data (dict): Additional data
        """
        # Scale impact_score from 0-1 to 0-10 for frontend compatibility
        scaled_impact = round(impact_score * 10, 1)
        
        # Increment issue counter for unique ID
        self._issue_counter += 1
        
        # Calculate priority based on severity and impact
        priority_map = {'critical': 1, 'warning': 2, 'info': 3}
        base_priority = priority_map.get(severity, 3)
        priority = base_priority + (1 - impact_score)  # Lower number = higher priority
        
        self.issues.append({
            'id': str(self._issue_counter),  # Frontend needs string ID
            'type': issue_type,
            'category': self._severity_to_category(severity),  # Frontend needs category
            'severity': severity,
            'title': title,
            'description': description,
            'recommendation': recommendation,
            'impact_score': scaled_impact,
            'expected_improvement': expected_improvement,
            'time_to_fix_hours': time_to_fix_hours,
            'priority': round(priority, 2),  # Frontend needs priority
            'data': data or {}
        })
    
    # ============================================
    # TITLE TAG CHECKS
    # ============================================
    
    def _check_title(self):
        """Check title tag issues"""
        title = self.metrics.get('title')
        title_length = self.metrics.get('title_length', 0)
        
        # Missing title
        if not title:
            self._add_issue(
                issue_type='title_tag',
                severity='critical',
                title='Missing title tag',
                description='No title tag found on the page',
                recommendation='Add a descriptive title tag between 30-60 characters',
                impact_score=1.0,
                expected_improvement='+15% CTR from search results',
                time_to_fix_hours=1,
                data={'current_length': 0, 'recommended_length': '30-60'}
            )
            return
        
        # Title too short
        if title_length < 30:
            self._add_issue(
                issue_type='title_tag',
                severity='warning',
                title='Title tag too short',
                description=f'Title is only {title_length} characters (recommended: 30-60)',
                recommendation='Expand the title to 30-60 characters with relevant keywords',
                impact_score=0.75,
                expected_improvement='+10% CTR from search results',
                time_to_fix_hours=1,
                data={'current_length': title_length, 'recommended_length': '30-60', 'current_title': title}
            )
        
        # Title too long
        elif title_length > 60:
            self._add_issue(
                issue_type='title_tag',
                severity='warning',
                title='Title tag too long',
                description=f'Title is {title_length} characters (recommended: 30-60). It may be truncated in search results.',
                recommendation='Shorten the title to 30-60 characters while keeping key information',
                impact_score=0.65,
                expected_improvement='+8% CTR from search results',
                time_to_fix_hours=1,
                data={'current_length': title_length, 'recommended_length': '30-60', 'current_title': title}
            )
    
    # ============================================
    # META DESCRIPTION CHECKS
    # ============================================
    
    def _check_meta_description(self):
        """Check meta description issues"""
        description = self.metrics.get('meta_description')
        desc_length = self.metrics.get('meta_description_length', 0)
        
        # Missing meta description
        if not description:
            self._add_issue(
                issue_type='meta_description',
                severity='critical',
                title='Missing meta description',
                description='No meta description found',
                recommendation='Add a compelling meta description between 120-160 characters',
                impact_score=0.95,
                expected_improvement='+12% CTR from search results',
                time_to_fix_hours=1,
                data={'current_length': 0, 'recommended_length': '120-160'}
            )
            return
        
        # Meta description too short
        if desc_length < 120:
            self._add_issue(
                issue_type='meta_description',
                severity='warning',
                title='Meta description too short',
                description=f'Meta description is only {desc_length} characters (recommended: 120-160)',
                recommendation='Expand the meta description to 120-160 characters',
                impact_score=0.70,
                expected_improvement='+8% CTR from search results',
                time_to_fix_hours=1,
                data={'current_length': desc_length, 'recommended_length': '120-160'}
            )
        
        # Meta description too long
        elif desc_length > 160:
            self._add_issue(
                issue_type='meta_description',
                severity='info',
                title='Meta description too long',
                description=f'Meta description is {desc_length} characters (recommended: 120-160). It may be truncated.',
                recommendation='Shorten to 120-160 characters',
                impact_score=0.50,
                expected_improvement='+5% CTR from search results',
                time_to_fix_hours=1,
                data={'current_length': desc_length, 'recommended_length': '120-160'}
            )
    
    # ============================================
    # H1 TAG CHECKS
    # ============================================
    
    def _check_h1_tags(self):
        """Check H1 tag issues"""
        h1_count = self.metrics.get('h1_count', 0)
        h1_tags = self.metrics.get('h1_tags', [])
        
        # Missing H1
        if h1_count == 0:
            self._add_issue(
                issue_type='h1_tag',
                severity='critical',
                title='Missing H1 tag',
                description='No H1 heading found on the page',
                recommendation='Add one clear H1 tag that describes the main topic',
                impact_score=0.85,
                expected_improvement='+10% SEO ranking improvement',
                time_to_fix_hours=1,
                data={'current_count': 0, 'recommended_count': 1}
            )
        
        # Multiple H1s
        elif h1_count > 1:
            self._add_issue(
                issue_type='h1_tag',
                severity='warning',
                title='Multiple H1 tags',
                description=f'Found {h1_count} H1 tags (recommended: 1)',
                recommendation='Use only one H1 tag for the main heading',
                impact_score=0.60,
                expected_improvement='+5% SEO clarity',
                time_to_fix_hours=1,
                data={'current_count': h1_count, 'recommended_count': 1, 'h1_tags': h1_tags}
            )
    
    # ============================================
    # H2 TAG CHECKS
    # ============================================
    
    def _check_h2_tags(self):
        """Check H2 tag issues"""
        h2_count = self.metrics.get('h2_count', 0)
        word_count = self.metrics.get('word_count', 0)
        
        # No H2s on content-heavy pages
        if h2_count == 0 and word_count > 300:
            self._add_issue(
                issue_type='heading_structure',
                severity='info',
                title='No H2 subheadings',
                description='Page has substantial content but no H2 subheadings',
                recommendation='Add H2 tags to break up content and improve readability',
                impact_score=0.45,
                expected_improvement='+3% user engagement',
                time_to_fix_hours=2,
                data={'current_h2_count': 0, 'word_count': word_count}
            )
    
    # ============================================
    # HTTPS CHECK
    # ============================================
    
    def _check_https(self):
        """Check HTTPS"""
        https_enabled = self.metrics.get('https_enabled', False)
        
        if not https_enabled:
            self._add_issue(
                issue_type='https',
                severity='critical',
                title='HTTPS not enabled',
                description='Website is not using HTTPS protocol',
                recommendation='Enable HTTPS with an SSL/TLS certificate',
                impact_score=1.0,
                expected_improvement='+20% trust & security, required for modern web',
                time_to_fix_hours=4,
                data={'current_protocol': 'HTTP', 'recommended_protocol': 'HTTPS'}
            )
    
    # ============================================
    # CANONICAL TAG CHECK
    # ============================================
    
    def _check_canonical(self):
        """Check canonical tag"""
        has_canonical = self.metrics.get('has_canonical', False)
        
        if not has_canonical:
            self._add_issue(
                issue_type='canonical',
                severity='warning',
                title='Missing canonical tag',
                description='No canonical URL specified',
                recommendation='Add a canonical tag to prevent duplicate content issues',
                impact_score=0.55,
                expected_improvement='+5% SEO clarity for search engines',
                time_to_fix_hours=1,
                data={'has_canonical': False}
            )
    
    # ============================================
    # IMAGE CHECKS
    # ============================================
    
    def _check_images(self):
        """Check image issues"""
        image_count = self.metrics.get('image_count', 0)
        images_without_alt = self.metrics.get('images_without_alt', 0)
        
        if image_count > 0 and images_without_alt > 0:
            percentage = (images_without_alt / image_count) * 100
            
            severity = 'critical' if percentage > 50 else 'warning'
            
            self._add_issue(
                issue_type='image_alt',
                severity=severity,
                title='Images missing alt text',
                description=f'{images_without_alt} out of {image_count} images lack alt text ({percentage:.0f}%)',
                recommendation='Add descriptive alt text to all images for accessibility and SEO',
                impact_score=0.70,
                expected_improvement='+8% accessibility score, +5% image SEO',
                time_to_fix_hours=2,
                data={
                    'total_images': image_count,
                    'missing_alt': images_without_alt,
                    'percentage': round(percentage, 1)
                }
            )
    
    # ============================================
    # WORD COUNT CHECK
    # ============================================
    
    def _check_word_count(self):
        """Check content word count"""
        word_count = self.metrics.get('word_count', 0)
        
        if word_count < 300:
            self._add_issue(
                issue_type='content_length',
                severity='warning',
                title='Thin content',
                description=f'Page has only {word_count} words (recommended: 300+)',
                recommendation='Add more valuable content to provide better information',
                impact_score=0.65,
                expected_improvement='+10% SEO ranking for content depth',
                time_to_fix_hours=4,
                data={'current_words': word_count, 'recommended_words': 300}
            )
    
    # ============================================
    # LINKS CHECK
    # ============================================
    
    def _check_links(self):
        """Check internal/external links"""
        internal_links = self.metrics.get('internal_links_count', 0)
        external_links = self.metrics.get('external_links_count', 0)
        
        # Too few internal links
        if internal_links < 3:
            self._add_issue(
                issue_type='internal_links',
                severity='info',
                title='Few internal links',
                description=f'Only {internal_links} internal links found (recommended: 3+)',
                recommendation='Add more internal links to improve site navigation and SEO',
                impact_score=0.50,
                expected_improvement='+5% internal linking structure',
                time_to_fix_hours=2,
                data={'current_count': internal_links, 'recommended_count': 3}
            )
    
    # ============================================
    # OPEN GRAPH CHECKS
    # ============================================
    
    def _check_og_tags(self):
        """Check Open Graph tags for social media"""
        has_og_tags = self.metrics.get('has_og_tags', False)
        
        if not has_og_tags:
            self._add_issue(
                issue_type='open_graph',
                severity='info',
                title='Missing Open Graph tags',
                description='No Open Graph tags found for social media sharing',
                recommendation='Add og:title, og:description, and og:image tags',
                impact_score=0.40,
                expected_improvement='+10% social media engagement',
                time_to_fix_hours=2,
                data={'has_og_tags': False}
            )


# ============================================
# TEST FUNCTION
# ============================================

def test_issue_detector():
    """
    Test issue detector with sample metrics
    """
    print("\n" + "="*60)
    print("🧪 TESTING REAL ISSUE DETECTOR")
    print("="*60)
    
    # Test Case 1: Website with issues
    print("\n📝 Test Case 1: Website with multiple issues")
    
    metrics_with_issues = {
        'url': 'http://example.com',
        'title': 'Short',
        'title_length': 5,
        'meta_description': None,
        'meta_description_length': 0,
        'h1_tags': [],
        'h1_count': 0,
        'h2_count': 0,
        'word_count': 150,
        'image_count': 5,
        'images_without_alt': 3,
        'internal_links_count': 1,
        'external_links_count': 0,
        'https_enabled': False,
        'has_canonical': False,
        'has_og_tags': False
    }
    
    detector = IssueDetector(metrics_with_issues)
    issues = detector.detect_all_issues()
    
    print(f"   ✅ Detected {len(issues)} issues:")
    for i, issue in enumerate(issues, 1):
        print(f"   {i}. [{issue['severity'].upper()}] {issue['title']}")
        print(f"      Impact: {issue['impact_score']} | Fix time: {issue['time_to_fix_hours']}h")
    
    # Test Case 2: Well-optimized website
    print("\n📝 Test Case 2: Well-optimized website")
    
    metrics_optimized = {
        'url': 'https://example.com',
        'title': 'Perfect SEO Title Between Thirty And Sixty Characters',
        'title_length': 50,
        'meta_description': 'This is a perfect meta description that is between 120 and 160 characters long and provides a compelling preview of the page content.',
        'meta_description_length': 140,
        'h1_tags': ['Main Heading'],
        'h1_count': 1,
        'h2_count': 5,
        'word_count': 850,
        'image_count': 8,
        'images_without_alt': 0,
        'internal_links_count': 12,
        'external_links_count': 3,
        'https_enabled': True,
        'has_canonical': True,
        'has_og_tags': True
    }
    
    detector2 = IssueDetector(metrics_optimized)
    issues2 = detector2.detect_all_issues()
    
    print(f"   ✅ Detected {len(issues2)} issues")
    if len(issues2) == 0:
        print("   🎉 Perfect! No issues found!")
    
    print("\n" + "="*60)
    print("✅ ISSUE DETECTOR TEST COMPLETE")
    print("="*60 + "\n")


if __name__ == "__main__":
    test_issue_detector()
# py-services/analyzer/scorer.py

"""
Real Scoring Algorithm
Calculates SEO score based on metrics (0-100 scale)
"""


class Scorer:
    def __init__(self, metrics):
        """
        Initialize scorer
        
        Args:
            metrics (dict): Parsed metrics from HTMLParser
        """
        self.metrics = metrics
        self.max_score = 100
    
    def calculate_score(self):
        """
        Calculate overall SEO score
        
        Returns:
            int: Score from 0-100
        """
        score = 0
        
        # Title Tag (15 points)
        score += self._score_title()
        
        # Meta Description (15 points)
        score += self._score_meta_description()
        
        # H1 Tags (10 points)
        score += self._score_h1()
        
        # Content Quality (10 points)
        score += self._score_content()
        
        # Images (10 points)
        score += self._score_images()
        
        # HTTPS (10 points)
        score += self._score_https()
        
        # Canonical Tag (10 points)
        score += self._score_canonical()
        
        # Internal Links (10 points)
        score += self._score_links()
        
        # Open Graph Tags (5 points)
        score += self._score_og_tags()
        
        # Heading Structure (5 points)
        score += self._score_heading_structure()
        
        # Round to integer
        return round(score)
    
    # ============================================
    # TITLE SCORING (15 points)
    # ============================================
    
    def _score_title(self):
        """Score title tag (15 points max)"""
        title = self.metrics.get('title')
        title_length = self.metrics.get('title_length', 0)
        
        if not title:
            return 0  # No title = 0 points
        
        if 30 <= title_length <= 60:
            return 15  # Perfect length
        elif 20 <= title_length < 30:
            return 10  # A bit short
        elif 60 < title_length <= 70:
            return 10  # A bit long
        elif title_length < 20:
            return 5   # Too short
        else:
            return 5   # Too long
    
    # ============================================
    # META DESCRIPTION SCORING (15 points)
    # ============================================
    
    def _score_meta_description(self):
        """Score meta description (15 points max)"""
        description = self.metrics.get('meta_description')
        desc_length = self.metrics.get('meta_description_length', 0)
        
        if not description:
            return 0  # No description = 0 points
        
        if 120 <= desc_length <= 160:
            return 15  # Perfect length
        elif 100 <= desc_length < 120:
            return 10  # A bit short
        elif 160 < desc_length <= 180:
            return 10  # A bit long
        elif desc_length < 100:
            return 5   # Too short
        else:
            return 5   # Too long
    
    # ============================================
    # H1 SCORING (10 points)
    # ============================================
    
    def _score_h1(self):
        """Score H1 tags (10 points max)"""
        h1_count = self.metrics.get('h1_count', 0)
        
        if h1_count == 1:
            return 10  # Perfect: exactly one H1
        elif h1_count == 0:
            return 0   # No H1
        else:
            return 5   # Multiple H1s (not ideal but not terrible)
    
    # ============================================
    # CONTENT SCORING (10 points)
    # ============================================
    
    def _score_content(self):
        """Score content quality (10 points max)"""
        word_count = self.metrics.get('word_count', 0)
        
        if word_count >= 600:
            return 10  # Excellent content
        elif word_count >= 300:
            return 7   # Good content
        elif word_count >= 150:
            return 4   # Minimal content
        else:
            return 0   # Very thin content
    
    # ============================================
    # IMAGE SCORING (10 points)
    # ============================================
    
    def _score_images(self):
        """Score images (10 points max)"""
        image_count = self.metrics.get('image_count', 0)
        images_without_alt = self.metrics.get('images_without_alt', 0)
        
        if image_count == 0:
            return 10  # No images = no problem
        
        # Calculate percentage with alt text
        images_with_alt = image_count - images_without_alt
        alt_percentage = (images_with_alt / image_count) * 100
        
        if alt_percentage == 100:
            return 10  # All images have alt text
        elif alt_percentage >= 80:
            return 7   # Most images have alt
        elif alt_percentage >= 50:
            return 4   # Half have alt
        else:
            return 2   # Few have alt
    
    # ============================================
    # HTTPS SCORING (10 points)
    # ============================================
    
    def _score_https(self):
        """Score HTTPS (10 points max)"""
        https_enabled = self.metrics.get('https_enabled', False)
        
        return 10 if https_enabled else 0
    
    # ============================================
    # CANONICAL SCORING (10 points)
    # ============================================
    
    def _score_canonical(self):
        """Score canonical tag (10 points max)"""
        has_canonical = self.metrics.get('has_canonical', False)
        
        return 10 if has_canonical else 5  # 5 points if missing (not critical)
    
    # ============================================
    # LINKS SCORING (10 points)
    # ============================================
    
    def _score_links(self):
        """Score internal links (10 points max)"""
        internal_links = self.metrics.get('internal_links_count', 0)
        
        if internal_links >= 5:
            return 10  # Good internal linking
        elif internal_links >= 3:
            return 7   # Decent linking
        elif internal_links >= 1:
            return 4   # Minimal linking
        else:
            return 0   # No links
    
    # ============================================
    # OPEN GRAPH SCORING (5 points)
    # ============================================
    
    def _score_og_tags(self):
        """Score Open Graph tags (5 points max)"""
        has_og_tags = self.metrics.get('has_og_tags', False)
        
        return 5 if has_og_tags else 0
    
    # ============================================
    # HEADING STRUCTURE SCORING (5 points)
    # ============================================
    
    def _score_heading_structure(self):
        """Score heading structure (5 points max)"""
        h2_count = self.metrics.get('h2_count', 0)
        word_count = self.metrics.get('word_count', 0)
        
        # If short content, H2s not critical
        if word_count < 300:
            return 5
        
        # For longer content, H2s help structure
        if h2_count >= 3:
            return 5   # Good structure
        elif h2_count >= 1:
            return 3   # Some structure
        else:
            return 0   # No structure
    
    def get_score_breakdown(self):
        """
        Get detailed score breakdown
        
        Returns:
            dict: Score breakdown by category
        """
        return {
            'total_score': self.calculate_score(),
            'breakdown': {
                'title': self._score_title(),
                'meta_description': self._score_meta_description(),
                'h1_tags': self._score_h1(),
                'content': self._score_content(),
                'images': self._score_images(),
                'https': self._score_https(),
                'canonical': self._score_canonical(),
                'links': self._score_links(),
                'og_tags': self._score_og_tags(),
                'heading_structure': self._score_heading_structure()
            }
        }


# ============================================
# TEST FUNCTION
# ============================================

def test_scorer():
    """
    Test scorer with different scenarios
    """
    print("\n" + "="*60)
    print("🧪 TESTING REAL SCORING ALGORITHM")
    print("="*60)
    
    # Test Case 1: Perfect website
    print("\n📝 Test Case 1: Perfect Website")
    perfect_metrics = {
        'title': 'Perfect SEO Title Between 30 and 60 Characters',
        'title_length': 50,
        'meta_description': 'Perfect meta description between 120 and 160 characters providing great preview of content that users will love.',
        'meta_description_length': 130,
        'h1_count': 1,
        'h2_count': 5,
        'word_count': 800,
        'image_count': 6,
        'images_without_alt': 0,
        'internal_links_count': 8,
        'https_enabled': True,
        'has_canonical': True,
        'has_og_tags': True
    }
    
    scorer1 = Scorer(perfect_metrics)
    score1 = scorer1.calculate_score()
    breakdown1 = scorer1.get_score_breakdown()
    
    print(f"   Score: {score1}/100 🎯")
    print(f"   Breakdown:")
    for category, points in breakdown1['breakdown'].items():
        print(f"      {category}: {points}")
    
    # Test Case 2: Poor website
    print("\n📝 Test Case 2: Poor Website")
    poor_metrics = {
        'title': 'Bad',
        'title_length': 3,
        'meta_description': None,
        'meta_description_length': 0,
        'h1_count': 0,
        'h2_count': 0,
        'word_count': 50,
        'image_count': 5,
        'images_without_alt': 5,
        'internal_links_count': 0,
        'https_enabled': False,
        'has_canonical': False,
        'has_og_tags': False
    }
    
    scorer2 = Scorer(poor_metrics)
    score2 = scorer2.calculate_score()
    breakdown2 = scorer2.get_score_breakdown()
    
    print(f"   Score: {score2}/100 ⚠️")
    print(f"   Breakdown:")
    for category, points in breakdown2['breakdown'].items():
        print(f"      {category}: {points}")
    
    # Test Case 3: Average website
    print("\n📝 Test Case 3: Average Website")
    average_metrics = {
        'title': 'Average Title',
        'title_length': 13,
        'meta_description': 'Short meta description',
        'meta_description_length': 22,
        'h1_count': 1,
        'h2_count': 2,
        'word_count': 350,
        'image_count': 4,
        'images_without_alt': 2,
        'internal_links_count': 3,
        'https_enabled': True,
        'has_canonical': True,
        'has_og_tags': False
    }
    
    scorer3 = Scorer(average_metrics)
    score3 = scorer3.calculate_score()
    breakdown3 = scorer3.get_score_breakdown()
    
    print(f"   Score: {score3}/100 📊")
    print(f"   Breakdown:")
    for category, points in breakdown3['breakdown'].items():
        print(f"      {category}: {points}")
    
    print("\n" + "="*60)
    print("✅ SCORER TEST COMPLETE")
    print("="*60 + "\n")


if __name__ == "__main__":
    test_scorer()
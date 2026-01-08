"""
Advanced Text Analysis Module
Provides TF-IDF keyword extraction, readability scoring, and content analysis
"""

import re
import math
from collections import Counter
from typing import List, Dict, Tuple, Optional

# Try importing sklearn for TF-IDF, fall back to manual implementation
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

# Try importing textstat for readability, fall back to manual
try:
    import textstat
    HAS_TEXTSTAT = True
except ImportError:
    HAS_TEXTSTAT = False


class TextAnalyzer:
    """
    Comprehensive text analysis for SEO content evaluation.
    Provides keyword extraction, readability analysis, and content metrics.
    """
    
    # Extended stop words list for better keyword extraction
    STOP_WORDS = frozenset({
        # Articles
        'a', 'an', 'the',
        # Pronouns
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're",
        "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves',
        'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself',
        'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
        'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those',
        # Verbs
        'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
        'having', 'do', 'does', 'did', 'doing', 'would', 'should', 'could', 'ought',
        "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've", "you've",
        "we've", "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll",
        "you'll", "he'll", "she'll", "we'll", "they'll", "isn't", "aren't", "wasn't",
        "weren't", "hasn't", "haven't", "hadn't", "doesn't", "don't", "didn't", "won't",
        "wouldn't", "shan't", "shouldn't", "can't", 'cannot', "couldn't", "mustn't",
        "let's", "that's", "who's", "what's", "here's", "there's", "when's", "where's",
        "why's", "how's",
        # Prepositions
        'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around',
        'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond',
        'by', 'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into',
        'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past',
        'since', 'through', 'throughout', 'till', 'to', 'toward', 'under', 'underneath',
        'until', 'up', 'upon', 'with', 'within', 'without',
        # Conjunctions
        'and', 'as', 'because', 'but', 'if', 'or', 'so', 'than', 'that', 'though',
        'unless', 'until', 'when', 'where', 'whether', 'while', 'yet',
        # Common words
        'all', 'also', 'any', 'both', 'each', 'either', 'else', 'ever', 'every',
        'few', 'first', 'get', 'got', 'just', 'last', 'least', 'less', 'made',
        'make', 'many', 'may', 'might', 'more', 'most', 'much', 'must', 'need',
        'never', 'new', 'next', 'no', 'none', 'nor', 'not', 'now', 'often', 'old',
        'once', 'one', 'only', 'other', 'own', 'part', 'rather', 'said', 'same',
        'seem', 'seemed', 'seeming', 'seems', 'several', 'shall', 'some', 'still',
        'such', 'take', 'taken', 'tell', 'then', 'there', 'therefore', 'thing',
        'think', 'three', 'thus', 'too', 'two', 'use', 'used', 'using', 'very',
        'want', 'way', 'well', 'went', 'will', 'work', 'year', 'years',
        # Web-specific stop words
        'click', 'here', 'read', 'more', 'learn', 'see', 'view', 'visit', 'page',
        'site', 'website', 'web', 'link', 'links', 'menu', 'home', 'contact',
        'login', 'sign', 'register', 'search', 'back', 'next', 'previous',
        'submit', 'send', 'share', 'follow', 'like', 'comment', 'comments',
        'reply', 'post', 'posts', 'privacy', 'policy', 'terms', 'conditions',
        'copyright', 'rights', 'reserved', 'cookie', 'cookies', 'accept'
    })
    
    def __init__(self, text: str, title: str = '', meta_description: str = ''):
        """
        Initialize text analyzer with content.
        
        Args:
            text: The main visible text content from the page
            title: Page title for context
            meta_description: Meta description for context
        """
        self.raw_text = text
        self.title = title
        self.meta_description = meta_description
        
        # Process text
        self.clean_text = self._clean_text(text)
        self.words = self._tokenize(self.clean_text)
        self.sentences = self._split_sentences(text)
        self.paragraphs = self._split_paragraphs(text)
        
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text."""
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        # Remove special characters but keep spaces and basic punctuation
        text = re.sub(r'[^\w\s\.\!\?\,\-]', ' ', text)
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def _tokenize(self, text: str) -> List[str]:
        """Tokenize text into words."""
        # Split on whitespace and punctuation
        words = re.findall(r'\b[a-zA-Z]{2,}\b', text.lower())
        return words
    
    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences."""
        # Split on sentence-ending punctuation
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if s.strip() and len(s.strip().split()) > 2]
    
    def _split_paragraphs(self, text: str) -> List[str]:
        """Split text into paragraphs."""
        paragraphs = re.split(r'\n\n+', text)
        return [p.strip() for p in paragraphs if p.strip() and len(p.strip()) > 50]
    
    def _count_syllables(self, word: str) -> int:
        """Count syllables in a word using a heuristic approach."""
        word = word.lower()
        if len(word) <= 3:
            return 1
            
        # Remove silent e at end
        if word.endswith('e'):
            word = word[:-1]
        if word.endswith('es') or word.endswith('ed'):
            word = word[:-2]
            
        # Count vowel groups
        vowels = 'aeiouy'
        count = 0
        prev_is_vowel = False
        
        for char in word:
            is_vowel = char in vowels
            if is_vowel and not prev_is_vowel:
                count += 1
            prev_is_vowel = is_vowel
            
        return max(1, count)
    
    def _is_complex_word(self, word: str) -> bool:
        """Determine if a word is complex (3+ syllables, not proper noun or compound)."""
        if len(word) < 6:
            return False
        syllables = self._count_syllables(word)
        # Complex words have 3+ syllables and don't end in common suffixes
        common_suffixes = ('ing', 'ed', 'es', 'ly')
        if syllables >= 3:
            # Check if removing common suffix still leaves 3+ syllables
            for suffix in common_suffixes:
                if word.endswith(suffix):
                    base_syllables = self._count_syllables(word[:-len(suffix)])
                    if base_syllables >= 3:
                        return True
                    return False
            return True
        return False
    
    # ==================== TF-IDF Keyword Extraction ====================
    
    def extract_keywords_tfidf(self, top_n: int = 10) -> List[Dict]:
        """
        Extract keywords using TF-IDF algorithm.
        Returns keywords with scores, density, and placement info.
        """
        if HAS_SKLEARN:
            return self._tfidf_sklearn(top_n)
        else:
            return self._tfidf_manual(top_n)
    
    def _tfidf_sklearn(self, top_n: int) -> List[Dict]:
        """Use sklearn TfidfVectorizer for keyword extraction."""
        # Filter words
        filtered_words = [w for w in self.words if w not in self.STOP_WORDS and len(w) > 2]
        
        if len(filtered_words) < 3:
            return []
        
        # Create document from filtered words
        document = ' '.join(filtered_words)
        
        # TF-IDF with n-grams (1-2 words)
        try:
            vectorizer = TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=100,
                stop_words=list(self.STOP_WORDS),
                min_df=1,
                max_df=0.95
            )
            tfidf_matrix = vectorizer.fit_transform([document])
            feature_names = vectorizer.get_feature_names_out()
            scores = tfidf_matrix.toarray()[0]
            
            # Get top keywords with scores
            keyword_scores = list(zip(feature_names, scores))
            keyword_scores.sort(key=lambda x: x[1], reverse=True)
            
            results = []
            for keyword, score in keyword_scores[:top_n]:
                count = self.clean_text.lower().count(keyword)
                density = (count / max(len(self.words), 1)) * 100
                
                results.append({
                    'keyword': keyword,
                    'score': round(score, 4),
                    'count': count,
                    'density': round(density, 2),
                    'inTitle': keyword in self.title.lower() if self.title else False,
                    'inMeta': keyword in self.meta_description.lower() if self.meta_description else False,
                    'prominence': self._calculate_prominence(keyword)
                })
            
            return results
            
        except Exception:
            return self._tfidf_manual(top_n)
    
    def _tfidf_manual(self, top_n: int) -> List[Dict]:
        """Manual TF-IDF implementation as fallback."""
        # Filter words
        filtered_words = [w for w in self.words if w not in self.STOP_WORDS and len(w) > 2]
        
        if not filtered_words:
            return []
        
        # Calculate term frequency
        word_counts = Counter(filtered_words)
        total_words = len(filtered_words)
        
        # Calculate TF-IDF (simplified - document frequency is 1 since single doc)
        # Use inverse word frequency as proxy: penalize very common words
        max_count = max(word_counts.values())
        
        tfidf_scores = {}
        for word, count in word_counts.items():
            tf = count / total_words
            # IDF approximation: give higher scores to moderately frequent terms
            idf = math.log(max_count / count + 1)
            tfidf_scores[word] = tf * idf
        
        # Sort by score
        sorted_keywords = sorted(tfidf_scores.items(), key=lambda x: x[1], reverse=True)
        
        results = []
        for keyword, score in sorted_keywords[:top_n]:
            count = word_counts[keyword]
            density = (count / max(len(self.words), 1)) * 100
            
            results.append({
                'keyword': keyword,
                'score': round(score, 4),
                'count': count,
                'density': round(density, 2),
                'inTitle': keyword in self.title.lower() if self.title else False,
                'inMeta': keyword in self.meta_description.lower() if self.meta_description else False,
                'prominence': self._calculate_prominence(keyword)
            })
        
        return results
    
    def _calculate_prominence(self, keyword: str) -> str:
        """Calculate keyword prominence based on position in content."""
        keyword_lower = keyword.lower()
        text_lower = self.clean_text.lower()
        
        # Check position in text
        first_pos = text_lower.find(keyword_lower)
        if first_pos == -1:
            return 'low'
        
        text_length = len(text_lower)
        position_ratio = first_pos / max(text_length, 1)
        
        # Check if in title or early content
        in_title = keyword_lower in self.title.lower() if self.title else False
        in_first_paragraph = position_ratio < 0.1
        
        if in_title:
            return 'very high'
        elif in_first_paragraph:
            return 'high'
        elif position_ratio < 0.3:
            return 'medium'
        else:
            return 'low'
    
    def extract_bigrams(self, top_n: int = 5) -> List[Dict]:
        """Extract meaningful two-word phrases."""
        filtered_words = [w for w in self.words if w not in self.STOP_WORDS and len(w) > 2]
        
        bigrams = []
        for i in range(len(filtered_words) - 1):
            bigram = f"{filtered_words[i]} {filtered_words[i+1]}"
            bigrams.append(bigram)
        
        bigram_counts = Counter(bigrams)
        
        results = []
        for bigram, count in bigram_counts.most_common(top_n):
            if count >= 2:  # Only include bigrams that appear at least twice
                results.append({
                    'phrase': bigram,
                    'count': count,
                    'density': round((count / max(len(self.words), 1)) * 100, 3)
                })
        
        return results
    
    # ==================== Readability Analysis ====================
    
    def analyze_readability(self) -> Dict:
        """
        Comprehensive readability analysis using multiple metrics.
        """
        if HAS_TEXTSTAT:
            return self._readability_textstat()
        else:
            return self._readability_manual()
    
    def _readability_textstat(self) -> Dict:
        """Use textstat library for comprehensive readability scores."""
        text = self.clean_text
        
        try:
            return {
                'fleschReadingEase': {
                    'score': round(textstat.flesch_reading_ease(text), 1),
                    'rating': self._rate_flesch(textstat.flesch_reading_ease(text)),
                    'description': self._describe_flesch(textstat.flesch_reading_ease(text))
                },
                'fleschKincaidGrade': {
                    'score': round(textstat.flesch_kincaid_grade(text), 1),
                    'gradeLevel': f"Grade {round(textstat.flesch_kincaid_grade(text))}"
                },
                'gunningFog': {
                    'score': round(textstat.gunning_fog(text), 1),
                    'gradeLevel': f"Grade {round(textstat.gunning_fog(text))}"
                },
                'smogIndex': {
                    'score': round(textstat.smog_index(text), 1),
                    'gradeLevel': f"Grade {round(textstat.smog_index(text))}"
                },
                'automatedReadabilityIndex': {
                    'score': round(textstat.automated_readability_index(text), 1),
                    'gradeLevel': f"Grade {round(textstat.automated_readability_index(text))}"
                },
                'colemanLiauIndex': {
                    'score': round(textstat.coleman_liau_index(text), 1),
                    'gradeLevel': f"Grade {round(textstat.coleman_liau_index(text))}"
                },
                'averageGradeLevel': round(textstat.text_standard(text, float_output=True), 1),
                'readingTime': self._calculate_reading_time(),
                'difficulty': textstat.text_standard(text),
                'sentenceInfo': {
                    'count': len(self.sentences),
                    'avgWordsPerSentence': round(len(self.words) / max(len(self.sentences), 1), 1),
                    'avgSyllablesPerWord': round(
                        sum(self._count_syllables(w) for w in self.words) / max(len(self.words), 1), 2
                    )
                }
            }
        except Exception:
            return self._readability_manual()
    
    def _readability_manual(self) -> Dict:
        """Manual readability calculation as fallback."""
        total_words = len(self.words)
        total_sentences = len(self.sentences)
        total_syllables = sum(self._count_syllables(w) for w in self.words)
        complex_words = sum(1 for w in self.words if self._is_complex_word(w))
        
        # Flesch Reading Ease: 206.835 - 1.015(words/sentences) - 84.6(syllables/words)
        if total_sentences > 0 and total_words > 0:
            flesch = 206.835 - 1.015 * (total_words / total_sentences) - 84.6 * (total_syllables / total_words)
            flesch = max(0, min(100, flesch))
        else:
            flesch = 50
        
        # Flesch-Kincaid Grade: 0.39(words/sentences) + 11.8(syllables/words) - 15.59
        if total_sentences > 0 and total_words > 0:
            fk_grade = 0.39 * (total_words / total_sentences) + 11.8 * (total_syllables / total_words) - 15.59
            fk_grade = max(0, min(18, fk_grade))
        else:
            fk_grade = 8
        
        # Gunning Fog: 0.4 * ((words/sentences) + 100 * (complex_words/words))
        if total_sentences > 0 and total_words > 0:
            fog = 0.4 * ((total_words / total_sentences) + 100 * (complex_words / total_words))
            fog = max(0, min(20, fog))
        else:
            fog = 10
        
        avg_words_per_sentence = total_words / max(total_sentences, 1)
        avg_syllables_per_word = total_syllables / max(total_words, 1)
        
        return {
            'fleschReadingEase': {
                'score': round(flesch, 1),
                'rating': self._rate_flesch(flesch),
                'description': self._describe_flesch(flesch)
            },
            'fleschKincaidGrade': {
                'score': round(fk_grade, 1),
                'gradeLevel': f"Grade {round(fk_grade)}"
            },
            'gunningFog': {
                'score': round(fog, 1),
                'gradeLevel': f"Grade {round(fog)}"
            },
            'smogIndex': {
                'score': round(fk_grade * 0.9, 1),  # Approximation
                'gradeLevel': f"Grade {round(fk_grade * 0.9)}"
            },
            'automatedReadabilityIndex': {
                'score': round(fk_grade * 1.1, 1),  # Approximation
                'gradeLevel': f"Grade {round(fk_grade * 1.1)}"
            },
            'colemanLiauIndex': {
                'score': round(fk_grade, 1),  # Approximation
                'gradeLevel': f"Grade {round(fk_grade)}"
            },
            'averageGradeLevel': round(fk_grade, 1),
            'readingTime': self._calculate_reading_time(),
            'difficulty': self._get_difficulty_label(fk_grade),
            'sentenceInfo': {
                'count': total_sentences,
                'avgWordsPerSentence': round(avg_words_per_sentence, 1),
                'avgSyllablesPerWord': round(avg_syllables_per_word, 2)
            }
        }
    
    def _rate_flesch(self, score: float) -> str:
        """Rate Flesch Reading Ease score."""
        if score >= 90:
            return 'very easy'
        elif score >= 80:
            return 'easy'
        elif score >= 70:
            return 'fairly easy'
        elif score >= 60:
            return 'standard'
        elif score >= 50:
            return 'fairly difficult'
        elif score >= 30:
            return 'difficult'
        else:
            return 'very difficult'
    
    def _describe_flesch(self, score: float) -> str:
        """Describe Flesch Reading Ease score for users."""
        if score >= 90:
            return 'Very easy to read. Easily understood by an average 11-year-old student.'
        elif score >= 80:
            return 'Easy to read. Conversational English for consumers.'
        elif score >= 70:
            return 'Fairly easy to read. Suitable for 7th grade students.'
        elif score >= 60:
            return 'Plain English. Easily understood by 13-15 year old students.'
        elif score >= 50:
            return 'Fairly difficult to read. Best suited for high school level.'
        elif score >= 30:
            return 'Difficult to read. Best understood by college graduates.'
        else:
            return 'Very difficult to read. Best understood by university graduates.'
    
    def _get_difficulty_label(self, grade: float) -> str:
        """Get difficulty label from grade level."""
        if grade <= 6:
            return '5th-6th grade level'
        elif grade <= 8:
            return '7th-8th grade level'
        elif grade <= 10:
            return '9th-10th grade level'
        elif grade <= 12:
            return '11th-12th grade level'
        else:
            return 'College level'
    
    def _calculate_reading_time(self) -> Dict:
        """Calculate estimated reading time."""
        # Average reading speed: 200-250 words per minute
        words = len(self.words)
        minutes = words / 225
        
        return {
            'minutes': round(minutes, 1),
            'seconds': round(minutes * 60),
            'formatted': f"{int(minutes)} min {int((minutes % 1) * 60)} sec" if minutes >= 1 else f"{int(minutes * 60)} sec"
        }
    
    # ==================== Content Quality Metrics ====================
    
    def analyze_content_quality(self) -> Dict:
        """Analyze overall content quality."""
        word_count = len(self.words)
        unique_words = len(set(self.words))
        
        # Vocabulary richness (Type-Token Ratio)
        ttr = unique_words / max(word_count, 1)
        
        # Content depth assessment
        if word_count < 300:
            depth = 'thin'
            depth_score = 30
        elif word_count < 600:
            depth = 'moderate'
            depth_score = 50
        elif word_count < 1200:
            depth = 'comprehensive'
            depth_score = 75
        elif word_count < 2500:
            depth = 'in-depth'
            depth_score = 90
        else:
            depth = 'expert'
            depth_score = 100
        
        return {
            'wordCount': word_count,
            'uniqueWords': unique_words,
            'vocabularyRichness': {
                'ttr': round(ttr, 3),
                'rating': 'rich' if ttr > 0.5 else 'moderate' if ttr > 0.3 else 'limited'
            },
            'contentDepth': {
                'level': depth,
                'score': depth_score,
                'wordCountOptimal': 600 <= word_count <= 2500
            },
            'paragraphCount': len(self.paragraphs),
            'sentenceCount': len(self.sentences),
            'avgWordsPerSentence': round(word_count / max(len(self.sentences), 1), 1),
            'avgWordsPerParagraph': round(word_count / max(len(self.paragraphs), 1), 1),
        }
    
    def get_full_analysis(self) -> Dict:
        """Get complete text analysis with all metrics."""
        return {
            'keywords': {
                'tfidf': self.extract_keywords_tfidf(10),
                'bigrams': self.extract_bigrams(5),
            },
            'readability': self.analyze_readability(),
            'contentQuality': self.analyze_content_quality(),
        }

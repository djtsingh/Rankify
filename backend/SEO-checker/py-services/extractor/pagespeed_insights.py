"""
Google PageSpeed Insights API Integration
Provides real Core Web Vitals and performance metrics from Google's API
"""

import httpx
from typing import Dict, Optional, List
from dataclasses import dataclass


@dataclass
class CoreWebVital:
    """Core Web Vital metric result."""
    name: str
    value: float
    unit: str
    rating: str  # 'good', 'needs-improvement', 'poor'
    percentile: Optional[int] = None


class PageSpeedInsightsAPI:
    """
    Client for Google PageSpeed Insights API.
    Free tier: 25,000 queries per day with API key, 400 queries without.
    """
    
    API_BASE = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    
    CWV_THRESHOLDS = {
        'LCP': {'good': 2500, 'poor': 4000},  # milliseconds
        'FID': {'good': 100, 'poor': 300},     # milliseconds
        'CLS': {'good': 0.1, 'poor': 0.25},    # unitless
        'INP': {'good': 200, 'poor': 500},     # milliseconds
        'TTFB': {'good': 800, 'poor': 1800},   # milliseconds
        'FCP': {'good': 1800, 'poor': 3000},   # milliseconds
    }
    
    def __init__(self, api_key: Optional[str] = None, timeout: float = 30.0):
        """
        Initialize PageSpeed Insights client.
        
        Args:
            api_key: Optional Google API key for higher rate limits
            timeout: Request timeout in seconds (API can be slow)
        """
        self.api_key = api_key
        self.timeout = timeout
        self._last_response: Optional[Dict] = None
    
    def _rate_metric(self, metric_name: str, value: float) -> str:
        """Rate a metric value based on Google's thresholds."""
        thresholds = self.CWV_THRESHOLDS.get(metric_name, {'good': 0, 'poor': float('inf')})
        
        if value <= thresholds['good']:
            return 'good'
        elif value > thresholds['poor']:
            return 'poor'
        else:
            return 'needs-improvement'
    
    def analyze(self, url: str, strategy: str = 'mobile', categories: List[str] = None) -> Dict:
        """
        Run PageSpeed Insights analysis on a URL.
        
        Args:
            url: The URL to analyze
            strategy: 'mobile' or 'desktop'
            categories: List of categories to analyze (default: all)
            
        Returns:
            Dictionary with Core Web Vitals and performance metrics
        """
        if categories is None:
            categories = ['performance', 'accessibility', 'best-practices', 'seo']
        
        params = {
            'url': url,
            'strategy': strategy,
        }
        
        for cat in categories:
            if 'category' not in params:
                params['category'] = cat
            else:
                pass
        
        if self.api_key:
            params['key'] = self.api_key
        
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(self.API_BASE, params=params)
                
                if response.status_code == 200:
                    self._last_response = response.json()
                    return self._parse_response(self._last_response)
                else:
                    return self._create_error_response(
                        f"API returned status {response.status_code}",
                        url,
                        strategy
                    )
                    
        except httpx.TimeoutException:
            return self._create_error_response("Request timed out", url, strategy)
        except httpx.RequestError as e:
            return self._create_error_response(str(e), url, strategy)
        except Exception as e:
            return self._create_error_response(str(e), url, strategy)
    
    def _parse_response(self, data: Dict) -> Dict:
        """Parse the PageSpeed Insights API response."""
        result = {
            'success': True,
            'url': data.get('id', ''),
            'fetchTime': data.get('analysisUTCTimestamp', ''),
            'coreWebVitals': {},
            'lighthouseScores': {},
            'performanceMetrics': {},
            'fieldData': None,
            'suggestions': [],
        }
        
        lighthouse = data.get('lighthouseResult', {})
        
        categories = lighthouse.get('categories', {})
        for cat_key, cat_data in categories.items():
            result['lighthouseScores'][cat_key] = {
                'score': int((cat_data.get('score') or 0) * 100),
                'title': cat_data.get('title', cat_key),
            }
        
        audits = lighthouse.get('audits', {})
        
        if 'largest-contentful-paint' in audits:
            lcp_data = audits['largest-contentful-paint']
            lcp_value = lcp_data.get('numericValue', 0)  # milliseconds
            result['coreWebVitals']['lcp'] = {
                'value': round(lcp_value / 1000, 2),  # Convert to seconds
                'displayValue': lcp_data.get('displayValue', ''),
                'rating': self._rate_metric('LCP', lcp_value),
                'target': 2.5,
                'unit': 'seconds'
            }
        
        if 'total-blocking-time' in audits:
            tbt_data = audits['total-blocking-time']
            tbt_value = tbt_data.get('numericValue', 0)
            result['coreWebVitals']['fid'] = {
                'value': round(tbt_value, 0),
                'displayValue': tbt_data.get('displayValue', ''),
                'rating': self._rate_metric('FID', tbt_value / 3),  # TBT/3 approximates FID
                'target': 100,
                'unit': 'ms',
                'note': 'Estimated from Total Blocking Time'
            }
        
        if 'cumulative-layout-shift' in audits:
            cls_data = audits['cumulative-layout-shift']
            cls_value = cls_data.get('numericValue', 0)
            result['coreWebVitals']['cls'] = {
                'value': round(cls_value, 3),
                'displayValue': cls_data.get('displayValue', ''),
                'rating': self._rate_metric('CLS', cls_value),
                'target': 0.1,
                'unit': ''
            }
        
        if 'max-potential-fid' in audits:
            mpfid = audits['max-potential-fid'].get('numericValue', 0)
            result['coreWebVitals']['inp'] = {
                'value': round(mpfid, 0),
                'displayValue': audits['max-potential-fid'].get('displayValue', ''),
                'rating': self._rate_metric('INP', mpfid),
                'target': 200,
                'unit': 'ms',
                'note': 'Estimated from Max Potential FID'
            }
        
        if 'first-contentful-paint' in audits:
            fcp_data = audits['first-contentful-paint']
            fcp_value = fcp_data.get('numericValue', 0)
            result['coreWebVitals']['fcp'] = {
                'value': round(fcp_value / 1000, 2),
                'displayValue': fcp_data.get('displayValue', ''),
                'rating': self._rate_metric('FCP', fcp_value),
                'target': 1.8,
                'unit': 'seconds'
            }
        
        if 'server-response-time' in audits:
            ttfb_data = audits['server-response-time']
            ttfb_value = ttfb_data.get('numericValue', 0)
            result['coreWebVitals']['ttfb'] = {
                'value': round(ttfb_value, 0),
                'displayValue': ttfb_data.get('displayValue', ''),
                'rating': self._rate_metric('TTFB', ttfb_value),
                'target': 800,
                'unit': 'ms'
            }
        
        performance_audits = [
            ('speed-index', 'speedIndex'),
            ('interactive', 'timeToInteractive'),
            ('total-byte-weight', 'totalByteWeight'),
            ('render-blocking-resources', 'renderBlockingResources'),
            ('uses-optimized-images', 'optimizedImages'),
            ('uses-text-compression', 'textCompression'),
            ('uses-responsive-images', 'responsiveImages'),
            ('efficient-animated-content', 'efficientAnimations'),
        ]
        
        for audit_key, result_key in performance_audits:
            if audit_key in audits:
                audit_data = audits[audit_key]
                result['performanceMetrics'][result_key] = {
                    'score': int((audit_data.get('score') or 0) * 100),
                    'displayValue': audit_data.get('displayValue', ''),
                    'description': audit_data.get('description', ''),
                }
        
        loading_experience = data.get('loadingExperience', {})
        if loading_experience.get('metrics'):
            field_metrics = loading_experience['metrics']
            result['fieldData'] = {
                'source': 'Chrome User Experience Report',
                'origin': loading_experience.get('id', ''),
            }
            
            if 'LARGEST_CONTENTFUL_PAINT_MS' in field_metrics:
                lcp_field = field_metrics['LARGEST_CONTENTFUL_PAINT_MS']
                result['fieldData']['lcp'] = {
                    'percentile': lcp_field.get('percentile', 0),
                    'category': lcp_field.get('category', 'AVERAGE'),
                }
            
            if 'CUMULATIVE_LAYOUT_SHIFT_SCORE' in field_metrics:
                cls_field = field_metrics['CUMULATIVE_LAYOUT_SHIFT_SCORE']
                result['fieldData']['cls'] = {
                    'percentile': cls_field.get('percentile', 0) / 100,  # CLS is stored as integer
                    'category': cls_field.get('category', 'AVERAGE'),
                }
            
            if 'INTERACTION_TO_NEXT_PAINT' in field_metrics:
                inp_field = field_metrics['INTERACTION_TO_NEXT_PAINT']
                result['fieldData']['inp'] = {
                    'percentile': inp_field.get('percentile', 0),
                    'category': inp_field.get('category', 'AVERAGE'),
                }
        
        opportunities = lighthouse.get('audits', {})
        improvement_audits = [
            'render-blocking-resources',
            'unused-css-rules',
            'unused-javascript',
            'unminified-css',
            'unminified-javascript',
            'uses-optimized-images',
            'uses-responsive-images',
            'efficient-animated-content',
            'uses-text-compression',
            'uses-rel-preconnect',
            'server-response-time',
        ]
        
        for audit_key in improvement_audits:
            if audit_key in opportunities:
                audit = opportunities[audit_key]
                score = audit.get('score')
                if score is not None and score < 1:
                    savings = audit.get('details', {}).get('overallSavingsMs', 0)
                    result['suggestions'].append({
                        'audit': audit_key,
                        'title': audit.get('title', audit_key),
                        'description': audit.get('description', ''),
                        'score': int(score * 100),
                        'savings_ms': savings,
                        'displayValue': audit.get('displayValue', ''),
                    })
        
        result['suggestions'].sort(key=lambda x: x.get('savings_ms', 0), reverse=True)
        result['suggestions'] = result['suggestions'][:5]  # Top 5
        
        return result
    
    def _create_error_response(self, error: str, url: str, strategy: str) -> Dict:
        """Create an error response structure."""
        return {
            'success': False,
            'error': error,
            'url': url,
            'strategy': strategy,
            'coreWebVitals': {},
            'lighthouseScores': {},
            'performanceMetrics': {},
            'fieldData': None,
            'suggestions': [],
        }
    
    def get_core_web_vitals(self, url: str, strategy: str = 'mobile') -> Dict:
        """
        Get only Core Web Vitals for a URL.
        Lighter-weight analysis focusing on CWV.
        
        Args:
            url: The URL to analyze
            strategy: 'mobile' or 'desktop'
            
        Returns:
            Dictionary with Core Web Vitals data
        """
        full_result = self.analyze(url, strategy, categories=['performance'])
        
        if not full_result.get('success', False):
            return full_result
        
        return {
            'success': True,
            'url': full_result.get('url', url),
            'strategy': strategy,
            'coreWebVitals': full_result.get('coreWebVitals', {}),
            'performanceScore': full_result.get('lighthouseScores', {}).get('performance', {}).get('score', 0),
            'fieldData': full_result.get('fieldData'),
        }


def get_pagespeed_metrics(url: str, api_key: Optional[str] = None, strategy: str = 'mobile') -> Dict:
    """
    Convenience function to get PageSpeed metrics for a URL.
    
    Args:
        url: The URL to analyze
        api_key: Optional Google API key
        strategy: 'mobile' or 'desktop'
        
    Returns:
        Dictionary with PageSpeed analysis results
    """
    client = PageSpeedInsightsAPI(api_key=api_key)
    return client.analyze(url, strategy)


def get_core_web_vitals(url: str, api_key: Optional[str] = None, strategy: str = 'mobile') -> Dict:
    """
    Convenience function to get Core Web Vitals only.
    
    Args:
        url: The URL to analyze
        api_key: Optional Google API key
        strategy: 'mobile' or 'desktop'
        
    Returns:
        Dictionary with Core Web Vitals
    """
    client = PageSpeedInsightsAPI(api_key=api_key)
    return client.get_core_web_vitals(url, strategy)


def format_cwv_for_frontend(pagespeed_result: Dict) -> Dict:
    """
    Format PageSpeed results for the frontend CoreWebVitals interface.
    
    Args:
        pagespeed_result: Result from get_pagespeed_metrics or get_core_web_vitals
        
    Returns:
        Dictionary matching frontend CoreWebVitals interface
    """
    if not pagespeed_result.get('success', False):
        return {
            'lcp': {'value': 2.5, 'rating': 'needs-improvement', 'target': 2.5, 'estimated': True},
            'fid': {'value': 100, 'rating': 'good', 'target': 100, 'estimated': True},
            'cls': {'value': 0.1, 'rating': 'needs-improvement', 'target': 0.1, 'estimated': True},
            'inp': {'value': 200, 'rating': 'good', 'target': 200, 'estimated': True},
            'ttfb': {'value': 400, 'rating': 'good', 'target': 800, 'estimated': True},
            'fcp': {'value': 1.8, 'rating': 'needs-improvement', 'target': 1.8, 'estimated': True},
        }
    
    cwv = pagespeed_result.get('coreWebVitals', {})
    
    return {
        'lcp': {
            'value': cwv.get('lcp', {}).get('value', 2.5),
            'rating': cwv.get('lcp', {}).get('rating', 'needs-improvement'),
            'target': 2.5,
            'estimated': False,
        },
        'fid': {
            'value': cwv.get('fid', {}).get('value', 100),
            'rating': cwv.get('fid', {}).get('rating', 'good'),
            'target': 100,
            'estimated': 'note' in cwv.get('fid', {}),
        },
        'cls': {
            'value': cwv.get('cls', {}).get('value', 0.1),
            'rating': cwv.get('cls', {}).get('rating', 'needs-improvement'),
            'target': 0.1,
            'estimated': False,
        },
        'inp': {
            'value': cwv.get('inp', {}).get('value', 200),
            'rating': cwv.get('inp', {}).get('rating', 'good'),
            'target': 200,
            'estimated': 'note' in cwv.get('inp', {}),
        },
        'ttfb': {
            'value': cwv.get('ttfb', {}).get('value', 400),
            'rating': cwv.get('ttfb', {}).get('rating', 'good'),
            'target': 800,
            'estimated': False,
        },
        'fcp': {
            'value': cwv.get('fcp', {}).get('value', 1.8),
            'rating': cwv.get('fcp', {}).get('rating', 'needs-improvement'),
            'target': 1.8,
            'estimated': False,
        },
    }

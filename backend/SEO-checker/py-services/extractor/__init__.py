"""
SEO Metrics Extractor Package
Provides comprehensive SEO analysis tools including:
- HTML-based SEO metrics extraction
- TF-IDF keyword analysis
- Readability scoring (Flesch-Kincaid, Gunning Fog)
- Security headers analysis
- Google PageSpeed Insights integration
"""

from .comprehensive_extractor import ComprehensiveMetricsExtractor
from .text_analyzer import TextAnalyzer

# Optional imports that may not be available
try:
    from .security_headers import (
        SecurityHeadersAnalyzer, 
        analyze_security_headers, 
        get_security_quick_check
    )
except ImportError:
    SecurityHeadersAnalyzer = None
    analyze_security_headers = None
    get_security_quick_check = None

try:
    from .pagespeed_insights import (
        PageSpeedInsightsAPI, 
        get_pagespeed_metrics, 
        get_core_web_vitals,
        format_cwv_for_frontend
    )
except ImportError:
    PageSpeedInsightsAPI = None
    get_pagespeed_metrics = None
    get_core_web_vitals = None
    format_cwv_for_frontend = None

__all__ = [
    'ComprehensiveMetricsExtractor',
    'TextAnalyzer',
    'SecurityHeadersAnalyzer',
    'analyze_security_headers',
    'get_security_quick_check',
    'PageSpeedInsightsAPI',
    'get_pagespeed_metrics',
    'get_core_web_vitals',
    'format_cwv_for_frontend',
]

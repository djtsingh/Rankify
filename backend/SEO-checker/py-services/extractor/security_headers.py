"""
Security Headers Analyzer
Checks HTTP security headers for a given URL
"""

import httpx
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum


class SecurityLevel(Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"
    PASS = "pass"


@dataclass
class SecurityHeaderResult:
    """Result of a security header check."""
    name: str
    present: bool
    value: Optional[str]
    level: SecurityLevel
    recommendation: str
    description: str


class SecurityHeadersAnalyzer:
    """
    Analyzes HTTP security headers for a given URL.
    Checks for critical security headers and provides recommendations.
    """
    
    # Security headers to check with their importance
    HEADERS_CONFIG = {
        'Strict-Transport-Security': {
            'importance': 'critical',
            'description': 'Enforces HTTPS connections to prevent man-in-the-middle attacks',
            'recommendation': 'Add "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"',
            'good_values': lambda v: 'max-age' in v.lower() and int(v.split('max-age=')[1].split(';')[0].strip()) >= 31536000 if v else False,
        },
        'Content-Security-Policy': {
            'importance': 'critical',
            'description': 'Prevents XSS attacks and data injection by controlling allowed sources',
            'recommendation': 'Implement CSP with appropriate directives for your application',
            'good_values': lambda v: bool(v) and len(v) > 10,
        },
        'X-Frame-Options': {
            'importance': 'high',
            'description': 'Prevents clickjacking by controlling iframe embedding',
            'recommendation': 'Add "X-Frame-Options: DENY" or "X-Frame-Options: SAMEORIGIN"',
            'good_values': lambda v: v and v.upper() in ['DENY', 'SAMEORIGIN'],
        },
        'X-Content-Type-Options': {
            'importance': 'high',
            'description': 'Prevents MIME-sniffing attacks',
            'recommendation': 'Add "X-Content-Type-Options: nosniff"',
            'good_values': lambda v: v and v.lower() == 'nosniff',
        },
        'Referrer-Policy': {
            'importance': 'medium',
            'description': 'Controls referrer information sent in requests',
            'recommendation': 'Add "Referrer-Policy: strict-origin-when-cross-origin" or "no-referrer"',
            'good_values': lambda v: v and v.lower() in [
                'no-referrer', 'no-referrer-when-downgrade', 'origin',
                'origin-when-cross-origin', 'same-origin', 'strict-origin',
                'strict-origin-when-cross-origin'
            ],
        },
        'Permissions-Policy': {
            'importance': 'medium',
            'description': 'Controls browser features like geolocation, camera, microphone',
            'recommendation': 'Add Permissions-Policy to restrict unnecessary browser features',
            'good_values': lambda v: bool(v) and len(v) > 5,
        },
        'X-XSS-Protection': {
            'importance': 'low',
            'description': 'Legacy XSS filter (mostly superseded by CSP)',
            'recommendation': 'Add "X-XSS-Protection: 1; mode=block" (or rely on CSP)',
            'good_values': lambda v: v and '1' in v,
        },
        'Cross-Origin-Opener-Policy': {
            'importance': 'medium',
            'description': 'Isolates browsing context to prevent attacks',
            'recommendation': 'Add "Cross-Origin-Opener-Policy: same-origin"',
            'good_values': lambda v: v and v.lower() in ['same-origin', 'same-origin-allow-popups'],
        },
        'Cross-Origin-Resource-Policy': {
            'importance': 'medium',
            'description': 'Controls which origins can load the resource',
            'recommendation': 'Add "Cross-Origin-Resource-Policy: same-origin" or "same-site"',
            'good_values': lambda v: v and v.lower() in ['same-origin', 'same-site', 'cross-origin'],
        },
        'Cross-Origin-Embedder-Policy': {
            'importance': 'medium',
            'description': 'Controls embedding of cross-origin resources',
            'recommendation': 'Add "Cross-Origin-Embedder-Policy: require-corp"',
            'good_values': lambda v: v and v.lower() in ['require-corp', 'credentialless'],
        },
    }
    
    # Additional headers to detect but not require
    OPTIONAL_HEADERS = {
        'Cache-Control': 'Controls caching behavior',
        'X-DNS-Prefetch-Control': 'Controls DNS prefetching',
        'Expect-CT': 'Certificate Transparency enforcement (deprecated)',
        'Feature-Policy': 'Legacy version of Permissions-Policy',
    }
    
    def __init__(self, timeout: float = 10.0):
        """Initialize analyzer with configurable timeout."""
        self.timeout = timeout
        self._headers: Dict[str, str] = {}
        self._status_code: int = 0
        self._url: str = ''
        self._is_https: bool = False
    
    async def fetch_headers(self, url: str) -> bool:
        """
        Fetch HTTP headers from URL.
        Returns True if successful, False otherwise.
        """
        self._url = url
        self._is_https = url.startswith('https://')
        
        try:
            async with httpx.AsyncClient(
                follow_redirects=True,
                timeout=self.timeout,
                verify=True
            ) as client:
                response = await client.head(url)
                self._headers = dict(response.headers)
                self._status_code = response.status_code
                return True
        except httpx.RequestError:
            try:
                # Fallback to GET request if HEAD fails
                async with httpx.AsyncClient(
                    follow_redirects=True,
                    timeout=self.timeout,
                    verify=True
                ) as client:
                    response = await client.get(url, follow_redirects=True)
                    self._headers = dict(response.headers)
                    self._status_code = response.status_code
                    return True
            except Exception:
                return False
        except Exception:
            return False
    
    def fetch_headers_sync(self, url: str) -> bool:
        """
        Synchronous version of fetch_headers.
        Returns True if successful, False otherwise.
        """
        self._url = url
        self._is_https = url.startswith('https://')
        
        try:
            with httpx.Client(
                follow_redirects=True,
                timeout=self.timeout,
                verify=True
            ) as client:
                response = client.head(url)
                self._headers = dict(response.headers)
                self._status_code = response.status_code
                return True
        except httpx.RequestError:
            try:
                # Fallback to GET request if HEAD fails
                with httpx.Client(
                    follow_redirects=True,
                    timeout=self.timeout,
                    verify=True
                ) as client:
                    response = client.get(url, follow_redirects=True)
                    self._headers = dict(response.headers)
                    self._status_code = response.status_code
                    return True
            except Exception:
                return False
        except Exception:
            return False
    
    def analyze(self) -> Dict:
        """
        Analyze security headers and return comprehensive results.
        """
        results = {
            'url': self._url,
            'isHttps': self._is_https,
            'statusCode': self._status_code,
            'score': 0,
            'grade': 'F',
            'summary': {
                'passed': 0,
                'warnings': 0,
                'critical': 0,
                'missing': 0,
            },
            'headers': {},
            'recommendations': [],
            'rawHeaders': self._headers,
        }
        
        if not self._headers:
            return results
        
        total_checks = len(self.HEADERS_CONFIG)
        passed = 0
        critical_missing = 0
        warnings = 0
        
        for header_name, config in self.HEADERS_CONFIG.items():
            # Check if header exists (case-insensitive)
            header_value = self._get_header_value(header_name)
            is_present = header_value is not None
            is_good = config['good_values'](header_value) if is_present else False
            
            importance = config['importance']
            
            if is_present and is_good:
                level = SecurityLevel.PASS
                passed += 1
            elif is_present and not is_good:
                level = SecurityLevel.WARNING
                warnings += 1
            elif importance == 'critical':
                level = SecurityLevel.CRITICAL
                critical_missing += 1
            elif importance == 'high':
                level = SecurityLevel.WARNING
                warnings += 1
            else:
                level = SecurityLevel.INFO
            
            results['headers'][header_name] = {
                'present': is_present,
                'value': header_value,
                'level': level.value,
                'importance': importance,
                'description': config['description'],
                'recommendation': config['recommendation'] if not is_good else None,
                'isSecure': is_good,
            }
            
            if not is_good:
                results['recommendations'].append({
                    'header': header_name,
                    'importance': importance,
                    'recommendation': config['recommendation'],
                    'description': config['description'],
                })
        
        # Calculate score (0-100)
        # Critical headers worth 20 points each (2 critical = 40 points)
        # High headers worth 15 points each (2 high = 30 points)
        # Medium headers worth 6 points each (5 medium = 30 points)
        critical_headers = sum(1 for h, c in self.HEADERS_CONFIG.items() 
                             if c['importance'] == 'critical' and results['headers'][h]['isSecure'])
        high_headers = sum(1 for h, c in self.HEADERS_CONFIG.items() 
                         if c['importance'] == 'high' and results['headers'][h]['isSecure'])
        medium_headers = sum(1 for h, c in self.HEADERS_CONFIG.items() 
                           if c['importance'] == 'medium' and results['headers'][h]['isSecure'])
        
        score = (critical_headers * 20) + (high_headers * 15) + (medium_headers * 6)
        score = min(100, score)
        
        # HTTPS bonus
        if self._is_https:
            score = min(100, score + 10)
        
        results['score'] = score
        results['grade'] = self._calculate_grade(score)
        results['summary'] = {
            'passed': passed,
            'warnings': warnings,
            'critical': critical_missing,
            'missing': total_checks - passed - warnings,
        }
        
        # Sort recommendations by importance
        importance_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        results['recommendations'].sort(key=lambda x: importance_order.get(x['importance'], 4))
        
        return results
    
    def _get_header_value(self, header_name: str) -> Optional[str]:
        """Get header value case-insensitively."""
        header_lower = header_name.lower()
        for key, value in self._headers.items():
            if key.lower() == header_lower:
                return value
        return None
    
    def _calculate_grade(self, score: int) -> str:
        """Calculate letter grade from score."""
        if score >= 90:
            return 'A+'
        elif score >= 80:
            return 'A'
        elif score >= 70:
            return 'B'
        elif score >= 60:
            return 'C'
        elif score >= 50:
            return 'D'
        else:
            return 'F'
    
    def get_quick_summary(self) -> Dict:
        """Get a quick summary suitable for the frontend."""
        analysis = self.analyze()
        
        return {
            'score': analysis['score'],
            'grade': analysis['grade'],
            'https': analysis['isHttps'],
            'passed': analysis['summary']['passed'],
            'critical': analysis['summary']['critical'],
            'warnings': analysis['summary']['warnings'],
            'topIssues': [
                {
                    'header': r['header'],
                    'importance': r['importance'],
                    'recommendation': r['recommendation']
                }
                for r in analysis['recommendations'][:3]
            ],
            'headers': {
                'contentSecurityPolicy': analysis['headers'].get('Content-Security-Policy', {}).get('present', False),
                'strictTransportSecurity': analysis['headers'].get('Strict-Transport-Security', {}).get('present', False),
                'xFrameOptions': analysis['headers'].get('X-Frame-Options', {}).get('present', False),
                'xContentTypeOptions': analysis['headers'].get('X-Content-Type-Options', {}).get('present', False),
                'referrerPolicy': analysis['headers'].get('Referrer-Policy', {}).get('present', False),
                'permissionsPolicy': analysis['headers'].get('Permissions-Policy', {}).get('present', False),
            }
        }


def analyze_security_headers(url: str, timeout: float = 10.0) -> Dict:
    """
    Convenience function to analyze security headers for a URL.
    
    Args:
        url: The URL to analyze
        timeout: Request timeout in seconds
        
    Returns:
        Dictionary with security analysis results
    """
    analyzer = SecurityHeadersAnalyzer(timeout=timeout)
    success = analyzer.fetch_headers_sync(url)
    
    if not success:
        return {
            'url': url,
            'error': 'Failed to fetch headers',
            'score': 0,
            'grade': 'F',
            'isHttps': url.startswith('https://'),
            'summary': {'passed': 0, 'warnings': 0, 'critical': 0, 'missing': 0},
            'headers': {},
            'recommendations': [],
        }
    
    return analyzer.analyze()


def get_security_quick_check(url: str, timeout: float = 10.0) -> Dict:
    """
    Quick security check for frontend display.
    
    Args:
        url: The URL to check
        timeout: Request timeout in seconds
        
    Returns:
        Simplified security check results
    """
    analyzer = SecurityHeadersAnalyzer(timeout=timeout)
    success = analyzer.fetch_headers_sync(url)
    
    if not success:
        return {
            'score': 0,
            'grade': 'F',
            'https': url.startswith('https://'),
            'passed': 0,
            'critical': 0,
            'warnings': 0,
            'topIssues': [],
            'headers': {
                'contentSecurityPolicy': False,
                'strictTransportSecurity': False,
                'xFrameOptions': False,
                'xContentTypeOptions': False,
                'referrerPolicy': False,
                'permissionsPolicy': False,
            }
        }
    
    return analyzer.get_quick_summary()

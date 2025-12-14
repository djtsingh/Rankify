# cache.py (Python calling Go service via HTTP)
import requests
import json

def cache_result(url, score, priority_issues):
    """
    Call Go caching service
    """
    url_hash = hashlib.md5(url.encode()).hexdigest()
    
    cache_data = {
        'url': url,
        'score': score,
        'issues': priority_issues,
        'cached_at': datetime.now().isoformat()
    }
    
    # Call Go caching microservice
    requests.post('http://localhost:8081/cache/set', json={
        'key': f'scan:{url_hash}',
        'value': json.dumps(cache_data),
        'ttl': 86400  # 24 hours
    })
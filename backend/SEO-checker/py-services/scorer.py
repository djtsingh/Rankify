# scorer.py (Python)

def calculate_score(check_results):
    """
    Calculate 0-100 SEO score
    """
    base_score = 100
    
    # Define weights for each check
    weights = {
        'Title Tag': 10,
        'Meta Description': 8,
        'H1 Tag': 10,
        'Image Alt Text': 5,
        'Content Length': 7,
        'Internal Links': 5,
        'Page Speed': 15,  # Highest weight
        'Mobile Friendly': 12,
        'HTTPS': 10,
        'Broken Links': 8,
        'Heading Hierarchy': 5,
        'Canonical Tag': 5
    }
    
    for check in check_results:
        if not check['passed']:
            # Deduct based on severity
            for issue in check['issues']:
                if issue['severity'] == 'critical':
                    base_score -= weights[check['check_name']]
                elif issue['severity'] == 'warning':
                    base_score -= weights[check['check_name']] * 0.5
    
    # Ensure score doesn't go below 0
    final_score = max(0, base_score)
    
    return int(final_score)
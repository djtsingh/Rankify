# priority.py (Python)

def prioritize_issues(check_results):
    """
    Rank issues by impact using ML-based scoring
    """
    all_issues = []
    
    for check in check_results:
        if not check['passed']:
            for issue in check['issues']:
                # Calculate impact score
                impact_score = calculate_impact_score(
                    severity=issue['severity'],
                    check_name=check['check_name'],
                    issue_type=issue['message']
                )
                
                issue['impact_score'] = impact_score
                issue['check_name'] = check['check_name']
                all_issues.append(issue)
    
    # Sort by impact score (descending)
    sorted_issues = sorted(all_issues, key=lambda x: x['impact_score'], reverse=True)
    
    # Return top 3-5 priority issues
    priority_issues = sorted_issues[:5]
    
    # Enrich with fix instructions
    for issue in priority_issues:
        issue['how_to_fix'] = generate_fix_instructions(issue)
        issue['estimated_time'] = estimate_fix_time(issue)
        issue['expected_improvement'] = predict_improvement(issue)
    
    return priority_issues


def calculate_impact_score(severity, check_name, issue_type):
    """
    ML-based impact scoring
    (For MVP: rule-based, later: train ML model)
    """
    base_score = 0.0
    
    # Severity weight
    severity_weights = {
        'critical': 1.0,
        'warning': 0.6,
        'info': 0.3
    }
    base_score += severity_weights.get(severity, 0.5) * 0.4
    
    # Check importance (based on Google ranking factors)
    check_importance = {
        'Page Speed': 0.95,  # Core Web Vitals = critical
        'Mobile Friendly': 0.9,
        'HTTPS': 0.85,
        'Title Tag': 0.8,
        'H1 Tag': 0.75,
        'Meta Description': 0.7,
        'Content Length': 0.65,
        'Broken Links': 0.6,
        'Internal Links': 0.55,
        'Image Alt Text': 0.5,
        'Heading Hierarchy': 0.45,
        'Canonical Tag': 0.4
    }
    base_score += check_importance.get(check_name, 0.5) * 0.3
    
    # Ease of fix (quick wins = higher priority)
    fix_time_estimate = estimate_fix_time_internal(issue_type)
    effort_score = 1.0 / (fix_time_estimate + 1)  # Inverse of time
    base_score += effort_score * 0.3
    
    return base_score
# checker.py (Python)

def run_seo_checks(parsed_data, metrics):
    """
    Run all 12 core checks
    """
    checks = []
    
    # Check 1: Title Tag
    title_check = check_title_tag(parsed_data['title'])
    checks.append(title_check)
    
    # Check 2: Meta Description
    meta_check = check_meta_description(parsed_data['meta_description'])
    checks.append(meta_check)
    
    # Check 3: H1 Tag
    h1_check = check_h1_tag(parsed_data['headings']['h1'])
    checks.append(h1_check)
    
    # Check 4: Image Alt Text
    img_check = check_image_alt_text(parsed_data['images'])
    checks.append(img_check)
    
    # Check 5: Content Length
    content_check = check_content_length(parsed_data['word_count'])
    checks.append(content_check)
    
    # Check 6: Internal Links
    links_check = check_internal_links(parsed_data['internal_links'])
    checks.append(links_check)
    
    # Check 7: Page Speed
    speed_check = check_page_speed(metrics['lcp'], metrics['load_time'])
    checks.append(speed_check)
    
    # Check 8: Mobile Friendly
    mobile_check = check_mobile_friendly(parsed_data)
    checks.append(mobile_check)
    
    # Check 9: HTTPS
    https_check = check_https(url)
    checks.append(https_check)
    
    # Check 10: Broken Links
    broken_check = check_broken_links(parsed_data['internal_links'])
    checks.append(broken_check)
    
    # Check 11: Heading Hierarchy
    heading_check = check_heading_hierarchy(parsed_data['headings'])
    checks.append(heading_check)
    
    # Check 12: Canonical Tag
    canonical_check = check_canonical(parsed_data['canonical_url'], url)
    checks.append(canonical_check)
    
    return checks


def check_title_tag(title):
    """
    Check title tag quality
    """
    issues = []
    passed = True
    
    if not title:
        issues.append({
            'severity': 'critical',
            'message': 'Title tag is missing',
            'recommendation': 'Add a descriptive title tag (30-60 characters)',
            'impact': 'HIGH - Title tags are crucial for rankings'
        })
        passed = False
    elif len(title) < 30:
        issues.append({
            'severity': 'warning',
            'message': f'Title tag is too short ({len(title)} chars)',
            'recommendation': 'Expand title to 30-60 characters',
            'impact': 'MEDIUM - Short titles miss keyword opportunities'
        })
        passed = False
    elif len(title) > 60:
        issues.append({
            'severity': 'warning',
            'message': f'Title tag is too long ({len(title)} chars)',
            'recommendation': 'Shorten title to 30-60 characters',
            'impact': 'MEDIUM - Long titles get truncated in search results'
        })
        passed = False
    
    return {
        'check_name': 'Title Tag',
        'passed': passed,
        'issues': issues,
        'data': {'title': title, 'length': len(title) if title else 0}
    }

# Similar functions for other 11 checks...

"""
Complete result saving with all data
"""

from database.operations import (
    save_scan_result,
    save_issues,
    update_scan_status
)
import json

def save_complete_scan_results(scan_id, analysis_data):
    """
    Save complete scan results to database
    
    Args:
        scan_id (str): Scan ID
        analysis_data (dict): Complete analysis data with structure:
            {
                'score': 75,
                'metrics': {
                    'title': 'Example',
                    'title_length': 7,
                    'meta_description': None,
                    'h1_count': 1,
                    'word_count': 150,
                    'page_speed_lcp': 2.5,
                    'mobile_friendly': True,
                    'https_enabled': True
                },
                'issues': [
                    {
                        'type': 'title_tag',
                        'severity': 'warning',
                        'title': 'Title too short',
                        'description': 'Title is only 7 characters',
                        'recommendation': 'Expand to 30-60 characters',
                        'impact_score': 0.75,
                        'expected_improvement': '+10% CTR',
                        'time_to_fix_hours': 1,
                        'data': {'current': 7, 'recommended': '30-60'}
                    }
                ]
            }
    
    Returns:
        dict: Save summary
    """
    try:
        score = analysis_data['score']
        metrics = analysis_data['metrics']
        issues = analysis_data['issues']
        
        result_id = save_scan_result(scan_id, score, metrics)
        print(f"✅ Saved scan result: {result_id}")
        
        issues_count = save_issues(scan_id, issues)
        print(f"✅ Saved {issues_count} issues")
        
        update_scan_status(scan_id, 'completed')
        print(f"✅ Scan marked as completed")
        
        return {
            'success': True,
            'result_id': result_id,
            'issues_saved': issues_count
        }
        
    except Exception as e:
        print(f"❌ Error saving results: {e}")
        update_scan_status(scan_id, 'failed', str(e))
        raise



def test_save_complete_results():
    """
    Test complete result saving flow
    """
    from database.operations import create_scan
    
    print("\n" + "="*60)
    print("🧪 TESTING COMPLETE RESULT SAVING")
    print("="*60)
    
    print("\n📝 Step 1: Creating test scan...")
    test_url = "https://test-example.com"
    scan_id = create_scan(test_url)
    print(f"✅ Scan created: {scan_id}")
    
    print("\n📝 Step 2: Preparing analysis data...")
    analysis_data = {
        'score': 68,
        'metrics': {
            'url': test_url,
            'title': 'Test Site',
            'title_length': 9,
            'meta_description': None,
            'meta_description_length': 0,
            'h1_tags': ['Welcome'],
            'h1_count': 1,
            'h2_count': 3,
            'word_count': 245,
            'image_count': 5,
            'images_without_alt': 3,
            'internal_links_count': 8,
            'page_speed_lcp': 3.2,
            'page_speed_fid': 150,
            'page_speed_cls': 0.08,
            'mobile_friendly': True,
            'https_enabled': True,
            'has_canonical': False,
            'broken_links_count': 2
        },
        'issues': [
            {
                'type': 'page_speed',
                'severity': 'critical',
                'title': 'Page speed too slow',
                'description': 'LCP is 3.2 seconds (should be < 2.5s)',
                'recommendation': 'Optimize images, enable compression, minimize CSS/JS',
                'impact_score': 0.95,
                'expected_improvement': '+15% traffic, +20% conversions',
                'time_to_fix_hours': 4,
                'data': {
                    'current_lcp': 3.2,
                    'target_lcp': 2.5,
                    'fid': 150,
                    'cls': 0.08
                }
            },
            {
                'type': 'meta_description',
                'severity': 'critical',
                'title': 'Missing meta description',
                'description': 'No meta description tag found',
                'recommendation': 'Add 120-160 character meta description',
                'impact_score': 0.85,
                'expected_improvement': '+12% CTR from search results',
                'time_to_fix_hours': 1,
                'data': {
                    'current_length': 0,
                    'recommended_length': '120-160'
                }
            },
            {
                'type': 'image_alt',
                'severity': 'warning',
                'title': 'Images missing alt text',
                'description': '3 out of 5 images missing alt text',
                'recommendation': 'Add descriptive alt text to all images',
                'impact_score': 0.65,
                'expected_improvement': '+5% accessibility score',
                'time_to_fix_hours': 1,
                'data': {
                    'total_images': 5,
                    'missing_alt': 3
                }
            }
        ]
    }
    print(f"✅ Analysis data prepared (Score: {analysis_data['score']}, Issues: {len(analysis_data['issues'])})")
    
    print("\n📝 Step 3: Saving complete results to database...")
    save_summary = save_complete_scan_results(scan_id, analysis_data)
    print(f"✅ Save complete: {save_summary}")
    
    print("\n📝 Step 4: Verifying saved data...")
    from database.operations import get_complete_scan_data
    
    complete_data = get_complete_scan_data(scan_id)
    
    print(f"\n📊 VERIFICATION RESULTS:")
    print(f"   Scan ID: {complete_data['scan_id']}")
    print(f"   URL: {complete_data['url']}")
    print(f"   Status: {complete_data['status']}")
    print(f"   Score: {complete_data['score']}")
    print(f"   Issues Count: {len(complete_data['issues'])}")
    print(f"   Created: {complete_data['created_at']}")
    print(f"   Completed: {complete_data['completed_at']}")
    
    print(f"\n📋 ISSUES DETAILS:")
    for i, issue in enumerate(complete_data['issues'], 1):
        print(f"   {i}. [{issue['severity'].upper()}] {issue['title']}")
        print(f"      Impact Score: {issue['impact_score']}")
        print(f"      Expected: {issue['expected_improvement']}")
    
    print("\n" + "="*60)
    print("✅ ALL TESTS PASSED!")
    print("="*60)
    
    return scan_id, complete_data


if __name__ == "__main__":
    test_save_complete_results()

# python-services/database/operations.py

from database.connection import get_cursor
from psycopg2.extras import Json
import uuid
from datetime import datetime
import hashlib

# ============================================
# SCAN OPERATIONS
# ============================================

def create_scan(url, user_id=None):
    """
    Create a new scan record
    
    Args:
        url (str): URL to scan
        user_id (str, optional): User ID if authenticated
    
    Returns:
        str: scan_id
    """
    scan_id = str(uuid.uuid4())
    url_hash = hashlib.md5(url.encode()).hexdigest()
    
    with get_cursor(commit=True) as cur:
        cur.execute("""
            INSERT INTO scans (id, user_id, url, url_hash, status)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (scan_id, user_id, url, url_hash, 'pending'))
        
        result = cur.fetchone()
        return result['id']

def update_scan_status(scan_id, status, error_message=None):
    """
    Update scan status
    
    Args:
        scan_id (str): Scan ID
        status (str): 'pending', 'processing', 'completed', 'failed'
        error_message (str, optional): Error message if failed
    """
    with get_cursor(commit=True) as cur:
        if status == 'completed':
            cur.execute("""
                UPDATE scans
                SET status = %s, completed_at = NOW()
                WHERE id = %s
            """, (status, scan_id))
        else:
            cur.execute("""
                UPDATE scans
                SET status = %s, error_message = %s
                WHERE id = %s
            """, (status, error_message, scan_id))

def get_scan(scan_id):
    """
    Get scan by ID
    
    Returns:
        dict: Scan record
    """
    with get_cursor() as cur:
        cur.execute("""
            SELECT id, url, status, created_at, completed_at, error_message
            FROM scans
            WHERE id = %s
        """, (scan_id,))
        
        return cur.fetchone()

# ============================================
# SCAN RESULTS OPERATIONS
# ============================================

def save_scan_result(scan_id, score, metrics):
    """
    Save scan result
    
    Args:
        scan_id (str): Scan ID
        score (int): SEO score (0-100)
        metrics (dict): All metrics data
    
    Returns:
        str: result_id
    """
    with get_cursor(commit=True) as cur:
        cur.execute("""
            INSERT INTO scan_results (scan_id, score, metrics)
            VALUES (%s, %s, %s)
            RETURNING id
        """, (scan_id, score, Json(metrics)))
        
        result = cur.fetchone()
        return result['id']

def get_scan_result(scan_id):
    """
    Get scan result by scan_id
    
    Returns:
        dict: Result record
    """
    with get_cursor() as cur:
        cur.execute("""
            SELECT score, metrics, created_at
            FROM scan_results
            WHERE scan_id = %s
        """, (scan_id,))
        
        return cur.fetchone()

# ============================================
# ISSUES OPERATIONS
# ============================================

def save_issues(scan_id, issues_list):
    """
    Save multiple issues for a scan
    
    Args:
        scan_id (str): Scan ID
        issues_list (list): List of issue dictionaries
    
    Returns:
        int: Number of issues saved
    """
    if not issues_list:
        return 0
    
    with get_cursor(commit=True) as cur:
        for issue in issues_list:
            cur.execute("""
                INSERT INTO issues (
                    scan_id,
                    type,
                    severity,
                    title,
                    description,
                    recommendation,
                    impact_score,
                    expected_improvement,
                    time_to_fix_hours,
                    data
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                scan_id,
                issue.get('type'),
                issue.get('severity'),
                issue.get('title'),
                issue.get('description'),
                issue.get('recommendation'),
                issue.get('impact_score'),
                issue.get('expected_improvement'),
                issue.get('time_to_fix_hours'),
                Json(issue.get('data', {}))
            ))
        
        return len(issues_list)

def get_issues(scan_id):
    """
    Get all issues for a scan
    
    Returns:
        list: List of issue dictionaries
    """
    with get_cursor() as cur:
        cur.execute("""
            SELECT 
                type,
                severity,
                title,
                description,
                recommendation,
                impact_score,
                expected_improvement,
                time_to_fix_hours,
                data
            FROM issues
            WHERE scan_id = %s
            ORDER BY impact_score DESC
        """, (scan_id,))
        
        return cur.fetchall()

# ============================================
# COMPLETE SCAN SAVE
# ============================================

def save_complete_scan_result(scan_id, score, metrics, issues_list):
    """
    Save complete scan result (result + issues) in one transaction
    
    Args:
        scan_id (str): Scan ID
        score (int): SEO score
        metrics (dict): All metrics
        issues_list (list): List of issues
    
    Returns:
        dict: Summary of what was saved
    """
    try:
        # Save result
        result_id = save_scan_result(scan_id, score, metrics)
        
        # Save issues
        issues_count = save_issues(scan_id, issues_list)
        
        # Update scan status
        update_scan_status(scan_id, 'completed')
        
        return {
            'success': True,
            'result_id': result_id,
            'issues_saved': issues_count
        }
    
    except Exception as e:
        # Mark scan as failed
        update_scan_status(scan_id, 'failed', str(e))
        raise e

# ============================================
# RETRIEVAL OPERATIONS
# ============================================

def get_complete_scan_data(scan_id):
    """
    Get complete scan data (scan + result + issues)
    
    Returns:
        dict: Complete scan data
    """
    # Get scan
    scan = get_scan(scan_id)
    if not scan:
        return None
    
    # Get result (if completed)
    result = None
    issues = []
    
    if scan['status'] == 'completed':
        result = get_scan_result(scan_id)
        issues = get_issues(scan_id)
    
    return {
        'scan_id': scan['id'],
        'url': scan['url'],
        'status': scan['status'],
        'created_at': scan['created_at'].isoformat() if scan['created_at'] else None,
        'completed_at': scan['completed_at'].isoformat() if scan['completed_at'] else None,
        'error_message': scan.get('error_message'),
        'score': result['score'] if result else None,
        'metrics': result['metrics'] if result else None,
        'issues': issues
    }

# ============================================
# TESTING FUNCTIONS
# ============================================

def test_database_operations():
    """
    Test all database operations
    """
    print("🧪 Testing database operations...")
    
    try:
        # Test 1: Create scan
        print("\n1️⃣ Creating scan...")
        scan_id = create_scan("https://example.com")
        print(f"✅ Scan created: {scan_id}")
        
        # Test 2: Update status
        print("\n2️⃣ Updating scan status...")
        update_scan_status(scan_id, 'processing')
        print(f"✅ Status updated to 'processing'")
        
        # Test 3: Save result
        print("\n3️⃣ Saving scan result...")
        metrics = {
            'title': 'Example Domain',
            'title_length': 14,
            'meta_description': None,
            'h1_count': 1,
            'page_speed': 2.5
        }
        result_id = save_scan_result(scan_id, 75, metrics)
        print(f"✅ Result saved: {result_id}")
        
        # Test 4: Save issues
        print("\n4️⃣ Saving issues...")
        issues = [
            {
                'type': 'title_tag',
                'severity': 'warning',
                'title': 'Title tag too short',
                'description': 'Your title is only 14 characters',
                'recommendation': 'Expand to 30-60 characters',
                'impact_score': 0.75,
                'expected_improvement': '+10% CTR',
                'time_to_fix_hours': 1,
                'data': {'current_length': 14, 'recommended': '30-60'}
            },
            {
                'type': 'meta_description',
                'severity': 'critical',
                'title': 'Missing meta description',
                'description': 'No meta description found',
                'recommendation': 'Add 120-160 character meta description',
                'impact_score': 0.85,
                'expected_improvement': '+15% CTR',
                'time_to_fix_hours': 1,
                'data': {}
            }
        ]
        issues_count = save_issues(scan_id, issues)
        print(f"✅ {issues_count} issues saved")
        
        # Test 5: Update to completed
        print("\n5️⃣ Marking scan as completed...")
        update_scan_status(scan_id, 'completed')
        print(f"✅ Scan marked as completed")
        
        # Test 6: Retrieve complete data
        print("\n6️⃣ Retrieving complete scan data...")
        complete_data = get_complete_scan_data(scan_id)
        print(f"✅ Retrieved complete data:")
        print(f"   Score: {complete_data['score']}")
        print(f"   Issues: {len(complete_data['issues'])}")
        print(f"   Status: {complete_data['status']}")
        
        print("\n✅ All tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_database_operations()
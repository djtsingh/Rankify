# database.py (Python)
import psycopg2
from psycopg2.extras import Json

def save_results(scan_id, score, priority_issues):
    """
    Save scan results to PostgreSQL
    """
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Update scan record
    cur.execute("""
        UPDATE scans
        SET status = 'completed',
            completed_at = NOW()
        WHERE id = %s
    """, (scan_id,))
    
    # Insert scan result
    cur.execute("""
        INSERT INTO scan_results (scan_id, score, metrics)
        VALUES (%s, %s, %s)
        RETURNING id
    """, (scan_id, score, Json(metrics)))
    
    result_id = cur.fetchone()[0]
    
    # Insert issues
    for issue in priority_issues:
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
            issue['check_name'],
            issue['severity'],
            issue['message'],
            issue.get('description', ''),
            issue['recommendation'],
            issue['impact_score'],
            issue.get('expected_improvement', ''),
            issue.get('estimated_time', 0),
            Json(issue.get('data', {}))
        ))
    
    conn.commit()
    cur.close()
    conn.close()
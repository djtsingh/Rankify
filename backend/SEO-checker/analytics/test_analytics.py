#!/usr/bin/env python3
"""
Test script for Rankify Analytics System
Tests database connectivity and analytics logging functionality
"""

import os
import sys
import json
import psycopg2
from datetime import datetime, timedelta
from psycopg2.extras import RealDictCursor

# Add the analytics directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_database_connection():
    """Test database connection"""
    print("🔍 Testing database connection...")

    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL environment variable not set")
        return False

    try:
        conn = psycopg2.connect(database_url)
        conn.close()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_analytics_tables():
    """Test that analytics tables exist"""
    print("\n🔍 Testing analytics tables...")

    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return False

    try:
        conn = psycopg2.connect(database_url)
        with conn.cursor() as cur:
            # Check if audit_logs table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'audit_logs'
                );
            """)
            audit_logs_exists = cur.fetchone()[0]

            # Check if business_events table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'business_events'
                );
            """)
            business_events_exists = cur.fetchone()[0]

            # Check if performance_metrics table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'performance_metrics'
                );
            """)
            performance_metrics_exists = cur.fetchone()[0]

            # Check if error_logs table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_name = 'error_logs'
                );
            """)
            error_logs_exists = cur.fetchone()[0]

        conn.close()

        tables_status = {
            'audit_logs': audit_logs_exists,
            'business_events': business_events_exists,
            'performance_metrics': performance_metrics_exists,
            'error_logs': error_logs_exists
        }

        all_exist = all(tables_status.values())
        if all_exist:
            print("✅ All analytics tables exist")
            for table, exists in tables_status.items():
                print(f"   ✓ {table}: {'EXISTS' if exists else 'MISSING'}")
        else:
            print("❌ Some analytics tables are missing:")
            for table, exists in tables_status.items():
                status = "EXISTS" if exists else "MISSING"
                print(f"   {'✓' if exists else '✗'} {table}: {status}")

        return all_exist

    except Exception as e:
        print(f"❌ Error checking tables: {e}")
        return False

def test_analytics_views():
    """Test that analytics views exist"""
    print("\n🔍 Testing analytics views...")

    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return False

    try:
        conn = psycopg2.connect(database_url)
        with conn.cursor() as cur:
            views = [
                'view_daily_health',
                'view_conversion_stats',
                'view_performance_health',
                'view_error_summary'
            ]

            views_status = {}
            for view in views:
                cur.execute("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.views
                        WHERE table_name = %s
                    );
                """, (view,))
                views_status[view] = cur.fetchone()[0]

        conn.close()

        all_exist = all(views_status.values())
        if all_exist:
            print("✅ All analytics views exist")
            for view, exists in views_status.items():
                print(f"   ✓ {view}: {'EXISTS' if exists else 'MISSING'}")
        else:
            print("❌ Some analytics views are missing:")
            for view, exists in views_status.items():
                status = "EXISTS" if exists else "MISSING"
                print(f"   {'✓' if exists else '✗'} {view}: {status}")

        return all_exist

    except Exception as e:
        print(f"❌ Error checking views: {e}")
        return False

def test_sample_data_insertion():
    """Test inserting sample analytics data"""
    print("\n🔍 Testing sample data insertion...")

    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return False

    try:
        conn = psycopg2.connect(database_url)

        # Insert sample audit log
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO audit_logs (scan_id, target_url, status, metadata, processing_time_ms, created_at)
                VALUES (gen_random_uuid(), 'https://example.com', 'COMPLETED',
                       '{"test": true, "source": "test_script"}'::jsonb, 1500, NOW())
            """)

        # Insert sample business event
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO business_events (event_type, revenue_amount, currency, source, metadata, created_at)
                VALUES ('TEST_SIGNUP', 0.00, 'USD', 'test', '{"test": true}'::jsonb, NOW())
            """)

        # Insert sample performance metric
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO performance_metrics (metric_type, value, unit, page_path, created_at)
                VALUES ('LCP', 1250.50, 'ms', '/test', NOW())
            """)

        # Insert sample error log
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO error_logs (error_type, error_message, page_path, created_at)
                VALUES ('test_error', 'This is a test error', '/test', NOW())
            """)

        conn.commit()
        conn.close()

        print("✅ Sample data inserted successfully")
        return True

    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        return False

def test_reporting_query():
    """Test a sample reporting query"""
    print("\n🔍 Testing reporting query...")

    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return False

    try:
        conn = psycopg2.connect(database_url)
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Test daily health view
            cur.execute("""
                SELECT COUNT(*) as total_audits,
                       COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as successful,
                       ROUND(
                           COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END)::numeric /
                           NULLIF(COUNT(*), 0) * 100, 1
                       ) as success_rate
                FROM audit_logs
                WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
            """)

            result = cur.fetchone()

        conn.close()

        if result:
            print("✅ Reporting query executed successfully")
            print(f"   Total audits: {result['total_audits']}")
            print(f"   Successful: {result['successful']}")
            print(f"   Success rate: {result['success_rate']}%")
            return True
        else:
            print("❌ No data returned from reporting query")
            return False

    except Exception as e:
        print(f"❌ Error executing reporting query: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Rankify Analytics System Test")
    print("=" * 50)

    tests = [
        ("Database Connection", test_database_connection),
        ("Analytics Tables", test_analytics_tables),
        ("Analytics Views", test_analytics_views),
        ("Sample Data Insertion", test_sample_data_insertion),
        ("Reporting Query", test_reporting_query),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))

    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)

    passed = 0
    total = len(results)

    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1

    print(f"\nOverall: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All tests passed! Analytics system is ready.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
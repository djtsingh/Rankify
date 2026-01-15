#!/usr/bin/env python3
"""
Rankify Analytics Report Generator
Generates comprehensive daily reports from PostgreSQL analytics data.

Usage:
    python generate_report.py
    # or with custom date range:
    python generate_report.py --days 30

Requirements:
    pip install pandas sqlalchemy psycopg2-binary tabulate python-dotenv

Environment Variables:
    DATABASE_URL=postgresql://user:password@host:port/dbname
    WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN  # Optional
"""

import os
import sys
import argparse
from datetime import datetime, timedelta
from typing import Optional

import pandas as pd
from sqlalchemy import create_engine, text
from tabulate import tabulate
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

class RankifyAnalyticsReporter:
    def __init__(self, db_url: Optional[str] = None):
        self.db_url = db_url or os.getenv("DATABASE_URL")
        if not self.db_url:
            raise ValueError("DATABASE_URL environment variable is not set")
        self.engine = create_engine(self.db_url)

    def get_db_connection(self):
        return self.engine

    def _cleanup_zombie_jobs(self, engine):
        """Clean up zombie jobs that have been PROCESSING for too long"""
        print("🧟‍♂️ Checking for zombie jobs...")

        cleanup_query = """
        UPDATE audit_logs
        SET
            status = 'FAILED',
            error_message = 'System Error: Audit timed out or worker crashed.',
            processing_time_ms = NULL
        WHERE
            status = 'PROCESSING'
            AND created_at < NOW() - INTERVAL '15 minutes';
        """

        try:
            with engine.connect() as conn:
                result = conn.execute(text(cleanup_query))
                zombie_count = result.rowcount
                conn.commit()

            if zombie_count > 0:
                print(f"   ✅ Cleaned up {zombie_count} zombie job(s) that were stuck in PROCESSING status")
            else:
                print("   ✅ No zombie jobs found")

        except Exception as e:
            print(f"   ❌ Error during zombie cleanup: {e}")
            zombie_count = 0

        print()
        return zombie_count

    def send_webhook_notification(self, webhook_url: str, summary: dict, report_type: str):
        """Send summary notification to Discord/Slack webhook"""
        try:
            # Create a concise summary message
            health = summary['sections'].get('health', {})
            growth = summary['sections'].get('growth', {})

            message = {
                "embeds": [{
                    "title": f"📊 Rankify {report_type.title()} Analytics Report",
                    "description": f"Report for {summary['report_date']} (Last {summary['period_days']} days)",
                    "color": 3447003,  # Blue color
                    "fields": [
                        {
                            "name": "🧟 Zombie Jobs Cleaned",
                            "value": str(summary.get('zombie_jobs_cleaned', 0)),
                            "inline": True
                        }
                    ],
                    "timestamp": datetime.now().isoformat()
                }]
            }

            # Add health metrics if available
            if health and 'latest' in health:
                latest = health['latest']
                message["embeds"][0]["fields"].extend([
                    {
                        "name": "📈 Total Audits",
                        "value": str(latest.get('total_audits', 0)),
                        "inline": True
                    },
                    {
                        "name": "✅ Success Rate",
                        "value": f"{latest.get('success_rate', 0):.1f}%",
                        "inline": True
                    },
                    {
                        "name": "⚡ Avg Processing Time",
                        "value": f"{latest.get('avg_time_seconds', 0):.1f}s",
                        "inline": True
                    }
                ])

            # Add growth metrics if available
            if growth and 'totals' in growth:
                totals = growth['totals']
                message["embeds"][0]["fields"].extend([
                    {
                        "name": "👥 Total Signups",
                        "value": str(totals.get('signups', 0)),
                        "inline": True
                    },
                    {
                        "name": "💰 Revenue",
                        "value": f"${totals.get('revenue', 0):.2f}",
                        "inline": True
                    },
                    {
                        "name": "📈 Conversion Rate",
                        "value": f"{totals.get('conversion_rate', 0):.1f}%",
                        "inline": True
                    }
                ])

            response = requests.post(webhook_url, json=message, timeout=10)
            response.raise_for_status()
            print(f"✅ Webhook notification sent successfully")

        except Exception as e:
            print(f"❌ Error sending webhook notification: {e}")

    def generate_daily_report(self, days_back: int = 7):
        """Generate comprehensive daily analytics report"""
        engine = self.get_db_connection()

        # 🧟‍♂️ ZOMBIE JOB CLEANUP: Mark stuck PROCESSING jobs as FAILED
        zombie_cleanup = self._cleanup_zombie_jobs(engine)

        print("\n" + "="*80)
        print(f"🚀 RANKIFY ANALYTICS REPORT - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📅 Reporting Period: Last {days_back} days")
        print("="*80 + "\n")

        # Generate all report sections and collect summary data
        summary = {
            'report_date': datetime.now().strftime('%Y-%m-%d'),
            'period_days': days_back,
            'zombie_jobs_cleaned': zombie_cleanup,
            'sections': {}
        }

        # 1. Product Health Dashboard
        health_data = self._generate_product_health_report(engine, days_back)
        summary['sections']['health'] = health_data

        # 2. Growth & Conversion Metrics
        growth_data = self._generate_growth_report(engine, days_back)
        summary['sections']['growth'] = growth_data

        # 3. Performance Monitoring
        perf_data = self._generate_performance_report(engine, days_back)
        summary['sections']['performance'] = perf_data

        # 4. Error Analysis
        error_data = self._generate_error_report(engine, days_back)
        summary['sections']['errors'] = error_data

        # 5. Executive Summary
        exec_data = self._generate_executive_summary(engine, days_back)
        summary['sections']['executive'] = exec_data

        return summary

    def _generate_product_health_report(self, engine, days_back: int):
        """Generate product health metrics"""
        print("📊 PRODUCT HEALTH DASHBOARD")
        print("-" * 50)

        query = f"""
        SELECT * FROM view_daily_health
        WHERE date >= CURRENT_DATE - INTERVAL '{days_back} days'
        ORDER BY date DESC;
        """

        df = pd.read_sql(query, engine)
        summary = {}

        if not df.empty:
            # Calculate additional metrics
            df['success_rate'] = (df['successful_audits'] / df['total_audits'] * 100).round(1)
            df['success_rate_str'] = df['success_rate'].astype(str) + '%'
            df['avg_time_seconds'] = (df['avg_processing_time_ms'] / 1000).round(1)

            # Display metrics
            print(tabulate(
                df[[
                    'date', 'total_audits', 'successful_audits',
                    'failed_audits', 'success_rate_str', 'avg_time_seconds',
                    'avg_seo_score', 'unique_users'
                ]],
                headers=['Date', 'Total Audits', 'Successful', 'Failed', 'Success Rate',
                        'Avg Time (s)', 'Avg SEO Score', 'Unique Users'],
                tablefmt='psql',
                showindex=False
            ))

            # Prepare summary data
            latest = df.iloc[0] if len(df) > 0 else None
            summary['latest'] = {
                'total_audits': int(latest['total_audits']) if latest is not None else 0,
                'successful_audits': int(latest['successful_audits']) if latest is not None else 0,
                'failed_audits': int(latest['failed_audits']) if latest is not None else 0,
                'success_rate': float(latest['success_rate']) if latest is not None else 0,
                'avg_time_seconds': float(latest['avg_time_seconds']) if latest is not None else 0,
                'avg_seo_score': float(latest['avg_seo_score']) if latest is not None else 0,
                'unique_users': int(latest['unique_users']) if latest is not None else 0
            }

            # Alerting logic
            if latest is not None and latest['failed_audits'] > 0:
                failure_rate = (latest['failed_audits'] / latest['total_audits']) * 100
                if failure_rate > 10:
                    print(f"\n⚠️  ALERT: High failure rate today ({failure_rate:.1f}%)!")
                    print("   Recent errors:")
                    self._show_recent_errors(engine, limit=3)
                    summary['alert'] = f"High failure rate: {failure_rate:.1f}%"
        else:
            print("No audit data found in the specified period.")
            summary['status'] = 'no_data'

        print()
        return summary

    def _generate_growth_report(self, engine, days_back: int):
        """Generate growth and conversion metrics"""
        print("📈 GROWTH & CONVERSION METRICS")
        print("-" * 50)

        query = f"""
        SELECT * FROM view_conversion_stats
        WHERE date >= CURRENT_DATE - INTERVAL '{days_back} days'
        ORDER BY date DESC;
        """

        df = pd.read_sql(query, engine)
        summary = {}

        if not df.empty:
            # Calculate conversion rates
            df['conversion_rate'] = ((df['paid_conversions'] / df['total_signups'].replace(0, 1)) * 100).round(1)
            df['conversion_rate_str'] = df['conversion_rate'].astype(str) + '%'

            print(tabulate(
                df[['date', 'total_signups', 'total_logins', 'paid_conversions',
                     'conversion_rate_str', 'revenue_generated', 'active_users']],
                headers=['Date', 'Signups', 'Logins', 'Conversions', 'Conv Rate',
                        'Revenue', 'Active Users'],
                tablefmt='psql',
                showindex=False
            ))

            # Growth insights
            total_signups = df['total_signups'].sum()
            total_conversions = df['paid_conversions'].sum()
            total_revenue = df['revenue_generated'].sum()

            summary['totals'] = {
                'signups': int(total_signups),
                'conversions': int(total_conversions),
                'revenue': float(total_revenue)
            }

            if total_signups > 0:
                overall_conversion = (total_conversions / total_signups) * 100
                print(f"📈 Overall Conversion Rate: {overall_conversion:.1f}%")
                print(f"💰 Total Revenue: ${total_revenue:.2f}")
                summary['totals']['conversion_rate'] = float(overall_conversion)
        else:
            print("No growth data found in the specified period.")
            summary['status'] = 'no_data'

        print()
        return summary

    def _generate_performance_report(self, engine, days_back: int):
        """Generate performance monitoring report"""
        print("⚡ PERFORMANCE MONITORING")
        print("-" * 50)

        query = f"""
        SELECT * FROM view_performance_health
        WHERE date >= CURRENT_DATE - INTERVAL '{days_back} days'
        ORDER BY date DESC, metric_type;
        """

        df = pd.read_sql(query, engine)

        if not df.empty:
            # Group by metric type for better display
            for metric_type in df['metric_type'].unique():
                metric_data = df[df['metric_type'] == metric_type]
                if not metric_data.empty:
                    print(f"\n📈 {metric_type} Performance:")
                    print(tabulate(
                        metric_data[['date', 'measurement_count', 'avg_value', 'min_value', 'max_value', 'unit']],
                        headers=['Date', 'Count', 'Average', 'Min', 'Max', 'Unit'],
                        tablefmt='simple',
                        showindex=False
                    ))

                    # Performance alerts
                    latest_avg = metric_data.iloc[0]['avg_value'] if len(metric_data) > 0 else 0
                    self._check_performance_alerts(metric_type, latest_avg)
        else:
            print("No performance data found in the specified period.")

        print()
        return {}

    def _generate_error_report(self, engine, days_back: int):
        """Generate error analysis report"""
        print("🐛 ERROR ANALYSIS")
        print("-" * 50)

        # Summary view
        query_summary = f"""
        SELECT * FROM view_error_summary
        WHERE date >= CURRENT_DATE - INTERVAL '{days_back} days'
        ORDER BY date DESC, error_count DESC;
        """

        df_summary = pd.read_sql(query_summary, engine)

        if not df_summary.empty:
            print("Error Summary by Type:")
            print(tabulate(
                df_summary,
                headers=['Date', 'Error Type', 'Count', 'Affected Users'],
                tablefmt='psql',
                showindex=False
            ))
        else:
            print("✅ No errors found in the specified period.")

        # Recent detailed errors
        print("\n🔍 Recent Error Details:")
        self._show_recent_errors(engine, limit=5)

        print()
        return {}

    def _generate_executive_summary(self, engine, days_back: int):
        """Generate executive summary with key insights"""
        print("📋 EXECUTIVE SUMMARY")
        print("-" * 50)

        # Get key metrics for the period
        query_summary = f"""
        SELECT
            COUNT(a.*) as total_audits,
            COUNT(CASE WHEN a.status = 'COMPLETED' THEN 1 END) as successful_audits,
            ROUND(AVG(a.seo_score), 1) as avg_seo_score,
            COUNT(DISTINCT COALESCE(a.user_id, b.user_id)) as unique_users,
            SUM(CASE WHEN b.event_type = 'SIGNUP' THEN 1 ELSE 0 END) as total_signups,
            SUM(CASE WHEN b.event_type = 'UPGRADE' THEN 1 ELSE 0 END) as total_upgrades,
            SUM(CASE WHEN b.event_type = 'UPGRADE' THEN b.revenue_amount ELSE 0 END) as total_revenue
        FROM audit_logs a
        FULL OUTER JOIN business_events b ON DATE(a.created_at) = DATE(b.created_at)
        WHERE a.created_at >= CURRENT_DATE - INTERVAL '{days_back} days'
           OR b.created_at >= CURRENT_DATE - INTERVAL '{days_back} days';
        """

        df_summary = pd.read_sql(query_summary, engine)

        if not df_summary.empty and len(df_summary) > 0:
            row = df_summary.iloc[0]

            print(f"📊 Period Summary ({days_back} days):")
            print(f"   • Total Audits: {int(row['total_audits'] or 0)}")
            print(f"   • Successful Audits: {int(row['successful_audits'] or 0)}")
            print(f"   • Average SEO Score: {row['avg_seo_score'] or 0}/100")
            print(f"   • Unique Users: {int(row['unique_users'] or 0)}")
            print(f"   • New Signups: {int(row['total_signups'] or 0)}")
            print(f"   • Paid Conversions: {int(row['total_upgrades'] or 0)}")
            print(f"   • Revenue Generated: ${row['total_revenue'] or 0:.2f}")

            # Calculate rates
            if row['total_audits'] and row['total_audits'] > 0:
                success_rate = (row['successful_audits'] / row['total_audits']) * 100
                print(f"   • Success Rate: {success_rate:.1f}%")
            if row['total_signups'] and row['total_signups'] > 0:
                conversion_rate = (row['total_upgrades'] / row['total_signups']) * 100
                print(f"   • Conversion Rate: {conversion_rate:.1f}%")
        else:
            print("No summary data available.")

        return {}

    def _show_recent_errors(self, engine, limit: int = 5):
        """Show recent error details"""
        query = f"""
        SELECT
            created_at,
            target_url,
            error_message,
            'audit_error' as error_type
        FROM audit_logs
        WHERE status = 'FAILED'
        ORDER BY created_at DESC
        LIMIT {limit};
        """

        df = pd.read_sql(query, engine)

        if not df.empty:
            for _, row in df.iterrows():
                print(f"   • {row['created_at'].strftime('%m/%d %H:%M')}: {row['error_type']} - {row['error_message'][:100]}...")
        else:
            print("   No recent errors found.")

    def _check_performance_alerts(self, metric_type: str, value: float):
        """Check for performance alerts based on metric thresholds"""
        alerts = {
            'LCP': {'threshold': 2500, 'unit': 'ms'},
            'FID': {'threshold': 100, 'unit': 'ms'},
            'CLS': {'threshold': 0.1, 'unit': ''},
        }

        if metric_type in alerts:
            threshold = alerts[metric_type]['threshold']
            unit = alerts[metric_type]['unit']

            if value > threshold:
                print(f"   ⚠️  ALERT: {metric_type} ({value}{unit}) exceeds threshold ({threshold}{unit})")

def main():
    parser = argparse.ArgumentParser(description='Generate Rankify Analytics Report')
    parser.add_argument('--days', type=int, default=30,
                       help='Number of days to look back (default: 30 for monthly)')
    parser.add_argument('--db-url', type=str,
                       help='Database URL (or set DATABASE_URL env var)')
    parser.add_argument('--webhook-url', type=str,
                       help='Discord/Slack webhook URL for notifications (or set WEBHOOK_URL env var)',
                       default=os.getenv('WEBHOOK_URL'))
    parser.add_argument('--report-type', choices=['daily', 'weekly', 'monthly', 'custom'],
                       default='monthly', help='Type of report to generate (default: monthly)')

    args = parser.parse_args()

    try:
        reporter = RankifyAnalyticsReporter(args.db_url)
        if args.report_type == 'monthly':
            args.days = 30
        elif args.report_type == 'weekly':
            args.days = 7
        elif args.report_type == 'daily':
            args.days = 1

        summary = reporter.generate_daily_report(args.days)

        # Send webhook notification if URL provided
        if args.webhook_url and summary:
            reporter.send_webhook_notification(args.webhook_url, summary, args.report_type)

    except Exception as e:
        print(f"❌ Error generating report: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
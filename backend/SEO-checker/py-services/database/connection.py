# python-services/database/connection.py

import psycopg2
from psycopg2.extras import RealDictCursor, Json
import os
from dotenv import load_dotenv
from contextlib import contextmanager

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'rankify'),
    'user': os.getenv('DB_USER', 'rankify_user'),
    'password': os.getenv('DB_PASSWORD', 'your_secure_password_here')
}

def get_connection():
    """
    Create database connection
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

@contextmanager
def get_cursor(commit=False):
    """
    Context manager for database cursor
    
    Usage:
        with get_cursor(commit=True) as cur:
            cur.execute("INSERT INTO ...")
    """
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        yield cur
        if commit:
            conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

def test_connection():
    """
    Test database connection
    """
    try:
        with get_cursor() as cur:
            cur.execute("SELECT version();")
            version = cur.fetchone()
            print(f"✅ Database connected: {version['version']}")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    test_connection()
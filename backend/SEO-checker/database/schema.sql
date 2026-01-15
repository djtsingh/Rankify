-- database/schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    subscription_tier VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- SCANS TABLE
CREATE TABLE scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    url_hash VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Indexes for scans
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_url_hash ON scans(url_hash);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);

-- SCAN_RESULTS TABLE
CREATE TABLE scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    metrics JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scan_results_scan_id ON scan_results(scan_id);

-- ISSUES TABLE
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    impact_score FLOAT NOT NULL,
    expected_improvement TEXT,
    time_to_fix_hours INTEGER,
    data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_issues_scan_id ON issues(scan_id);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_issues_impact_score ON issues(impact_score DESC);

-- SCAN_HISTORY TABLE (for progress tracking)
CREATE TABLE scan_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    score INTEGER NOT NULL,
    previous_score INTEGER,
    score_delta INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scan_history_user_id ON scan_history(user_id, created_at DESC);
CREATE INDEX idx_scan_history_url ON scan_history(url);

-- ===========================================
-- ANALYTICS TRACKING TABLES
-- ===========================================

-- 1. AUDIT LOGS (Product Usage Tracking)
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id), -- Nullable if guest users are allowed
    scan_id UUID REFERENCES scans(id), -- Link to actual scan
    target_url TEXT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
    seo_score INT CHECK (seo_score >= 0 AND seo_score <= 100),
    performance_score INT CHECK (performance_score >= 0 AND performance_score <= 100),
    error_message TEXT,
    processing_time_ms INT, -- How long the audit took
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB, -- Flexible field for extra data (browser type, region, etc.)
    ip_address INET, -- For geographical analysis
    user_agent TEXT -- For device/browser analysis
);

-- 2. BUSINESS EVENTS (Revenue & Growth Tracking)
CREATE TABLE business_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- 'SIGNUP', 'LOGIN', 'UPGRADE', 'CHURN', 'PAYMENT'
    user_id UUID REFERENCES users(id),
    revenue_amount DECIMAL(10, 2) DEFAULT 0.00, -- For calculating LTV
    currency VARCHAR(3) DEFAULT 'USD',
    source VARCHAR(50), -- 'google', 'twitter', 'direct', 'referral'
    campaign VARCHAR(100), -- UTM campaign
    medium VARCHAR(50), -- UTM medium
    subscription_tier VARCHAR(20), -- 'free', 'pro', 'enterprise'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB -- Additional event data
);

-- 3. PERFORMANCE METRICS (Technical Monitoring)
CREATE TABLE performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL, -- 'LCP', 'FID', 'CLS', 'API_RESPONSE'
    value DECIMAL(10, 3) NOT NULL,
    unit VARCHAR(20) DEFAULT 'ms', -- 'ms', 's', '%', 'bytes'
    page_path TEXT,
    user_id UUID REFERENCES users(id),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ERROR LOGS (Application Monitoring)
CREATE TABLE error_logs (
    id SERIAL PRIMARY KEY,
    error_type VARCHAR(100) NOT NULL, -- 'javascript_error', 'api_error', 'scan_error'
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID REFERENCES users(id),
    page_path TEXT,
    user_agent TEXT,
    ip_address INET,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES FOR ANALYTICS TABLES
-- ===========================================

-- Audit Logs Indexes
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_scan_id ON audit_logs(scan_id);
CREATE INDEX idx_audit_logs_target_url ON audit_logs(target_url);

-- Business Events Indexes
CREATE INDEX idx_business_events_created_at ON business_events(created_at DESC);
CREATE INDEX idx_business_events_event_type ON business_events(event_type);
CREATE INDEX idx_business_events_user_id ON business_events(user_id);
CREATE INDEX idx_business_events_source ON business_events(source);

-- Performance Metrics Indexes
CREATE INDEX idx_performance_metrics_created_at ON performance_metrics(created_at DESC);
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_user_id ON performance_metrics(user_id);

-- Error Logs Indexes
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_user_id ON error_logs(user_id);

-- ===========================================
-- ANALYTICS REPORTING VIEWS
-- ===========================================

-- VIEW 1: Daily Health Dashboard (The "Morning Coffee" View)
CREATE OR REPLACE VIEW view_daily_health AS
SELECT
    DATE(created_at) as report_date,
    COUNT(*) as total_audits,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as successful_audits,
    COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_audits,
    ROUND(
        CASE
            WHEN COUNT(*) > 0 THEN
                (COUNT(CASE WHEN status = 'FAILED' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100
            ELSE 0
        END, 1
    ) as failure_rate_percent,
    ROUND(AVG(processing_time_ms) / 1000.0, 2) as avg_seconds_per_audit,
    ROUND(AVG(seo_score), 1) as avg_seo_score,
    ROUND(AVG(performance_score), 1) as avg_performance_score,
    COUNT(DISTINCT user_id) as unique_users
FROM audit_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY report_date DESC;

-- VIEW 2: User Conversion Funnel (The "Growth" View)
CREATE OR REPLACE VIEW view_conversion_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(CASE WHEN event_type = 'SIGNUP' THEN 1 END) as total_signups,
    COUNT(CASE WHEN event_type = 'LOGIN' THEN 1 END) as total_logins,
    COUNT(CASE WHEN event_type = 'UPGRADE' THEN 1 END) as paid_conversions,
    COUNT(DISTINCT CASE WHEN event_type IN ('SIGNUP', 'LOGIN', 'UPGRADE') THEN user_id END) as active_users,
    SUM(CASE WHEN event_type = 'UPGRADE' THEN revenue_amount ELSE 0 END) as revenue_generated
FROM business_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- VIEW 3: Performance Monitoring (Technical Health)
CREATE OR REPLACE VIEW view_performance_health AS
SELECT
    DATE(created_at) as date,
    metric_type,
    COUNT(*) as measurement_count,
    ROUND(AVG(value), 2) as avg_value,
    ROUND(MIN(value), 2) as min_value,
    ROUND(MAX(value), 2) as max_value,
    unit
FROM performance_metrics
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at), metric_type, unit
ORDER BY date DESC, metric_type;

-- VIEW 4: Error Summary (Debugging View)
CREATE OR REPLACE VIEW view_error_summary AS
SELECT
    DATE(created_at) as date,
    error_type,
    COUNT(*) as error_count,
    COUNT(DISTINCT user_id) as affected_users
FROM error_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at), error_type
ORDER BY date DESC, error_count DESC;
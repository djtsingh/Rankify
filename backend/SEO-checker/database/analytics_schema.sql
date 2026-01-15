-- Analytics tables for Rankify - Only the additional tables not in Prisma schema
-- Run this after Prisma migrations

-- AUDIT LOGS (Product Usage Tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID, -- Nullable if guest users are allowed
    scan_id UUID, -- Link to actual scan
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

-- BUSINESS EVENTS (Revenue & Conversion Tracking)
CREATE TABLE IF NOT EXISTS business_events (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    event_type VARCHAR(50) NOT NULL, -- 'SIGNUP', 'LOGIN', 'UPGRADE', 'PAYMENT', 'CANCEL', etc.
    event_value DECIMAL(10,2), -- Revenue amount for payments
    currency VARCHAR(3) DEFAULT 'USD',
    metadata JSONB, -- Additional event data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source VARCHAR(50) -- 'web', 'api', 'mobile', etc.
);

-- PERFORMANCE METRICS (Technical Monitoring)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(100) NOT NULL, -- 'response_time', 'cpu_usage', 'memory_usage', etc.
    value DECIMAL(10,4) NOT NULL,
    unit VARCHAR(20), -- 'ms', 'percent', 'bytes', etc.
    tags JSONB, -- Key-value pairs for filtering (service, endpoint, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ERROR LOGS (Debugging & Monitoring)
CREATE TABLE IF NOT EXISTS error_logs (
    id SERIAL PRIMARY KEY,
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID,
    metadata JSONB, -- Request details, user agent, etc.
    severity VARCHAR(20) DEFAULT 'ERROR' CHECK (severity IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_scan_id ON audit_logs(scan_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_events_user_id ON business_events(user_id);
CREATE INDEX IF NOT EXISTS idx_business_events_event_type ON business_events(event_type);
CREATE INDEX IF NOT EXISTS idx_business_events_created_at ON business_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);

-- Create analytics views
CREATE OR REPLACE VIEW view_daily_health AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_audits,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as successful_audits,
    ROUND(
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END)::decimal /
        NULLIF(COUNT(*), 0) * 100, 1
    ) as success_rate,
    ROUND(AVG(seo_score), 1) as avg_seo_score,
    ROUND(AVG(performance_score), 1) as avg_performance_score,
    ROUND(AVG(processing_time_ms), 0) as avg_time_seconds,
    COUNT(DISTINCT user_id) as unique_users
FROM audit_logs
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW view_conversion_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(CASE WHEN event_type = 'SIGNUP' THEN 1 END) as total_signups,
    COUNT(CASE WHEN event_type = 'LOGIN' THEN 1 END) as total_logins,
    COUNT(CASE WHEN event_type = 'UPGRADE' THEN 1 END) as paid_conversions,
    COUNT(DISTINCT CASE WHEN event_type IN ('SIGNUP', 'LOGIN', 'UPGRADE') THEN user_id END) as active_users,
    SUM(CASE WHEN event_type = 'UPGRADE' THEN event_value ELSE 0 END) as revenue_generated
FROM business_events
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

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
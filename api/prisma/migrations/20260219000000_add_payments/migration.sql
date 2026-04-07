-- Rankify Payment & Subscription Migration
-- Migration: Add payment, subscription, and usage tracking tables

-- Add stripe_customer_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) UNIQUE;

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_product_id VARCHAR(255) UNIQUE,
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_yearly VARCHAR(255),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2) DEFAULT 0,
    price_yearly DECIMAL(10, 2) DEFAULT 0,
    
    -- Plan limits (-1 = unlimited)
    scans_per_day INTEGER DEFAULT -1,
    concurrent_scans INTEGER DEFAULT 1,
    history_days INTEGER DEFAULT 7,
    max_projects INTEGER DEFAULT 1,
    max_team_members INTEGER DEFAULT 1,
    api_calls_per_month INTEGER DEFAULT 0,
    
    -- Feature flags
    has_pdf_export BOOLEAN DEFAULT FALSE,
    has_white_label BOOLEAN DEFAULT FALSE,
    has_competitors BOOLEAN DEFAULT FALSE,
    has_api_access BOOLEAN DEFAULT FALSE,
    has_priority_support BOOLEAN DEFAULT FALSE,
    
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    
    status VARCHAR(50) DEFAULT 'active',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    
    trial_start_date TIMESTAMPTZ,
    trial_end_date TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_invoice_id VARCHAR(255),
    
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,
    
    billing_reason VARCHAR(100),
    invoice_url TEXT,
    receipt_url TEXT,
    failure_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Create usage_records table
CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guest_id VARCHAR(255),
    
    action VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    
    date DATE DEFAULT CURRENT_DATE,
    hour INTEGER,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_records_user_id_date ON usage_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_usage_records_guest_id_date ON usage_records(guest_id, date);
CREATE INDEX IF NOT EXISTS idx_usage_records_action_date ON usage_records(action, date);

-- Create guest_fingerprints table
CREATE TABLE IF NOT EXISTS guest_fingerprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint VARCHAR(255) UNIQUE NOT NULL,
    ip_addresses TEXT[] DEFAULT '{}',
    
    scans_today INTEGER DEFAULT 0,
    last_scan_date DATE,
    
    abuse_score INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    block_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_fingerprints_fingerprint ON guest_fingerprints(fingerprint);
CREATE INDEX IF NOT EXISTS idx_guest_fingerprints_is_blocked ON guest_fingerprints(is_blocked);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    stripe_coupon_id VARCHAR(255) UNIQUE,
    
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    
    applicable_plans TEXT[] DEFAULT '{}',
    min_purchase_amount DECIMAL(10, 2),
    
    max_uses INTEGER,
    max_uses_per_user INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    
    duration_months INTEGER,
    
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);

-- Create coupon_usages table
CREATE TABLE IF NOT EXISTS coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES coupons(id),
    user_id UUID NOT NULL REFERENCES users(id),
    subscription_id UUID,
    
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    discount_amount DECIMAL(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_user_id ON coupon_usages(user_id);

-- Insert default plans
INSERT INTO plans (name, display_name, description, price_monthly, price_yearly, scans_per_day, concurrent_scans, history_days, max_projects, max_team_members, api_calls_per_month, has_pdf_export, has_white_label, has_competitors, has_api_access, has_priority_support, sort_order)
VALUES 
    ('free', 'Free', 'Perfect for trying out Rankify', 0, 0, 5, 2, 7, 1, 1, 0, TRUE, FALSE, FALSE, FALSE, FALSE, 1),
    ('pro', 'Pro', 'For SEO professionals & agencies', 49, 468, -1, 5, 90, 10, 3, 1000, TRUE, TRUE, TRUE, TRUE, FALSE, 2),
    ('enterprise', 'Enterprise', 'For large teams & organizations', 199, 1908, -1, 20, -1, -1, -1, -1, TRUE, TRUE, TRUE, TRUE, TRUE, 3)
ON CONFLICT (name) DO NOTHING;

-- Create function to reset daily guest scans (run via cron job)
CREATE OR REPLACE FUNCTION reset_daily_guest_scans()
RETURNS void AS $$
BEGIN
    UPDATE guest_fingerprints
    SET scans_today = 0,
        updated_at = NOW()
    WHERE last_scan_date < CURRENT_DATE OR last_scan_date IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_plans_updated_at ON plans;
CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guest_fingerprints_updated_at ON guest_fingerprints;
CREATE TRIGGER update_guest_fingerprints_updated_at
    BEFORE UPDATE ON guest_fingerprints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

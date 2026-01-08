-- Migration: Add scans, scan_results, and issues tables
-- For queue-based SEO scanning workflow

-- Create scans table
CREATE TABLE IF NOT EXISTS "scans" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "url_hash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "completed_at" TIMESTAMP WITH TIME ZONE
);

-- Create scan_results table (for storing comprehensive results)
CREATE TABLE IF NOT EXISTS "scan_results" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "scan_id" UUID NOT NULL UNIQUE REFERENCES "scans"("id") ON DELETE CASCADE,
    "score" INTEGER,
    "metrics" JSONB,
    "category_scores" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issues table (for storing individual issues)
CREATE TABLE IF NOT EXISTS "issues" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "scan_id" UUID NOT NULL REFERENCES "scans"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "recommendation" TEXT,
    "impact_score" INTEGER DEFAULT 0,
    "expected_improvement" TEXT,
    "time_to_fix_hours" DECIMAL(5,2),
    "priority" INTEGER DEFAULT 50,
    "data" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "scans_url_hash_idx" ON "scans"("url_hash");
CREATE INDEX IF NOT EXISTS "scans_status_idx" ON "scans"("status");
CREATE INDEX IF NOT EXISTS "scans_created_at_idx" ON "scans"("created_at");
CREATE INDEX IF NOT EXISTS "scan_results_scan_id_idx" ON "scan_results"("scan_id");
CREATE INDEX IF NOT EXISTS "issues_scan_id_idx" ON "issues"("scan_id");
CREATE INDEX IF NOT EXISTS "issues_category_idx" ON "issues"("category");
CREATE INDEX IF NOT EXISTS "issues_priority_idx" ON "issues"("priority");

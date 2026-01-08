-- Migration: Add category and priority columns to issues table
-- Date: 2026-01-07
-- Description: Add fields required by frontend for issue display

-- Add category column (maps severity to user-friendly category)
ALTER TABLE issues ADD COLUMN IF NOT EXISTS category VARCHAR(20);

-- Add priority column (numeric priority for sorting)
ALTER TABLE issues ADD COLUMN IF NOT EXISTS priority FLOAT;

-- Create index on priority for sorting
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues(priority);

-- Set default values for existing rows
UPDATE issues 
SET category = CASE 
    WHEN severity = 'critical' THEN 'critical'
    WHEN severity = 'warning' THEN 'important'
    WHEN severity = 'info' THEN 'moderate'
    ELSE 'minor'
END
WHERE category IS NULL;

UPDATE issues
SET priority = CASE
    WHEN severity = 'critical' THEN 1.0
    WHEN severity = 'warning' THEN 2.0
    WHEN severity = 'info' THEN 3.0
    ELSE 4.0
END + (1.0 - LEAST(impact_score, 1.0))
WHERE priority IS NULL;

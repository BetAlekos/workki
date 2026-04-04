-- Add view_count column to jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_jobs_view_count ON jobs (view_count DESC) WHERE is_approved = true;

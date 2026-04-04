-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id     UUID REFERENCES jobs(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  message    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications (job_id);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application"
  ON applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role reads applications"
  ON applications FOR SELECT USING (false);

-- Email alerts table
CREATE TABLE IF NOT EXISTS email_alerts (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON email_alerts FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role reads alerts"
  ON email_alerts FOR SELECT USING (false);

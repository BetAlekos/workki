-- =============================================================
-- Workki.gr — Supabase Schema
-- Run this in the Supabase SQL Editor
-- =============================================================

-- Enums
CREATE TYPE employment_type AS ENUM (
  'FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'TEMPORARY', 'INTERN', 'VOLUNTEER'
);

CREATE TYPE salary_period AS ENUM (
  'HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'
);

-- Jobs table
CREATE TABLE jobs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text UNIQUE NOT NULL,
  title            text NOT NULL,
  company_name     text NOT NULL,
  company_website  text,
  company_logo     text,
  description      text NOT NULL,
  employment_type  employment_type NOT NULL,
  location_city    text,
  location_region  text,
  location_country text NOT NULL DEFAULT 'GR',
  is_remote        boolean NOT NULL DEFAULT false,
  salary_min       integer,
  salary_max       integer,
  salary_currency  text NOT NULL DEFAULT 'EUR',
  salary_period    salary_period,
  category         text NOT NULL,
  apply_url        text,
  apply_email      text,
  date_posted      date NOT NULL DEFAULT CURRENT_DATE,
  valid_through    timestamptz,
  is_approved      boolean NOT NULL DEFAULT false,
  is_featured      boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_approved ON jobs (is_approved, created_at DESC);
CREATE INDEX idx_jobs_slug ON jobs (slug);
CREATE INDEX idx_jobs_category ON jobs (category) WHERE is_approved = true;
CREATE INDEX idx_jobs_city ON jobs (location_city) WHERE is_approved = true;
CREATE INDEX idx_jobs_featured ON jobs (is_featured) WHERE is_approved = true;
CREATE INDEX idx_jobs_fts ON jobs USING GIN (
  to_tsvector('simple', title || ' ' || company_name || ' ' || description)
);

-- Companies table
CREATE TABLE companies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  website     text,
  logo        text,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Email alerts table
CREATE TABLE email_alerts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL,
  keywords   text[] NOT NULL DEFAULT '{}',
  categories text[] NOT NULL DEFAULT '{}',
  confirmed  boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_alerts_email ON email_alerts (email);

-- =============================================================
-- Row Level Security
-- =============================================================

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_alerts ENABLE ROW LEVEL SECURITY;

-- Jobs: public can read approved, non-expired jobs
CREATE POLICY "Public can read approved jobs"
  ON jobs FOR SELECT
  USING (
    is_approved = true
    AND (valid_through IS NULL OR valid_through > now())
  );

-- Jobs: public can insert (always creates unapproved)
CREATE POLICY "Public can submit jobs"
  ON jobs FOR INSERT
  WITH CHECK (is_approved = false AND is_featured = false);

-- Jobs: service role has full access (bypasses RLS automatically)

-- Companies: public read
CREATE POLICY "Public can read companies"
  ON companies FOR SELECT
  USING (true);

-- Email alerts: anyone can insert their own alert
CREATE POLICY "Users can create email alerts"
  ON email_alerts FOR INSERT
  WITH CHECK (true);

-- =============================================================
-- Sample seed data (optional — remove in production)
-- =============================================================

INSERT INTO jobs (
  slug, title, company_name, company_website,
  description, employment_type, location_city, location_region,
  is_remote, salary_min, salary_max, salary_currency, salary_period,
  category, apply_url, date_posted, is_approved, is_featured
) VALUES
(
  'senior-frontend-developer-techstartup-gr-a1b2c',
  'Senior Frontend Developer',
  'TechStartup GR',
  'https://example.com',
  '<p>Αναζητάμε έναν έμπειρο <strong>Senior Frontend Developer</strong> να ενταχθεί στην ομάδα μας.</p><h2>Απαιτούμενα προσόντα</h2><ul><li>3+ χρόνια εμπειρία με React / Next.js</li><li>Γνώση TypeScript</li><li>Εμπειρία με REST APIs</li></ul><h2>Τι προσφέρουμε</h2><ul><li>Ανταγωνιστικό πακέτο αποδοχών</li><li>Δυνατότητα εξ αποστάσεως εργασίας</li><li>Σύγχρονο εργασιακό περιβάλλον</li></ul>',
  'FULL_TIME',
  'Αθήνα',
  'Αττική',
  true,
  3000,
  5000,
  'EUR',
  'MONTH',
  'Πληροφορική & Τεχνολογία',
  'https://example.com/apply',
  CURRENT_DATE,
  true,
  true
),
(
  'digital-marketing-manager-agency-d3e4f',
  'Digital Marketing Manager',
  'Agency Alpha',
  null,
  '<p>Η Agency Alpha αναζητά <strong>Digital Marketing Manager</strong> για την ομάδα της στη Θεσσαλονίκη.</p><h2>Αρμοδιότητες</h2><ul><li>Διαχείριση καμπανιών Google Ads & Meta Ads</li><li>SEO / Content Strategy</li><li>Ανάλυση δεδομένων & reporting</li></ul>',
  'FULL_TIME',
  'Θεσσαλονίκη',
  'Κεντρική Μακεδονία',
  false,
  1800,
  2800,
  'EUR',
  'MONTH',
  'Πωλήσεις & Marketing',
  null,
  CURRENT_DATE,
  true,
  false
),
(
  'hotel-receptionist-crete-g5h6i',
  'Υπεύθυνος Υποδοχής Ξενοδοχείου',
  'Crete Luxury Resorts',
  null,
  '<p>Αναζητάμε <strong>Υπεύθυνο Υποδοχής</strong> για το ξενοδοχείο μας στο Ηράκλειο (εποχική θέση).</p><ul><li>Γνώση Αγγλικών & Γερμανικών</li><li>Εμπειρία σε ξενοδοχειακό λογισμικό</li><li>Ευχάριστη παρουσία</li></ul>',
  'TEMPORARY',
  'Ηράκλειο',
  'Κρήτη',
  false,
  null,
  null,
  'EUR',
  'MONTH',
  'Τουρισμός & Φιλοξενία',
  null,
  CURRENT_DATE,
  true,
  false
);

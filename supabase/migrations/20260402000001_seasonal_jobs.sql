-- Seasonal jobs columns
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_seasonal BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS season TEXT CHECK (season IN ('spring', 'summer', 'autumn', 'winter'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS season_start DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS season_end DATE;

CREATE INDEX IF NOT EXISTS idx_jobs_seasonal ON jobs (is_seasonal, season) WHERE is_approved = true;

-- Seed seasonal jobs
INSERT INTO jobs (
  slug, title, company_name, description,
  employment_type, location_city, location_region,
  is_remote, category, date_posted,
  is_approved, is_featured, is_seasonal, season, season_start, season_end
) VALUES
(
  'barista-beach-bar-naxos-x1y2z',
  'Barista – Beach Bar',
  'Sunset Beach Bar Νάξος',
  '<p>Ζητείται <strong>Barista</strong> για beach bar στην Αγία Άννα Νάξου για την καλοκαιρινή σεζόν 2025.</p><h2>Απαιτούμενα</h2><ul><li>Εμπειρία σε barista ή bartending</li><li>Ευχάριστη προσωπικότητα</li><li>Γνώση Αγγλικών</li></ul><h2>Παροχές</h2><ul><li>Στέγαση παρέχεται</li><li>Γεύματα</li><li>Ανταγωνιστικές αμοιβές + tips</li></ul>',
  'TEMPORARY',
  'Νάξος',
  'Κυκλάδες',
  false,
  'Εστίαση',
  CURRENT_DATE,
  true, false, true, 'summer',
  '2025-06-01', '2025-09-30'
),
(
  'receptionist-hotel-heraklion-a2b3c',
  'Υπάλληλος Υποδοχής Ξενοδοχείου',
  'Azure Hotel Ηράκλειο',
  '<p>Ξενοδοχείο 4 αστέρων στο Ηράκλειο αναζητά <strong>Υπάλληλο Υποδοχής</strong> για τη σεζόν Μαΐου–Οκτωβρίου 2025.</p><h2>Προσόντα</h2><ul><li>Γνώση PMS (Fidelio/Opera)</li><li>Άριστα Αγγλικά, επιθυμητά Γερμανικά</li><li>Εμπειρία σε ξενοδοχείο</li></ul>',
  'TEMPORARY',
  'Ηράκλειο',
  'Κρήτη',
  false,
  'Τουρισμός & Φιλοξενία',
  CURRENT_DATE,
  true, false, true, 'summer',
  '2025-05-01', '2025-10-31'
),
(
  'servitoros-mykonos-d4e5f',
  'Σερβιτόρος / Σερβιτόρα',
  'Mykonos Breeze Restaurant',
  '<p>Εστιατόριο στη Μύκονο αναζητά <strong>Σερβιτόρο/α</strong> για τη σεζόν Ιουνίου–Σεπτεμβρίου 2025.</p><ul><li>Εμπειρία σε εστίαση τουλάχιστον 1 έτος</li><li>Γνώση Αγγλικών</li><li>Ομαδικό πνεύμα</li></ul><h2>Παροχές</h2><ul><li>Στέγαση + γεύματα</li><li>Υψηλές αμοιβές + tips</li></ul>',
  'TEMPORARY',
  'Μύκονος',
  'Κυκλάδες',
  false,
  'Εστίαση',
  CURRENT_DATE,
  true, true, true, 'summer',
  '2025-06-01', '2025-09-30'
),
(
  'lifeguard-halkidiki-g6h7i',
  'Ναυαγοσώστης',
  'Poseidon Beach Resort Χαλκιδική',
  '<p>Θέση <strong>Ναυαγοσώστη</strong> σε beach resort στη Χαλκιδική για την καλοκαιρινή σεζόν 2025.</p><ul><li>Απαραίτητο δίπλωμα ναυαγοσωστικής</li><li>Πιστοποίηση Α'' Βοηθειών</li><li>Φυσική κατάσταση</li></ul>',
  'TEMPORARY',
  'Χαλκιδική',
  'Κεντρική Μακεδονία',
  false,
  'Άλλο',
  CURRENT_DATE,
  true, false, true, 'summer',
  '2025-06-01', '2025-08-31'
),
(
  'tamias-rhodes-j8k9l',
  'Ταμίας Σούπερ Μάρκετ',
  'Fresh Market Ρόδος',
  '<p>Σούπερ μάρκετ σε τουριστική περιοχή της Ρόδου ζητά <strong>Ταμία</strong> για τη σεζόν Μαΐου–Σεπτεμβρίου 2025.</p><ul><li>Εμπειρία σε ταμείο επιθυμητή</li><li>Γνώση Αγγλικών</li><li>Αξιοπιστία & ακρίβεια</li></ul>',
  'TEMPORARY',
  'Ρόδος',
  'Δωδεκάνησα',
  false,
  'Λιανεμπόριο',
  CURRENT_DATE,
  true, false, true, 'summer',
  '2025-05-01', '2025-09-30'
);

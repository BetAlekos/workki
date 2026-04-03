export interface WorkableCompany {
  slug: string
  name: string
}

export const WORKABLE_COMPANIES: WorkableCompany[] = [
  // ── Tech & Startups ────────────────────────────────────────────────────
  { slug: 'skroutz',          name: 'Skroutz' },
  { slug: 'e-food',           name: 'efood' },
  { slug: 'blueground',       name: 'Blueground' },
  { slug: 'epignosis',        name: 'Epignosis' },
  { slug: 'hack-the-box',     name: 'Hack The Box' },
  { slug: 'spotawheel',       name: 'Spotawheel' },
  { slug: 'flexcar',          name: 'Flexcar' },
  { slug: 'hellas-direct',    name: 'Hellas Direct' },
  { slug: 'omilia',           name: 'Omilia' },
  { slug: 'netdata',          name: 'Netdata' },
  { slug: 'volton',           name: 'Volton' },
  { slug: 'growthfund',       name: 'Growthfund' },
  { slug: 'foss-productions', name: 'Foss Productions' },
  { slug: 'xp-courier',       name: 'XP Courier' },
  { slug: 'apivita',          name: 'APIVITA' },

  // ── Retail & Consumer ──────────────────────────────────────────────────
  { slug: 'plaisio-careers',  name: 'Plaisio' },
  { slug: 'avis-greece',      name: 'AVIS Greece' },
  { slug: 'kotsovolos',       name: 'Kotsovolos' },
  { slug: 'public',           name: 'Public' },
  { slug: 'jumbo',            name: 'Jumbo' },
  { slug: 'ab-vassilopoulos', name: 'AB Βασιλόπουλος' },
  { slug: 'opap',             name: 'OPAP' },

  // ── Telecoms & Utilities ───────────────────────────────────────────────
  { slug: 'cosmote',          name: 'Cosmote' },

  // ── Banking & Finance ──────────────────────────────────────────────────
  { slug: 'eurobank',         name: 'Eurobank' },
  { slug: 'alpha-bank',       name: 'Alpha Bank' },
  { slug: 'piraeus-bank',     name: 'Piraeus Bank' },

  // ── Consulting & Professional Services ────────────────────────────────
  { slug: 'deloitte',         name: 'Deloitte' },
  { slug: 'pwc-greece',       name: 'PwC Greece' },
  { slug: 'accenture-greece', name: 'Accenture Greece' },
  { slug: 'kariera',          name: 'Kariera' },
  { slug: 'mandynamic',       name: 'Mandynamic' },

  // ── Global Tech (with Greek offices) ──────────────────────────────────
  { slug: 'oracle',           name: 'Oracle' },
  { slug: 'microsoft',        name: 'Microsoft' },
]

import type { EmploymentType } from '@/types'

export const JOB_CATEGORIES = [
  'Πληροφορική & Τεχνολογία',
  'Πωλήσεις & Marketing',
  'Λογιστική & Οικονομικά',
  'Τουρισμός & Φιλοξενία',
  'Εκπαίδευση',
  'Υγεία & Φαρμακευτική',
  'Κατασκευές & Τεχνικά',
  'Νομικά',
  'Διοίκηση & Γραμματεία',
  'Εστίαση',
  'Λιανεμπόριο',
  'Logistics & Αποθήκη',
  'Ναυτιλία',
  'Άλλο',
] as const

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: 'Πλήρης Απασχόληση',
  PART_TIME: 'Μερική Απασχόληση',
  CONTRACTOR: 'Ελεύθερος Επαγγελματίας',
  TEMPORARY: 'Προσωρινή',
  INTERN: 'Πρακτική Άσκηση',
  VOLUNTEER: 'Εθελοντισμός',
}

export const SALARY_PERIOD_LABELS: Record<string, string> = {
  HOUR: 'ανά ώρα',
  DAY: 'ανά ημέρα',
  WEEK: 'ανά εβδομάδα',
  MONTH: 'ανά μήνα',
  YEAR: 'ανά έτος',
}

export const GREEK_CITIES = [
  'Αθήνα',
  'Θεσσαλονίκη',
  'Πάτρα',
  'Ηράκλειο',
  'Λάρισα',
  'Βόλος',
  'Ρόδος',
  'Ιωάννινα',
  'Κέρκυρα',
  'Χανιά',
]

// Category slug mapping (Greek → URL-safe)
export const CATEGORY_SLUGS: Record<string, string> = {
  'Πληροφορική & Τεχνολογία': 'pliroforiki-technologia',
  'Πωλήσεις & Marketing': 'poliseis-marketing',
  'Λογιστική & Οικονομικά': 'logistiki-oikonomika',
  'Τουρισμός & Φιλοξενία': 'tourismos-filoxenia',
  'Εκπαίδευση': 'ekpaideysi',
  'Υγεία & Φαρμακευτική': 'ygeia-farmakeftiki',
  'Κατασκευές & Τεχνικά': 'kataskeyes-texnika',
  'Νομικά': 'nomika',
  'Διοίκηση & Γραμματεία': 'dioikisi-grammateia',
  'Εστίαση': 'estiasi',
  'Λιανεμπόριο': 'lianemporio',
  'Logistics & Αποθήκη': 'logistics-apothiki',
  'Ναυτιλία': 'naftilia',
  'Άλλο': 'allo',
}

// Reverse: slug → Greek category name
export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([cat, slug]) => [slug, cat])
)

// City SEO pages config
export interface CityPageConfig {
  name: string
  nameAccusative: string
  h1: string
  description: string
  filter: string | null
  isRemote?: boolean
}

export const CITY_PAGES: Record<string, CityPageConfig> = {
  athina: {
    name: 'Αθήνα',
    nameAccusative: 'Αθήνα',
    h1: 'Αγγελίες Εργασίας στην Αθήνα',
    description: 'Ανακάλυψε εκατοντάδες αγγελίες εργασίας στην Αθήνα. Από τεχνολογία και marketing έως υγεία και εκπαίδευση — βρες τη δουλειά που σου ταιριάζει στην ελληνική πρωτεύουσα.',
    filter: 'Αθήνα',
  },
  thessaloniki: {
    name: 'Θεσσαλονίκη',
    nameAccusative: 'Θεσσαλονίκη',
    h1: 'Αγγελίες Εργασίας στη Θεσσαλονίκη',
    description: 'Βρες αγγελίες εργασίας στη Θεσσαλονίκη. Η δεύτερη μεγαλύτερη πόλη της Ελλάδας προσφέρει πλούσιες ευκαιρίες καριέρας σε όλους τους κλάδους.',
    filter: 'Θεσσαλονίκη',
  },
  heraklion: {
    name: 'Ηράκλειο',
    nameAccusative: 'Ηράκλειο',
    h1: 'Αγγελίες Εργασίας στο Ηράκλειο',
    description: 'Αγγελίες εργασίας στο Ηράκλειο Κρήτης. Τουρισμός, εστίαση, εμπόριο και τεχνολογία — ανακάλυψε ευκαιρίες στη μεγαλύτερη πόλη της Κρήτης.',
    filter: 'Ηράκλειο',
  },
  patra: {
    name: 'Πάτρα',
    nameAccusative: 'Πάτρα',
    h1: 'Αγγελίες Εργασίας στην Πάτρα',
    description: 'Θέσεις εργασίας στην Πάτρα. Η τρίτη μεγαλύτερη πόλη της Ελλάδας με ισχυρή βιομηχανία, εμπόριο και ακμαία τοπική οικονομία.',
    filter: 'Πάτρα',
  },
  remote: {
    name: 'Εξ Αποστάσεως',
    nameAccusative: 'Εξ Αποστάσεως',
    h1: 'Αγγελίες Εξ Αποστάσεως Εργασίας',
    description: 'Βρες δουλειά εξ αποστάσεως (remote) από οποιοδήποτε σημείο της Ελλάδας ή του κόσμου. Πλήρης απασχόληση, μερική ή freelance — η τηλεργασία έχει άφθονες επιλογές.',
    filter: null,
    isRemote: true,
  },
}

// Season labels
export const SEASON_LABELS: Record<string, { label: string; emoji: string; monthRange: string }> = {
  spring: { label: 'Άνοιξη', emoji: '🌸', monthRange: 'Μαρ – Μάι' },
  summer: { label: 'Καλοκαίρι', emoji: '☀️', monthRange: 'Ιούν – Αύγ' },
  autumn: { label: 'Φθινόπωρο', emoji: '🍂', monthRange: 'Σεπ – Νοε' },
  winter: { label: 'Χειμώνας', emoji: '❄️', monthRange: 'Δεκ – Φεβ' },
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://workki.gr'
export const SITE_NAME = 'Workki'
export const SITE_DESCRIPTION =
  'Βρες τη δουλειά που σου ταιριάζει. Χιλιάδες αγγελίες εργασίας σε όλη την Ελλάδα.'

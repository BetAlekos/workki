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

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://workki.gr'
export const SITE_NAME = 'Workki'
export const SITE_DESCRIPTION =
  'Βρες τη δουλειά που σου ταιριάζει. Χιλιάδες αγγελίες εργασίας σε όλη την Ελλάδα.'

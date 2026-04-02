export type EmploymentType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACTOR'
  | 'TEMPORARY'
  | 'INTERN'
  | 'VOLUNTEER'

export type SalaryPeriod = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'

export interface Job {
  id: string
  slug: string
  title: string
  company_name: string
  company_website: string | null
  company_logo: string | null
  description: string
  employment_type: EmploymentType
  location_city: string | null
  location_region: string | null
  location_country: string
  is_remote: boolean
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  salary_period: SalaryPeriod | null
  category: string
  apply_url: string | null
  apply_email: string | null
  date_posted: string
  valid_through: string | null
  is_approved: boolean
  is_featured: boolean
  created_at: string
}

export interface Company {
  id: string
  slug: string
  name: string
  website: string | null
  logo: string | null
  description: string | null
  created_at: string
}

export interface EmailAlert {
  id: string
  email: string
  keywords: string[]
  categories: string[]
  created_at: string
  confirmed: boolean
}

export interface JobFilters {
  q?: string
  category?: string
  type?: string
  remote?: string
  location?: string
}

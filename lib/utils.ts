import type { EmploymentType, Job, SalaryPeriod } from '@/types'
import { EMPLOYMENT_TYPE_LABELS, SALARY_PERIOD_LABELS } from './constants'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateJobSlug(title: string, company: string): string {
  const base = slugify(`${title}-${company}`)
  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}

export function formatEmploymentType(type: EmploymentType): string {
  return EMPLOYMENT_TYPE_LABELS[type] || type
}

export function formatSalary(job: Job): string | null {
  if (!job.salary_min && !job.salary_max) return null
  const currency = job.salary_currency === 'EUR' ? '€' : job.salary_currency
  const period = job.salary_period ? ` ${SALARY_PERIOD_LABELS[job.salary_period]}` : ''

  if (job.salary_min && job.salary_max) {
    return `${currency}${job.salary_min.toLocaleString('el-GR')} – ${currency}${job.salary_max.toLocaleString('el-GR')}${period}`
  }
  if (job.salary_min) {
    return `από ${currency}${job.salary_min.toLocaleString('el-GR')}${period}`
  }
  return `έως ${currency}${job.salary_max!.toLocaleString('el-GR')}${period}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Σήμερα'
  if (days === 1) return 'Χθες'
  if (days < 7) return `${days} μέρες πριν`
  if (days < 30) return `${Math.floor(days / 7)} εβδομάδες πριν`
  return `${Math.floor(days / 30)} μήνες πριν`
}

export function isExpired(job: Job): boolean {
  if (!job.valid_through) return false
  return new Date(job.valid_through) < new Date()
}

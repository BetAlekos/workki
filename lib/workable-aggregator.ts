import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { WORKABLE_COMPANIES } from './workable-companies'
import { detectCategory } from './detect-category'

// ── Types ──────────────────────────────────────────────────────────────────

interface WorkableJob {
  id: number
  shortcode: string
  title: string
  remote: boolean
  location: {
    country?: string
    countryCode?: string
    city?: string
    region?: string
  }
  published: string      // ISO date
  type: string           // "full" | "part" | "contract" | "temp" | "intern"
  department?: string[]
  workplace?: string     // "on_site" | "remote" | "hybrid"
}

interface WorkableListResponse {
  total: number
  results: WorkableJob[]
}

// ── Employment type mapping ────────────────────────────────────────────────

const EMPLOYMENT_MAP: Record<string, string> = {
  full: 'FULL_TIME',
  full_time: 'FULL_TIME',
  part: 'PART_TIME',
  part_time: 'PART_TIME',
  contract: 'CONTRACTOR',
  temp: 'TEMPORARY',
  temporary: 'TEMPORARY',
  intern: 'INTERN',
  internship: 'INTERN',
  volunteer: 'VOLUNTEER',
}

function mapType(raw: string): string {
  return EMPLOYMENT_MAP[raw?.toLowerCase()] ?? 'FULL_TIME'
}

// ── Slug ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function makeSlug(title: string, companySlug: string, shortcode: string): string {
  const base = slugify(`${title}-${companySlug}`)
  const sc = shortcode.toLowerCase()
  return `${base}-${sc}`
}

// ── Fetch helpers ─────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, opts: RequestInit = {}, ms = 10_000): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal })
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Verify a company exists on Workable by probing the JSON API.
 * Returns true if the company account is found (200 or has jobs).
 */
export async function verifyCompany(slug: string): Promise<boolean> {
  const url = `https://apply.workable.com/api/v3/accounts/${slug}/jobs`
  try {
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '' }),
    }, 8_000)
    return res.ok
  } catch {
    return false
  }
}

/**
 * Fetch job list from Workable public JSON API.
 * Returns null on 404 (company not on Workable).
 */
async function fetchCompanyJobs(slug: string): Promise<WorkableJob[] | null> {
  const url = `https://apply.workable.com/api/v3/accounts/${slug}/jobs`
  let res: Response
  try {
    res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '' }),
    })
  } catch {
    throw new Error('Network/timeout error')
  }

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const data: WorkableListResponse = await res.json()
  return data.results ?? []
}

/**
 * Scrape the truncated meta description from the Workable job page.
 * Returns a fallback HTML string if scraping fails.
 */
async function fetchJobDescription(companySlug: string, shortcode: string, title: string, companyName: string): Promise<string> {
  const jobUrl = `https://apply.workable.com/${companySlug}/j/${shortcode}/`
  try {
    const res = await fetchWithTimeout(jobUrl, {}, 8_000)
    if (!res.ok) throw new Error('non-ok')
    const html = await res.text()
    const match = html.match(/<meta name="description" content="([^"]+)"/)
    if (match?.[1]) {
      const desc = match[1].trim()
      return `<p>${desc}</p><p><a href="${jobUrl}" target="_blank" rel="noopener noreferrer">Δες την πλήρη αγγελία στο Workable →</a></p>`
    }
  } catch {
    // fall through to placeholder
  }
  return `<p><strong>${title}</strong> — ${companyName}</p><p><a href="${jobUrl}" target="_blank" rel="noopener noreferrer">Δες την πλήρη αγγελία στο Workable →</a></p>`
}

// ── Valid-through date: 60 days from now ──────────────────────────────────

function validThrough(): string {
  const d = new Date()
  d.setDate(d.getDate() + 60)
  return d.toISOString().split('T')[0]
}

// ── Core aggregator ───────────────────────────────────────────────────────

export interface AggregatorResult {
  added: number
  skipped: number
  errors: string[]
}

export async function runAggregator(
  log: (msg: string) => void = console.log,
  companies = WORKABLE_COMPANIES
): Promise<AggregatorResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, serviceKey)

  let added = 0
  let skipped = 0
  const errors: string[] = []

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i]
    // Polite delay between companies (skip before first)
    if (i > 0) await new Promise((r) => setTimeout(r, 800))

    let jobs: WorkableJob[] | null
    try {
      jobs = await fetchCompanyJobs(company.slug)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      log(`⚠ ${company.name}: ${msg}`)
      errors.push(`${company.slug}: ${msg}`)
      continue
    }

    if (jobs === null) {
      // Company not found on Workable — skip silently
      continue
    }

    if (jobs.length === 0) {
      log(`  ${company.name}: no open positions`)
      continue
    }

    log(`  ${company.name}: ${jobs.length} open position(s)`)

    for (const job of jobs) {
      const applyUrl = `https://apply.workable.com/${company.slug}/j/${job.shortcode}/`

      // Deduplicate by apply_url
      const { data: existing } = await supabase
        .from('jobs')
        .select('id')
        .eq('apply_url', applyUrl)
        .maybeSingle()

      if (existing) {
        log(`  → Skipped: ${job.title}`)
        skipped++
        continue
      }

      const department = (job.department ?? []).join(' ')
      const category = detectCategory(job.title, department)

      const isRemote =
        job.remote === true ||
        job.workplace === 'remote'

      const description = await fetchJobDescription(company.slug, job.shortcode, job.title, company.name)

      const record = {
        slug: makeSlug(job.title, company.slug, job.shortcode),
        title: job.title.trim(),
        company_name: company.name,
        description,
        employment_type: mapType(job.type),
        category,
        location_city: job.location?.city ?? null,
        location_region: job.location?.region ?? null,
        location_country: job.location?.countryCode ?? 'GR',
        is_remote: isRemote,
        apply_url: applyUrl,
        date_posted: job.published.split('T')[0],
        valid_through: validThrough(),
        is_approved: true,
        is_featured: false,
        is_seasonal: false,
        salary_currency: 'EUR',
        salary_period: 'MONTH',
      }

      const { error } = await supabase.from('jobs').insert(record)

      if (error) {
        log(`  ✗ Insert failed: ${job.title} — ${error.message}`)
        errors.push(`${company.slug}/${job.shortcode}: ${error.message}`)
        continue
      }

      log(`  ✓ Added: ${job.title} @ ${company.name}`)
      added++
    }
  }

  return { added, skipped, errors }
}

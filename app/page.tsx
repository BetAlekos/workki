import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JobCard from '@/components/JobCard'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import StatsBar from '@/components/StatsBar'
import { createClient } from '@/lib/supabase/server'
import type { Job, JobFilters } from '@/types'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, CITY_PAGES, CATEGORY_SLUGS, JOB_CATEGORIES } from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
  description: SITE_DESCRIPTION,
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: 'Αγγελίες εργασίας στην Ελλάδα',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

// ── Data fetchers ─────────────────────────────────────────────────────────

async function getJobs(filters: JobFilters): Promise<Job[]> {
  const supabase = await createClient()
  let query = supabase
    .from('jobs').select('*').eq('is_approved', true)
    .or('valid_through.is.null,valid_through.gt.' + new Date().toISOString())
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  if (filters.q) query = query.or(`title.ilike.%${filters.q}%,company_name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`)
  if (filters.category) query = query.eq('category', filters.category)
  if (filters.type) query = query.eq('employment_type', filters.type)
  if (filters.remote === 'true') query = query.eq('is_remote', true)
  else if (filters.remote === 'false') query = query.eq('is_remote', false)
  if (filters.location) query = query.ilike('location_city', `%${filters.location}%`)

  const { data } = await query
  return (data as Job[]) || []
}

async function getSeasonalJobs(): Promise<Job[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('jobs').select('*').eq('is_approved', true).eq('is_seasonal', true)
    .order('is_featured', { ascending: false }).order('created_at', { ascending: false }).limit(3)
  return (data as Job[]) || []
}

async function getJobCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('jobs').select('*', { count: 'exact', head: true }).eq('is_approved', true)
  return count ?? 0
}

async function getCompanyCount(): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase.from('jobs').select('company_name').eq('is_approved', true)
  return new Set((data || []).map((r: { company_name: string }) => r.company_name)).size
}

// ── Trust bar data ─────────────────────────────────────────────────────────

const TRUST_COMPANIES = [
  { name: 'Skroutz',     color: 'bg-orange-100 text-orange-700' },
  { name: 'Blueground',  color: 'bg-blue-100 text-blue-700' },
  { name: 'Eurobank',    color: 'bg-sky-100 text-sky-700' },
  { name: 'Upstream',    color: 'bg-purple-100 text-purple-700' },
  { name: 'Spotawheel',  color: 'bg-green-100 text-green-700' },
  { name: 'efood',       color: 'bg-red-100 text-red-700' },
  { name: 'Epignosis',   color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Hack The Box','color': 'bg-emerald-100 text-emerald-700' },
  { name: 'AVIS Greece', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Volton',      color: 'bg-teal-100 text-teal-700' },
  { name: 'Mandynamic',  color: 'bg-pink-100 text-pink-700' },
  { name: 'Omilia',      color: 'bg-violet-100 text-violet-700' },
]

// ── Page ──────────────────────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: JobFilters = {
    q: params.q, category: params.category, type: params.type,
    remote: params.remote, location: params.location,
  }

  const [jobs, seasonalJobs, jobCount, companyCount] = await Promise.all([
    getJobs(filters), getSeasonalJobs(), getJobCount(), getCompanyCount(),
  ])

  const featured = jobs.filter((j) => j.is_featured && !j.is_seasonal)
  const regular  = jobs.filter((j) => !j.is_featured && !j.is_seasonal)
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Navbar />

      <main className="flex-1">

        {/* ── Split Hero ───────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-18">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* Left — Job seekers */}
              <div>
                <h1 className="text-3xl sm:text-5xl font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-bricolage)' }}>
                  Βρες τη δουλειά
                  <br />
                  <span className="text-brand-300">που αξίζεις.</span>
                </h1>
                <p className="text-brand-200 text-lg mb-6 max-w-lg">
                  {jobCount}+ αγγελίες από τις καλύτερες εταιρείες της Ελλάδας. Ανανεώνεται καθημερινά.
                </p>
                <Suspense>
                  <SearchBar />
                </Suspense>
              </div>

              {/* Right — Employers */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8">
                <p className="text-brand-300 text-xs font-semibold uppercase tracking-wider mb-3">Για εργοδότες</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
                  Ψάχνεις υπάλληλο;
                </h2>
                <p className="text-brand-200 text-base mb-6">
                  Δημοσίευσε δωρεάν και εμφανίσου αυτόματα στο{' '}
                  <span className="text-white font-semibold">Google Jobs</span>.
                </p>
                <Link
                  href="/submit"
                  className="inline-block w-full text-center bg-amber-400 text-amber-900 font-bold py-3 px-6 rounded-xl hover:bg-amber-300 transition-colors text-base"
                >
                  Δημοσίευσε Δωρεάν →
                </Link>
                <p className="text-brand-300 text-xs mt-3 text-center">
                  Χωρίς κόστος. Χωρίς λογαριασμό.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── Trust Bar ────────────────────────────────────────────────── */}
        <section className="bg-slate-50 border-b border-slate-200 overflow-hidden py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-2">
            <p className="text-xs text-slate-400 font-medium text-center sm:text-left">
              Αγγελίες από:
            </p>
          </div>
          <div className="overflow-hidden">
            <div className="flex gap-3 animate-marquee whitespace-nowrap px-4">
              {[...TRUST_COMPANIES, ...TRUST_COMPANIES].map((c, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shrink-0 ${c.color}`}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center mt-2">και άλλες {Math.max(companyCount - TRUST_COMPANIES.length, 10)}+ εταιρείες</p>
        </section>

        {/* ── Stats Bar ────────────────────────────────────────────────── */}
        <StatsBar jobCount={jobCount} companyCount={companyCount} />

        {/* ── Quick links — cities + categories ────────────────────────── */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-400 font-medium shrink-0">Πόλεις:</span>
              {Object.entries(CITY_PAGES).map(([slug, city]) => (
                <Link key={slug} href={`/jobs/${slug}`}
                  className="text-xs text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-full transition-colors font-medium">
                  {city.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-400 font-medium shrink-0">Κατηγορίες:</span>
              {JOB_CATEGORIES.map((cat) => (
                <Link key={cat} href={`/jobs/category/${CATEGORY_SLUGS[cat]}`}
                  className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-colors">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Employer Value Proposition ───────────────────────────────── */}
        {!hasFilters && (
          <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">Για εργοδότες</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-bricolage)' }}>
                  Γιατί να διαλέξεις το Workki;
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {/* Col 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">💸</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
                    Δωρεάν για πάντα
                  </h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Καμία χρέωση για βασική αγγελία.</p>
                    <div className="mt-3 space-y-1.5 text-left bg-slate-50 rounded-xl p-3">
                      <p className="flex justify-between"><span className="text-slate-500">Kariera.gr</span><span className="font-semibold text-red-600">έως €180</span></p>
                      <p className="flex justify-between"><span className="text-slate-500">Skywalker</span><span className="font-semibold text-red-600">€90+</span></p>
                      <p className="flex justify-between border-t border-slate-200 pt-1.5 mt-1.5"><span className="font-semibold text-slate-900">Workki</span><span className="font-bold text-green-600">€0</span></p>
                    </div>
                  </div>
                </div>

                {/* Col 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
                    Google Jobs
                  </h3>
                  <p className="text-sm text-slate-600">
                    Κάθε αγγελία εμφανίζεται αυτόματα στο Google Jobs με structured data (JSON-LD).
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Περισσότερες εμφανίσεις, περισσότεροι υποψήφιοι — χωρίς να κάνεις τίποτα.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
                    ✓ Αυτόματα σε 48 ώρες
                  </div>
                </div>

                {/* Col 3 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
                    2 λεπτά
                  </h3>
                  <p className="text-sm text-slate-600">
                    Δημοσίευσε σε 2 λεπτά. Χωρίς λογαριασμό, χωρίς γραφειοκρατία.
                  </p>
                  <p className="text-sm text-slate-600 mt-2">
                    Απλά συμπλήρωσε τη φόρμα και η αγγελία σου είναι live μέσα σε 24 ώρες.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                    ✓ Χωρίς λογαριασμό
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link
                  href="/submit"
                  className="inline-block bg-amber-400 text-amber-900 font-bold py-4 px-8 rounded-xl hover:bg-amber-300 transition-colors text-lg shadow-sm"
                >
                  Δημοσίευσε την Αγγελία σου Τώρα — Δωρεάν
                </Link>
                <p className="text-xs text-slate-500 mt-3">
                  Ήδη {jobCount} αγγελίες από Skroutz, Eurobank, Blueground και άλλες
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Content / Listings ───────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-5">
            <Suspense>
              <FilterBar />
            </Suspense>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {jobs.length > 0 ? (
                <><span className="font-semibold text-slate-800">{jobs.length}</span> αγγελίες{hasFilters && ' βρέθηκαν'}</>
              ) : 'Δεν βρέθηκαν αγγελίες'}
            </p>
          </div>

          {/* Featured */}
          {!hasFilters && featured.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-featured-600 uppercase tracking-wider mb-3">
                ★ Προτεινόμενες αγγελίες
              </h2>
              <div className="space-y-3">
                {featured.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
              {(seasonalJobs.length > 0 || regular.length > 0) && <div className="border-t border-slate-200 mt-6 mb-4" />}
            </div>
          )}

          {/* Seasonal teaser */}
          {!hasFilters && seasonalJobs.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-seasonal-600 uppercase tracking-wider">
                  ☀️ Εποχιακές Θέσεις 2025
                </h2>
                <Link href="/seasonal" className="text-sm text-seasonal-600 hover:text-seasonal-500 font-medium transition-colors">
                  Δες όλες →
                </Link>
              </div>
              <div className="space-y-3">
                {seasonalJobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
              {regular.length > 0 && <div className="border-t border-slate-200 mt-6 mb-4" />}
            </div>
          )}

          {/* Regular */}
          {(hasFilters ? jobs : regular).length > 0 ? (
            <div className="space-y-3">
              {(hasFilters ? jobs : regular).map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-medium text-slate-600 mb-1">Δεν βρέθηκαν αγγελίες</p>
              <p className="text-sm">Δοκίμασε διαφορετικά κριτήρια αναζήτησης.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}

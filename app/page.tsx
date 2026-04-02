import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JobCard from '@/components/JobCard'
import SearchBar from '@/components/SearchBar'
import FilterBar from '@/components/FilterBar'
import { createClient } from '@/lib/supabase/server'
import type { Job, JobFilters } from '@/types'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
  description: SITE_DESCRIPTION,
}

async function getJobs(filters: JobFilters): Promise<Job[]> {
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select('*')
    .eq('is_approved', true)
    .or('valid_through.is.null,valid_through.gt.' + new Date().toISOString())
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,company_name.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
    )
  }
  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.type) {
    query = query.eq('employment_type', filters.type)
  }
  if (filters.remote === 'true') {
    query = query.eq('is_remote', true)
  } else if (filters.remote === 'false') {
    query = query.eq('is_remote', false)
  }
  if (filters.location) {
    query = query.ilike('location_city', `%${filters.location}%`)
  }

  const { data } = await query
  return (data as Job[]) || []
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: JobFilters = {
    q: params.q,
    category: params.category,
    type: params.type,
    remote: params.remote,
    location: params.location,
  }

  const jobs = await getJobs(filters)
  const featured = jobs.filter((j) => j.is_featured)
  const regular = jobs.filter((j) => !j.is_featured)
  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
            <h1
              className="text-3xl sm:text-5xl font-bold mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Βρες τη δουλειά
              <br />
              <span className="text-brand-300">που σου ταιριάζει.</span>
            </h1>
            <p className="text-brand-200 text-lg mb-8 max-w-xl">
              Χιλιάδες αγγελίες εργασίας σε όλη την Ελλάδα. Ανανεώνεται καθημερινά.
            </p>
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-5">
            <Suspense>
              <FilterBar />
            </Suspense>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {jobs.length > 0 ? (
                <>
                  <span className="font-semibold text-slate-800">{jobs.length}</span> αγγελίες
                  {hasFilters && ' βρέθηκαν'}
                </>
              ) : (
                'Δεν βρέθηκαν αγγελίες'
              )}
            </p>
          </div>

          {/* Featured jobs */}
          {!hasFilters && featured.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-featured-600 uppercase tracking-wider mb-3">
                ★ Προτεινόμενες αγγελίες
              </h2>
              <div className="space-y-3">
                {featured.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              {regular.length > 0 && (
                <div className="border-t border-slate-200 mt-6 mb-4" />
              )}
            </div>
          )}

          {/* Regular jobs */}
          {(hasFilters ? jobs : regular).length > 0 ? (
            <div className="space-y-3">
              {(hasFilters ? jobs : regular).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
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

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JobCard from '@/components/JobCard'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/types'
import type { CityPageConfig } from '@/lib/constants'
import { SITE_URL, SITE_NAME, JOB_CATEGORIES, CATEGORY_SLUGS } from '@/lib/constants'

interface Props {
  citySlug: string
  config: CityPageConfig
}

async function getCityJobs(config: CityPageConfig): Promise<Job[]> {
  const supabase = await createClient()
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('is_approved', true)
    .or('valid_through.is.null,valid_through.gt.' + new Date().toISOString())
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  if (config.isRemote) {
    query = query.eq('is_remote', true)
  } else if (config.filter) {
    query = query.ilike('location_city', `%${config.filter}%`)
  }

  const { data } = await query
  return (data as Job[]) || []
}

export default async function CityJobsPage({ citySlug, config }: Props) {
  const jobs = await getCityJobs(config)
  const url = `${SITE_URL}/jobs/${citySlug}`

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Αγγελίες εργασίας', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 3, name: config.h1, item: url },
    ],
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.h1,
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 10).map((job, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/jobs/${job.slug}`,
      name: job.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <nav className="flex items-center gap-1 text-xs text-brand-300 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Workki</Link>
              <span>/</span>
              <Link href="/" className="hover:text-white transition-colors">Αγγελίες</Link>
              <span>/</span>
              <span className="text-white">{config.name}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
              {config.h1}
            </h1>
            <p className="text-brand-200 text-base max-w-2xl">{config.description}</p>
            {jobs.length > 0 && (
              <p className="text-brand-300 text-sm mt-3">
                <span className="font-bold text-white">{jobs.length}</span> διαθέσιμες θέσεις
              </p>
            )}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Listings */}
            <div className="lg:col-span-3">
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job) => <JobCard key={job.id} job={job} />)}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-lg font-medium text-slate-600 mb-1">Δεν βρέθηκαν αγγελίες</p>
                  <p className="text-sm mb-4">Νέες αγγελίες προστίθενται καθημερινά.</p>
                  <Link href="/" className="text-sm text-brand-800 hover:text-brand-900 font-medium">
                    Δες όλες τις αγγελίες →
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
                  Άλλες πόλεις
                </h2>
                <ul className="space-y-1.5">
                  {[
                    { label: 'Αθήνα', href: '/jobs/athina' },
                    { label: 'Θεσσαλονίκη', href: '/jobs/thessaloniki' },
                    { label: 'Ηράκλειο', href: '/jobs/heraklion' },
                    { label: 'Πάτρα', href: '/jobs/patra' },
                    { label: 'Εξ αποστάσεως', href: '/jobs/remote' },
                  ].filter(c => !c.href.includes(citySlug)).map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="text-sm text-brand-800 hover:text-brand-900 transition-colors">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
                  Κατηγορίες
                </h2>
                <ul className="space-y-1.5">
                  {JOB_CATEGORIES.slice(0, 7).map((cat) => (
                    <li key={cat}>
                      <Link href={`/jobs/category/${CATEGORY_SLUGS[cat]}`} className="text-sm text-slate-600 hover:text-brand-800 transition-colors">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JobCard from '@/components/JobCard'
import { createClient } from '@/lib/supabase/server'
import type { Job, Season } from '@/types'
import { SITE_URL, SITE_NAME, SEASON_LABELS } from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `Εποχιακές Αγγελίες Εργασίας 2025 | ${SITE_NAME}`,
  description: 'Βρες εποχιακές θέσεις εργασίας σε τουρισμό, εστίαση, ξενοδοχεία και νησιά. Καλοκαιρινές αγγελίες σε Κρήτη, Μύκονο, Ρόδο, Σαντορίνη και Χαλκιδική.',
  alternates: { canonical: `${SITE_URL}/seasonal` },
  openGraph: {
    title: `Εποχιακές Αγγελίες 2025 | ${SITE_NAME}`,
    description: 'Εποχιακές θέσεις εργασίας σε τουρισμό, ξενοδοχεία και εστίαση σε όλη την Ελλάδα.',
    url: `${SITE_URL}/seasonal`,
    type: 'website',
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
}

async function getSeasonalJobs(season?: Season): Promise<Job[]> {
  const supabase = await createClient()
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('is_approved', true)
    .eq('is_seasonal', true)
    .or('valid_through.is.null,valid_through.gt.' + new Date().toISOString())
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  if (season) query = query.eq('season', season)

  const { data } = await query
  return (data as Job[]) || []
}

const SEASONAL_HUBS = [
  { label: '☀️ Καλοκαιρινές', href: '/seasonal/kalokairini', desc: 'Θέσεις Ιούν–Αύγ' },
  { label: '🏝 Νησιά', href: '/seasonal/nisia', desc: 'Κρήτη, Ρόδος, Μύκονος' },
  { label: '✈️ Τουρισμός', href: '/seasonal/tourismos', desc: 'Ξενοδοχεία & εστίαση' },
  { label: '🫒 Κρήτη', href: '/seasonal/kritis', desc: 'Εποχιακές θέσεις Κρήτης' },
  { label: '🌊 Χαλκιδική', href: '/seasonal/xalkidiki', desc: 'Εποχιακές θέσεις Χαλκιδικής' },
]

export default async function SeasonalPage() {
  const jobs = await getSeasonalJobs()

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Αγγελίες', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 3, name: 'Εποχιακές Αγγελίες', item: `${SITE_URL}/seasonal` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-seasonal-600 via-seasonal-500 to-orange-400 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
            <nav className="flex items-center gap-1 text-xs text-orange-100 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Workki</Link>
              <span>/</span>
              <span className="text-white">Εποχιακές Αγγελίες</span>
            </nav>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3 leading-tight" style={{ fontFamily: 'var(--font-bricolage)' }}>
              ☀️ Εποχιακές Θέσεις
              <br />
              <span className="text-orange-100">Εργασίας 2025</span>
            </h1>
            <p className="text-orange-50 text-lg mb-6 max-w-xl">
              Τουρισμός, ξενοδοχεία, εστίαση και νησιά — χιλιάδες εποχιακές αγγελίες για το καλοκαίρι του 2025.
            </p>
            {jobs.length > 0 && (
              <p className="text-orange-100 text-sm">
                <span className="font-bold text-white">{jobs.length}</span> εποχιακές θέσεις διαθέσιμες
              </p>
            )}
          </div>
        </section>

        {/* Hub links */}
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {SEASONAL_HUBS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="flex flex-col items-center text-center p-4 rounded-xl border border-seasonal-200 bg-seasonal-50 hover:bg-seasonal-100 transition-colors"
                >
                  <span className="font-semibold text-seasonal-700 text-sm">{hub.label}</span>
                  <span className="text-xs text-slate-500 mt-1">{hub.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Listings */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-lg font-bold text-slate-800 mb-4" style={{ fontFamily: 'var(--font-bricolage)' }}>
                Όλες οι εποχιακές αγγελίες
              </h2>
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job) => <JobCard key={job.id} job={job} />)}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-lg font-medium text-slate-600 mb-1">Δεν βρέθηκαν εποχιακές αγγελίες</p>
                  <p className="text-sm mb-4">Νέες αγγελίες προστίθενται καθημερινά.</p>
                  <Link href="/" className="text-sm text-brand-800 hover:text-brand-900 font-medium">
                    Δες όλες τις αγγελίες →
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="bg-seasonal-50 rounded-xl border border-seasonal-200 p-4">
                <h3 className="text-sm font-semibold text-seasonal-700 mb-3">Εποχές</h3>
                <ul className="space-y-2">
                  {Object.entries(SEASON_LABELS).map(([key, val]) => (
                    <li key={key}>
                      <span className="text-sm text-slate-600">
                        {val.emoji} {val.label}
                        <span className="text-xs text-slate-400 ml-1">({val.monthRange})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Δημοφιλή προορισμοί</h3>
                <ul className="space-y-1.5">
                  {[
                    { label: 'Κρήτη', href: '/seasonal/kritis' },
                    { label: 'Νησιά Αιγαίου', href: '/seasonal/nisia' },
                    { label: 'Χαλκιδική', href: '/seasonal/xalkidiki' },
                    { label: 'Τουρισμός & Ξενοδοχεία', href: '/seasonal/tourismos' },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-brand-800 hover:text-brand-900 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-900 text-white rounded-xl p-4">
                <p className="text-sm font-semibold mb-1">Δημοσίευσε αγγελία</p>
                <p className="text-xs text-brand-200 mb-3">Βρες εποχιακό προσωπικό γρήγορα.</p>
                <Link
                  href="/submit"
                  className="block text-center text-sm bg-white text-brand-900 font-semibold px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  + Νέα αγγελία
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

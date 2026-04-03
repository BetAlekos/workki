import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JobCard from '@/components/JobCard'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/types'
import { SITE_URL, SITE_NAME } from '@/lib/constants'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `Εποχιακές Αγγελίες Νησιά Ελλάδας 2025 | ${SITE_NAME}`,
  description: 'Εποχιακή εργασία σε ελληνικά νησιά. Μύκονος, Σαντορίνη, Ρόδος, Κέρκυρα, Ζάκυνθος — ξενοδοχεία, beach bars και τουρισμός.',
  alternates: { canonical: `${SITE_URL}/seasonal/nisia` },
}

const ISLAND_CITIES = ['Μύκονος', 'Σαντορίνη', 'Ρόδος', 'Κέρκυρα', 'Ζάκυνθος', 'Νάξος', 'Πάρος', 'Ίος', 'Σκιάθος', 'Λέσβος']

async function getJobs(): Promise<Job[]> {
  const supabase = await createClient()
  const orClause = ISLAND_CITIES.map((c) => `location_city.ilike.%${c}%`).join(',')
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_approved', true)
    .eq('is_seasonal', true)
    .or(orClause)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)
  return (data as Job[]) || []
}

export default async function NisiaPage() {
  const jobs = await getJobs()

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-seasonal-600 via-seasonal-500 to-orange-400 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <nav className="flex items-center gap-1 text-xs text-orange-100 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Workki</Link>
              <span>/</span>
              <Link href="/seasonal" className="hover:text-white transition-colors">Εποχιακές</Link>
              <span>/</span>
              <span className="text-white">Νησιά</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
              🏝 Εποχιακές Αγγελίες σε Νησιά
            </h1>
            <p className="text-orange-50 text-base max-w-2xl">
              Μύκονος, Σαντορίνη, Ρόδος, Κέρκυρα, Νάξος και άλλα νησιά — δουλειά στον παράδεισο για το καλοκαίρι 2025.
            </p>
            {jobs.length > 0 && (
              <p className="text-orange-100 text-sm mt-3">
                <span className="font-bold text-white">{jobs.length}</span> θέσεις σε νησιά
              </p>
            )}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg font-medium text-slate-600 mb-1">Δεν βρέθηκαν αγγελίες για νησιά</p>
              <Link href="/seasonal" className="text-sm text-seasonal-600 font-medium">← Όλες οι εποχιακές</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

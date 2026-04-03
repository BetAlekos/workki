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
  title: `Καλοκαιρινές Αγγελίες Εργασίας 2025 | ${SITE_NAME}`,
  description: 'Καλοκαιρινές θέσεις εργασίας Ιούνιο–Αύγουστο 2025. Ξενοδοχεία, beach bars, εστιατόρια, τουρισμός και εποχιακή απασχόληση σε όλη την Ελλάδα.',
  alternates: { canonical: `${SITE_URL}/seasonal/kalokairini` },
}

async function getJobs(): Promise<Job[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_approved', true)
    .eq('is_seasonal', true)
    .eq('season', 'summer')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)
  return (data as Job[]) || []
}

export default async function KalokairiniPage() {
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
              <span className="text-white">Καλοκαιρινές</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
              ☀️ Καλοκαιρινές Αγγελίες 2025
            </h1>
            <p className="text-orange-50 text-base max-w-2xl">
              Εποχιακές θέσεις Ιούν–Αύγ 2025. Ξενοδοχεία, beach bars, εστιατόρια και τουριστικές επιχειρήσεις σε όλη την Ελλάδα.
            </p>
            {jobs.length > 0 && (
              <p className="text-orange-100 text-sm mt-3">
                <span className="font-bold text-white">{jobs.length}</span> καλοκαιρινές θέσεις
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
              <p className="text-lg font-medium text-slate-600 mb-1">Δεν βρέθηκαν καλοκαιρινές αγγελίες</p>
              <Link href="/seasonal" className="text-sm text-seasonal-600 font-medium">← Όλες οι εποχιακές</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

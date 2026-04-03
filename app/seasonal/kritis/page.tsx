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
  title: `Εποχιακές Αγγελίες Εργασίας Κρήτη 2025 | ${SITE_NAME}`,
  description: 'Εποχιακές θέσεις εργασίας στην Κρήτη. Ηράκλειο, Χανιά, Ρέθυμνο, Αγ. Νικόλαος — ξενοδοχεία, εστιατόρια και τουριστικές επιχειρήσεις.',
  alternates: { canonical: `${SITE_URL}/seasonal/kritis` },
}

const CRETE_CITIES = ['Ηράκλειο', 'Χανιά', 'Ρέθυμνο', 'Αγ. Νικόλαος', 'Ιεράπετρα', 'Σητεία']

async function getJobs(): Promise<Job[]> {
  const supabase = await createClient()
  const orClause = CRETE_CITIES.map((c) => `location_city.ilike.%${c}%`).join(',')
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

export default async function KritisPage() {
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
              <span className="text-white">Κρήτη</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-bricolage)' }}>
              🫒 Εποχιακές Αγγελίες στην Κρήτη
            </h1>
            <p className="text-orange-50 text-base max-w-2xl">
              Θέσεις εργασίας σε Ηράκλειο, Χανιά, Ρέθυμνο και όλη την Κρήτη. Ξενοδοχεία, εστίαση και τουριστικές επιχειρήσεις για το 2025.
            </p>
            {jobs.length > 0 && (
              <p className="text-orange-100 text-sm mt-3">
                <span className="font-bold text-white">{jobs.length}</span> θέσεις στην Κρήτη
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
              <p className="text-lg font-medium text-slate-600 mb-1">Δεν βρέθηκαν αγγελίες για Κρήτη</p>
              <Link href="/seasonal" className="text-sm text-seasonal-600 font-medium">← Όλες οι εποχιακές</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

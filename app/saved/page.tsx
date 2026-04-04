'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JobCard from '@/components/JobCard'
import type { Job } from '@/types'
import { getSavedIds } from '@/components/SaveButton'

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = getSavedIds()
    if (ids.length === 0) {
      setLoading(false)
      return
    }
    fetch(`/api/saved?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((data) => setJobs(data.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-bricolage)' }}>
            ❤️ Αποθηκευμένες αγγελίες
          </h1>
          {jobs.length > 0 && (
            <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
              {jobs.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p className="text-5xl mb-4">🤍</p>
            <p className="text-lg font-medium text-slate-600 mb-2">
              Δεν έχεις αποθηκεύσει αγγελίες ακόμα
            </p>
            <p className="text-sm mb-6">Πάτα το ❤️ σε μια αγγελία για να την αποθηκεύσεις</p>
            <Link
              href="/"
              className="inline-block bg-brand-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-800 transition-colors text-sm"
            >
              Δες όλες τις αγγελίες →
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

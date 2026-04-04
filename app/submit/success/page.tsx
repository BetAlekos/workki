import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Επιτυχής Υποβολή | ${SITE_NAME}`,
  robots: { index: false },
}

export default function SubmitSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            Η αγγελία σου υποβλήθηκε!
          </h1>
          <p className="text-slate-600 text-base mb-2">
            Λάβαμε την πληρωμή σου και η αγγελία σου είναι στην ουρά έγκρισης.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Θα είναι live ως <strong>Featured</strong> εντός 24 ωρών.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left text-sm text-amber-800 space-y-1.5">
            <p className="font-semibold">Τι γίνεται τώρα:</p>
            <p>✅ Η πληρωμή καταγράφηκε</p>
            <p>⏳ Η ομάδα μας ελέγχει την αγγελία (εντός 24ω)</p>
            <p>🚀 Δημοσίευση ως Featured — εμφανίζεται πρώτη</p>
            <p>🔍 Ευρετηρίαση στο Google Jobs σε 48 ώρες</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-block bg-brand-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-800 transition-colors text-sm"
            >
              Δες τις αγγελίες →
            </Link>
            <Link
              href="/submit"
              className="inline-block bg-white border border-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Δημοσίευσε άλλη →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

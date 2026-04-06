import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Γιατί Workki | Η ιστορία μας | ${SITE_NAME}`,
  description:
    'Φτιαγμένο από επιχειρηματίες για επιχειρηματίες. Δωρεάν αγγελίες εργασίας για κάθε ελληνική επιχείρηση.',
  alternates: { canonical: `${SITE_URL}/about` },
}

const COMPARISON = [
  { feature: 'Βασική αγγελία',    kariera: '€180',   skywalker: '€90',   myjob: '€45,99',  workki: '€0' },
  { feature: 'Featured αγγελία',  kariera: '€350+',  skywalker: '€180+', myjob: '€125,99', workki: '€19,99' },
  { feature: 'Google Jobs',       kariera: '✅',      skywalker: '✅',    myjob: '❌',       workki: '✅' },
  { feature: 'Χωρίς λογαριασμό', kariera: '❌',      skywalker: '❌',    myjob: '❌',       workki: '✅' },
  { feature: 'Εποχιακές',         kariera: '❌',      skywalker: '✅',    myjob: '❌',       workki: '✅' },
  { feature: 'Γρήγορη Αίτηση',   kariera: '❌',      skywalker: '❌',    myjob: '✅',       workki: '✅' },
  { feature: 'Αποθήκευση αγγελίας', kariera: '❌',   skywalker: '❌',    myjob: '❌',       workki: '✅' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <p className="text-brand-300 text-sm font-semibold uppercase tracking-widest mb-5">
              Η ιστορία μας
            </p>
            <h1
              className="text-3xl sm:text-5xl font-bold mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-bricolage)' }}
            >
              Φτιαγμένο από επιχειρηματίες,<br />
              <span className="text-brand-300">για επιχειρηματίες.</span>
            </h1>
            <blockquote className="border-l-4 border-brand-400 pl-6 text-left max-w-2xl mx-auto">
              <p className="text-brand-100 text-lg sm:text-xl italic leading-relaxed">
                &ldquo;Βρήκαμε υπερβολικό να πληρώνουμε €45–180 για μια αγγελία εργασίας.
                Γι&rsquo; αυτό φτιάξαμε το Workki — προσιτό για κάθε επιχείρηση, από το μικρό
                μαγαζί της γειτονιάς μέχρι τη μεγάλη εταιρεία. Οι τιμές μας καλύπτουν τα
                λειτουργικά μας έξοδα και τίποτα παραπάνω. Σας ευχαριστούμε που μας
                στηρίζετε.&rdquo;
              </p>
            </blockquote>
          </div>
        </section>

        {/* Comparison table */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <h2
            className="text-2xl font-bold text-slate-900 text-center mb-8"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            Γιατί το Workki είναι διαφορετικό
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-slate-600 font-semibold">Χαρακτηριστικό</th>
                  <th className="px-4 py-3 text-slate-500 font-medium text-center">Kariera.gr</th>
                  <th className="px-4 py-3 text-slate-500 font-medium text-center">Skywalker</th>
                  <th className="px-4 py-3 text-slate-500 font-medium text-center">MyJobNow</th>
                  <th className="px-4 py-3 text-brand-900 font-bold text-center bg-brand-50">Workki ✓</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-4 py-3 text-slate-700 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{row.kariera}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{row.skywalker}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{row.myjob}</td>
                    <td className="px-4 py-3 text-center font-bold text-brand-900 bg-brand-50/50">{row.workki}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-brand-50 border-y border-brand-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
            <p className="text-4xl mb-6">🎯</p>
            <h2
              className="text-2xl font-bold text-brand-900 mb-4"
              style={{ fontFamily: 'var(--font-bricolage)' }}
            >
              Η αποστολή μας
            </h2>
            <p className="text-slate-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Πιστεύουμε ότι κάθε επιχείρηση — μικρή ή μεγάλη — αξίζει πρόσβαση σε ποιοτικούς
              υποψηφίους χωρίς να ξοδεύει περιττά χρήματα. Το Workki είναι η απάντησή μας.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/submit"
                className="inline-block bg-amber-400 text-amber-900 font-bold py-3 px-8 rounded-xl hover:bg-amber-300 transition-colors"
              >
                Δημοσίευσε Δωρεάν →
              </Link>
              <Link
                href="/pricing"
                className="inline-block bg-white border border-brand-200 text-brand-900 font-semibold py-3 px-8 rounded-xl hover:bg-brand-50 transition-colors"
              >
                Δες τις τιμές →
              </Link>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <p className="text-slate-500 text-base">
            Developed with ❤️ by{' '}
            <a
              href="https://infotron.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-800 hover:text-brand-600 underline underline-offset-2 font-medium transition-colors"
            >
              Infotron
            </a>
            {' '}— Web Development &amp; SEO Agency
          </p>
        </section>

      </main>
      <Footer />
    </>
  )
}

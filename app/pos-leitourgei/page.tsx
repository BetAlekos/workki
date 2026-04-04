import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SITE_URL, SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Πώς λειτουργεί | ${SITE_NAME}`,
  description: `Δημοσίευσε αγγελία εργασίας στο ${SITE_NAME} σε 3 βήματα. Δωρεάν, χωρίς λογαριασμό, με εμφάνιση στο Google Jobs.`,
  alternates: { canonical: `${SITE_URL}/pos-leitourgei` },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Πόσο κοστίζει η δημοσίευση αγγελίας στο Workki;', acceptedAnswer: { '@type': 'Answer', text: 'Η βασική δημοσίευση είναι εντελώς δωρεάν.' } },
    { '@type': 'Question', name: 'Χρειάζεται λογαριασμό για να δημοσιεύσω αγγελία;', acceptedAnswer: { '@type': 'Answer', text: 'Όχι. Δεν χρειάζεται εγγραφή ή λογαριασμός.' } },
    { '@type': 'Question', name: 'Πότε εμφανίζεται η αγγελία στο Google Jobs;', acceptedAnswer: { '@type': 'Answer', text: 'Συνήθως εντός 24-48 ωρών από την έγκριση.' } },
  ],
}

const STEPS = [
  {
    number: '1',
    icon: '📝',
    title: 'Συμπλήρωσε τη φόρμα',
    time: '2 λεπτά',
    description: 'Συμπλήρωσε τα βασικά στοιχεία της θέσης: τίτλος, εταιρεία, περιγραφή, τοποθεσία. Δεν χρειάζεσαι λογαριασμό.',
    detail: 'Χωρίς εγγραφή, χωρίς πιστωτική κάρτα.',
    color: 'bg-blue-50 border-blue-200',
    numberColor: 'bg-brand-900 text-white',
  },
  {
    number: '2',
    icon: '✅',
    title: 'Εγκρίνουμε την αγγελία σου',
    time: 'εντός 24 ωρών',
    description: 'Η ομάδα μας ελέγχει κάθε αγγελία για ποιότητα. Αμέσως μετά την έγκριση, η αγγελία εμφανίζεται στο Workki και υποβάλλεται στο Google Jobs.',
    detail: 'Σύντομη αναμονή, πλήρης ποιότητα.',
    color: 'bg-green-50 border-green-200',
    numberColor: 'bg-green-600 text-white',
  },
  {
    number: '3',
    icon: '📬',
    title: 'Λαμβάνεις υποψηφίους',
    time: 'απευθείας',
    description: 'Οι υποψήφιοι επικοινωνούν απευθείας μαζί σου — μέσω email ή URL αίτησης που έχεις ορίσει. Δεν μεσολαβεί η πλατφόρμα.',
    detail: 'Άμεση επαφή, χωρίς ενδιάμεσους.',
    color: 'bg-amber-50 border-amber-200',
    numberColor: 'bg-amber-400 text-amber-900',
  },
]

const COMPARISON = [
  { feature: 'Κόστος βασικής αγγελίας', workki: '€0', kariera: 'έως €180', skywalker: '€90+' },
  { feature: 'Εμφάνιση στο Google Jobs', workki: '✓', kariera: '✓', skywalker: '✓' },
  { feature: 'Χωρίς λογαριασμό', workki: '✓', kariera: '✗', skywalker: '✗' },
  { feature: 'Εποχιακές αγγελίες', workki: '✓', kariera: '✗', skywalker: '✗' },
  { feature: 'JSON-LD structured data', workki: '✓', kariera: 'μερικώς', skywalker: 'μερικώς' },
]

export default function PosLeitourgeiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
            <p className="text-brand-300 text-sm font-semibold uppercase tracking-widest mb-4">Για εργοδότες</p>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-bricolage)' }}>
              Δημοσίευσε αγγελία σε<br />
              <span className="text-brand-300">3 απλά βήματα</span>
            </h1>
            <p className="text-brand-200 text-lg max-w-xl mx-auto mb-8">
              Δωρεάν, χωρίς λογαριασμό. Εμφάνιση στο Google Jobs αυτόματα.
            </p>
            <Link
              href="/submit"
              className="inline-block bg-amber-400 text-amber-900 font-bold py-4 px-8 rounded-xl hover:bg-amber-300 transition-colors text-lg"
            >
              Δημοσίευσε Τώρα — Δωρεάν →
            </Link>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <div key={i} className={`rounded-2xl border p-6 sm:p-8 ${step.color}`}>
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-full ${step.numberColor} flex items-center justify-center font-bold text-xl shrink-0`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-2xl">{step.icon}</span>
                      <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-bricolage)' }}>
                        {step.title}
                      </h2>
                      <span className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full font-medium">
                        ⏱ {step.time}
                      </span>
                    </div>
                    <p className="text-slate-700">{step.description}</p>
                    <p className="text-sm text-slate-500 mt-2 font-medium">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/submit"
              className="inline-block bg-amber-400 text-amber-900 font-bold py-4 px-10 rounded-xl hover:bg-amber-300 transition-colors text-lg shadow"
            >
              Δημοσίευσε Δωρεάν →
            </Link>
            <p className="text-sm text-slate-500 mt-3">Χωρίς κόστος. Χωρίς λογαριασμό.</p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8" style={{ fontFamily: 'var(--font-bricolage)' }}>
              Σύγκριση πλατφορμών
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-slate-600 font-semibold">Χαρακτηριστικό</th>
                    <th className="px-4 py-3 text-brand-900 font-bold text-center bg-brand-50">Workki ✓</th>
                    <th className="px-4 py-3 text-slate-500 font-medium text-center">Kariera.gr</th>
                    <th className="px-4 py-3 text-slate-500 font-medium text-center">Skywalker</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                      <td className="px-4 py-3 text-slate-700">{row.feature}</td>
                      <td className="px-4 py-3 text-center font-bold text-brand-900 bg-brand-50/50">{row.workki}</td>
                      <td className="px-4 py-3 text-center text-slate-500">{row.kariera}</td>
                      <td className="px-4 py-3 text-center text-slate-500">{row.skywalker}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Συχνές ερωτήσεις
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Πόσο κοστίζει;', a: 'Η βασική δημοσίευση είναι εντελώς δωρεάν. Δεν χρειάζεσαι λογαριασμό ή πιστωτική κάρτα.' },
              { q: 'Πότε θα εμφανιστεί η αγγελία μου;', a: 'Μετά από σύντομο έλεγχο από την ομάδα μας, συνήθως εντός 24 ωρών.' },
              { q: 'Πού εμφανίζεται η αγγελία;', a: 'Στο Workki.gr, στο Google Jobs και στο Google Search με πλήρη structured data (JSON-LD JobPosting).' },
              { q: 'Πόσο καιρό παραμένει online;', a: 'Έως 60 ημέρες. Μπορείς να επικοινωνήσεις μαζί μας για παράταση ή διαγραφή.' },
              { q: 'Πώς λαμβάνω τις αιτήσεις;', a: 'Απευθείας — οι υποψήφιοι επικοινωνούν μέσω του email ή URL αίτησης που έχεις ορίσει στη φόρμα.' },
            ].map(({ q, a }) => (
              <div key={q} className="border border-slate-200 rounded-xl p-4 bg-white">
                <p className="font-semibold text-slate-900 mb-1">{q}</p>
                <p className="text-sm text-slate-600">{a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/submit"
              className="inline-block bg-amber-400 text-amber-900 font-bold py-4 px-10 rounded-xl hover:bg-amber-300 transition-colors text-lg"
            >
              Ξεκίνα τώρα — Δωρεάν →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

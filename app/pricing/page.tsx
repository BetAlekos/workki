'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Χρειάζομαι λογαριασμό για να δημοσιεύσω;',
      acceptedAnswer: { '@type': 'Answer', text: 'Όχι. Η βασική δημοσίευση γίνεται χωρίς εγγραφή.' },
    },
    {
      '@type': 'Question',
      name: 'Πότε εμφανίζεται η αγγελία στο Google Jobs;',
      acceptedAnswer: { '@type': 'Answer', text: 'Εντός 24-48 ωρών από την έγκριση.' },
    },
    {
      '@type': 'Question',
      name: 'Μπορώ να αναβαθμίσω σε Featured μετά;',
      acceptedAnswer: { '@type': 'Answer', text: 'Ναι, επικοινώνησε μαζί μας στο info@workki.gr.' },
    },
    {
      '@type': 'Question',
      name: 'Τι γίνεται μετά τις 60 ημέρες;',
      acceptedAnswer: { '@type': 'Answer', text: 'Η αγγελία αφαιρείται αυτόματα.' },
    },
  ],
}

type CheckoutPlan = 'featured_single' | 'featured_pack'

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<CheckoutPlan | null>(null)

  async function handleCheckout(plan: CheckoutPlan) {
    setLoading(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Κάτι πήγε στραβά. Δοκίμασε ξανά.')
        setLoading(null)
      }
    } catch {
      alert('Κάτι πήγε στραβά. Δοκίμασε ξανά.')
      setLoading(null)
    }
  }

  const inputClass =
    'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
            <p className="text-brand-300 text-sm font-semibold uppercase tracking-widest mb-4">Τιμολόγηση</p>
            <h1
              className="text-3xl sm:text-5xl font-bold mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-bricolage)' }}
            >
              Απλές, διαφανείς τιμές
            </h1>
            <p className="text-brand-200 text-lg max-w-xl mx-auto">
              Η βασική αγγελία είναι πάντα δωρεάν. Πληρώνεις μόνο αν θέλεις να ξεχωρίσεις.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">

            {/* Card 1 — Free */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Δωρεάν</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-bricolage)' }}>€0</span>
                <span className="text-slate-500 text-sm ml-2">για πάντα</span>
              </div>
              <ul className="space-y-2 text-sm mb-6 flex-1">
                {[
                  { ok: true,  text: '1 αγγελία' },
                  { ok: true,  text: 'Εμφάνιση στο Google Jobs' },
                  { ok: true,  text: '60 ημέρες online' },
                  { ok: true,  text: 'Χωρίς λογαριασμό' },
                  { ok: false, text: 'Featured προβολή' },
                  { ok: false, text: 'Εμφανίζεται πρώτη' },
                ].map(({ ok, text }) => (
                  <li key={text} className={`flex items-center gap-2 ${ok ? 'text-slate-700' : 'text-slate-400'}`}>
                    <span>{ok ? '✅' : '❌'}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/submit"
                className="block text-center bg-slate-100 text-slate-800 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Δημοσίευσε Δωρεάν
              </Link>
            </div>

            {/* Card 2 — Featured (highlighted) */}
            <div className="bg-amber-50 rounded-2xl border-2 border-amber-400 p-6 flex flex-col relative shadow-lg">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                ★ Δημοφιλές
              </span>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Featured</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-bricolage)' }}>€19,99</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">+ ΦΠΑ 24% / αγγελία</p>
              <ul className="space-y-2 text-sm mb-6 flex-1">
                {[
                  '1 αγγελία',
                  'Εμφάνιση στο Google Jobs',
                  '60 ημέρες online',
                  'Featured badge ⭐',
                  'Εμφανίζεται ΠΡΩΤΗ στις αναζητήσεις',
                  'Amber highlight στη λίστα',
                  'Email notification σε νέους υποψηφίους',
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2 text-slate-700">
                    <span>✅</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout('featured_single')}
                disabled={loading !== null}
                className="w-full bg-amber-400 text-amber-900 font-bold py-3 px-4 rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60 text-sm"
              >
                {loading === 'featured_single' ? 'Ανακατεύθυνση...' : 'Αγόρασε Featured →'}
              </button>
            </div>

            {/* Card 3 — Pack */}
            <div className="bg-brand-50 rounded-2xl border border-brand-200 p-6 flex flex-col">
              <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-2">Πακέτο</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-bricolage)' }}>€49,99</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">+ ΦΠΑ 24%</p>
              <p className="text-xs font-semibold text-brand-700 mb-4">3 Featured αγγελίες (€16,66 / αγγελία)</p>
              <ul className="space-y-2 text-sm mb-6 flex-1">
                {[
                  '3 αγγελίες',
                  'Εμφάνιση στο Google Jobs',
                  '60 ημέρες online η καθεμία',
                  'Featured badge ⭐ x3',
                  'Εμφανίζονται ΠΡΩΤΕΣ',
                  'Amber highlight στη λίστα',
                  'Email notification σε νέους υποψηφίους',
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2 text-slate-700">
                    <span>✅</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout('featured_pack')}
                disabled={loading !== null}
                className="w-full bg-brand-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60 text-sm"
              >
                {loading === 'featured_pack' ? 'Ανακατεύθυνση...' : 'Αγόρασε Πακέτο →'}
              </button>
            </div>

          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Ασφαλής πληρωμή μέσω{' '}
            <span className="font-semibold text-slate-500">Stripe</span>
            {' '}· Visa, Mastercard, American Express
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-14">
          <h2
            className="text-xl font-bold text-slate-900 mb-5"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            Συχνές ερωτήσεις
          </h2>
          <div className="space-y-3">
            {[
              { q: 'Χρειάζομαι λογαριασμό για να δημοσιεύσω;', a: 'Όχι. Η βασική δημοσίευση γίνεται χωρίς εγγραφή.' },
              { q: 'Πότε εμφανίζεται η αγγελία στο Google Jobs;', a: 'Εντός 24-48 ωρών από την έγκριση.' },
              { q: 'Μπορώ να αναβαθμίσω σε Featured μετά;', a: 'Ναι, επικοινώνησε μαζί μας στο info@workki.gr.' },
              { q: 'Τι γίνεται μετά τις 60 ημέρες;', a: 'Η αγγελία αφαιρείται αυτόματα.' },
            ].map(({ q, a }) => (
              <div key={q} className="border border-slate-200 rounded-xl p-4 bg-white">
                <p className="font-semibold text-slate-900 text-sm mb-1">{q}</p>
                <p className="text-sm text-slate-600">{a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

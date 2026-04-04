'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { JOB_CATEGORIES, EMPLOYMENT_TYPE_LABELS, GREEK_CITIES, SEASON_LABELS } from '@/lib/constants'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function SubmitPage() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [applyMethod, setApplyMethod] = useState<'url' | 'email'>('url')
  const [applyWarning, setApplyWarning] = useState(false)
  const [isFeaturedPlan, setIsFeaturedPlan] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('plan') === 'featured') setIsFeaturedPlan(true)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    // Validate apply method — at least one must be filled
    if (!data.apply_url && !data.apply_email) {
      setApplyWarning(true)
      setState('idle')
      return
    }
    setApplyWarning(false)

    const jobPayload = {
      ...data,
      is_remote: data.is_remote === 'true',
      is_seasonal: data.is_seasonal === 'true',
      salary_min: data.salary_min ? Number(data.salary_min) : null,
      salary_max: data.salary_max ? Number(data.salary_max) : null,
      season: data.season || null,
      season_start: data.season_start || null,
      season_end: data.season_end || null,
      valid_through: data.valid_through || null,
    }

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Κάτι πήγε στραβά.')
      }

      const { id: jobId } = await res.json()

      // Featured plan → redirect to Stripe checkout
      if (isFeaturedPlan) {
        const checkoutRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'featured_single', jobId }),
        })
        const checkout = await checkoutRes.json()
        if (checkout.url) {
          window.location.href = checkout.url
          return
        }
        throw new Error(checkout.error || 'Αποτυχία ανακατεύθυνσης στο checkout.')
      }

      setState('success')
      form.reset()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Κάτι πήγε στραβά.')
      setState('error')
    }
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Πόσο κοστίζει η δημοσίευση αγγελίας;', acceptedAnswer: { '@type': 'Answer', text: 'Η βασική δημοσίευση είναι εντελώς δωρεάν. Δεν απαιτείται λογαριασμός.' } },
      { '@type': 'Question', name: 'Πότε θα εμφανιστεί η αγγελία μου;', acceptedAnswer: { '@type': 'Answer', text: 'Μετά από σύντομο έλεγχο από την ομάδα μας, συνήθως εντός 24 ωρών.' } },
      { '@type': 'Question', name: 'Πού εμφανίζεται η αγγελία;', acceptedAnswer: { '@type': 'Answer', text: 'Στο Workki.gr, στο Google Jobs και στο Google Search μέσω structured data (JSON-LD).' } },
      { '@type': 'Question', name: 'Πόσο καιρό παραμένει online η αγγελία;', acceptedAnswer: { '@type': 'Answer', text: 'Έως 60 ημέρες ή μέχρι να τη διαγράψεις επικοινωνώντας μαζί μας.' } },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-10 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Πίσω
        </Link>

        {/* Featured plan banner */}
        {isFeaturedPlan && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-4 flex items-start gap-3">
            <span className="text-2xl shrink-0">⭐</span>
            <div>
              <p className="font-semibold text-amber-900 text-sm">Επιλέξατε Featured — €19,99 + ΦΠΑ</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Η αγγελία σου θα εμφανίζεται πρώτη με amber highlight. Θα ανακατευθυνθείς στο Stripe μετά την υποβολή.
              </p>
            </div>
          </div>
        )}

        {/* Benefits reminder */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">Γιατί να δημοσιεύσεις στο Workki;</p>
          <ul className="space-y-1.5">
            {[
              'Δωρεάν δημοσίευση — χωρίς λογαριασμό',
              'Εμφάνιση στο Google Jobs σε 48 ώρες',
              'Χιλιάδες job seekers κάθε μέρα',
              'Εποχιακές αγγελίες με ειδική προβολή',
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-green-800">
                <span className="mt-0.5 shrink-0">✅</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h1
            className="text-2xl font-bold text-slate-900 mb-1"
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            Δημοσίευση αγγελίας
          </h1>
          <p className="text-slate-500 text-sm mb-7">
            Η αγγελία σας θα ελεγχθεί από την ομάδα μας και θα δημοσιευτεί εντός 24 ωρών.
          </p>

          {state === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Η αγγελία υποβλήθηκε!</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left my-4 space-y-2 text-sm">
                <p className="font-semibold text-amber-900">Τι γίνεται τώρα:</p>
                <p className="text-amber-800">⏳ Η ομάδα μας ελέγχει την αγγελία <strong>(εντός 24 ωρών)</strong></p>
                <p className="text-amber-800">✅ Μετά την έγκριση εμφανίζεται στο Workki.gr</p>
                <p className="text-amber-800">🔍 Ευρετηρίαση στο Google Jobs σε <strong>48 ώρες</strong></p>
              </div>
              <p className="text-slate-400 text-xs mb-5">Η αγγελία <strong>αποθηκεύτηκε</strong> και αναμένει έγκριση.</p>
              <button
                onClick={() => setState('idle')}
                className="text-sm bg-brand-900 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-800 transition-colors"
              >
                Υποβολή νέας αγγελίας →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Company info */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-slate-700 mb-1">Στοιχεία εταιρείας</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Επωνυμία εταιρείας <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="company_name"
                      required
                      type="text"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="π.χ. Acme AE"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Website εταιρείας
                    </label>
                    <input
                      name="company_website"
                      type="url"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">URL λογοτύπου</label>
                  <input
                    name="company_logo"
                    type="url"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="https://..."
                  />
                </div>
              </fieldset>

              <div className="border-t border-slate-100" />

              {/* Job info */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-slate-700 mb-1">Στοιχεία θέσης</legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Τίτλος θέσης <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    required
                    type="text"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="π.χ. Senior Frontend Developer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Κατηγορία <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      required
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="">Επιλογή...</option>
                      {JOB_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Τύπος εργασίας <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="employment_type"
                      required
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="">Επιλογή...</option>
                      {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Περιγραφή θέσης <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={8}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                    placeholder="Περιγράψτε τη θέση, τα απαιτούμενα προσόντα, τα οφέλη..."
                  />
                  <p className="text-xs text-slate-400 mt-1">HTML επιτρέπεται (p, ul, li, strong, h2, h3).</p>
                </div>
              </fieldset>

              <div className="border-t border-slate-100" />

              {/* Location */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-slate-700 mb-1">Τοποθεσία</legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Εξ αποστάσεως;</label>
                  <select
                    name="is_remote"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="false">Όχι</option>
                    <option value="true">Ναι</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Πόλη</label>
                    <select
                      name="location_city"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="">Επιλογή...</option>
                      {GREEK_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Νομός / Περιφέρεια</label>
                    <input
                      name="location_region"
                      type="text"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="π.χ. Αττική"
                    />
                  </div>
                </div>
              </fieldset>

              <div className="border-t border-slate-100" />

              {/* Salary */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-slate-700 mb-1">Αμοιβή (προαιρετικό)</legend>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Από (€)</label>
                    <input
                      name="salary_min"
                      type="number"
                      min={0}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Έως (€)</label>
                    <input
                      name="salary_max"
                      type="number"
                      min={0}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="2000"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Περίοδος</label>
                    <select
                      name="salary_period"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="MONTH">Ανά μήνα</option>
                      <option value="YEAR">Ανά έτος</option>
                      <option value="HOUR">Ανά ώρα</option>
                      <option value="DAY">Ανά ημέρα</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <div className="border-t border-slate-100" />

              {/* Seasonal */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-slate-700 mb-1">Εποχιακή θέση (προαιρετικό)</legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Είναι εποχιακή θέση;</label>
                  <select
                    name="is_seasonal"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="false">Όχι</option>
                    <option value="true">Ναι</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Εποχή</label>
                    <select
                      name="season"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="">—</option>
                      {Object.entries(SEASON_LABELS).map(([key, val]) => (
                        <option key={key} value={key}>{val.emoji} {val.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Από</label>
                    <input
                      name="season_start"
                      type="date"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Έως</label>
                    <input
                      name="season_end"
                      type="date"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </fieldset>

              <div className="border-t border-slate-100" />

              {/* Apply */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-slate-700">
                  Πώς θα κάνουν αίτηση οι υποψήφιοι;
                </legend>

                {/* Toggle */}
                <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm font-medium w-fit">
                  <button
                    type="button"
                    onClick={() => { setApplyMethod('url'); setApplyWarning(false) }}
                    className={`px-4 py-2 transition-colors ${applyMethod === 'url' ? 'bg-brand-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    🔗 Μέσω Link
                  </button>
                  <button
                    type="button"
                    onClick={() => { setApplyMethod('email'); setApplyWarning(false) }}
                    className={`px-4 py-2 border-l border-slate-200 transition-colors ${applyMethod === 'email' ? 'bg-brand-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    ✉ Μέσω Email
                  </button>
                </div>

                {applyMethod === 'url' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Link αίτησης
                    </label>
                    <input
                      name="apply_url"
                      type="url"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="π.χ. https://apply.workable.com/mycompany/j/ABC123/"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Σύνδεσμος στη φόρμα αίτησής σας (Workable, LinkedIn, careers page κλπ)
                    </p>
                  </div>
                )}

                {applyMethod === 'email' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Email αποστολής βιογραφικού
                    </label>
                    <input
                      name="apply_email"
                      type="email"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="π.χ. hr@mycompany.gr"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Οι υποψήφιοι θα στέλνουν το βιογραφικό τους εδώ
                    </p>
                  </div>
                )}

                {applyWarning && (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    ⚠️ Παρακαλώ συμπλήρωσε τουλάχιστον έναν τρόπο αίτησης
                  </p>
                )}
              </fieldset>

              {/* Valid through */}
              <fieldset>
                <legend className="text-sm font-semibold text-slate-700 mb-3">
                  Λήξη αγγελίας (προαιρετικό)
                </legend>
                <input
                  name="valid_through"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Αφήστε κενό αν δεν έχει ημερομηνία λήξης
                </p>
              </fieldset>

              {state === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  <p className="font-semibold mb-0.5">Σφάλμα υποβολής</p>
                  <p>{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full bg-brand-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                {state === 'loading'
                  ? (isFeaturedPlan ? 'Ανακατεύθυνση στο Stripe...' : 'Υποβολή...')
                  : (isFeaturedPlan ? 'Υποβολή & Πληρωμή →' : 'Υποβολή αγγελίας')}
              </button>

              {!isFeaturedPlan && (
                <>
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">ή</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <Link
                    href="/pricing?plan=featured"
                    className="block text-center border-2 border-amber-400 text-amber-900 font-bold py-3 px-6 rounded-xl hover:bg-amber-50 transition-colors text-sm"
                  >
                    Δημοσίευσε ως Featured για €19,99 →
                  </Link>
                  <p className="text-center text-xs text-slate-400">
                    Εμφανίζεται πρώτη, με amber highlight και ⭐ badge
                  </p>
                </>
              )}
            </form>
          )}
        </div>
        {/* FAQ */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-bricolage)' }}>
            Συχνές Ερωτήσεις
          </h2>
          <div className="space-y-4">
            {[
              { q: 'Πόσο κοστίζει;', a: 'Η βασική δημοσίευση είναι εντελώς δωρεάν. Δεν χρειάζεται λογαριασμός.' },
              { q: 'Πότε θα εμφανιστεί η αγγελία μου;', a: 'Μετά από σύντομο έλεγχο (συνήθως εντός 24 ωρών).' },
              { q: 'Πού εμφανίζεται η αγγελία;', a: 'Στο Workki.gr, στο Google Jobs και στο Google Search με πλήρη structured data.' },
              { q: 'Πόσο καιρό παραμένει online;', a: 'Έως 60 ημέρες ή μέχρι να επικοινωνήσεις μαζί μας για διαγραφή.' },
            ].map(({ q, a }) => (
              <div key={q} className="border border-slate-200 rounded-xl p-4 bg-white">
                <p className="font-semibold text-slate-900 text-sm mb-1">{q}</p>
                <p className="text-sm text-slate-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

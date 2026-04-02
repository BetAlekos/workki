'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { JOB_CATEGORIES, EMPLOYMENT_TYPE_LABELS, GREEK_CITIES } from '@/lib/constants'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function SubmitPage() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          is_remote: data.is_remote === 'true',
          salary_min: data.salary_min ? Number(data.salary_min) : null,
          salary_max: data.salary_max ? Number(data.salary_max) : null,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Κάτι πήγε στραβά.')
      }

      setState('success')
      form.reset()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Κάτι πήγε στραβά.')
      setState('error')
    }
  }

  return (
    <>
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

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h1
            className="text-2xl font-bold text-slate-900 mb-1"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Δημοσίευση αγγελίας
          </h1>
          <p className="text-slate-500 text-sm mb-7">
            Η αγγελία σας θα ελεγχθεί από την ομάδα μας και θα δημοσιευτεί εντός 24 ωρών.
          </p>

          {state === 'success' ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Η αγγελία υποβλήθηκε!</h2>
              <p className="text-slate-500 text-sm mb-5">Θα σας ειδοποιήσουμε μόλις εγκριθεί.</p>
              <button
                onClick={() => setState('idle')}
                className="text-sm text-brand-800 hover:text-brand-900 font-medium"
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

              {/* Apply */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-slate-700 mb-1">Τρόπος αίτησης</legend>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">URL αίτησης</label>
                  <input
                    name="apply_url"
                    type="url"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email αίτησης</label>
                  <input
                    name="apply_email"
                    type="email"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="jobs@company.gr"
                  />
                </div>
              </fieldset>

              {state === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={state === 'loading'}
                className="w-full bg-brand-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                {state === 'loading' ? 'Υποβολή...' : 'Υποβολή αγγελίας'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

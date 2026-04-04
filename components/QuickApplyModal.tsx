'use client'

import { useState, useEffect } from 'react'
import type { Job } from '@/types'

interface Props {
  job: Job
  onClose: () => void
}

export function QuickApplyModal({ job, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: job.id, name, email, phone, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Κάτι πήγε στραβά.')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Κάτι πήγε στραβά.')
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">⚡ Γρήγορη Αίτηση</p>
              <h2 className="font-bold text-slate-900 text-base leading-snug">{job.title}</h2>
              <p className="text-sm text-slate-500">{job.company_name}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-5">
          {status === 'success' ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">✅</p>
              <p className="font-semibold text-slate-800 mb-1">Η αίτησή σου εστάλη!</p>
              <p className="text-sm text-slate-500 mb-4">
                Η εταιρεία θα επικοινωνήσει μαζί σου στο {email}.
              </p>
              <button
                onClick={onClose}
                className="text-sm text-brand-800 hover:text-brand-900 font-medium"
              >
                Κλείσιμο
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Ονοματεπώνυμο <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="π.χ. Γιώργος Παπαδόπουλος"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="το email σου"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Τηλέφωνο</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="π.χ. 6912345678"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Μήνυμα</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Σύντομη παρουσίαση ή κάλυψη αίτησης..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60 text-sm"
              >
                {status === 'loading' ? 'Αποστολή...' : 'Στείλε Αίτηση →'}
              </button>
              <p className="text-center text-xs text-slate-400">
                Η αίτηση αποστέλλεται απευθείας στην εταιρεία
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// Trigger button shown on the card (outside the Link)
export function QuickApplyTrigger({ job }: { job: Job }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}
        className="text-xs bg-green-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
      >
        Κάνε Αίτηση ⚡
      </button>
      {open && <QuickApplyModal job={job} onClose={() => setOpen(false)} />}
    </>
  )
}

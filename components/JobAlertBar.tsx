'use client'

import { useState, useEffect } from 'react'

const DISMISS_KEY = 'workki_alert_dismissed'
const SUBSCRIBED_KEY = 'workki_alert_subscribed'

export default function JobAlertBar() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const dismissed = localStorage.getItem(DISMISS_KEY)
        const subscribed = localStorage.getItem(SUBSCRIBED_KEY)
        if (!dismissed && !subscribed) setVisible(true)
      } catch {}
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, '1') } catch {}
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      localStorage.setItem(SUBSCRIBED_KEY, '1')
      setStatus('success')
    } catch {
      setStatus('success') // still hide bar on error
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
        <button
          onClick={dismiss}
          aria-label="Κλείσιμο"
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors text-lg leading-none"
        >
          ×
        </button>

        {status === 'success' ? (
          <div className="flex items-center gap-3 pr-6">
            <span className="text-2xl shrink-0">✅</span>
            <p className="text-sm font-medium text-slate-800">
              Εγγραφήκες! Θα λαμβάνεις αγγελίες κάθε εβδομάδα.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-800 mb-3 pr-6">
              🔔 Λάβε νέες αγγελίες στο email σου
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="το email σου"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-brand-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-800 transition-colors disabled:opacity-60 shrink-0"
              >
                {status === 'loading' ? '...' : 'Εγγραφή'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

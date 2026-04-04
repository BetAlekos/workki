'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'workki_saved'

export function getSavedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function toggleSaved(jobId: string): boolean {
  const ids = getSavedIds()
  const next = ids.includes(jobId) ? ids.filter((id) => id !== jobId) : [...ids, jobId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next.includes(jobId)
}

export default function SaveButton({ jobId }: { jobId: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(getSavedIds().includes(jobId))
  }, [jobId])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setSaved(toggleSaved(jobId))
    // Notify navbar badge if present
    window.dispatchEvent(new Event('workki_saved_change'))
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Αφαίρεση από αποθηκευμένα' : 'Αποθήκευση αγγελίας'}
      className="w-7 h-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 hover:scale-110 transition-transform text-sm leading-none"
    >
      {saved ? '❤️' : '🤍'}
    </button>
  )
}

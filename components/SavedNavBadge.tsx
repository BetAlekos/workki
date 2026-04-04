'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSavedIds } from '@/components/SaveButton'

export default function SavedNavBadge() {
  const [count, setCount] = useState(0)

  function sync() {
    setCount(getSavedIds().length)
  }

  useEffect(() => {
    sync()
    window.addEventListener('workki_saved_change', sync)
    return () => window.removeEventListener('workki_saved_change', sync)
  }, [])

  return (
    <Link
      href="/saved"
      className="relative text-sm text-slate-600 hover:text-brand-900 transition-colors hidden sm:flex items-center gap-1 px-2 py-1"
    >
      ❤️
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}

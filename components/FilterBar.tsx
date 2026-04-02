'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { JOB_CATEGORIES, EMPLOYMENT_TYPE_LABELS, GREEK_CITIES } from '@/lib/constants'

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }
      // Reset to page 1 on filter change
      params.delete('page')
      return params.toString()
    },
    [searchParams]
  )

  const handleChange = (key: string, value: string) => {
    const qs = createQueryString({ [key]: value })
    router.push(`${pathname}?${qs}`)
  }

  const current = {
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    remote: searchParams.get('remote') || '',
    location: searchParams.get('location') || '',
  }

  const hasFilters = Object.values(current).some(Boolean)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Κατηγορία</label>
          <select
            value={current.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Όλες</option>
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Τύπος εργασίας</label>
          <select
            value={current.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Όλοι</option>
            {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Πόλη</label>
          <select
            value={current.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Όλες</option>
            {GREEK_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium text-slate-500 mb-1">Εξ αποστάσεως</label>
          <select
            value={current.remote}
            onChange={(e) => handleChange('remote', e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="">Όλες</option>
            <option value="true">Ναι</option>
            <option value="false">Όχι</option>
          </select>
        </div>

        {hasFilters && (
          <div className="flex items-end">
            <button
              onClick={() => router.push(pathname)}
              className="text-sm text-slate-500 hover:text-brand-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Καθαρισμός ×
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

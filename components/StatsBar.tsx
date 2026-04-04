'use client'

import { useEffect, useRef, useState } from 'react'

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0)
  const ran = useRef(false)
  useEffect(() => {
    if (ran.current || target === 0) return
    ran.current = true
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

export default function StatsBar({ jobCount, companyCount }: { jobCount: number; companyCount: number }) {
  const jobs = useCountUp(jobCount)
  const companies = useCountUp(companyCount)

  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-brand-900 tabular-nums" style={{ fontFamily: 'var(--font-bricolage)' }}>
              {jobs}+
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">αγγελίες εργασίας</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-brand-900 tabular-nums" style={{ fontFamily: 'var(--font-bricolage)' }}>
              {companies}+
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">εταιρείες</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-brand-900" style={{ fontFamily: 'var(--font-bricolage)' }}>
              48h
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">εμφάνιση στο Google Jobs</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-green-600" style={{ fontFamily: 'var(--font-bricolage)' }}>
              €0
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">κόστος δημοσίευσης</p>
          </div>
        </div>
      </div>
    </section>
  )
}

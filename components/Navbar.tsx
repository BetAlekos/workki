import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span
            className="text-xl font-bold text-brand-900 group-hover:text-brand-700 transition-colors"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {SITE_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-brand-900 transition-colors hidden sm:block"
          >
            Αγγελίες
          </Link>
          <Link
            href="/submit"
            className="text-sm bg-brand-900 text-white px-4 py-2 rounded-lg hover:bg-brand-800 transition-colors font-medium"
          >
            + Δημοσίευση αγγελίας
          </Link>
        </nav>
      </div>
    </header>
  )
}

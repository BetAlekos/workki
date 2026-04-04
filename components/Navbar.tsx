import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'
import SavedNavBadge from '@/components/SavedNavBadge'

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
            style={{ fontFamily: 'var(--font-bricolage)' }}
          >
            {SITE_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/"
            className="text-sm text-slate-600 hover:text-brand-900 transition-colors hidden sm:block px-2 py-1"
          >
            Αγγελίες
          </Link>
          <Link
            href="/seasonal"
            className="text-sm text-seasonal-600 hover:text-seasonal-500 transition-colors hidden sm:block px-2 py-1 font-medium"
          >
            ☀️ Εποχιακές
          </Link>
          <Link
            href="/pos-leitourgei"
            className="text-sm text-slate-600 hover:text-brand-900 transition-colors hidden sm:block px-2 py-1"
          >
            Πώς λειτουργεί
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-slate-600 hover:text-brand-900 transition-colors hidden sm:block px-2 py-1"
          >
            Τιμές
          </Link>
          <Link
            href="/about"
            className="text-sm text-slate-600 hover:text-brand-900 transition-colors hidden sm:block px-2 py-1"
          >
            Η ιστορία μας
          </Link>

          <SavedNavBadge />

          {/* Desktop CTA with badge */}
          <div className="relative hidden sm:block mt-1">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold whitespace-nowrap leading-tight">
              100% Δωρεάν
            </span>
            <Link
              href="/submit"
              className="text-sm bg-amber-400 text-amber-900 px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors font-bold"
            >
              Δημοσίευσε Δωρεάν →
            </Link>
          </div>

          {/* Mobile CTA */}
          <Link
            href="/submit"
            className="sm:hidden text-sm bg-amber-400 text-amber-900 px-3 py-2 rounded-lg hover:bg-amber-300 transition-colors font-bold"
          >
            Δωρεάν →
          </Link>
        </nav>
      </div>
    </header>
  )
}

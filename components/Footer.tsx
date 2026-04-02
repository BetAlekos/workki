import Link from 'next/link'
import { SITE_NAME } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-700 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span
                className="text-lg font-bold text-white"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {SITE_NAME}
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Η νέα πλατφόρμα αγγελιών εργασίας για την Ελλάδα. Βρες τη δουλειά που σου ταιριάζει.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Για Εργαζόμενους</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Αναζήτηση αγγελιών</Link></li>
              <li><Link href="/?remote=true" className="hover:text-white transition-colors">Εξ αποστάσεως θέσεις</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Για Εργοδότες</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit" className="hover:text-white transition-colors">Δημοσίευση αγγελίας</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Με επιφύλαξη παντός δικαιώματος.</p>
          <p>Φτιαγμένο με ❤️ για την Ελλάδα</p>
        </div>
      </div>
    </footer>
  )
}

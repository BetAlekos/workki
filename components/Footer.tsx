import Link from 'next/link'
import { SITE_NAME, CITY_PAGES, CATEGORY_SLUGS, JOB_CATEGORIES } from '@/lib/constants'

export default function Footer() {
  const topCategories = JOB_CATEGORIES.slice(0, 6)

  return (
    <footer className="bg-brand-950 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-700 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">W</span>
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-bricolage)' }}>
                {SITE_NAME}
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Η νέα πλατφόρμα αγγελιών εργασίας για την Ελλάδα. Βρες τη δουλειά που σου ταιριάζει.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Πόλεις</h3>
            <ul className="space-y-2 text-sm">
              {Object.entries(CITY_PAGES).map(([slug, city]) => (
                <li key={slug}>
                  <Link href={`/jobs/${slug}`} className="hover:text-white transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Κατηγορίες</h3>
            <ul className="space-y-2 text-sm">
              {topCategories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/jobs/category/${CATEGORY_SLUGS[cat]}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Εργοδότες</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit" className="hover:text-white transition-colors">Δημοσίευση αγγελίας</Link></li>
              <li><Link href="/seasonal" className="hover:text-white transition-colors">☀️ Εποχιακές θέσεις</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Με επιφύλαξη παντός δικαιώματος.</p>
          <p>
            Developed with ❤️ by{' '}
            <a
              href="https://infotron.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition-colors underline underline-offset-2"
            >
              Infotron
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

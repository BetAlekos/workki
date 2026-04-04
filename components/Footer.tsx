import Link from 'next/link'
import { SITE_NAME, CITY_PAGES, CATEGORY_SLUGS, JOB_CATEGORIES } from '@/lib/constants'

export default function Footer() {
  const topCategories = JOB_CATEGORIES.slice(0, 5)

  return (
    <footer className="bg-brand-950 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
          {/* Brand */}
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
              Η νέα πλατφόρμα αγγελιών εργασίας για την Ελλάδα. Δωρεάν δημοσίευση, εμφάνιση στο Google Jobs.
            </p>
          </div>

          {/* For job seekers */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Αναζήτηση εργασίας</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs/athina" className="hover:text-white transition-colors">Αγγελίες Αθήνα</Link></li>
              <li><Link href="/jobs/thessaloniki" className="hover:text-white transition-colors">Αγγελίες Θεσσαλονίκη</Link></li>
              <li><Link href="/jobs/remote" className="hover:text-white transition-colors">Εξ αποστάσεως εργασία</Link></li>
              <li><Link href="/seasonal" className="hover:text-white transition-colors">☀️ Εποχιακή εργασία</Link></li>
              {Object.entries(CITY_PAGES).slice(2).map(([slug, city]) => (
                <li key={slug}>
                  <Link href={`/jobs/${slug}`} className="hover:text-white transition-colors">
                    Αγγελίες {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
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

          {/* For employers */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Για εργοδότες</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/submit" className="hover:text-white transition-colors font-medium text-amber-400">Δημοσίευση αγγελίας</Link></li>
              <li><Link href="/pos-leitourgei" className="hover:text-white transition-colors">Πώς λειτουργεί</Link></li>
              <li><Link href="/submit" className="hover:text-white transition-colors">Featured αγγελίες</Link></li>
            </ul>
          </div>

          {/* Seasonal */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Εποχιακές</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/seasonal/kalokairini" className="hover:text-white transition-colors">Καλοκαιρινές</Link></li>
              <li><Link href="/seasonal/tourismos" className="hover:text-white transition-colors">Τουρισμός</Link></li>
              <li><Link href="/seasonal/kritis" className="hover:text-white transition-colors">Κρήτη</Link></li>
              <li><Link href="/seasonal/nisia" className="hover:text-white transition-colors">Νησιά</Link></li>
              <li><Link href="/seasonal/xalkidiki" className="hover:text-white transition-colors">Χαλκιδική</Link></li>
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

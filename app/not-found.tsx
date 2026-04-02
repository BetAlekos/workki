import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <p className="text-6xl font-bold text-brand-900 mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
            404
          </p>
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Η σελίδα δεν βρέθηκε</h1>
          <p className="text-slate-500 mb-6 text-sm">
            Η αγγελία που ψάχνεις μπορεί να έχει λήξει ή να έχει αφαιρεθεί.
          </p>
          <Link
            href="/"
            className="inline-block bg-brand-900 text-white px-5 py-2.5 rounded-xl hover:bg-brand-800 transition-colors text-sm font-medium"
          >
            Αναζήτηση αγγελιών
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

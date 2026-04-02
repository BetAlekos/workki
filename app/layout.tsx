import type { Metadata } from 'next'
import { Syne, Instrument_Sans } from 'next/font/google'
import './globals.css'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants'

const syne = Syne({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-syne',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['αγγελίες εργασίας', 'δουλειά', 'θέσεις εργασίας', 'Ελλάδα', 'jobs Greece'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'el_GR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="el" className={`${syne.variable} ${instrumentSans.variable} h-full`}>
      <body className="antialiased min-h-full flex flex-col">{children}</body>
    </html>
  )
}

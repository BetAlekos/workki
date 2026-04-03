import type { Metadata } from 'next'
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bricolage',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['αγγελίες εργασίας', 'δουλειά', 'θέσεις εργασίας', 'Ελλάδα', 'jobs Greece', 'εποχιακή εργασία'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  verification: {
    google: 'REPLACE_WITH_GOOGLE_VERIFICATION_TOKEN',
  },
  openGraph: {
    type: 'website',
    locale: 'el_GR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Αγγελίες Εργασίας στην Ελλάδα`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image`],
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
    <html lang="el" className={`${bricolage.variable} ${jakarta.variable} h-full`}>
      <body className="antialiased min-h-full flex flex-col">{children}</body>
    </html>
  )
}

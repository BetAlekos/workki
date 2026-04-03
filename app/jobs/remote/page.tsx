import type { Metadata } from 'next'
import CityJobsPage from '@/components/CityJobsPage'
import { CITY_PAGES, SITE_URL } from '@/lib/constants'

export const revalidate = 3600

const config = CITY_PAGES.remote

export const metadata: Metadata = {
  title: `${config.h1} | Workki`,
  description: config.description,
  alternates: { canonical: `${SITE_URL}/jobs/remote` },
  openGraph: {
    title: config.h1,
    description: config.description,
    url: `${SITE_URL}/jobs/remote`,
    type: 'website',
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
}

export default function RemotePage() {
  return <CityJobsPage citySlug="remote" config={config} />
}

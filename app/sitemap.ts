import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SITE_URL, CATEGORY_SLUGS } from '@/lib/constants'

export const revalidate = 3600

const CITY_SLUGS = ['athina', 'thessaloniki', 'heraklion', 'patra', 'remote']
const SEASONAL_SLUGS = ['kalokairini', 'tourismos', 'kritis', 'nisia', 'xalkidiki']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cityUrls: MetadataRoute.Sitemap = CITY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/jobs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = Object.values(CATEGORY_SLUGS).map((slug) => ({
    url: `${SITE_URL}/jobs/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const seasonalUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/seasonal`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...SEASONAL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/seasonal/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [
      { url: SITE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
      ...cityUrls,
      ...categoryUrls,
      ...seasonalUrls,
    ]
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: jobs } = await supabase
    .from('jobs')
    .select('slug, created_at')
    .eq('is_approved', true)
    .or('valid_through.is.null,valid_through.gt.' + new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(5000)

  const jobUrls: MetadataRoute.Sitemap = (jobs || []).map((job) => ({
    url: `${SITE_URL}/jobs/${job.slug}`,
    lastModified: new Date(job.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${SITE_URL}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/pos-leitourgei`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...cityUrls,
    ...categoryUrls,
    ...seasonalUrls,
    ...jobUrls,
  ]
}

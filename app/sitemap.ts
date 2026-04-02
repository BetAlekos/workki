import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [{ url: SITE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 }]
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: jobs } = await supabase
    .from('jobs')
    .select('slug, created_at, date_posted')
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
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...jobUrls,
  ]
}

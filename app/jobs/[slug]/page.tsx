import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import type { Job } from '@/types'
import { formatEmploymentType, formatSalary, formatDate } from '@/lib/utils'
import { EMPLOYMENT_TYPE_LABELS, SITE_URL, SITE_NAME } from '@/lib/constants'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getJob(slug: string): Promise<Job | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .eq('is_approved', true)
    .single()
  return (data as Job) || null
}

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }
  const { createClient: createSupabase } = await import('@supabase/supabase-js')
  const supabase = createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data } = await supabase
    .from('jobs')
    .select('slug')
    .eq('is_approved', true)
    .limit(200)
  return (data || []).map((job: { slug: string }) => ({ slug: job.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getJob(slug)
  if (!job) return {}

  const locationParts = [job.location_city, job.location_region].filter(Boolean)
  const locationStr = job.is_remote ? 'Εξ αποστάσεως' : (locationParts.join(', ') || 'Ελλάδα')
  const title = `${job.title} στη ${job.company_name} — ${locationStr}`
  const description = `${job.company_name} αναζητά ${job.title} (${formatEmploymentType(job.employment_type)}) ${locationStr}. Δες την αγγελία και κάνε αίτηση τώρα στο ${SITE_NAME}.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/jobs/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/jobs/${slug}`,
      type: 'website',
    },
  }
}

function buildJsonLd(job: Job) {
  const locationParts = [job.location_city, job.location_region, job.location_country].filter(Boolean)

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.date_posted,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name,
      ...(job.company_website ? { sameAs: job.company_website } : {}),
      ...(job.company_logo ? { logo: job.company_logo } : {}),
    },
    employmentType: job.employment_type,
    directApply: !!(job.apply_url || job.apply_email),
  }

  if (job.valid_through) {
    ld.validThrough = job.valid_through
  }

  if (job.is_remote) {
    ld.jobLocationType = 'TELECOMMUTE'
    if (locationParts.length > 0) {
      ld.jobLocation = {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressCountry: job.location_country || 'GR',
          ...(job.location_city ? { addressLocality: job.location_city } : {}),
          ...(job.location_region ? { addressRegion: job.location_region } : {}),
        },
      }
    }
  } else {
    ld.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: job.location_country || 'GR',
        ...(job.location_city ? { addressLocality: job.location_city } : {}),
        ...(job.location_region ? { addressRegion: job.location_region } : {}),
      },
    }
  }

  if (job.salary_min || job.salary_max) {
    ld.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.salary_currency || 'EUR',
      value: {
        '@type': 'QuantitativeValue',
        ...(job.salary_min ? { minValue: job.salary_min } : {}),
        ...(job.salary_max ? { maxValue: job.salary_max } : {}),
        unitText: job.salary_period || 'MONTH',
      },
    }
  }

  if (job.apply_url) {
    ld.url = job.apply_url
  }

  return ld
}

export default async function JobPage({ params }: PageProps) {
  const { slug } = await params
  const job = await getJob(slug)

  if (!job) notFound()

  const salary = formatSalary(job)
  const locationParts = [job.location_city, job.location_region].filter(Boolean)
  const location = job.is_remote
    ? locationParts.length > 0
      ? `${locationParts.join(', ')} · Εξ αποστάσεως`
      : 'Εξ αποστάσεως'
    : locationParts.join(', ') || 'Ελλάδα'

  const jsonLd = buildJsonLd(job)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Πίσω στις αγγελίες
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              {job.is_featured && (
                <span className="inline-block text-xs font-semibold text-featured-600 bg-featured-100 px-2 py-0.5 rounded-full mb-3">
                  ★ Προτεινόμενη αγγελία
                </span>
              )}

              <div className="flex items-start gap-4">
                {job.company_logo ? (
                  <div className="shrink-0 w-14 h-14 rounded-xl border border-slate-100 overflow-hidden bg-white flex items-center justify-center">
                    <Image
                      src={job.company_logo}
                      alt={`${job.company_name} logo`}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-brand-900 flex items-center justify-center text-white font-bold text-xl">
                    {job.company_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1
                    className="text-2xl font-bold text-slate-900 leading-snug"
                    style={{ fontFamily: 'var(--font-syne)' }}
                  >
                    {job.title}
                  </h1>
                  <p className="text-slate-600 mt-1">
                    {job.company_website ? (
                      <a
                        href={job.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-800 transition-colors"
                      >
                        {job.company_name}
                      </a>
                    ) : (
                      job.company_name
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location}
                </span>
                <span className="inline-flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {formatEmploymentType(job.employment_type)}
                </span>
                <span className="inline-flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {job.category}
                </span>
                {salary && (
                  <span className="inline-flex items-center text-sm font-semibold text-brand-800 bg-brand-50 px-3 py-1 rounded-full">
                    {salary}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2
                className="text-lg font-bold text-slate-900 mb-4"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                Περιγραφή θέσης
              </h2>
              <div
                className="job-description text-slate-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply CTA */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-20">
              <h3 className="font-semibold text-slate-900 mb-4">Αίτηση εργασίας</h3>

              {job.apply_url ? (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-brand-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-brand-800 transition-colors"
                >
                  Κάνε αίτηση τώρα
                </a>
              ) : job.apply_email ? (
                <a
                  href={`mailto:${job.apply_email}?subject=Αίτηση για τη θέση: ${job.title}`}
                  className="block w-full text-center bg-brand-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-brand-800 transition-colors"
                >
                  Αποστολή email
                </a>
              ) : (
                <p className="text-sm text-slate-500 text-center">
                  Επικοινώνησε απευθείας με την εταιρεία.
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Δημοσιεύτηκε</span>
                  <span className="text-slate-700 font-medium">{formatDate(job.date_posted)}</span>
                </div>
                {job.valid_through && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Ισχύει έως</span>
                    <span className="text-slate-700 font-medium">{formatDate(job.valid_through)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Τύπος</span>
                  <span className="text-slate-700 font-medium">{formatEmploymentType(job.employment_type)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import type { Job } from '@/types'
import { formatEmploymentType, formatSalary, timeAgo } from '@/lib/utils'
import { SEASON_LABELS } from '@/lib/constants'

interface JobCardProps {
  job: Job
}

function getViewCount(id: string): number {
  return (parseInt(id.slice(-4), 16) % 200) + 50
}

function isNewJob(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 3 * 24 * 60 * 60 * 1000
}

export default function JobCard({ job }: JobCardProps) {
  const salary = formatSalary(job)
  const locationParts = [job.location_city, job.location_region].filter(Boolean)
  const location = job.is_remote
    ? locationParts.length > 0
      ? `${locationParts.join(', ')} · Εξ αποστάσεως`
      : 'Εξ αποστάσεως'
    : locationParts.join(', ') || 'Ελλάδα'

  const seasonInfo = job.is_seasonal && job.season ? SEASON_LABELS[job.season] : null
  const seasonDates = job.season_start && job.season_end
    ? `${new Date(job.season_start).toLocaleDateString('el-GR', { month: 'short' })} – ${new Date(job.season_end).toLocaleDateString('el-GR', { month: 'short', year: 'numeric' })}`
    : null

  const cardClass = job.is_seasonal ? 'seasonal' : job.is_featured ? 'featured' : ''
  const isNew = isNewJob(job.created_at)
  const viewCount = getViewCount(job.id)

  return (
    <Link href={`/jobs/${job.slug}`} className="block group">
      <article
        className={`job-card bg-white rounded-xl border px-5 py-4 ${
          job.is_seasonal
            ? 'border-seasonal-400 bg-seasonal-50'
            : job.is_featured
            ? 'border-featured-400 bg-featured-50'
            : 'border-slate-200'
        } ${cardClass}`}
      >
        {/* Badges row */}
        {(job.is_featured || job.is_seasonal || isNew) && (
          <div className="flex items-center gap-2 mb-2">
            {isNew && !job.is_featured && !job.is_seasonal && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                🔥 Νέα
              </span>
            )}
            {job.is_featured && (
              <span className="text-xs font-semibold text-featured-600 bg-featured-100 px-2 py-0.5 rounded-full">
                ★ Προτεινόμενη
              </span>
            )}
            {seasonInfo && (
              <span className="text-xs font-semibold text-seasonal-600 bg-seasonal-100 px-2 py-0.5 rounded-full">
                {seasonInfo.emoji} {seasonInfo.label}
                {seasonDates && ` · ${seasonDates}`}
              </span>
            )}
          </div>
        )}

        <div className="flex items-start gap-3">
          {job.company_logo ? (
            <div className="shrink-0 w-11 h-11 rounded-lg border border-slate-100 overflow-hidden bg-white flex items-center justify-center">
              <Image
                src={job.company_logo}
                alt={`${job.company_name} logo`}
                width={44}
                height={44}
                loading="lazy"
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <div className="shrink-0 w-11 h-11 rounded-lg bg-brand-900 flex items-center justify-center text-white font-bold text-base">
              {job.company_name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug text-base truncate">
              {job.title}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">{job.company_name}</p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {formatEmploymentType(job.employment_type)}
              </span>
              <span className="text-xs text-slate-400 hidden sm:block">{job.category}</span>
            </div>
          </div>

          <div className="shrink-0 text-right hidden sm:flex flex-col items-end gap-1">
            {salary && (
              <p className="text-sm font-semibold text-brand-800">{salary}</p>
            )}
            <p className="text-xs text-slate-400">{timeAgo(job.created_at)}</p>
            <p className="text-xs text-slate-400">👁 {viewCount}</p>
          </div>
        </div>
      </article>
    </Link>
  )
}

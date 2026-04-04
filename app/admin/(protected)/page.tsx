import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { Job } from '@/types'
import { formatDate, formatEmploymentType } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'
import Link from 'next/link'

async function approveJob(jobId: string) {
  'use server'
  const supabase = await createServiceClient()
  await supabase.from('jobs').update({ is_approved: true }).eq('id', jobId)
  revalidatePath('/admin')
  revalidatePath('/')
}

async function rejectJob(jobId: string) {
  'use server'
  const supabase = await createServiceClient()
  await supabase.from('jobs').delete().eq('id', jobId)
  revalidatePath('/admin')
}

async function toggleFeatured(jobId: string, current: boolean) {
  'use server'
  const supabase = await createServiceClient()
  await supabase.from('jobs').update({ is_featured: !current }).eq('id', jobId)
  revalidatePath('/admin')
  revalidatePath('/')
}

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export default async function AdminPage() {
  const supabase = await createServiceClient()

  const { data: pending } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  const { data: approved } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(20)

  const pendingJobs = (pending as Job[]) || []
  const approvedJobs = (approved as Job[]) || []

  // Fetch application counts + applicants for all visible jobs
  const allJobIds = [...pendingJobs, ...approvedJobs].map((j) => j.id)
  const { data: applications } = allJobIds.length
    ? await supabase
        .from('applications')
        .select('id, job_id, name, email, phone, message, created_at')
        .in('job_id', allJobIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  // Group by job_id
  type AppRow = { id: string; job_id: string; name: string; email: string; phone: string | null; message: string | null; created_at: string }
  const appsByJob = ((applications || []) as AppRow[]).reduce<Record<string, AppRow[]>>((acc, a) => {
    ;(acc[a.job_id] = acc[a.job_id] || []).push(a)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-brand-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-700 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="font-bold text-base" style={{ fontFamily: 'var(--font-syne)' }}>
              {SITE_NAME}
            </span>
          </Link>
          <span className="text-brand-400 text-sm">/ Admin</span>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs text-brand-300 hover:text-white transition-colors"
          >
            Αποσύνδεση
          </button>
        </form>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Αναμένουν έγκριση', value: pendingJobs.length, accent: 'text-amber-600' },
            { label: 'Εγκεκριμένες', value: approvedJobs.length, accent: 'text-green-600' },
            { label: 'Προτεινόμενες', value: approvedJobs.filter(j => j.is_featured).length, accent: 'text-brand-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pending */}
        <section className="mb-8">
          <h2
            className="text-lg font-bold text-slate-800 mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Αναμένουν έγκριση
            {pendingJobs.length > 0 && (
              <span className="ml-2 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {pendingJobs.length}
              </span>
            )}
          </h2>

          {pendingJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
              Καμία αγγελία σε αναμονή.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJobs.map((job) => (
                <AdminJobRow
                  key={job.id}
                  job={job}
                  approveJob={approveJob}
                  rejectJob={rejectJob}
                  toggleFeatured={toggleFeatured}
                  isPending
                  applications={appsByJob[job.id] || []}
                />
              ))}
            </div>
          )}
        </section>

        {/* Approved */}
        <section>
          <h2
            className="text-lg font-bold text-slate-800 mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Εγκεκριμένες αγγελίες
          </h2>

          {approvedJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
              Καμία εγκεκριμένη αγγελία.
            </div>
          ) : (
            <div className="space-y-3">
              {approvedJobs.map((job) => (
                <AdminJobRow
                  key={job.id}
                  job={job}
                  approveJob={approveJob}
                  rejectJob={rejectJob}
                  toggleFeatured={toggleFeatured}
                  isPending={false}
                  applications={appsByJob[job.id] || []}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

type AppRow = { id: string; job_id: string; name: string; email: string; phone: string | null; message: string | null; created_at: string }

interface AdminJobRowProps {
  job: Job
  approveJob: (id: string) => Promise<void>
  rejectJob: (id: string) => Promise<void>
  toggleFeatured: (id: string, current: boolean) => Promise<void>
  isPending: boolean
  applications: AppRow[]
}

function AdminJobRow({ job, approveJob, rejectJob, toggleFeatured, isPending, applications }: AdminJobRowProps) {
  return (
    <div className={`bg-white rounded-xl border ${isPending ? 'border-amber-200' : 'border-slate-200'} p-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 text-sm truncate">{job.title}</h3>
            {job.is_featured && (
              <span className="text-xs text-featured-600 bg-featured-100 px-1.5 py-0.5 rounded-full shrink-0">
                ★ Featured
              </span>
            )}
            {applications.length > 0 && (
              <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full shrink-0">
                📩 {applications.length} αιτήσεις
              </span>
            )}
            {job.view_count > 0 && (
              <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full shrink-0">
                👁 {job.view_count.toLocaleString('el-GR')}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {job.company_name} · {formatEmploymentType(job.employment_type)} · {job.category}
            {job.location_city ? ` · ${job.location_city}` : ''}
            {job.is_remote ? ' · Remote' : ''}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Υποβλήθηκε {formatDate(job.created_at)}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {!job.is_approved && (
            <>
              <form action={approveJob.bind(null, job.id)}>
                <button
                  type="submit"
                  className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Έγκριση
                </button>
              </form>
              <Link
                href={`/jobs/${job.slug}`}
                target="_blank"
                className="text-xs text-slate-500 hover:text-brand-800 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Προεπισκόπηση
              </Link>
            </>
          )}

          {job.is_approved && (
            <>
              <form action={toggleFeatured.bind(null, job.id, job.is_featured)}>
                <button
                  type="submit"
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    job.is_featured
                      ? 'bg-featured-100 text-featured-700 hover:bg-featured-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {job.is_featured ? '★ Unfeature' : '☆ Feature'}
                </button>
              </form>
              <Link
                href={`/jobs/${job.slug}`}
                target="_blank"
                className="text-xs text-slate-500 hover:text-brand-800 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Προβολή
              </Link>
            </>
          )}

          <form action={rejectJob.bind(null, job.id)}>
            <button
              type="submit"
              className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
              onClick={(e) => {
                if (!confirm('Διαγραφή αγγελίας;')) e.preventDefault()
              }}
            >
              Διαγραφή
            </button>
          </form>
        </div>
      </div>

      {/* Applications — native expand/collapse with <details> */}
      {applications.length > 0 && (
        <details className="mt-3 pt-3 border-t border-slate-100">
          <summary className="text-xs font-semibold text-blue-700 cursor-pointer select-none list-none flex items-center gap-1 w-fit">
            <span className="inline-block transition-transform [details[open]_&]:rotate-90">▶</span>
            📩 {applications.length} αιτήσεις — κλικ για προβολή
          </summary>
          <div className="mt-3 space-y-2">
            {applications.map((app) => (
              <div key={app.id} className="bg-slate-50 rounded-lg p-3 text-xs">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-slate-800">{app.name}</p>
                    <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline">{app.email}</a>
                    {app.phone && <span className="text-slate-500 ml-2">· {app.phone}</span>}
                  </div>
                  <span className="text-slate-400 shrink-0">{formatDate(app.created_at)}</span>
                </div>
                {app.message && (
                  <p className="text-slate-600 mt-1.5 line-clamp-2">{app.message}</p>
                )}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}

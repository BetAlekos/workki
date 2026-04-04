import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateJobSlug } from '@/lib/utils'
import { JOB_CATEGORIES, EMPLOYMENT_TYPE_LABELS } from '@/lib/constants'

const VALID_CATEGORIES = JOB_CATEGORIES as readonly string[]
const VALID_TYPES = Object.keys(EMPLOYMENT_TYPE_LABELS)

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    console.error('[jobs/POST] Failed to parse JSON body')
    return NextResponse.json({ error: 'Μη έγκυρο JSON.' }, { status: 400 })
  }

  console.log('[jobs/POST] Received body keys:', Object.keys(body).join(', '))

  // Required field validation
  const required = ['title', 'company_name', 'description', 'employment_type', 'category']
  for (const field of required) {
    if (!body[field] || typeof body[field] !== 'string' || !(body[field] as string).trim()) {
      console.error(`[jobs/POST] Missing required field: ${field}`, { value: body[field] })
      return NextResponse.json({ error: `Το πεδίο "${field}" είναι υποχρεωτικό.` }, { status: 400 })
    }
  }

  if (!VALID_TYPES.includes(body.employment_type as string)) {
    console.error('[jobs/POST] Invalid employment_type:', body.employment_type)
    return NextResponse.json({ error: 'Μη έγκυρος τύπος εργασίας.' }, { status: 400 })
  }
  if (!VALID_CATEGORIES.includes(body.category as string)) {
    console.error('[jobs/POST] Invalid category:', body.category)
    return NextResponse.json({ error: 'Μη έγκυρη κατηγορία.' }, { status: 400 })
  }

  if (!body.apply_url && !body.apply_email) {
    return NextResponse.json({ error: 'Απαιτείται τουλάχιστον ένας τρόπος αίτησης (URL ή email).' }, { status: 400 })
  }

  // Sanitize apply_url
  if (body.apply_url && typeof body.apply_url === 'string') {
    try { new URL(body.apply_url) } catch {
      return NextResponse.json({ error: 'Μη έγκυρο URL αίτησης.' }, { status: 400 })
    }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[jobs/POST] Missing Supabase env vars')
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 503 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const slug = generateJobSlug(body.title as string, body.company_name as string)
  const today = new Date().toISOString().split('T')[0]

  const job = {
    slug,
    title: (body.title as string).trim(),
    company_name: (body.company_name as string).trim(),
    company_website: (body.company_website as string | undefined)?.trim() || null,
    company_logo: (body.company_logo as string | undefined)?.trim() || null,
    description: (body.description as string).trim(),
    employment_type: body.employment_type as string,
    location_city: (body.location_city as string | undefined)?.trim() || null,
    location_region: (body.location_region as string | undefined)?.trim() || null,
    location_country: 'GR',
    is_remote: body.is_remote === true || body.is_remote === 'true',
    salary_min: body.salary_min ? Number(body.salary_min) : null,
    salary_max: body.salary_max ? Number(body.salary_max) : null,
    salary_currency: 'EUR',
    salary_period: (body.salary_period as string | undefined) || 'MONTH',
    category: body.category as string,
    apply_url: (body.apply_url as string | undefined)?.trim() || null,
    apply_email: (body.apply_email as string | undefined)?.trim() || null,
    date_posted: today,
    valid_through: (body.valid_through as string | undefined) || null,
    is_seasonal: body.is_seasonal === true || body.is_seasonal === 'true',
    season: (body.season as string | undefined) || null,
    season_start: (body.season_start as string | undefined) || null,
    season_end: (body.season_end as string | undefined) || null,
    is_approved: false,
    is_featured: false,
  }

  console.log('[jobs/POST] Inserting job:', {
    title: job.title,
    company: job.company_name,
    category: job.category,
    employment_type: job.employment_type,
    slug: job.slug,
  })

  const { data, error } = await supabase.from('jobs').insert(job).select('id, slug').single()

  if (error) {
    console.error('[jobs/POST] Supabase insert error:', JSON.stringify(error))
    return NextResponse.json(
      { error: `Αποτυχία αποθήκευσης: ${error.message || error.code || 'Άγνωστο σφάλμα'}` },
      { status: 500 }
    )
  }

  console.log('[jobs/POST] Job created:', { id: data.id, slug: data.slug })
  return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 })
}

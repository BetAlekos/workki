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
    return NextResponse.json({ error: 'Μη έγκυρο JSON.' }, { status: 400 })
  }

  // Required field validation
  const required = ['title', 'company_name', 'description', 'employment_type', 'category']
  for (const field of required) {
    if (!body[field] || typeof body[field] !== 'string' || !(body[field] as string).trim()) {
      return NextResponse.json({ error: `Το πεδίο "${field}" είναι υποχρεωτικό.` }, { status: 400 })
    }
  }

  if (!VALID_TYPES.includes(body.employment_type as string)) {
    return NextResponse.json({ error: 'Μη έγκυρος τύπος εργασίας.' }, { status: 400 })
  }
  if (!VALID_CATEGORIES.includes(body.category as string)) {
    return NextResponse.json({ error: 'Μη έγκυρη κατηγορία.' }, { status: 400 })
  }

  // Sanitize apply fields
  if (body.apply_url && typeof body.apply_url === 'string') {
    try { new URL(body.apply_url) } catch {
      return NextResponse.json({ error: 'Μη έγκυρο URL αίτησης.' }, { status: 400 })
    }
  }

  // Use service role to bypass RLS and enforce is_approved = false
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    is_approved: false, // always false — admin must approve
    is_featured: false,
  }

  const { data, error } = await supabase.from('jobs').insert(job).select('id, slug').single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Αποτυχία αποθήκευσης. Δοκιμάστε ξανά.' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, slug: data.slug }, { status: 201 })
}

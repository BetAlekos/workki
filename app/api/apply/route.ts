import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  let body: { job_id?: string; name?: string; email?: string; phone?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { job_id, name, email, phone, message } = body

  if (!job_id || !name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Τα πεδία Όνομα και Email είναι υποχρεωτικά.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: 'Μη έγκυρο email.' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Verify job exists and has apply_email
  const { data: job } = await supabase
    .from('jobs')
    .select('id, title, company_name, apply_email')
    .eq('id', job_id)
    .eq('is_approved', true)
    .single()

  if (!job) {
    return NextResponse.json({ error: 'Η αγγελία δεν βρέθηκε.' }, { status: 404 })
  }

  const { error } = await supabase.from('applications').insert({
    job_id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    message: message?.trim() || null,
  })

  if (error) {
    console.error('[apply] Supabase insert error:', error)
    return NextResponse.json({ error: 'Αποτυχία αποστολής. Δοκίμασε ξανά.' }, { status: 500 })
  }

  console.log(`[apply] Application submitted job_id=${job_id} email=${email}`)
  return NextResponse.json({ ok: true })
}

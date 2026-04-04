import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get('ids')
  if (!ids) return NextResponse.json({ jobs: [] })

  const idList = ids
    .split(',')
    .map((id) => id.trim())
    .filter((id) => /^[0-9a-f-]{36}$/.test(id)) // validate UUID format
    .slice(0, 50) // limit

  if (idList.length === 0) return NextResponse.json({ jobs: [] })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .in('id', idList)
    .eq('is_approved', true)
    .or('valid_through.is.null,valid_through.gt.' + new Date().toISOString())

  if (error) console.error('[saved] Supabase fetch error:', error)

  return NextResponse.json({ jobs: data || [] })
}

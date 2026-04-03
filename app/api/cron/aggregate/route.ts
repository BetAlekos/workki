import { NextRequest, NextResponse } from 'next/server'
import { runAggregator } from '@/lib/workable-aggregator'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 min — Vercel Pro max; on Hobby it's capped at 60s

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expected = `Bearer ${process.env.CRON_SECRET}`

  if (!process.env.CRON_SECRET || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const logs: string[] = []
  const log = (msg: string) => {
    logs.push(msg)
    console.log(msg)
  }

  try {
    const result = await runAggregator(log)
    return NextResponse.json({
      ok: true,
      added: result.added,
      skipped: result.skipped,
      errors: result.errors,
      logs: logs.slice(-50), // last 50 log lines
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Aggregator error:', err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Stripe requires the raw body for signature verification —
// App Router serves it via request.text() without any parsing.
export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] Stripe env vars not configured')
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const rawBody = await request.text()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  console.log(`[webhook] Received event type=${event.type} id=${event.id}`)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { plan, jobId } = session.metadata ?? {}

    console.log(`[webhook] checkout.session.completed plan=${plan} jobId=${jobId} session=${session.id}`)

    if (jobId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const { error } = await supabase
        .from('jobs')
        .update({ is_featured: true, is_approved: true })
        .eq('id', jobId)

      if (error) {
        console.error(`[webhook] Supabase update failed for jobId=${jobId}:`, error)
        // Return 200 so Stripe doesn't retry — the job can be manually approved
        return NextResponse.json({ received: true, warning: 'db_update_failed' })
      }

      console.log(`[webhook] Job ${jobId} marked featured+approved`)
    } else {
      // Pack purchase without a specific job — employer will submit separately
      console.log(`[webhook] Pack purchase (no jobId), session=${session.id}`)
    }
  }

  return NextResponse.json({ received: true })
}

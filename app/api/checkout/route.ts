import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const PLANS = {
  featured_single: {
    name: 'Workki Featured Αγγελία',
    description: '1 Featured αγγελία εργασίας στο Workki.gr — εμφανίζεται πρώτη με amber highlight',
    amount: 2479, // €19.99 + 24% ΦΠΑ = €24.79 (inclusive)
  },
  featured_pack: {
    name: 'Workki Πακέτο 3 Featured Αγγελίες',
    description: '3 Featured αγγελίες εργασίας στο Workki.gr (€16,66/αγγελία)',
    amount: 6199, // €49.99 + 24% ΦΠΑ = €61.99 (inclusive)
  },
} as const

type Plan = keyof typeof PLANS

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[checkout] STRIPE_SECRET_KEY not configured')
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  let body: { plan: string; jobId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { plan, jobId } = body
  if (!plan || !(plan in PLANS)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workki.gr'
  const selectedPlan = PLANS[plan as Plan]

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.amount,
            tax_behavior: 'inclusive',
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan,
        jobId: jobId || '',
      },
      success_url: `${siteUrl}/submit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing`,
      locale: 'el',
    })

    console.log(`[checkout] session created plan=${plan} jobId=${jobId || 'none'} id=${session.id}`)
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[checkout] Stripe session creation failed:', err)
    return NextResponse.json({ error: 'Αποτυχία δημιουργίας checkout. Δοκίμασε ξανά.' }, { status: 500 })
  }
}

import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

async function verifySignature(req: Request, rawBody: string): Promise<boolean> {
  const secret = process.env.MELHORENVIO_WEBHOOK_SECRET
  if (!secret) return true // skip if not configured
  const sig = req.headers.get('x-me-signature') ?? req.headers.get('x-melhorenvio-signature')
  if (!sig) return false
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  return sig === expected || sig === `sha256=${expected}`
}

const ME_STATUS_MAP: Record<string, string> = {
  released:        'posted',
  posted:          'posted',
  in_transit:      'in_transit',
  out_for_delivery:'out_for_delivery',
  delivered:       'delivered',
  undelivered:     'returned',
  returned:        'returned',
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    if (!(await verifySignature(req, rawBody))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = JSON.parse(rawBody)
    const shipmentId = body?.data?.id ?? body?.id
    if (!shipmentId) return NextResponse.json({ received: true })

    const meStatus = body?.data?.status ?? body?.status
    const tracking = body?.data?.tracking ?? body?.tracking
    const history: any[] = body?.data?.tracking_history ?? body?.tracking_history ?? []

    const ourStatus = ME_STATUS_MAP[meStatus] ?? null
    if (!ourStatus) return NextResponse.json({ received: true })

    const supabase = createAdminClient()

    const { data: record } = await supabase
      .from('order_tracking')
      .select('id, events')
      .eq('me_shipment_id', shipmentId)
      .maybeSingle() as unknown as { data: { id: string; events: any[] } | null }

    if (!record) return NextResponse.json({ received: true })

    const existingEvents: any[] = record.events ?? []
    const newEvents = history.map((e: any) => ({
      label: e.description ?? e.status ?? '',
      location: e.location ?? '',
      ts: e.created_at ?? new Date().toISOString(),
    }))

    const mergedEvents = [
      ...existingEvents,
      ...newEvents.filter(ne => !existingEvents.some(ee => ee.ts === ne.ts && ee.label === ne.label)),
    ]

    await supabase
      .from('order_tracking')
      .update({
        status: ourStatus,
        ...(tracking ? { tracking_code: tracking } : {}),
        events: mergedEvents,
      } as never)
      .eq('id', record.id)

    if (ourStatus === 'delivered') {
      const { data: ot } = await supabase
        .from('order_tracking')
        .select('order_id')
        .eq('id', record.id)
        .single() as unknown as { data: { order_id: string } | null }

      if (ot?.order_id) {
        await supabase
          .from('orders')
          .update({ status: 'delivered' } as never)
          .eq('id', ot.order_id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[webhook/me]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

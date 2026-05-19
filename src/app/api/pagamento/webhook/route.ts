import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { invoice_slug, order_nsu, transaction_nsu, capture_method, paid_amount, receipt_url } = body

    if (!order_nsu) {
      return NextResponse.json({ success: false, message: 'Missing order_nsu' }, { status: 400 })
    }

    const supabase = createAdminClient()

    await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: capture_method ?? null,
        metadata: { invoice_slug, transaction_nsu, receipt_url, paid_amount },
      } as never)
      .eq('id', order_nsu)

    return NextResponse.json({ success: true, message: null })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}

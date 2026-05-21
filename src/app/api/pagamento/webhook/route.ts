import { createAdminClient } from '@/lib/supabase/server'
import { getMPPaymentById } from '@/lib/mercadopago'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Mercado Pago webhook: { type: 'payment', data: { id: '...' } }
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = String(body.data.id)
      const payment = await getMPPaymentById(paymentId)

      if (payment.status === 'approved' && payment.external_reference) {
        const orderId = payment.external_reference
        const supabase = createAdminClient()
        await supabase
          .from('orders')
          .update({ payment_status: 'paid' } as never)
          .eq('id', orderId)
      }

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[webhook/mp]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

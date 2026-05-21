import { createAdminClient } from '@/lib/supabase/server'
import { getMPPaymentById } from '@/lib/mercadopago'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { orderId: string } }) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('orders')
    .select('payment_status, order_number, notes')
    .eq('id', params.orderId)
    .single() as unknown as { data: { payment_status: string; order_number: string; notes: string | null } | null }

  if (!data) return NextResponse.json({ paid: false })

  if (data.payment_status === 'paid') {
    return NextResponse.json({ paid: true, order_number: data.order_number })
  }

  // Ainda pending — consulta MP direto (não depende só do webhook)
  const mpId = data.notes?.match(/^mp:(.+)/)?.[1]
  if (mpId) {
    try {
      const payment = await getMPPaymentById(mpId)
      if (payment.status === 'approved') {
        await supabase
          .from('orders')
          .update({ payment_status: 'paid' } as never)
          .eq('id', params.orderId)
        return NextResponse.json({ paid: true, order_number: data.order_number })
      }
    } catch { /* ignore */ }
  }

  return NextResponse.json({ paid: false, payment_status: data.payment_status, order_number: data.order_number })
}

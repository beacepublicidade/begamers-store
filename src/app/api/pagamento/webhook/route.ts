import { createAdminClient } from '@/lib/supabase/server'
import { getMPPaymentById } from '@/lib/mercadopago'
import { NextResponse } from 'next/server'
import { buyLabelForOrder } from '@/lib/shipping-label'

async function handlePaidOrder(supabase: any, orderId: string) {
  // Mark order paid
  await supabase
    .from('orders')
    .update({ payment_status: 'paid', status: 'paid' } as never)
    .eq('id', orderId)

  // BG Coins: debit redeemed + credit earned
  const { data: order } = await supabase
    .from('orders')
    .select('customer_id, total, coins_redeemed')
    .eq('id', orderId)
    .single() as unknown as { data: { customer_id: string | null; total: number; coins_redeemed: number } | null }

  if (!order?.customer_id) return

  const { customer_id, total, coins_redeemed } = order
  const coinsRedeemed = coins_redeemed ?? 0
  const coinsEarned = Math.floor(total) // 1 coin per R$ 1 paid

  // Get current balance
  const { data: cust } = await supabase
    .from('customers').select('bg_coins').eq('id', customer_id).maybeSingle() as unknown as { data: { bg_coins: number } | null }
  const currentBalance = cust?.bg_coins ?? 0

  const newBalance = currentBalance - coinsRedeemed + coinsEarned
  await supabase.from('customers').update({ bg_coins: Math.max(0, newBalance) } as never).eq('id', customer_id)

  // Record transactions
  const txns: any[] = []
  if (coinsRedeemed > 0) {
    txns.push({ customer_id, order_id: orderId, type: 'redeem', amount: -coinsRedeemed, description: `Resgate no pedido` })
  }
  if (coinsEarned > 0) {
    txns.push({ customer_id, order_id: orderId, type: 'earn', amount: coinsEarned, description: `Compra confirmada — ${coinsEarned} BG Coins` })
  }
  if (txns.length > 0) {
    await supabase.from('bg_coins_transactions').insert(txns as never)
  }

  buyLabelForOrder(supabase, orderId).catch(err => console.error('[webhook/mp] buyLabel:', err))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.type === 'payment' && body.data?.id) {
      const paymentId = String(body.data.id)
      const payment = await getMPPaymentById(paymentId)

      if (payment.status === 'approved' && payment.external_reference) {
        const orderId = payment.external_reference
        const supabase = createAdminClient()
        await handlePaidOrder(supabase, orderId)
      }

      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[webhook/mp]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

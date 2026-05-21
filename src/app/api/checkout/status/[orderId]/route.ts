import { createAdminClient } from '@/lib/supabase/server'
import { getMPPaymentById } from '@/lib/mercadopago'
import { NextResponse } from 'next/server'
import { buyLabelForOrder } from '@/lib/shipping-label'

async function creditCoins(supabase: any, orderId: string) {
  const { data: order } = await supabase
    .from('orders')
    .select('customer_id, total, coins_redeemed')
    .eq('id', orderId)
    .single() as unknown as { data: { customer_id: string | null; total: number; coins_redeemed: number } | null }

  if (!order?.customer_id) return

  const { customer_id, total, coins_redeemed } = order
  const coinsRedeemed = coins_redeemed ?? 0
  const coinsEarned = Math.floor(total)

  const { data: cust } = await supabase
    .from('customers').select('bg_coins').eq('id', customer_id).maybeSingle() as unknown as { data: { bg_coins: number } | null }
  const currentBalance = cust?.bg_coins ?? 0
  const newBalance = currentBalance - coinsRedeemed + coinsEarned

  await supabase.from('customers').update({ bg_coins: Math.max(0, newBalance) } as never).eq('id', customer_id)

  const txns: any[] = []
  if (coinsRedeemed > 0) txns.push({ customer_id, order_id: orderId, type: 'redeem', amount: -coinsRedeemed, description: 'Resgate no pedido' })
  if (coinsEarned > 0) txns.push({ customer_id, order_id: orderId, type: 'earn', amount: coinsEarned, description: `Compra confirmada — ${coinsEarned} BG Coins` })
  if (txns.length > 0) await supabase.from('bg_coins_transactions').insert(txns as never)
}

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

  const mpId = data.notes?.match(/^mp:(.+)/)?.[1]
  if (mpId) {
    try {
      const payment = await getMPPaymentById(mpId)
      if (payment.status === 'approved') {
        await supabase
          .from('orders')
          .update({ payment_status: 'paid', status: 'paid' } as never)
          .eq('id', params.orderId)
        await creditCoins(supabase, params.orderId)
        buyLabelForOrder(supabase, params.orderId).catch(err => console.error('[status] buyLabel:', err))
        return NextResponse.json({ paid: true, order_number: data.order_number })
      }
    } catch { /* ignore */ }
  }

  return NextResponse.json({ paid: false, payment_status: data.payment_status, order_number: data.order_number })
}

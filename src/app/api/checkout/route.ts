import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { createMPPixPayment, createMPCardPayment } from '@/lib/mercadopago'

async function upsertCustomer(supabase: any, userId: string, customer: any): Promise<void> {
  await supabase.from('customers').upsert({
    id: userId,
    full_name: customer.name ?? null,
    phone: customer.phone ?? null,
    cpf: customer.cpf ?? null,
  } as never, { onConflict: 'id' })
}

async function createOrder(supabase: any, customerId: string | null, body: any) {
  const { items, shipping_cost, payment_method, coupon_code, discount, subtotal, total, coins_redeemed, shipping_service_id, shipping_carrier, address } = body
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      status: 'pending',
      payment_method,
      payment_status: 'pending',
      subtotal,
      discount: discount ?? 0,
      shipping: shipping_cost ?? 0,
      total,
      coins_redeemed: coins_redeemed ?? 0,
      shipping_service_id: shipping_service_id ?? null,
      shipping_carrier: shipping_carrier ?? null,
      delivery_address: address ?? null,
    } as never)
    .select('id, order_number')
    .single() as unknown as { data: { id: string; order_number: string } | null; error: any }
  if (error || !order) throw new Error(error?.message ?? 'Order creation failed')

  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    name: item.product_name,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
  }))
  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems as never)
  if (itemsErr) throw new Error(itemsErr.message)

  for (const item of items) {
    const { data: prod } = await supabase.from('products').select('stock').eq('id', item.product_id).single() as unknown as { data: { stock: number } | null }
    if (prod && prod.stock >= item.quantity) {
      await supabase.from('products').update({ stock: prod.stock - item.quantity } as never).eq('id', item.product_id)
    }
  }

  if (coupon_code) {
    const { data: coup } = await supabase.from('coupons').select('used_count').eq('code', coupon_code).single() as unknown as { data: { used_count: number } | null }
    if (coup) await supabase.from('coupons').update({ used_count: coup.used_count + 1 } as never).eq('code', coupon_code)
  }

  return order
}

export async function POST(req: Request) {
  try {
    const authClient = createClient()
    const { data: { user } } = await authClient.auth.getUser()
    const supabase = createAdminClient()
    const body = await req.json()
    const { customer, payment_method, card_token, card_payment_method_id, installments } = body

    const customerId = user?.id ?? null
    if (customerId) await upsertCustomer(supabase, customerId, customer)

    // Validate coins if being redeemed
    const coinsRedeemed: number = body.coins_redeemed ?? 0
    if (coinsRedeemed > 0 && customerId) {
      const { data: cust } = await supabase
        .from('customers').select('bg_coins').eq('id', customerId).maybeSingle() as unknown as { data: { bg_coins: number } | null }
      const balance = cust?.bg_coins ?? 0
      const maxAllowed = Math.floor((body.total / 5) * 100 / 100) * 100 // 10% of total in blocks of 100... simplified
      const coinsDiscount = (coinsRedeemed / 100) * 5
      if (coinsRedeemed > balance) throw new Error('Coins insuficientes')
      if (coinsRedeemed % 100 !== 0) throw new Error('Coins devem ser múltiplos de 100')
      if (coinsDiscount > body.total * 0.1) throw new Error('Desconto excede 10% do pedido')
    }

    const order = await createOrder(supabase, customerId, body)

    sendOrderConfirmationEmail({
      orderNumber: order.order_number,
      customerName: customer.name,
      customerEmail: customer.email,
      total: body.total,
      items: body.items,
      paymentMethod: payment_method,
      shippingMethod: body.shipping_method,
    }).catch(() => null)

    // ── PIX ───────────────────────────────────────────────────────────────────
    if (payment_method === 'pix') {
      const { br_code, payment_id } = await createMPPixPayment({
        amount: body.total,
        orderId: order.id,
        customer,
      })
      await supabase.from('orders').update({ notes: `mp:${payment_id}` } as never).eq('id', order.id)
      return NextResponse.json({ ok: true, order_id: order.id, order_number: order.order_number, br_code }, { status: 201 })
    }

    // ── Cartão ────────────────────────────────────────────────────────────────
    if (payment_method === 'credit' && card_token) {
      const { status, payment_id } = await createMPCardPayment({
        amount: body.total,
        orderId: order.id,
        cardToken: card_token,
        paymentMethodId: card_payment_method_id ?? 'visa',
        installments: installments ?? 1,
        customer,
      })
      const paid = ['approved', 'authorized'].includes(status)
      await supabase.from('orders').update({
        notes: `mp:${payment_id}`,
        ...(paid ? { payment_status: 'paid' } : {}),
      } as never).eq('id', order.id)
      return NextResponse.json({ ok: true, order_id: order.id, order_number: order.order_number, card_status: status, paid }, { status: 201 })
    }

    return NextResponse.json({ error: 'Método de pagamento não suportado' }, { status: 400 })

  } catch (err: any) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

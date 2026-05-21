import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { hasTransparentCredentials, createPixTransaction, createCardTransaction } from '@/lib/infinitepay'
import { sendOrderConfirmationEmail } from '@/lib/email'

async function upsertCustomer(supabase: any, customer: any): Promise<string | null> {
  if (!customer.email) return null
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('email', customer.email)
    .single() as unknown as { data: { id: string } | null }
  if (existing) return existing.id
  const { data: created } = await supabase
    .from('customers')
    .insert({ name: customer.name, email: customer.email, phone: customer.phone ?? null } as never)
    .select('id')
    .single() as unknown as { data: { id: string } | null }
  return created?.id ?? null
}

async function createOrder(supabase: any, customerId: string | null, body: any) {
  const { items, shipping_cost, payment_method, coupon_code, discount, subtotal, total } = body
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
    } as never)
    .select('id, order_number')
    .single() as unknown as { data: { id: string; order_number: string } | null; error: any }
  if (error || !order) throw new Error(error?.message ?? 'Order creation failed')

  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
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
    const { data: coup } = await supabase.from('coupons').select('uses_count').eq('code', coupon_code).single() as unknown as { data: { uses_count: number } | null }
    if (coup) await supabase.from('coupons').update({ uses_count: coup.uses_count + 1 } as never).eq('code', coupon_code)
  }

  return order
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { customer, payment_method, total, card_token, installments } = body

    const customerId = await upsertCustomer(supabase, customer)
    const order = await createOrder(supabase, customerId, body)

    // fire-and-forget — never blocks checkout
    sendOrderConfirmationEmail({
      orderNumber: order.order_number,
      customerName: customer.name,
      customerEmail: customer.email,
      total: body.total,
      items: body.items,
      paymentMethod: payment_method,
      shippingMethod: body.shipping_method,
    }).catch(() => null)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://begamerstore.com.br'
    const webhookUrl = `${baseUrl}/api/pagamento/webhook`
    const transparent = hasTransparentCredentials()

    // ── PIX transparente ───────────────────────────────────────────────────────
    if (payment_method === 'pix' && transparent) {
      const pixAmount = Math.round(total * 0.9)
      const { br_code, transaction_id } = await createPixTransaction({
        amount: pixAmount,
        orderId: order.id,
        customer,
        webhookUrl,
      })
      if (transaction_id) {
        await supabase.from('orders').update({ notes: `ip_tx:${transaction_id}` } as never).eq('id', order.id)
      }
      return NextResponse.json({ ok: true, order_id: order.id, order_number: order.order_number, br_code }, { status: 201 })
    }

    // ── Cartão transparente ────────────────────────────────────────────────────
    if (payment_method === 'credit' && transparent && card_token) {
      const { status, transaction_id } = await createCardTransaction({
        amount: total,
        orderId: order.id,
        cardToken: card_token,
        installments: installments ?? 1,
        customer,
      })
      const paid = ['approved', 'authorized', 'captured'].includes(status)
      if (paid) {
        await supabase.from('orders').update({ payment_status: 'paid', notes: `ip_tx:${transaction_id}` } as never).eq('id', order.id)
      }
      return NextResponse.json({ ok: true, order_id: order.id, order_number: order.order_number, card_status: status, paid }, { status: 201 })
    }

    // ── Fallback: link InfinitePay (redirect) ─────────────────────────────────
    const handle = process.env.INFINITEPAY_HANDLE ?? 'red-circle-digital'
    const ipPayload = {
      handle,
      redirect_url: `${baseUrl}/checkout/sucesso`,
      webhook_url: webhookUrl,
      order_nsu: order.id,
      items: body.items.map((item: any) => ({ quantity: item.quantity, price: item.price, description: item.product_name })),
      customer: { name: customer.name, email: customer.email, phone_number: customer.phone ?? '' },
      address: { cep: body.address.zip ?? '', number: body.address.number ?? '', complement: body.address.complement ?? '' },
    }
    const ipRes = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ipPayload),
    })
    if (!ipRes.ok) return NextResponse.json({ error: `InfinitePay error: ${await ipRes.text()}` }, { status: 502 })
    const { url: paymentUrl } = await ipRes.json() as { url: string }
    return NextResponse.json({ ok: true, order_id: order.id, order_number: order.order_number, payment_url: paymentUrl }, { status: 201 })

  } catch (err: any) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
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
    const { data: coup } = await supabase.from('coupons').select('uses_count').eq('code', coupon_code).single() as unknown as { data: { uses_count: number } | null }
    if (coup) await supabase.from('coupons').update({ uses_count: coup.uses_count + 1 } as never).eq('code', coupon_code)
  }

  return order
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    const { customer, payment_method } = body

    const customerId = await upsertCustomer(supabase, customer)
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://begamerstore.com.br'
    const webhookUrl = `${baseUrl}/api/pagamento/webhook`
    const handle = process.env.INFINITEPAY_HANDLE

    if (!handle) {
      return NextResponse.json({ error: 'INFINITEPAY_HANDLE env var não configurada' }, { status: 500 })
    }

    const ipPayload = {
      handle,
      redirect_url: `${baseUrl}/checkout/sucesso?order=${order.id}`,
      webhook_url: webhookUrl,
      order_nsu: order.id,
      items: body.items.map((item: any) => ({
        quantity: item.quantity,
        price: Math.round(item.price * 100),
        description: item.product_name,
      })),
      customer: { name: customer.name, email: customer.email, phone_number: customer.phone ?? '' },
      address: {
        cep: body.address?.zip ?? '',
        number: body.address?.number ?? '',
        complement: body.address?.complement ?? '',
      },
    }

    const ipRes = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ipPayload),
    })
    if (!ipRes.ok) {
      const errText = await ipRes.text()
      console.error('[checkout] InfinitePay error:', errText)
      return NextResponse.json({ error: `InfinitePay error: ${errText}` }, { status: 502 })
    }
    const { url: paymentUrl } = await ipRes.json() as { url: string }
    return NextResponse.json({ ok: true, order_id: order.id, order_number: order.order_number, payment_url: paymentUrl }, { status: 201 })

  } catch (err: any) {
    console.error('[checkout]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

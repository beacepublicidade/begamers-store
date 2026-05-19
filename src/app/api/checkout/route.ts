import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const body = await req.json()
  const { customer, address, items, shipping_method, shipping_cost, payment_method, coupon_code, discount, subtotal, total } = body

  // Upsert customer
  let customerId: string | null = null
  if (customer.email) {
    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .single() as unknown as { data: { id: string } | null }

    if (existing) {
      customerId = existing.id
    } else {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({ name: customer.name, email: customer.email, phone: customer.phone ?? null } as never)
        .select('id')
        .single() as unknown as { data: { id: string } | null }
      customerId = newCustomer?.id ?? null
    }
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      status: 'pending',
      payment_method,
      payment_status: 'pending',
      shipping_method,
      shipping_cost,
      shipping_address: address,
      subtotal,
      discount: discount ?? 0,
      total,
      coupon_code: coupon_code ?? null,
    } as never)
    .select('id, order_number')
    .single() as unknown as { data: { id: string; order_number: string } | null; error: any }

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'Order creation failed' }, { status: 500 })
  }

  // Create order items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems as never)
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  // Decrement stock
  for (const item of items) {
    const { data: prod } = await supabase.from('products').select('stock').eq('id', item.product_id).single() as unknown as { data: { stock: number } | null }
    if (prod && prod.stock >= item.quantity) {
      await supabase.from('products').update({ stock: prod.stock - item.quantity } as never).eq('id', item.product_id)
    }
  }

  // Increment coupon uses
  if (coupon_code) {
    const { data: coup } = await supabase.from('coupons').select('uses_count').eq('code', coupon_code).single() as unknown as { data: { uses_count: number } | null }
    if (coup) {
      await supabase.from('coupons').update({ uses_count: coup.uses_count + 1 } as never).eq('code', coupon_code)
    }
  }

  return NextResponse.json({ ok: true, order_number: order.order_number, order_id: order.id }, { status: 201 })
}

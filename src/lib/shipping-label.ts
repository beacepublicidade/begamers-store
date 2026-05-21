import { addShipmentToCart, checkoutMECart, getShipmentTracking } from './melhorenvio'

export async function buyLabelForOrder(supabase: any, orderId: string): Promise<void> {
  // Idempotent — skip if tracking already exists
  const { data: existing } = await supabase
    .from('order_tracking')
    .select('id')
    .eq('order_id', orderId)
    .maybeSingle()
  if (existing) return

  const { data: order } = await supabase
    .from('orders')
    .select(`
      id, order_number, total, created_at, shipping_method, shipping_carrier,
      shipping_service_id, delivery_address,
      order_items(name, quantity, price),
      customers:customer_id(full_name, phone, email, cpf)
    `)
    .eq('id', orderId)
    .single() as unknown as { data: any }

  if (!order) return

  const now = new Date().toISOString()
  const items: Array<{ name: string; quantity: number; price: number }> = order.order_items ?? []
  const customer = order.customers

  const initialEvents = [
    { label: 'Pedido feito', location: 'Online', ts: order.created_at },
    { label: 'Pagamento aprovado', location: 'Aprovação automática', ts: now },
    { label: 'Embalado e despachado', location: 'Centro Logístico BG', ts: now },
  ]

  let trackingCode = `BG${Date.now()}`
  let meShipmentId: string | null = null
  let carrier: string = order.shipping_carrier ?? order.shipping_method ?? 'BG Express'
  let carrierType = 'carrier'

  if (order.shipping_service_id && order.delivery_address && customer) {
    try {
      const addr = order.delivery_address as {
        zip: string; street: string; number: string; complement?: string
        neighborhood: string; city: string; state: string
      }

      const shipmentId = await addShipmentToCart({
        serviceId: order.shipping_service_id,
        order: {
          id: orderId,
          items,
          total: order.total,
          toAddress: addr,
          customer: {
            name: customer.full_name ?? 'Cliente',
            email: customer.email ?? '',
            phone: customer.phone ?? '11999999999',
            document: (customer.cpf ?? '00000000000').replace(/\D/g, ''),
          },
        },
      })

      await checkoutMECart(shipmentId)
      meShipmentId = shipmentId

      const meTracking = await getShipmentTracking(shipmentId)
      if (meTracking?.tracking) trackingCode = meTracking.tracking
      if (meTracking?.events?.length) {
        meTracking.events.forEach(e =>
          initialEvents.push({ label: e.description, location: e.location, ts: e.created_at })
        )
      }
    } catch (err) {
      console.error('[buyLabel] ME error (continuing with manual tracking):', err)
    }
  }

  const addr = order.delivery_address as any
  const deliveryAddressText = addr
    ? `${addr.street}, ${addr.number}${addr.complement ? `, ${addr.complement}` : ''} — ${addr.neighborhood}, ${addr.city}/${addr.state} ${addr.zip}`
    : null

  await supabase.from('order_tracking').insert({
    order_id: orderId,
    carrier,
    carrier_type: carrierType,
    tracking_code: trackingCode,
    status: 'preparing',
    me_shipment_id: meShipmentId,
    delivery_address: deliveryAddressText,
    events: initialEvents,
  } as never)

  if (meShipmentId) {
    await supabase.from('orders').update({ me_shipment_id: meShipmentId } as never).eq('id', orderId)
  }
}

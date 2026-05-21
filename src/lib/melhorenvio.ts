export interface ShippingOption {
  id: number
  name: string
  company: string
  price: number
  delivery_time: number
}

function meUrl(path: string) {
  const base = process.env.MELHORENVIO_SANDBOX === 'true'
    ? 'https://sandbox.melhorenvio.com.br/api/v2'
    : 'https://melhorenvio.com.br/api/v2'
  return `${base}${path}`
}

function meHeaders() {
  return {
    Authorization: `Bearer ${process.env.MELHORENVIO_TOKEN!}`,
    'Content-Type': 'application/json',
    'User-Agent': 'BeGamers Store (coloqueaficha@gmail.com)',
    Accept: 'application/json',
  }
}

export async function calculateShipping(opts: {
  fromCep: string
  toCep: string
  weight?: number
  height?: number
  width?: number
  length?: number
}): Promise<ShippingOption[]> {
  const res = await fetch(meUrl('/me/shipment/calculate'), {
    method: 'POST',
    headers: meHeaders(),
    body: JSON.stringify({
      from: { postal_code: opts.fromCep.replace(/\D/g, '') },
      to: { postal_code: opts.toCep.replace(/\D/g, '') },
      package: {
        height: opts.height ?? 20,
        width: opts.width ?? 20,
        length: opts.length ?? 20,
        weight: opts.weight ?? 0.5,
      },
      options: { receipt: false, own_hand: false },
    }),
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`Melhor Envio: ${res.statusText}`)
  const data = await res.json() as any[]
  console.log('[ME raw]', JSON.stringify(data.map(s => ({ id: s.id, name: s.name, price: s.price, time: s.delivery_time, err: s.error }))))
  return data
    .filter(s => !s.error && s.price)
    .map(s => ({
      id: s.id,
      name: s.name,
      company: s.company?.name ?? '',
      price: parseFloat(s.price),
      delivery_time: s.delivery_time,
    }))
    .sort((a, b) => a.price - b.price)
}

export async function addShipmentToCart(opts: {
  serviceId: number
  order: {
    id: string
    items: Array<{ name: string; quantity: number; price: number }>
    total: number
    toAddress: {
      zip: string; street: string; number: string
      complement?: string; neighborhood: string; city: string; state: string
    }
    customer: { name: string; email: string; phone: string; document: string }
  }
}): Promise<string> {
  const body = {
    service: opts.serviceId,
    from: {
      name: process.env.MELHORENVIO_FROM_NAME ?? 'BeGamers Store',
      phone: process.env.MELHORENVIO_FROM_PHONE ?? '11999999999',
      email: process.env.MELHORENVIO_FROM_EMAIL ?? 'loja@begamers.com.br',
      document: process.env.MELHORENVIO_FROM_DOCUMENT ?? '00000000000000',
      address: process.env.MELHORENVIO_FROM_STREET ?? 'Rua Exemplo',
      number: process.env.MELHORENVIO_FROM_NUMBER ?? '1',
      district: process.env.MELHORENVIO_FROM_DISTRICT ?? 'Centro',
      city: process.env.MELHORENVIO_FROM_CITY ?? 'São Paulo',
      state_abbr: process.env.MELHORENVIO_FROM_STATE ?? 'SP',
      country_id: 'BR',
      postal_code: (process.env.MELHORENVIO_FROM_CEP ?? '').replace(/\D/g, ''),
    },
    to: {
      name: opts.order.customer.name,
      phone: opts.order.customer.phone.replace(/\D/g, ''),
      email: opts.order.customer.email,
      document: opts.order.customer.document.replace(/\D/g, ''),
      address: opts.order.toAddress.street,
      number: opts.order.toAddress.number,
      complement: opts.order.toAddress.complement ?? '',
      district: opts.order.toAddress.neighborhood,
      city: opts.order.toAddress.city,
      state_abbr: opts.order.toAddress.state,
      country_id: 'BR',
      postal_code: opts.order.toAddress.zip.replace(/\D/g, ''),
    },
    products: opts.order.items.map(i => ({
      name: i.name,
      quantity: i.quantity,
      unitary_value: i.price,
    })),
    volumes: [{ height: 20, width: 20, length: 20, weight: 0.5 }],
    options: {
      insurance_value: opts.order.total,
      receipt: false,
      own_hand: false,
      collect: false,
      reverse: false,
      non_commercial: false,
    },
    tag: `BG-${opts.order.id.slice(0, 8)}`,
    platform: 'BeGamers Store',
  }

  const res = await fetch(meUrl('/me/cart'), {
    method: 'POST',
    headers: meHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`ME addToCart: ${err}`)
  }
  const data = await res.json() as { id: string }
  return data.id
}

export async function checkoutMECart(shipmentId: string): Promise<void> {
  const res = await fetch(meUrl('/me/shipment/checkout'), {
    method: 'POST',
    headers: meHeaders(),
    body: JSON.stringify({ orders: [shipmentId] }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`ME checkout: ${err}`)
  }
}

export async function getShipmentTracking(shipmentId: string): Promise<{
  status: string
  tracking: string
  events: Array<{ description: string; location: string; created_at: string }>
} | null> {
  const res = await fetch(meUrl(`/me/orders/tracking?orders[]=${shipmentId}`), {
    headers: meHeaders(),
    next: { revalidate: 0 },
  })
  if (!res.ok) return null
  const data = await res.json() as Record<string, any>
  const s = data[shipmentId]
  if (!s) return null
  return {
    status: s.status ?? 'posted',
    tracking: s.tracking ?? '',
    events: (s.tracking_history ?? []).map((e: any) => ({
      description: e.description ?? e.status ?? '',
      location: e.location ?? '',
      created_at: e.created_at ?? new Date().toISOString(),
    })),
  }
}

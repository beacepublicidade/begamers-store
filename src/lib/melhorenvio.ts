export interface ShippingOption {
  id: number
  name: string
  company: string
  price: number
  delivery_time: number
}

export async function calculateShipping(opts: {
  fromCep: string
  toCep: string
  weight?: number
  height?: number
  width?: number
  length?: number
}): Promise<ShippingOption[]> {
  const token = process.env.MELHORENVIO_TOKEN!
  const res = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'BeGamers Store (coloqueaficha@gmail.com)',
      Accept: 'application/json',
    },
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

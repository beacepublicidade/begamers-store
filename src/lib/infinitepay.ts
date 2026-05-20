const IP_BASE = 'https://api.infinitepay.io'
const IP_AUTH = 'https://authorizer.infinitepay.io'

export function hasTransparentCredentials() {
  return !!(process.env.INFINITEPAY_CLIENT_ID && process.env.INFINITEPAY_CLIENT_SECRET)
}

async function getToken(scope: string): Promise<string> {
  const res = await fetch(`${IP_BASE}/v2/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.INFINITEPAY_CLIENT_ID,
      client_secret: process.env.INFINITEPAY_CLIENT_SECRET,
      scope,
    }),
  })
  if (!res.ok) throw new Error(`InfinitePay auth (${scope}) failed: ${res.status}`)
  const data = await res.json()
  return data.access_token as string
}

export async function createPixTransaction(params: {
  amount: number
  orderId: string
  customer: { name: string; email: string; document?: string }
  webhookUrl: string
}): Promise<{ br_code: string; transaction_id: string }> {
  const token = await getToken('transactions')
  const res = await fetch(`${IP_BASE}/v2/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      amount: params.amount,
      capture_method: 'pix',
      order_id: params.orderId,
      customer: {
        name: params.customer.name,
        email: params.customer.email,
        document_number: params.customer.document ?? '',
      },
      metadata: { order_id: params.orderId, callback_url: params.webhookUrl },
    }),
  })
  if (!res.ok) throw new Error(`InfinitePay PIX failed: ${await res.text()}`)
  const data = await res.json()
  const br_code = data.pix?.br_code ?? data.br_code ?? data.qr_code ?? ''
  const transaction_id = data.id ?? data.transaction_id ?? ''
  return { br_code, transaction_id }
}

export async function tokenizeCard(card: {
  number: string
  expiration_month: string
  expiration_year: string
  holder_name: string
  cvv: string
}): Promise<string> {
  const token = await getToken('card_tokenization')
  const res = await fetch(`${IP_AUTH}/v2/cards/tokenize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(card),
  })
  if (!res.ok) throw new Error(`InfinitePay tokenize failed: ${await res.text()}`)
  const data = await res.json()
  return data.card_token ?? data.token ?? ''
}

export async function createCardTransaction(params: {
  amount: number
  orderId: string
  cardToken: string
  installments: number
  customer: { name: string; email: string; document?: string }
}): Promise<{ status: string; transaction_id: string }> {
  const token = await getToken('transactions')
  const res = await fetch(`${IP_BASE}/v2/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      amount: params.amount,
      capture_method: 'ecommerce',
      installments: params.installments,
      payment_types: ['credit'],
      card_token: params.cardToken,
      order_id: params.orderId,
      customer: {
        name: params.customer.name,
        email: params.customer.email,
        document_number: params.customer.document ?? '',
      },
    }),
  })
  if (!res.ok) throw new Error(`InfinitePay card failed: ${await res.text()}`)
  const data = await res.json()
  return {
    status: data.status ?? 'pending',
    transaction_id: data.id ?? data.transaction_id ?? '',
  }
}

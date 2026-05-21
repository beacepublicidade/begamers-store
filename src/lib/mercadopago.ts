import { MercadoPagoConfig, Payment } from 'mercadopago'

function getClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! })
}

export async function createMPPixPayment(opts: {
  amount: number
  orderId: string
  customer: { name: string; email: string; cpf: string }
}) {
  const parts = opts.customer.name.trim().split(' ')
  const response = await new Payment(getClient()).create({
    body: {
      transaction_amount: opts.amount,
      payment_method_id: 'pix',
      description: `Pedido BeGamers #${opts.orderId.slice(-8)}`,
      external_reference: opts.orderId,
      payer: {
        email: opts.customer.email,
        first_name: parts[0],
        last_name: parts.slice(1).join(' ') || parts[0],
        identification: { type: 'CPF', number: opts.customer.cpf.replace(/\D/g, '') },
      },
    },
  })
  const qrCode = response.point_of_interaction?.transaction_data?.qr_code
  if (!qrCode) throw new Error('QR Code PIX não gerado pelo Mercado Pago')
  return { br_code: qrCode, payment_id: String(response.id) }
}

export async function createMPCardPayment(opts: {
  amount: number
  orderId: string
  cardToken: string
  paymentMethodId: string
  installments: number
  customer: { email: string }
}) {
  const response = await new Payment(getClient()).create({
    body: {
      transaction_amount: opts.amount,
      token: opts.cardToken,
      installments: opts.installments,
      payment_method_id: opts.paymentMethodId,
      description: `Pedido BeGamers #${opts.orderId.slice(-8)}`,
      external_reference: opts.orderId,
      payer: { email: opts.customer.email },
    },
  })
  return { status: response.status ?? 'pending', payment_id: String(response.id) }
}

export async function getMPPaymentById(paymentId: string) {
  return new Payment(getClient()).get({ id: Number(paymentId) })
}

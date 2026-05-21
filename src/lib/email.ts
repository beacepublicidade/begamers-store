interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  items: Array<{ product_name: string; quantity: number; price: number }>
  paymentMethod: string
  shippingMethod?: string
}

function fmtPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function buildOrderEmail(data: OrderEmailData): string {
  const itemsHtml = data.items.map(i => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #222;font-size:13px;color:#d4d4d4">${i.product_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #222;font-size:13px;color:#d4d4d4;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #222;font-size:13px;color:#d4d4d4;text-align:right">${fmtPrice(i.price * i.quantity)}</td>
    </tr>`).join('')

  const pm = data.paymentMethod === 'pix' ? 'PIX' : data.paymentMethod === 'credit' ? 'Cartão de Crédito' : data.paymentMethod === 'boleto' ? 'Boleto Bancário' : data.paymentMethod

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pedido #${data.orderNumber}</title></head>
<body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#000">
    <!-- Header -->
    <div style="background:#cc0000;padding:24px 32px">
      <div style="font-family:Impact,'Arial Black',sans-serif;font-size:28px;letter-spacing:0.06em;color:#fff;text-transform:uppercase">BEGAMERS STORE</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:0.14em;text-transform:uppercase;margin-top:4px">// CONFIRMAÇÃO DE PEDIDO</div>
    </div>
    <!-- Body -->
    <div style="padding:32px">
      <p style="color:#fff;font-size:16px;margin:0 0 8px">Oi, ${data.customerName.split(' ')[0]}!</p>
      <p style="color:#a3a3a3;font-size:14px;margin:0 0 24px;line-height:1.6">Seu pedido foi recebido e já está sendo processado. Acompanhe o status abaixo.</p>

      <div style="background:#131313;border:1px solid #222;padding:16px 20px;margin-bottom:24px">
        <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#a3a3a3;margin-bottom:8px">// NÚMERO DO PEDIDO</div>
        <div style="font-family:Impact,'Arial Black',sans-serif;font-size:32px;color:#cc0000;letter-spacing:0.04em">#${data.orderNumber}</div>
      </div>

      <!-- Items -->
      <div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#a3a3a3;margin-bottom:12px">// ITENS DO PEDIDO</div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="border-bottom:1px solid #333">
            <th style="padding:8px 12px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#666;text-align:left;font-weight:600">Produto</th>
            <th style="padding:8px 12px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#666;text-align:center;font-weight:600">Qtd</th>
            <th style="padding:8px 12px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#666;text-align:right;font-weight:600">Valor</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Total -->
      <div style="border-top:1px solid #333;padding-top:16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
        <div>
          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#666">Forma de pagamento</div>
          <div style="font-size:13px;color:#d4d4d4;margin-top:4px">${pm}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#666">Total</div>
          <div style="font-family:Impact,'Arial Black',sans-serif;font-size:24px;color:#cc0000">${fmtPrice(data.total)}</div>
        </div>
      </div>

      ${data.paymentMethod === 'pix' ? `
      <div style="background:rgba(204,0,0,0.1);border:1px solid rgba(204,0,0,0.3);padding:14px 18px;margin-bottom:24px">
        <div style="font-size:12px;color:#ff6b6b;font-weight:600;margin-bottom:4px">⚡ Aguardando confirmação do PIX</div>
        <div style="font-size:12px;color:#a3a3a3">Após o pagamento ser confirmado, você receberá outro e-mail com a atualização do pedido.</div>
      </div>` : ''}

      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://begamerstore.com.br'}/conta/pedidos" style="display:block;background:#cc0000;color:#fff;text-decoration:none;text-align:center;padding:14px;font-family:Impact,'Arial Black',sans-serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:24px">
        ACOMPANHAR PEDIDO →
      </a>
    </div>
    <!-- Footer -->
    <div style="padding:20px 32px;border-top:1px solid #1a1a1a">
      <p style="color:#555;font-size:11px;margin:0;line-height:1.6">BeGamers Store · Dúvidas? Fale com a gente em contato@begamers.com.br<br>Você recebeu este e-mail porque realizou uma compra em nossa loja.</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // silently skip if not configured

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? 'BeGamers Store <pedidos@begamerstore.com.br>',
        to: [data.customerEmail],
        reply_to: 'Suporte BeGamers <suporte@begamerstore.com.br>',
        subject: `✅ Pedido #${data.orderNumber} recebido — BeGamers Store`,
        html: buildOrderEmail(data),
      }),
    })
  } catch {
    // never crash checkout due to email failure
  }
}

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

interface PageProps { params: { id: string } }

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente', confirmed: 'Confirmado', processing: 'Processando',
  shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado', refunded: 'Reembolsado',
}

function fmtPrice(v: number) {
  return (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function PedidoDetailPage({ params }: PageProps) {
  const supabase = createClient()
  const { data: order } = await supabase
    .from('orders')
    .select(`*, customers(name, email, phone), order_items(*, products(name, product_images(url, is_primary)))`)
    .eq('id', params.id)
    .single() as unknown as { data: any }

  if (!order) notFound()

  const cardStyle: React.CSSProperties = {
    background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, padding: 24, marginBottom: 20,
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 4, display: 'block',
  }

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/admin/pedidos" style={{ color: 'var(--fg3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Icon name="chevL" size={16} /> Pedidos
        </Link>
        <span style={{ color: 'var(--hair-strong)' }}>/</span>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 22, textTransform: 'uppercase' }}>
          #{order.order_number}
        </h1>
        <span style={{ marginLeft: 'auto', fontSize: 12, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', border: '1px solid var(--hair)', borderRadius: 2, color: 'var(--fg2)' }}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={cardStyle}>
          <p style={labelStyle}>Cliente</p>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{order.customers?.name ?? '—'}</p>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--fg2)' }}>{order.customers?.email}</p>
          {order.customers?.phone && <p style={{ margin: 0, fontSize: 13, color: 'var(--fg3)' }}>{order.customers.phone}</p>}
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Pagamento</p>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{order.payment_method ?? '—'}</p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg2)' }}>Status: {order.payment_status}</p>
        </div>
      </div>

      <div style={cardStyle}>
        <p style={{ ...labelStyle, marginBottom: 16 }}>Itens do Pedido</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hair)' }}>
              {['Produto', 'Qtd', 'Preço Unit.', 'Subtotal'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(order.order_items ?? []).map((item: any) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{item.product_name ?? item.products?.name}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{item.quantity}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{fmtPrice(item.price)}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600 }}>{fmtPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: '1px solid var(--hair)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 32 }}>
          {order.discount > 0 && <div style={{ textAlign: 'right' }}><span style={{ fontSize: 11, color: 'var(--fg3)' }}>Desconto</span><br /><span style={{ color: '#4cd680' }}>-{fmtPrice(order.discount)}</span></div>}
          {order.shipping_cost > 0 && <div style={{ textAlign: 'right' }}><span style={{ fontSize: 11, color: 'var(--fg3)' }}>Frete</span><br /><span>{fmtPrice(order.shipping_cost)}</span></div>}
          <div style={{ textAlign: 'right' }}><span style={{ fontSize: 11, color: 'var(--fg3)' }}>Total</span><br /><span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display-heavy)' }}>{fmtPrice(order.total)}</span></div>
        </div>
      </div>

      {order.shipping_address && (
        <div style={cardStyle}>
          <p style={labelStyle}>Endereço de Entrega</p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: 'var(--fg2)' }}>
            {order.shipping_address.street}, {order.shipping_address.number}{order.shipping_address.complement ? ` — ${order.shipping_address.complement}` : ''}<br />
            {order.shipping_address.neighborhood} — {order.shipping_address.city}/{order.shipping_address.state}<br />
            CEP: {order.shipping_address.zip}
          </p>
        </div>
      )}
    </div>
  )
}

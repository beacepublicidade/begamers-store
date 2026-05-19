import { createClient } from '@/lib/supabase/server'
import Icon from '@/components/ui/Icon'

async function getStats() {
  const supabase = createClient()
  const [products, orders, customers] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id, total, status'),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
  ])

  const ordersData = (orders.data ?? []) as Array<{ id: string; total: number; status: string }>
  const revenue = ordersData
    .filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status))
    .reduce((acc, o) => acc + Number(o.total), 0)
  const pending = ordersData.filter(o => o.status === 'pending').length

  return {
    products: products.count ?? 0,
    orders: ordersData.length,
    customers: customers.count ?? 0,
    revenue,
    pending,
  }
}

type RecentOrder = { id: string; order_number: string; status: string; total: number; created_at: string }

async function getRecentOrders(): Promise<RecentOrder[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at')
    .order('created_at', { ascending: false })
    .limit(10)
  return (data ?? []) as unknown as RecentOrder[]
}

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Aguardando', color: '#ffc940', bg: '#3a2a00' },
  paid:       { label: 'Pago', color: '#4cd680', bg: '#0e3a1f' },
  processing: { label: 'Processando', color: '#60a5fa', bg: '#0e2040' },
  shipped:    { label: 'Enviado', color: '#a78bfa', bg: '#1e1040' },
  delivered:  { label: 'Entregue', color: '#4cd680', bg: '#0e3a1f' },
  cancelled:  { label: 'Cancelado', color: '#f87171', bg: '#3a0e0e' },
  refunded:   { label: 'Reembolsado', color: '#fb923c', bg: '#3a1a00' },
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  const cards = [
    { label: 'Receita Total', value: fmt(stats.revenue), icon: 'chart', accent: true },
    { label: 'Pedidos', value: String(stats.orders), icon: 'truck', sub: `${stats.pending} aguardando` },
    { label: 'Produtos', value: String(stats.products), icon: 'package2' },
    { label: 'Clientes', value: String(stats.customers), icon: 'users' },
  ]

  return (
    <div style={{ padding: 32 }}>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Dashboard
        </h1>
        <p style={{ margin: '4px 0 0', color: 'var(--fg3)', fontSize: 13 }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: c.accent ? 'var(--bg-accent)' : 'var(--surf-2)',
            border: `1px solid ${c.accent ? 'transparent' : 'var(--hair)'}`,
            padding: 24, borderRadius: 2,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: c.accent ? 'rgba(255,255,255,0.8)' : 'var(--fg3)' }}>
                {c.label}
              </span>
              <Icon name={c.icon} size={18} color={c.accent ? 'rgba(255,255,255,0.6)' : 'var(--fg3)'} />
            </div>
            <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 32, fontWeight: 900, lineHeight: 1 }}>
              {c.value}
            </div>
            {c.sub && <div style={{ fontSize: 11, color: c.accent ? 'rgba(255,255,255,0.7)' : 'var(--fg3)', marginTop: 6 }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2 }}>
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid var(--hair)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Pedidos Recentes
          </h2>
          <a href="/admin/pedidos" style={{ fontSize: 12, color: 'var(--bg-accent-hot)', textDecoration: 'none', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Ver todos →
          </a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hair)' }}>
              {['Pedido', 'Status', 'Total', 'Data'].map(h => (
                <th key={h} style={{
                  padding: '10px 24px', textAlign: 'left',
                  fontFamily: 'var(--font-display-heavy)', fontSize: 10,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)',
                  fontWeight: 900,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--fg3)', fontSize: 13 }}>
                  Nenhum pedido ainda
                </td>
              </tr>
            ) : recentOrders.map(order => {
              const s = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                  <td style={{ padding: '14px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, color: '#fff' }}>
                    {order.order_number}
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{
                      padding: '4px 8px', fontSize: 10, fontWeight: 700,
                      fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: s.color, background: s.bg,
                    }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 14, fontWeight: 900 }}>
                    {fmt(Number(order.total))}
                  </td>
                  <td style={{ padding: '14px 24px', fontSize: 12, color: 'var(--fg3)' }}>
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

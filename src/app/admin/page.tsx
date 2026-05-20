import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

function fmt(v: number) {
  return 'R$ ' + (v / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
function fmtInt(v: number) {
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

async function getStats() {
  const supabase = createClient()
  const [products, orders, customers] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id, total, status, payment_status, created_at'),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
  ])

  const ordersData = (orders.data ?? []) as Array<{ id: string; total: number; status: string; payment_status: string; created_at: string }>
  const revenue = ordersData.filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status)).reduce((a, o) => a + Number(o.total), 0)
  const pending = ordersData.filter(o => o.status === 'pending').length
  const today = new Date().toISOString().slice(0, 10)
  const todayOrders = ordersData.filter(o => o.created_at?.slice(0, 10) === today)
  const todayRevenue = todayOrders.reduce((a, o) => a + Number(o.total), 0)

  return {
    products: products.count ?? 0,
    orders: ordersData.length,
    customers: customers.count ?? 0,
    revenue,
    pending,
    todayRevenue,
    todayOrders: todayOrders.length,
  }
}

type RecentOrder = { id: string; order_number: string; status: string; total: number; created_at: string; payment_method: string }

async function getRecentOrders(): Promise<RecentOrder[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at, payment_method')
    .order('created_at', { ascending: false })
    .limit(8)
  return (data ?? []) as unknown as RecentOrder[]
}

const STATUS: Record<string, { l: string; c: string; bg: string }> = {
  pending:    { l: 'Aguardando', c: '#ffc940', bg: 'rgba(217,154,0,0.12)' },
  paid:       { l: 'Pago',       c: '#4cd680', bg: 'rgba(31,157,85,0.12)' },
  processing: { l: 'Processando',c: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  shipped:    { l: 'Enviado',    c: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  delivered:  { l: 'Entregue',  c: '#4cd680', bg: 'rgba(31,157,85,0.12)' },
  cancelled:  { l: 'Cancelado', c: '#f87171', bg: 'rgba(248,113,113,0.12)' },
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 64, h = 28
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" fill="none" opacity={0.8} />
    </svg>
  )
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getStats(), getRecentOrders()])

  const KPI = [
    { l: 'FATURAMENTO TOTAL', v: fmt(stats.revenue), d: `${fmtInt(stats.orders)} pedidos`, c: '#4cd680', spark: [3, 5, 4, 7, 6, 8, 9] },
    { l: 'HOJE',             v: fmt(stats.todayRevenue), d: `${stats.todayOrders} pedidos hoje`, c: '#4cd680', spark: [2, 3, 2, 4, 5, 4, 6] },
    { l: 'AGUARDANDO',       v: String(stats.pending), d: 'pedidos pendentes', c: stats.pending > 0 ? '#ffc940' : '#4cd680', spark: [4, 3, 5, 4, 3, 4, stats.pending] },
    { l: 'CLIENTES',         v: fmtInt(stats.customers), d: `${fmtInt(stats.products)} produtos`, c: '#a78bfa', spark: [1, 2, 2, 3, 4, 4, 5] },
  ]

  return (
    <div>
      {/* Topbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--hair-strong)',
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 4 }}>
            // VISÃO · DASHBOARD
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            DASHBOARD.
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/admin/produtos/novo" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'var(--bg-accent-hot)', color: '#fff',
            fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
            textDecoration: 'none',
            clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
          }}>
            <Icon name="plus" size={14} /> Novo Produto
          </Link>
        </div>
      </div>

      <div style={{ padding: 32 }}>
        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {KPI.map((k, i) => (
            <div key={k.l} style={{
              padding: 20, background: i === 0 ? 'rgba(255,31,61,0.08)' : 'var(--surf-1)',
              border: `1px solid ${i === 0 ? 'var(--bg-accent-hot)' : 'var(--hair)'}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 10 }}>
                // {k.l}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, lineHeight: 1, letterSpacing: '-0.02em' }}>{k.v}</div>
                  <div style={{ fontSize: 11, color: k.c, marginTop: 6, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{k.d}</div>
                </div>
                <Sparkline data={k.spark} color={k.c} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
          {[
            { href: '/admin/pedidos', label: 'Ver Pedidos', icon: 'pkg' },
            { href: '/admin/produtos', label: 'Produtos', icon: 'rows' },
            { href: '/admin/clientes', label: 'Clientes', icon: 'user' },
            { href: '/admin/configuracoes', label: 'Configurações', icon: 'shield' },
          ].map(a => (
            <Link key={a.href} href={a.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 18px', background: 'var(--surf-1)', border: '1px solid var(--hair)',
              color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-display-heavy)',
              fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'border-color 120ms',
            }}>
              <Icon name={a.icon} size={15} color="var(--bg-accent-hot)" />
              {a.label}
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// PEDIDOS RECENTES</span>
            </div>
            <Link href="/admin/pedidos" style={{ fontSize: 11, color: 'var(--bg-accent-hot)', textDecoration: 'none', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Ver todos →
            </Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                {['Pedido', 'Status', 'Pagamento', 'Total', 'Data'].map(h => (
                  <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)', fontWeight: 700 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--fg3)', fontSize: 13 }}>
                    Nenhum pedido ainda
                  </td>
                </tr>
              ) : recentOrders.map(order => {
                const s = STATUS[order.status] ?? STATUS.pending
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                    <td style={{ padding: '13px 24px' }}>
                      <Link href={`/admin/pedidos/${order.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bg-accent-hot)', textDecoration: 'none' }}>
                        {order.order_number}
                      </Link>
                    </td>
                    <td style={{ padding: '13px 24px' }}>
                      <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg }}>
                        {s.l}
                      </span>
                    </td>
                    <td style={{ padding: '13px 24px', fontSize: 11, color: 'var(--fg2)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {order.payment_method ?? '—'}
                    </td>
                    <td style={{ padding: '13px 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 14 }}>
                      {fmt(Number(order.total))}
                    </td>
                    <td style={{ padding: '13px 24px', fontSize: 11, color: 'var(--fg3)' }}>
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

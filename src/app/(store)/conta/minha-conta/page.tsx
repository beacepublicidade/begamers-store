import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

function fmt(v: number) {
  return 'R$ ' + (v / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const STATUS: Record<string, { l: string; c: string; bg: string }> = {
  pending:    { l: 'Aguardando', c: '#ffc940', bg: 'rgba(217,154,0,0.12)' },
  paid:       { l: 'Pago',       c: '#4cd680', bg: 'rgba(31,157,85,0.12)' },
  processing: { l: 'Processando',c: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  shipped:    { l: 'Enviado',    c: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  delivered:  { l: 'Entregue',  c: '#4cd680', bg: 'rgba(31,157,85,0.12)' },
  cancelled:  { l: 'Cancelado', c: '#f87171', bg: 'rgba(248,113,113,0.12)' },
}

async function getCustomerOrders(email: string) {
  const supabase = createClient()
  const { data: customers } = await supabase.from('customers').select('id').eq('email', email) as unknown as { data: Array<{ id: string }> | null }
  const ids = (customers ?? []).map(c => c.id)
  if (ids.length === 0) return []
  const { data } = await supabase
    .from('orders')
    .select('id, order_number, status, total, payment_method, created_at, shipping_method')
    .in('customer_id', ids)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as Array<{ id: string; order_number: string; status: string; total: number; payment_method: string; created_at: string; shipping_method: string }>
}

export default async function MinhaContaPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/conta/login')

  const email = user.email ?? ''
  const name = user.user_metadata?.name ?? email.split('@')[0]
  const initials = name.slice(0, 2).toUpperCase()
  const orders = await getCustomerOrders(email)

  const totalGasto = orders.filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status)).reduce((a, o) => a + Number(o.total), 0)

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 64px' }}>
        {/* Hero */}
        <div style={{
          position: 'relative', padding: '32px 40px', marginBottom: 32, overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a0006 0%, #000 50%)',
          border: '1px solid var(--hair)',
        }}>
          <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{
                width: 88, height: 88, background: 'var(--bg-accent)',
                clipPath: 'polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display-heavy)', fontSize: 28, flexShrink: 0,
              }}>{initials}</div>
              <div>
                <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// MEMBRO BEGAMERS</span>
                <h1 style={{ margin: '8px 0 4px', fontFamily: 'var(--font-display-heavy)', fontSize: 44, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  FALA, {name.split(' ')[0].toUpperCase()}.
                </h1>
                <p style={{ margin: 0, color: 'var(--fg2)', fontSize: 13 }}>
                  {email} · {orders.length} pedidos · {fmt(totalGasto)} gasto
                </p>
              </div>
            </div>
            <form action="/api/conta/logout" method="POST">
              <button type="submit" style={{
                padding: '10px 20px', background: 'transparent', border: '1px solid var(--hair-strong)',
                color: 'var(--fg2)', fontFamily: 'var(--font-display-heavy)', fontSize: 11,
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              }}>
                Sair
              </button>
            </form>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { l: 'PEDIDOS REALIZADOS', v: String(orders.length), icon: 'pkg' },
            { l: 'TOTAL GASTO',        v: fmt(totalGasto),        icon: 'bolt' },
            { l: 'PEDIDOS PENDENTES',  v: String(orders.filter(o => o.status === 'pending').length), icon: 'truck' },
          ].map(k => (
            <div key={k.l} style={{ padding: 20, background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <Icon name={k.icon} size={16} color="var(--bg-accent-hot)" />
                <span className="eyebrow-mono">// {k.l}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, lineHeight: 1 }}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--hair)' }}>
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// MEUS PEDIDOS</span>
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--fg3)' }}>
              <Icon name="pkg" size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Nenhum pedido ainda</p>
              <Link href="/produtos" style={{ color: 'var(--bg-accent)', textDecoration: 'none', fontSize: 14, fontFamily: 'var(--font-display-heavy)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Ver produtos →
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                  {['Pedido', 'Status', 'Pagamento', 'Entrega', 'Total', 'Data'].map(h => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const s = STATUS[order.status] ?? STATUS.pending
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                      <td style={{ padding: '13px 24px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bg-accent-hot)' }}>
                        <Link href={`/conta/pedidos/${order.id}`} style={{ color: 'var(--bg-accent-hot)', textDecoration: 'none' }}>#{order.order_number}</Link>
                      </td>
                      <td style={{ padding: '13px 24px' }}>
                        <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg }}>{s.l}</span>
                      </td>
                      <td style={{ padding: '13px 24px', fontSize: 11, color: 'var(--fg2)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{order.payment_method ?? '—'}</td>
                      <td style={{ padding: '13px 24px', fontSize: 11, color: 'var(--fg2)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{order.shipping_method ?? '—'}</td>
                      <td style={{ padding: '13px 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 14 }}>{fmt(Number(order.total))}</td>
                      <td style={{ padding: '13px 24px', fontSize: 11, color: 'var(--fg3)' }}>{new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

    </div>
  )
}

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ContaSidebar from '@/components/conta/ContaSidebar'
import OrdersSection from '@/components/conta/OrdersSection'
import Icon from '@/components/ui/Icon'

function fmt(v: number) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function getCustomerOrders(userId: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('orders')
    .select(`id, order_number, status, total, payment_method, created_at,
      order_items(id, name, quantity, price, product:products(slug, product_images(url, is_primary))),
      order_tracking(id)`)
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })
  return (data ?? []) as unknown as any[]
}

export default async function MinhaContaPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/conta/login')

  const email = user.email ?? ''
  const name = user.user_metadata?.name ?? email.split('@')[0]
  const orders = await getCustomerOrders(user.id)

  const totalGasto = orders
    .filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status))
    .reduce((a, o) => a + Number(o.total), 0)

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        <ContaSidebar name={name} email={email} activePath="/conta/minha-conta" />

        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Hero */}
          <div style={{
            position: 'relative', overflow: 'hidden', marginBottom: 24,
            background: 'linear-gradient(135deg, #1a0006 0%, #000 50%)',
            padding: '28px 32px', border: '1px solid var(--hair)',
          }}>
            <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.25 }} />
            <div style={{ position: 'relative' }}>
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// MEMBRO BEGAMERS</span>
              <h1 style={{ margin: '8px 0 4px', fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.02em' }}>
                FALA, {name.split(' ')[0].toUpperCase()}.
              </h1>
              <p style={{ margin: 0, color: 'var(--fg2)', fontSize: 13 }}>
                {email} · {orders.length} pedidos · {fmt(totalGasto)} gasto
              </p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            {[
              { l: 'BG COINS',      v: '0',                                        icon: 'bolt',  c: 'var(--bg-accent-hot)' },
              { l: 'CUPONS ATIVOS', v: '0',                                        icon: 'tag',   c: '#4cd680' },
              { l: 'LISTA DESEJOS', v: '0',                                        icon: 'heart', c: '#a78bfa' },
            ].map(k => (
              <div key={k.l} style={{ padding: '16px 20px', background: 'var(--surf-1)', border: '1px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 14 }}>
                <Icon name={k.icon} size={20} color={k.c} />
                <div>
                  <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 22, lineHeight: 1 }}>{k.v}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginTop: 4 }}>{k.l}</div>
                </div>
              </div>
            ))}
          </div>

          <OrdersSection orders={orders} />
        </main>
      </div>
    </div>
  )
}

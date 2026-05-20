import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'

interface PageProps { params: { id: string } }

function fmt(v: number) {
  return (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const STATUS: Record<string, { l: string; c: string; bg: string; step: number }> = {
  pending:    { l: 'Aguardando Pagamento', c: '#ffc940', bg: 'rgba(217,154,0,0.12)',    step: 1 },
  paid:       { l: 'Pago',                c: '#4cd680', bg: 'rgba(31,157,85,0.12)',     step: 2 },
  processing: { l: 'Preparando',          c: '#60a5fa', bg: 'rgba(96,165,250,0.12)',    step: 2 },
  shipped:    { l: 'Enviado',             c: '#a78bfa', bg: 'rgba(167,139,250,0.12)',   step: 3 },
  delivered:  { l: 'Entregue',            c: '#4cd680', bg: 'rgba(31,157,85,0.12)',     step: 4 },
  cancelled:  { l: 'Cancelado',           c: '#f87171', bg: 'rgba(248,113,113,0.12)',   step: 0 },
}

const STEPS = ['Pedido', 'Pagamento', 'Envio', 'Entregue']

export default async function PedidoClientePage({ params }: PageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/conta/login?redirect=/conta/pedidos/' + params.id)

  const email = user.email ?? ''
  const { data: customers } = await supabase.from('customers').select('id').eq('email', email) as unknown as { data: Array<{ id: string }> | null }
  const customerIds = (customers ?? []).map(c => c.id)

  const { data: order } = await supabase
    .from('orders')
    .select(`*, order_items(*, products(name, slug, product_images(url, is_primary)))`)
    .eq('id', params.id)
    .in('customer_id', customerIds)
    .single() as unknown as { data: any }

  if (!order) notFound()

  const s = STATUS[order.status] ?? STATUS.pending

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <StoreHeader />

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 32px 80px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 32 }}>
          <Link href="/" style={{ color: 'var(--fg2)', textDecoration: 'none' }}>HOME</Link>
          <span>/</span>
          <Link href="/conta/minha-conta" style={{ color: 'var(--fg2)', textDecoration: 'none' }}>MINHA CONTA</Link>
          <span>/</span>
          <span style={{ color: '#fff' }}>PEDIDO #{order.order_number}</span>
        </nav>

        {/* Hero */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginBottom: 32,
          background: 'linear-gradient(135deg, #1a0006 0%, #000 50%)',
          padding: '32px 40px', border: '1px solid var(--hair)',
        }}>
          <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// MEU PEDIDO</span>
              <h1 style={{ margin: '8px 0 4px', fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
                #{order.order_number}
              </h1>
              <p style={{ margin: 0, color: 'var(--fg2)', fontSize: 13 }}>
                {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <span style={{ padding: '8px 16px', fontSize: 12, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg, border: `1px solid ${s.c}33` }}>
              {s.l}
            </span>
          </div>
        </div>

        {/* Status tracker */}
        {order.status !== 'cancelled' && (
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: '24px 32px', marginBottom: 24 }}>
            <span className="eyebrow-mono" style={{ color: 'var(--fg3)', display: 'block', marginBottom: 20 }}>// RASTREAMENTO</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {STEPS.map((step, i) => {
                const done = s.step > i
                const active = s.step === i + 1
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: done || active ? 'var(--bg-accent)' : 'var(--surf-2)',
                        border: active ? '2px solid var(--bg-accent-hot)' : done ? '2px solid var(--bg-accent)' : '1px solid var(--hair-strong)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {done ? <Icon name="check" size={16} stroke={2.5} /> : <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 13 }}>{i + 1}</span>}
                      </div>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: done || active ? '#fff' : 'var(--fg3)', whiteSpace: 'nowrap' }}>{step}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: done ? 'var(--bg-accent)' : 'var(--surf-2)', margin: '0 8px', marginBottom: 28 }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Items */}
          <div>
            <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--hair)' }}>
                <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// ITENS DO PEDIDO</span>
              </div>
              {(order.order_items ?? []).map((item: any) => {
                const img = item.products?.product_images?.find((i: any) => i.is_primary)?.url ?? item.products?.product_images?.[0]?.url
                return (
                  <div key={item.id} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--hair)', alignItems: 'center' }}>
                    {img ? (
                      <img src={img} alt="" style={{ width: 64, height: 64, objectFit: 'cover', background: 'var(--surf-2)', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 64, height: 64, background: 'var(--surf-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="pkg" size={24} color="var(--fg3)" />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.product_name ?? item.products?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg3)' }}>Qtd: {item.quantity} × {fmt(item.price)}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 15 }}>{fmt(item.price * item.quantity)}</div>
                  </div>
                )
              })}
            </div>

            {/* Shipping address */}
            {order.shipping_address && (
              <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', marginTop: 16, padding: '20px' }}>
                <span className="eyebrow-mono" style={{ color: 'var(--fg3)', display: 'block', marginBottom: 12 }}>// ENDEREÇO DE ENTREGA</span>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: 'var(--fg2)' }}>
                  {order.shipping_address.street}, {order.shipping_address.number}
                  {order.shipping_address.complement ? ` — ${order.shipping_address.complement}` : ''}<br />
                  {order.shipping_address.neighborhood} — {order.shipping_address.city}/{order.shipping_address.state}<br />
                  CEP: {order.shipping_address.zip}
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: 20 }}>
              <span className="eyebrow-mono" style={{ color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// RESUMO</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                {order.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--fg2)' }}>Desconto</span>
                    <span style={{ color: '#4cd680' }}>-{fmt(order.discount)}</span>
                  </div>
                )}
                {order.shipping_cost > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--fg2)' }}>Frete</span>
                    <span>{fmt(order.shipping_cost)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--hair)', paddingTop: 12, marginTop: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, textTransform: 'uppercase' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 18 }}>{fmt(order.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--fg3)' }}>Pagamento</span>
                  <span style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{order.payment_method ?? '—'}</span>
                </div>
              </div>
            </div>

            <Link href="/conta/minha-conta" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px', background: 'transparent', border: '1px solid var(--hair-strong)',
              color: 'var(--fg2)', fontSize: 12, fontFamily: 'var(--font-display-heavy)',
              letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
            }}>
              <Icon name="chevL" size={14} /> Voltar à conta
            </Link>

            <Link href="/produtos" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px', background: 'var(--bg-accent)', border: 'none',
              color: '#fff', fontSize: 12, fontFamily: 'var(--font-display-heavy)',
              letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
              clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
            }}>
              Continuar comprando
            </Link>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}

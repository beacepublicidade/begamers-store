import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

interface PageProps { params: { numero: string } }

function fmt(v: number) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const STATUS: Record<string, { l: string; c: string; bg: string; step: number }> = {
  pending:    { l: 'Aguardando Pagamento', c: '#ffc940', bg: 'rgba(217,154,0,0.12)',  step: 1 },
  paid:       { l: 'Pago',                c: '#4cd680', bg: 'rgba(31,157,85,0.12)',   step: 2 },
  processing: { l: 'Preparando',          c: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  step: 2 },
  shipped:    { l: 'Enviado',             c: '#a78bfa', bg: 'rgba(167,139,250,0.12)', step: 3 },
  delivered:  { l: 'Entregue',            c: '#4cd680', bg: 'rgba(31,157,85,0.12)',   step: 4 },
  cancelled:  { l: 'Cancelado',           c: '#f87171', bg: 'rgba(248,113,113,0.12)', step: 0 },
}

const PAYMENT_STATUS: Record<string, { l: string; c: string }> = {
  pending:  { l: 'Aguardando', c: '#ffc940' },
  paid:     { l: 'Pago',       c: '#4cd680' },
  failed:   { l: 'Falhou',     c: '#f87171' },
  refunded: { l: 'Estornado',  c: '#f87171' },
}

const STEPS = ['Pedido', 'Pagamento', 'Envio', 'Entregue']

const PAYMENT_LABEL: Record<string, string> = {
  pix: 'PIX', credit: 'Cartão de Crédito', boleto: 'Boleto',
}

export default async function PedidoPublicoPage({ params }: PageProps) {
  const supabase = createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select(`*, order_items(*)`)
    .eq('order_number', params.numero)
    .single() as unknown as { data: any }

  if (!order) notFound()

  const statusKey = order.payment_status === 'paid' ? 'paid' : (order.status ?? 'pending')
  const s = STATUS[statusKey] ?? STATUS.pending
  const ps = PAYMENT_STATUS[order.payment_status] ?? PAYMENT_STATUS.pending

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Hero */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginBottom: 24,
          background: 'linear-gradient(135deg, #1a0006 0%, #000 50%)',
          padding: '32px 40px', border: '1px solid var(--hair)',
        }}>
          <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// SEU PEDIDO</span>
              <h1 style={{ margin: '8px 0 4px', fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
                #{order.order_number}
              </h1>
              <p style={{ margin: 0, color: 'var(--fg2)', fontSize: 13 }}>
                {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <span style={{ padding: '8px 16px', fontSize: 12, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg, border: `1px solid ${s.c}33` }}>
                {s.l}
              </span>
              <span style={{ padding: '6px 12px', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: ps.c, background: 'transparent', border: `1px solid ${ps.c}44` }}>
                Pagamento: {ps.l}
              </span>
            </div>
          </div>
        </div>

        {/* Status tracker */}
        {order.status !== 'cancelled' && (
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: '24px 32px', marginBottom: 24 }}>
            <span className="eyebrow-mono" style={{ color: 'var(--fg3)', display: 'block', marginBottom: 20 }}>// ACOMPANHAMENTO</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
          {/* Items */}
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--hair)' }}>
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// ITENS DO PEDIDO</span>
            </div>
            {(order.order_items ?? []).map((item: any) => (
              <div key={item.id} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--hair)', alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, background: 'var(--surf-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="pkg" size={22} color="var(--fg3)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg3)' }}>Qtd: {item.quantity} × {fmt(item.price)}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 15 }}>{fmt(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: 20 }}>
              <span className="eyebrow-mono" style={{ color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// RESUMO</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--fg2)' }}>Subtotal</span>
                  <span>{fmt(order.subtotal ?? 0)}</span>
                </div>
                {order.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--fg2)' }}>Desconto</span>
                    <span style={{ color: '#4cd680' }}>-{fmt(order.discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--fg2)' }}>Frete</span>
                  <span>{order.shipping > 0 ? fmt(order.shipping) : 'GRÁTIS'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--hair)', paddingTop: 12, marginTop: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, textTransform: 'uppercase' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 20 }}>{fmt(order.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--fg3)' }}>Forma de pagamento</span>
                  <span style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    {PAYMENT_LABEL[order.payment_method] ?? order.payment_method ?? '—'}
                  </span>
                </div>
              </div>
            </div>

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
    </div>
  )
}

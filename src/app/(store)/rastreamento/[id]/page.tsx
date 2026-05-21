import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const STEPS = [
  { key: 'preparing',        icon: 'package',  label: 'EM PREPARAÇÃO',   sub: 'Pedido confirmado e sendo preparado' },
  { key: 'posted',           icon: 'truck',    label: 'POSTADO',         sub: 'Enviado à transportadora' },
  { key: 'in_transit',       icon: 'globe',    label: 'EM TRÂNSITO',     sub: 'A caminho do seu endereço' },
  { key: 'out_for_delivery', icon: 'bolt',     label: 'SAIU P/ ENTREGA', sub: 'Está perto! Entrega prevista hoje' },
  { key: 'delivered',        icon: 'check',    label: 'ENTREGUE',        sub: 'Pedido entregue com sucesso' },
]

const STATUS_ORDER: Record<string, number> = {
  preparing: 0, posted: 1, in_transit: 2, out_for_delivery: 3, delivered: 4,
}

async function getTracking(id: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('order_tracking')
    .select('*, orders(id, customer_name, total, created_at, items)')
    .eq('id', id)
    .single()
  return data as {
    id: string; carrier: string; tracking_code: string; status: string
    estimated_delivery: string; created_at: string
    orders?: { id: string; customer_name: string; total: number; created_at: string; items?: unknown } | null
  } | null
}

function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') }

export default async function RastreamentoPage({ params }: { params: { id: string } }) {
  const tracking = await getTracking(params.id)
  if (!tracking) notFound()

  const currentIdx = STATUS_ORDER[tracking.status] ?? 0
  const isReturned = tracking.status === 'returned'

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--fg3)', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: 32 }}>
            <Icon name="chevL" size={14} /> BEGAMERS STORE
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span className="red-rule" style={{ width: 24, height: 4 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--bg-accent-hot)', textTransform: 'uppercase' }}>// RASTREAMENTO</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 56, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            SEU PEDIDO<br />
            <span style={{ color: 'var(--bg-accent-hot)' }}>EM TEMPO REAL.</span>
          </h1>
        </div>

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 40 }}>
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 6 }}>// CÓD. RASTREIO</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, letterSpacing: '0.08em', color: '#fff' }}>{tracking.tracking_code}</div>
          </div>
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 6 }}>// TRANSPORTADORA</div>
            <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 15, textTransform: 'uppercase' }}>{tracking.carrier}</div>
          </div>
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', padding: '16px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 6 }}>// PREVISÃO DE ENTREGA</div>
            <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 15 }}>
              {tracking.estimated_delivery
                ? new Date(tracking.estimated_delivery).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
                : '—'}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {isReturned ? (
          <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.3)', padding: '24px 28px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Icon name="x" size={28} color="#f87171" />
            <div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 18, textTransform: 'uppercase', color: '#f87171', marginBottom: 4 }}>PEDIDO DEVOLVIDO</div>
              <div style={{ fontSize: 13, color: 'var(--fg2)' }}>Este pedido foi devolvido ao remetente. Entre em contato com o suporte.</div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', marginBottom: 48 }}>
            {/* Line */}
            <div style={{
              position: 'absolute', top: 28, left: 28, right: 28, height: 2,
              background: 'var(--hair-strong)', zIndex: 0,
            }} />
            <div style={{
              position: 'absolute', top: 28, left: 28, height: 2, zIndex: 1,
              background: 'var(--bg-accent-hot)',
              width: currentIdx === 0 ? '0%' : `${(currentIdx / (STEPS.length - 1)) * 100}%`,
              transition: 'width 0.6s ease',
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 8, position: 'relative', zIndex: 2 }}>
              {STEPS.map((step, idx) => {
                const done = idx < currentIdx
                const active = idx === currentIdx
                return (
                  <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 56, height: 56,
                      background: active ? 'var(--bg-accent-hot)' : done ? 'rgba(255,31,61,0.15)' : 'var(--surf-1)',
                      border: `2px solid ${active ? 'var(--bg-accent-hot)' : done ? 'rgba(255,31,61,0.4)' : 'var(--hair-strong)'}`,
                      borderRadius: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: active ? '0 0 24px rgba(255,31,61,0.5)' : 'none',
                    }}>
                      <Icon
                        name={step.icon}
                        size={22}
                        color={active ? '#fff' : done ? 'var(--bg-accent-hot)' : 'var(--fg3)'}
                      />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: active ? 'var(--bg-accent-hot)' : done ? '#fff' : 'var(--fg3)',
                        marginBottom: 4,
                      }}>{step.label}</div>
                      {active && (
                        <div style={{ fontSize: 10, color: 'var(--fg3)', maxWidth: 120, lineHeight: 1.4 }}>{step.sub}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          background: 'linear-gradient(135deg, rgba(255,31,61,0.08), rgba(0,0,0,0))',
          border: '1px solid rgba(255,31,61,0.2)', padding: '20px 32px', marginBottom: 40,
        }}>
          <div style={{ width: 8, height: 8, background: 'var(--bg-accent-hot)', borderRadius: '50%', boxShadow: '0 0 8px var(--bg-accent-hot)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {STEPS[currentIdx]?.label ?? tracking.status.toUpperCase()}
          </span>
        </div>

        {/* Order info */}
        {tracking.orders && (
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', padding: '20px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 16 }}>// DADOS DO PEDIDO</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Número</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--bg-accent-hot)' }}>#{tracking.orders.id.slice(0, 8)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Cliente</div>
                <div style={{ fontSize: 13 }}>{tracking.orders.customer_name}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Total</div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 16 }}>{fmt(tracking.orders.total)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Support footer */}
        <div style={{ marginTop: 40, textAlign: 'center', color: 'var(--fg3)', fontSize: 12 }}>
          <p>Dúvidas? <Link href="mailto:suporte@begamers.com.br" style={{ color: 'var(--bg-accent-hot)', textDecoration: 'none' }}>suporte@begamers.com.br</Link></p>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'

type ProductImage = { url: string; is_primary: boolean }
type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
  product?: { slug: string; product_images?: ProductImage[] }
}
type Order = {
  id: string
  order_number: string
  status: string
  total: number
  payment_method: string
  created_at: string
  order_items?: OrderItem[]
}

const STATUS: Record<string, { label: string; color: string }> = {
  pending:    { label: 'AGUARDANDO',   color: '#ffc940' },
  paid:       { label: 'CONFIRMADO',   color: '#4cd680' },
  processing: { label: 'PREPARANDO',  color: '#60a5fa' },
  shipped:    { label: 'EM TRÂNSITO', color: '#a78bfa' },
  delivered:  { label: 'ENTREGUE',    color: '#4cd680' },
  cancelled:  { label: 'CANCELADO',   color: '#f87171' },
}

const STATUS_MSG: Record<string, { msg: string; progress: number; showTrack: boolean }> = {
  pending:    { msg: 'Aguardando confirmação do pagamento',  progress: 12,  showTrack: false },
  paid:       { msg: 'Pagamento confirmado — em preparação', progress: 22,  showTrack: false },
  processing: { msg: 'Em preparação — envio em breve',       progress: 33,  showTrack: false },
  shipped:    { msg: 'Saiu para entrega — chegando em breve', progress: 66, showTrack: true  },
  delivered:  { msg: 'Entregue com sucesso',                 progress: 100, showTrack: true  },
  cancelled:  { msg: 'Pedido cancelado',                     progress: 0,   showTrack: false },
}

// 3 steps da barra de progresso
const PROGRESS_STEPS = [
  { label: 'Em preparação', threshold: 33 },
  { label: 'A caminho',     threshold: 66 },
  { label: 'Entregue',      threshold: 100 },
]

const FILTERS = [
  { key: 'all',       label: 'Todos',      fn: (_: string) => true },
  { key: 'active',    label: 'Em entrega', fn: (s: string) => ['pending', 'paid', 'processing'].includes(s) },
  { key: 'shipped',   label: 'A caminho',  fn: (s: string) => s === 'shipped' },
  { key: 'delivered', label: 'Entregues',  fn: (s: string) => s === 'delivered' },
  { key: 'cancelled', label: 'Cancelados', fn: (s: string) => s === 'cancelled' },
]

function fmt(v: number) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function TruckIcon({ color }: { color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
      fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      <path d="M1 3h15v13H1z"/>
      <path d="M16 8h4l3 3v5h-7"/>
      <circle cx="6" cy="19" r="2"/>
      <circle cx="19" cy="19" r="2"/>
    </svg>
  )
}

export default function OrdersSection({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState('all')
  const [period, setPeriod] = useState('6m')

  const periodFiltered = orders.filter(o => {
    if (period === 'all') return true
    const months = period === '1y' ? 12 : 6
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - months)
    return new Date(o.created_at) >= cutoff
  })

  const filtered = periodFiltered.filter(o => {
    const f = FILTERS.find(x => x.key === filter)
    return f ? f.fn(o.status) : true
  })

  const countFor = (key: string) => {
    const f = FILTERS.find(x => x.key === key)
    if (!f) return periodFiltered.length
    return key === 'all' ? periodFiltered.length : periodFiltered.filter(o => f.fn(o.status)).length
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--bg-accent-hot)',
          }}>
            // HISTÓRICO
          </span>
          <h2 style={{
            margin: '4px 0 0', fontFamily: 'var(--font-display-heavy)', fontSize: 32,
            textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.02em',
          }}>
            MEUS PEDIDOS.
          </h2>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          style={{
            background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
            color: 'var(--fg2)', padding: '8px 12px', fontSize: 12,
            fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="6m">Últimos 6 meses</option>
          <option value="1y">Último ano</option>
          <option value="all">Todos</option>
        </select>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--hair)', marginBottom: 20 }}>
        {FILTERS.map(f => {
          const active = filter === f.key
          const count = countFor(f.key)
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${active ? 'var(--bg-accent)' : 'transparent'}`,
                marginBottom: -1,
                color: active ? '#fff' : 'var(--fg3)',
                fontFamily: 'var(--font-display-heavy)', fontSize: 11,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {f.label}
              <span style={{
                fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 5px',
                background: active ? 'var(--bg-accent)' : 'rgba(255,255,255,0.06)',
                color: active ? '#fff' : 'var(--fg3)',
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '60px 24px', textAlign: 'center',
          color: 'var(--fg3)', background: 'var(--surf-1)', border: '1px solid var(--hair)',
        }}>
          <p style={{ margin: 0, fontSize: 14 }}>Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(order => {
            const s = STATUS[order.status] ?? STATUS.pending
            const sm = STATUS_MSG[order.status] ?? STATUS_MSG.pending
            const items = order.order_items ?? []
            const itemCount = items.length || ((order as any).item_count ?? 0)
            const trackingId = (order as any).order_tracking?.[0]?.id ?? null
            const thumbs = items.slice(0, 3).map(item => {
              const imgs = item.product?.product_images ?? []
              return imgs.find(i => i.is_primary)?.url ?? imgs[0]?.url ?? null
            })
            const emptySlots = Math.max(0, 3 - thumbs.length)

            return (
              <div key={order.id} style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>

                {/* Row 1: pedido | data | status | total | detalhes */}
                <div style={{
                  padding: '14px 20px', display: 'flex', alignItems: 'center',
                  gap: 20, borderBottom: '1px solid var(--hair)', flexWrap: 'wrap',
                }}>
                  {/* Pedido */}
                  <div style={{ minWidth: 80 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                      // PEDIDO
                    </div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 20, color: 'var(--bg-accent-hot)', lineHeight: 1.1, marginTop: 2 }}>
                      #{order.order_number}
                    </div>
                  </div>

                  {/* Data */}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                      // FEITO EM
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 2 }}>
                      {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-display-heavy)',
                      letterSpacing: '0.1em', color: s.color, whiteSpace: 'nowrap',
                    }}>
                      <span style={{ marginRight: 5 }}>●</span>{s.label}
                    </span>
                  </div>

                  {/* Total */}
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                      // TOTAL
                    </div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 16, marginTop: 2 }}>
                      {fmt(order.total)}
                    </div>
                  </div>

                  {/* Detalhes */}
                  <Link href={`/conta/pedidos/${order.id}`} style={{
                    padding: '10px 18px', background: 'transparent',
                    border: '1px solid var(--hair-strong)', color: 'var(--fg2)',
                    textDecoration: 'none', fontFamily: 'var(--font-display-heavy)',
                    fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    Detalhes →
                  </Link>
                </div>

                {/* Row 2: truck + mensagem */}
                <div style={{ padding: '10px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TruckIcon color={s.color} />
                  <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{sm.msg}</span>
                </div>

                {/* Barra de progresso + Rastrear */}
                <div style={{ padding: '10px 20px 12px', borderBottom: '1px solid var(--hair)' }}>
                  {order.status === 'cancelled' ? (
                    <div style={{ height: 5, background: 'rgba(248,113,113,0.2)', width: '100%' }} />
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Track + fill neon */}
                        <div style={{ flex: 1, position: 'relative', height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
                          <div style={{
                            position: 'absolute', top: 0, left: 0,
                            width: `${sm.progress}%`, height: '100%',
                            background: `linear-gradient(90deg, ${s.color}88 0%, ${s.color} 60%, #fff8 100%)`,
                            boxShadow: `0 0 6px ${s.color}, 0 0 14px ${s.color}66`,
                            borderRadius: 1,
                            transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)',
                          }} />
                        </div>
                      </div>
                      {/* Labels 3 etapas */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        {PROGRESS_STEPS.map(step => {
                          const done = sm.progress >= step.threshold
                          return (
                            <span key={step.label} style={{
                              fontSize: 8, fontFamily: 'var(--font-mono)',
                              letterSpacing: '0.1em', textTransform: 'uppercase',
                              color: done ? s.color : 'var(--fg3)',
                              textShadow: done ? `0 0 8px ${s.color}88` : 'none',
                            }}>
                              {step.label}
                            </span>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Row 3: thumbnails + count + rastrear */}
                <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {thumbs.map((url, i) => (
                    <div key={i} style={{
                      width: 52, height: 52, flexShrink: 0,
                      border: '1px solid var(--hair)', overflow: 'hidden',
                      background: 'var(--surf-2)',
                    }}>
                      {url && <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                  ))}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <div key={`ph-${i}`} style={{
                      width: 52, height: 52, flexShrink: 0,
                      border: '1px solid var(--hair)', background: 'var(--surf-2)',
                    }} />
                  ))}
                  <span style={{ fontSize: 12, color: 'var(--fg3)', marginLeft: 6, flex: 1 }}>
                    <span style={{ color: 'var(--fg2)' }}>+</span> {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                  </span>
                  {(sm.showTrack || !!trackingId) && (
                    <Link
                      href={trackingId ? `/rastreamento/${trackingId}` : `/conta/pedidos/${order.id}`}
                      style={{
                        padding: '8px 16px', background: 'transparent',
                        border: `1px solid var(--hair-strong)`, color: s.color,
                        fontFamily: 'var(--font-display-heavy)', fontSize: 10,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      Rastrear →
                    </Link>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CountdownClient from '@/components/tracking/CountdownClient'
import GPSMapClient from '@/components/tracking/GPSMapClient'

export const dynamic = 'force-dynamic'

const STEPS = ['FEITO', 'PAGO', 'EMBALADO', 'EM ROTA', 'ENTREGUE']

const STATUS_STEP: Record<string, number> = {
  preparing:        2,
  posted:           2,
  in_transit:       3,
  out_for_delivery: 3,
  delivered:        4,
}

const STATUS_HERO: Record<string, { label: string; sub: string; chega: boolean; color: string }> = {
  preparing:        { label: 'EM PREPARAÇÃO',    sub: 'Seu pedido está sendo preparado',    chega: false, color: 'var(--bg-accent-hot)' },
  posted:           { label: 'POSTADO',           sub: 'Enviado à transportadora',           chega: false, color: '#60a5fa' },
  in_transit:       { label: 'EM TRÂNSITO',       sub: 'A caminho do seu endereço',          chega: false, color: '#a78bfa' },
  out_for_delivery: { label: 'SAIU PARA ENTREGA', sub: 'CHEGA HOJE',                         chega: true,  color: 'var(--bg-accent-hot)' },
  delivered:        { label: 'ENTREGUE',          sub: 'Pedido entregue com sucesso',        chega: false, color: '#4cd680' },
  returned:         { label: 'DEVOLVIDO',         sub: 'Pedido devolvido ao remetente',      chega: false, color: '#f87171' },
}

type TrackingEvent = { label: string; location: string; ts: string }

type Tracking = {
  id: string
  carrier: string
  carrier_type: string
  tracking_code: string
  status: string
  estimated_delivery: string | null
  courier_name: string | null
  courier_rating: number | null
  courier_vehicle: string | null
  delivery_address: string | null
  events: TrackingEvent[]
  orders: {
    id: string
    order_number: string
    total: number
    created_at: string
    shipping_method: string | null
    shipping_carrier: string | null
    order_items: Array<{ name: string; quantity: number; price: number }>
  } | null
}

async function getTracking(id: string): Promise<Tracking | null> {
  const supabase = createAdminClient()

  const { data: t } = await supabase
    .from('order_tracking')
    .select('id, carrier, carrier_type, tracking_code, status, estimated_delivery, courier_name, courier_rating, courier_vehicle, delivery_address, events, order_id')
    .eq('id', id)
    .single() as unknown as { data: (Omit<Tracking, 'orders'> & { order_id: string }) | null }

  if (!t) return null

  const { data: order } = await supabase
    .from('orders')
    .select('id, order_number, total, created_at, shipping_method, shipping_carrier, order_items(name, quantity, price)')
    .eq('id', t.order_id)
    .single() as unknown as { data: Tracking['orders'] | null }

  return { ...t, orders: order ?? null }
}

function fmt(v: number) {
  return 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function fmtEventDate(ts: string) {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === today.toDateString()) return `Hoje · ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `Ontem · ${time}`
  return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')} · ${time}`
}

export default async function RastreamentoPage({ params }: { params: { id: string } }) {
  const tracking = await getTracking(params.id)
  if (!tracking) notFound()

  const order = tracking.orders
  const rawEvents: TrackingEvent[] = tracking.events ?? []
  const events = [...rawEvents].reverse()
  const currentStep = STATUS_STEP[tracking.status] ?? 1
  const hero = STATUS_HERO[tracking.status] ?? STATUS_HERO.in_transit
  const isExpress = tracking.carrier_type === 'express' || tracking.carrier_type === 'motoboy'
  const isDelivered = tracking.status === 'delivered'
  const isReturned = tracking.status === 'returned'
  const items = order?.order_items ?? []
  const hasCourier = isExpress && !!tracking.courier_name

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 40px',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        <Link href="/conta/minha-conta" style={{ color: 'var(--fg3)', textDecoration: 'none' }}>MINHA CONTA</Link>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
        <Link href="/conta/minha-conta" style={{ color: 'var(--fg3)', textDecoration: 'none' }}>PEDIDOS</Link>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
        <span style={{ color: '#fff' }}>
          {order ? `#${order.order_number} · RASTREAMENTO` : 'RASTREAMENTO'}
        </span>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' }}>

        {/* ===== HERO ===== */}
        <div style={{
          background: 'linear-gradient(135deg, #0d0001 0%, #050000 60%, #000 100%)',
          border: '1px solid rgba(255,31,61,0.2)',
          marginBottom: 16,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40,
        }}>
          <div style={{ padding: '40px 48px', flex: 1 }}>
            {/* Eyebrow */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: hero.color,
              marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: hero.color, display: 'inline-block',
                boxShadow: `0 0 8px ${hero.color}`,
                animation: isDelivered || isReturned ? 'none' : 'heroPulse 2s infinite',
              }} />
              // {hero.label}
              {hero.chega && (
                <span style={{ background: hero.color, color: '#fff', padding: '2px 8px', fontSize: 9, marginLeft: 4 }}>
                  · {hero.sub}
                </span>
              )}
            </div>

            {/* Main: countdown or status headline */}
            {hero.chega && tracking.estimated_delivery ? (
              <CountdownClient estimatedDelivery={tracking.estimated_delivery} />
            ) : (
              <div style={{
                fontFamily: 'var(--font-display-heavy)', fontSize: 52, lineHeight: 0.92,
                letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 20,
              }}>
                {isDelivered ? (
                  <>SEU PEDIDO<br /><span style={{ color: '#4cd680', textShadow: '0 0 30px rgba(76,214,128,0.5)' }}>ENTREGUE.</span></>
                ) : isReturned ? (
                  <>PEDIDO<br /><span style={{ color: '#f87171' }}>DEVOLVIDO.</span></>
                ) : (
                  <>{hero.label.split(' ').slice(0,2).join(' ')}<br />
                  <span style={{ color: hero.color }}>{hero.label.split(' ').slice(2).join(' ') || '...'}</span></>
                )}
              </div>
            )}

            {/* Window / address */}
            {tracking.estimated_delivery && !isDelivered && !isReturned && (
              <div style={{ fontSize: 13, color: 'var(--fg2)', marginBottom: 6 }}>
                Janela estimada:{' '}
                {new Date(tracking.estimated_delivery).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                {isExpress ? ', entre 13h e 16h' : ''}
              </div>
            )}
            {tracking.delivery_address && (
              <div style={{ fontSize: 13, color: 'var(--fg3)' }}>
                {isExpress ? 'O entregador vai chegar em' : 'Entrega em'}:{' '}
                <span style={{ color: 'var(--fg2)' }}>{tracking.delivery_address}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!isDelivered && !isReturned && (
            <div style={{ padding: '40px 40px 40px 0', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, justifyContent: 'center' }}>
              {hasCourier && (
                <button style={{
                  padding: '13px 28px', background: hero.color, color: '#fff', border: 'none',
                  fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>
                  Chamar entregador
                </button>
              )}
              <button style={{
                padding: '13px 28px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)', color: 'var(--fg2)',
                fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}>
                Mudar endereço
              </button>
            </div>
          )}
        </div>

        {/* ===== PROGRESS BAR ===== */}
        <div style={{
          background: 'var(--surf-1)', border: '1px solid var(--hair)',
          padding: '28px 48px', marginBottom: 16,
        }}>
          <div style={{ position: 'relative' }}>
            {/* Base track */}
            <div style={{
              position: 'absolute', top: 21, left: '10%', right: '10%', height: 2,
              background: 'rgba(255,255,255,0.06)',
            }} />
            {/* Fill */}
            <div style={{
              position: 'absolute', top: 21, left: '10%', height: 2,
              width: isReturned ? '0%' : `${Math.min((currentStep / 4) * 80, 80)}%`,
              background: isReturned
                ? 'rgba(248,113,113,0.4)'
                : `linear-gradient(90deg, rgba(255,31,61,0.4) 0%, var(--bg-accent-hot) 70%, #fff4 100%)`,
              boxShadow: isReturned ? 'none' : '0 0 10px rgba(255,31,61,0.6)',
              transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', position: 'relative', zIndex: 1 }}>
              {STEPS.map((label, idx) => {
                const done = idx < currentStep
                const active = idx === currentStep && !isReturned
                return (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 42, height: 42,
                      background: active ? hero.color : done ? 'rgba(255,31,61,0.12)' : 'var(--surf-2)',
                      border: `2px solid ${active ? hero.color : done ? 'rgba(255,31,61,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: active ? `0 0 20px ${hero.color}80` : 'none',
                      fontSize: 12, fontFamily: 'var(--font-display-heavy)',
                      color: active ? '#fff' : done ? hero.color : 'rgba(255,255,255,0.18)',
                      transition: 'all 0.4s ease',
                    }}>
                      {done ? '✓' : idx + 1}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em',
                      textTransform: 'uppercase', textAlign: 'center',
                      color: active ? hero.color : done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                    }}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ===== GPS MAP (express only) ===== */}
        {isExpress && (
          <div style={{ marginBottom: 16 }}>
            <GPSMapClient
              origin="CD · São Paulo / SP"
              destination={tracking.delivery_address ?? 'Destino'}
              status={tracking.status}
            />
          </div>
        )}

        {/* ===== COURIER CARD (express only, if has courier data) ===== */}
        {hasCourier && (
          <div style={{
            background: 'var(--surf-1)', border: '1px solid var(--hair)',
            padding: '20px 28px', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)', marginBottom: 10 }}>
                // SEU ENTREGADOR
              </div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 20, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 4 }}>
                {tracking.courier_name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg2)', letterSpacing: '0.06em' }}>
                {tracking.courier_rating && `★ ${tracking.courier_rating}`}
                {tracking.courier_vehicle && ` · VEÍCULO ${tracking.courier_vehicle}`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button style={{
                padding: '11px 24px', background: 'rgba(255,31,61,0.08)',
                border: '1px solid rgba(255,31,61,0.3)', color: 'var(--bg-accent-hot)',
                fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}>Mensagem</button>
              <button style={{
                padding: '11px 24px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)', color: 'var(--fg2)',
                fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}>Ligar</button>
            </div>
          </div>
        )}

        {/* ===== MAIN GRID: Timeline + Sidebar ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>

          {/* TIMELINE */}
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>
                // HISTÓRICO COMPLETO · TIMELINE
              </span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg3)' }}>
                {events.length} eventos
              </span>
            </div>
            <div>
              {events.length === 0 ? (
                <div style={{ padding: '32px 20px', color: 'var(--fg3)', fontSize: 13 }}>
                  Nenhum evento registrado ainda.
                </div>
              ) : (
                events.map((ev, i) => {
                  const isLatest = i === 0
                  return (
                    <div key={i} style={{
                      padding: '16px 20px',
                      display: 'grid',
                      gridTemplateColumns: '20px 128px 1fr',
                      gap: 16,
                      alignItems: 'start',
                      borderBottom: i < events.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      background: isLatest ? 'rgba(255,31,61,0.02)' : 'transparent',
                    }}>
                      {/* Dot */}
                      <div style={{ paddingTop: 3, display: 'flex', justifyContent: 'center' }}>
                        <span style={{
                          width: 7, height: 7, borderRadius: '50%', display: 'block', flexShrink: 0,
                          background: isLatest ? hero.color : 'rgba(255,255,255,0.15)',
                          boxShadow: isLatest ? `0 0 8px ${hero.color}` : 'none',
                        }} />
                      </div>
                      {/* Timestamp */}
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 10,
                        color: isLatest ? hero.color : 'var(--fg3)',
                        letterSpacing: '0.08em', lineHeight: 1.4, paddingTop: 1,
                      }}>
                        {fmtEventDate(ev.ts)}
                      </div>
                      {/* Content */}
                      <div>
                        <div style={{
                          fontFamily: 'var(--font-display-heavy)', fontSize: 13,
                          textTransform: 'uppercase', letterSpacing: '0.04em',
                          color: isLatest ? '#fff' : 'var(--fg2)', marginBottom: 2,
                        }}>
                          {ev.label}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{ev.location}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ORDER SUMMARY */}
            {order && (
              <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--hair)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>
                    // PEDIDO #{order.order_number}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg3)', marginTop: 4, letterSpacing: '0.1em' }}>
                    {tracking.tracking_code} · {items.length} {items.length === 1 ? 'ITEM' : 'ITENS'}
                  </div>
                </div>
                <div style={{ padding: '12px 20px' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      padding: '9px 0', gap: 12,
                      borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      <span style={{ fontSize: 12, color: 'var(--fg2)', flex: 1, lineHeight: 1.4 }}>
                        {item.name}{' '}
                        <span style={{ color: 'var(--fg3)' }}>× {item.quantity}</span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#fff', flexShrink: 0 }}>
                        {fmt(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, marginTop: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>TOTAL PAGO</span>
                    <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 18, color: 'var(--bg-accent-hot)' }}>{fmt(order.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* DELIVERY INFO */}
            <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--hair)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>
                  // ENTREGA
                </span>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {([
                  { label: 'Modalidade', value: order?.shipping_method ?? tracking.carrier },
                  { label: 'Código de rastreio', value: tracking.tracking_code },
                  tracking.delivery_address ? { label: 'Endereço', value: tracking.delivery_address } : null,
                  tracking.estimated_delivery ? {
                    label: 'Previsão',
                    value: new Date(tracking.estimated_delivery).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                  } : null,
                ] as const).filter(Boolean).map((row: any) => (
                  <div key={row.label}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 3 }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.5 }}>{row.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--hair)', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button style={{
                  padding: '10px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)', color: 'var(--fg2)',
                  fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer', textAlign: 'center',
                }}>
                  Problema com a entrega?
                </button>
                <button style={{
                  padding: '10px', background: 'transparent',
                  border: '1px solid rgba(248,113,113,0.25)', color: '#f87171',
                  fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer', textAlign: 'center',
                }}>
                  Pedir reembolso
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px currentColor; }
          50% { opacity: 0.4; box-shadow: 0 0 2px currentColor; }
        }
      `}</style>
    </div>
  )
}

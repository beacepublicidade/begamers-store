'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

function fmt(v: number) {
  return 'R$ ' + (v / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const STATUS_LABELS: Record<string, { l: string; c: string }> = {
  pending:    { l: 'Aguardando', c: '#ffc940' },
  paid:       { l: 'Pago',       c: '#4cd680' },
  processing: { l: 'Processando',c: '#60a5fa' },
  shipped:    { l: 'Enviado',    c: '#a78bfa' },
  delivered:  { l: 'Entregue',  c: '#4cd680' },
  cancelled:  { l: 'Cancelado', c: '#f87171' },
}

interface Data {
  totalRevenue: number
  totalOrders: number
  byStatus: Record<string, number>
  byPayment: Record<string, number>
  byMonth: Array<{ month: string; revenue: number; orders: number }>
  topProducts: Array<{ name: string; qty: number; revenue: number }>
}

export default function RelatoriosPage() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/relatorios')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const maxMonthRevenue = data ? Math.max(...data.byMonth.map(m => m.revenue), 1) : 1

  return (
    <div>
      <AdminTopbar section="VENDAS" page="RELATÓRIOS" />
      <div style={{ padding: 32 }}>
        <h1 style={{ margin: '0 0 32px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>
          Relatórios
        </h1>

        {loading ? (
          <p style={{ color: 'var(--fg3)', fontSize: 13 }}>Carregando...</p>
        ) : !data ? (
          <p style={{ color: '#f87171', fontSize: 13 }}>Erro ao carregar dados.</p>
        ) : (
          <>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[
                { l: 'RECEITA TOTAL',     v: fmt(data.totalRevenue),   icon: 'bolt',   accent: true },
                { l: 'TOTAL DE PEDIDOS',  v: String(data.totalOrders), icon: 'pkg',    accent: false },
                { l: 'PEDIDOS PAGOS',     v: String((data.byStatus.paid ?? 0) + (data.byStatus.delivered ?? 0) + (data.byStatus.shipped ?? 0) + (data.byStatus.processing ?? 0)), icon: 'check', accent: false },
                { l: 'CANCELADOS',        v: String(data.byStatus.cancelled ?? 0), icon: 'trash', accent: false },
              ].map(k => (
                <div key={k.l} style={{ background: 'var(--surf-2)', border: `1px solid ${k.accent ? 'var(--bg-accent)' : 'var(--hair)'}`, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Icon name={k.icon} size={14} color={k.accent ? 'var(--bg-accent-hot)' : 'var(--fg3)'} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)' }}>// {k.l}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: k.accent ? 28 : 32, lineHeight: 1, color: k.accent ? 'var(--bg-accent-hot)' : '#fff' }}>
                    {k.v}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>
              {/* Revenue by month */}
              <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 24 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 20 }}>
                  // RECEITA ÚLTIMOS 6 MESES
                </span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 160 }}>
                  {data.byMonth.map(m => {
                    const pct = maxMonthRevenue > 0 ? (m.revenue / maxMonthRevenue) * 100 : 0
                    return (
                      <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                        <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 9, color: 'var(--fg3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                          {m.revenue > 0 ? fmt(m.revenue).replace('R$ ', '') : '—'}
                        </span>
                        <div style={{
                          width: '100%', background: m.revenue > 0 ? 'var(--bg-accent)' : 'var(--surf-3)',
                          height: `${Math.max(pct, 4)}%`,
                          transition: 'height 400ms ease',
                          position: 'relative',
                        }}>
                          {m.revenue > 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--bg-accent-hot)' }} />}
                        </div>
                        <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--fg2)' }}>{m.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* By status */}
              <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 24 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 20 }}>
                  // PEDIDOS POR STATUS
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(data.byStatus).map(([status, count]) => {
                    const s = STATUS_LABELS[status] ?? { l: status, c: '#fff' }
                    const pct = data.totalOrders > 0 ? Math.round((count / data.totalOrders) * 100) : 0
                    return (
                      <div key={status}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: s.c, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.l}</span>
                          <span style={{ fontSize: 11, color: 'var(--fg2)' }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--surf-3)' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: s.c, transition: 'width 400ms ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Top products */}
              <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 24 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>
                  // TOP PRODUTOS POR RECEITA
                </span>
                {data.topProducts.length === 0 ? (
                  <p style={{ color: 'var(--fg3)', fontSize: 13 }}>Nenhum dado ainda</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {data.topProducts.map((p, i) => (
                      <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--hair)' }}>
                        <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 18, color: 'var(--fg3)', width: 24, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{p.qty} unidades</div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 13, color: 'var(--bg-accent-hot)', flexShrink: 0 }}>{fmt(p.revenue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* By payment */}
              <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 24 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>
                  // RECEITA POR PAGAMENTO
                </span>
                {Object.keys(data.byPayment).length === 0 ? (
                  <p style={{ color: 'var(--fg3)', fontSize: 13 }}>Nenhum dado ainda</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {Object.entries(data.byPayment).sort((a, b) => b[1] - a[1]).map(([method, revenue]) => {
                      const totalPaid = Object.values(data.byPayment).reduce((a, v) => a + v, 0)
                      const pct = totalPaid > 0 ? Math.round((revenue / totalPaid) * 100) : 0
                      return (
                        <div key={method}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontFamily: 'var(--font-display-heavy)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{method}</span>
                            <span style={{ fontSize: 12 }}>{fmt(revenue)} ({pct}%)</span>
                          </div>
                          <div style={{ height: 6, background: 'var(--surf-3)' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--bg-accent)', transition: 'width 400ms ease' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

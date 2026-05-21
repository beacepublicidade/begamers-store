'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function fmtDate(d: string) {
  const dt = new Date(d)
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' +
    dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

interface Order {
  id: string; total: number; status: string; payment_method: string
  payment_status: string; created_at: string; customer_name?: string
}

interface Summary {
  totalRevenue: number; totalOrders: number; avgTicket: number; paidCount: number
}

const STATUS_C: Record<string, string> = {
  paid: '#4cd680', pending: '#ffc940', cancelled: '#f87171',
  refunded: '#f87171', processing: '#60a5fa',
}

const PAYMENT_LABEL: Record<string, string> = {
  pix: 'PIX', credit_card: 'CARTÃO', boleto: 'BOLETO', credit: 'CRÉDITO',
}

const TABS = ['EXTRATO DE PEDIDOS', 'RECEBÍVEIS', 'TAXAS & TARIFAS', 'SAQUES']

export default function FinanceiroPage() {
  const [tab, setTab] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [summary, setSummary] = useState<Summary>({ totalRevenue: 0, totalOrders: 0, avgTicket: 0, paidCount: 0 })
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/relatorios').then(r => r.json()),
      fetch('/api/admin/pedidos?limit=50').then(r => r.json()),
    ]).then(([rel, ords]) => {
      setSummary({
        totalRevenue: rel.totalRevenue ?? 0,
        totalOrders: rel.totalOrders ?? 0,
        avgTicket: rel.avgTicket ?? 0,
        paidCount: rel.paidCount ?? 0,
      })
      setOrders(Array.isArray(ords) ? ords : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const paidOrders = orders.filter(o => o.payment_status === 'paid' || o.status === 'paid')
  const pendingOrders = orders.filter(o => o.payment_status === 'pending' || o.status === 'pending')
  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.payment_status === filterStatus || o.status === filterStatus)

  const payMix = [
    { method: 'PIX', pct: 0, count: 0, color: '#4cd680' },
    { method: 'CARTÃO', pct: 0, count: 0, color: '#60a5fa' },
    { method: 'BOLETO', pct: 0, count: 0, color: '#ffc940' },
    { method: 'OUTROS', pct: 0, count: 0, color: '#a78bfa' },
  ]
  if (paidOrders.length > 0) {
    const px = paidOrders.filter(o => o.payment_method === 'pix').length
    const cc = paidOrders.filter(o => o.payment_method?.includes('card') || o.payment_method === 'credit_card').length
    const bl = paidOrders.filter(o => o.payment_method === 'boleto').length
    const ot = paidOrders.length - px - cc - bl
    const t = paidOrders.length
    payMix[0].pct = Math.round(px / t * 100); payMix[0].count = px
    payMix[1].pct = Math.round(cc / t * 100); payMix[1].count = cc
    payMix[2].pct = Math.round(bl / t * 100); payMix[2].count = bl
    payMix[3].pct = Math.round(ot / t * 100); payMix[3].count = ot
  }

  return (
    <div>
      <AdminTopbar section="FINANCEIRO" page="VISÃO GERAL" />
      <div style={{ padding: 32 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>// RECEITA TOTAL · PEDIDOS PAGOS</span>
            <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 56, lineHeight: 1, margin: '8px 0 4px' }}>
              {loading ? '—' : fmt(summary.totalRevenue)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg3)' }}>
              {loading ? '' : `${summary.paidCount ?? paidOrders.length} pedidos pagos · ${pendingOrders.length} pendentes`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/admin/relatorios" style={{ padding: '10px 16px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--surf-2)', border: '1px solid var(--hair-strong)', color: '#fff', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>Ver relatórios →</Link>
            <Link href="/admin/financeiro/saques" style={{ padding: '10px 16px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>Saques →</Link>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { l: 'TOTAL DE PEDIDOS', v: loading ? '—' : String(summary.totalOrders), icon: 'rows', accent: false },
            { l: 'PEDIDOS PAGOS', v: loading ? '—' : String(paidOrders.length || summary.paidCount), icon: 'check', accent: true },
            { l: 'TICKET MÉDIO', v: loading ? '—' : fmt(summary.avgTicket || (summary.totalRevenue / Math.max(1, paidOrders.length))), icon: 'tag', accent: false },
            { l: 'PEDIDOS PENDENTES', v: loading ? '—' : String(pendingOrders.length), icon: 'bolt', accent: false },
          ].map(k => (
            <div key={k.l} style={{ background: 'var(--surf-2)', border: `1px solid ${k.accent ? 'var(--bg-accent)' : 'var(--hair)'}`, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon name={k.icon} size={13} color={k.accent ? 'var(--bg-accent-hot)' : 'var(--fg3)'} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>// {k.l}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 26, lineHeight: 1, color: k.accent ? 'var(--bg-accent-hot)' : '#fff' }}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* Mix de pagamentos */}
        {!loading && paidOrders.length > 0 && (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 24, marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 20 }}>// MIX DE PAGAMENTOS</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {payMix.filter(p => p.count > 0).map(p => (
                <div key={p.method}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: p.color }}>{p.method}</span>
                    <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 18 }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--surf-3)', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: p.color }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{p.count} pedido{p.count !== 1 ? 's' : ''}</div>
                </div>
              ))}
              {paidOrders.length === 0 && <div style={{ color: 'var(--fg3)', fontSize: 12 }}>Nenhum pedido pago ainda.</div>}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--hair)', overflowX: 'auto' }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} style={{ padding: '12px 16px', fontSize: 10, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'transparent', border: 'none', color: tab === i ? '#fff' : 'var(--fg3)', borderBottom: tab === i ? '2px solid var(--bg-accent)' : '2px solid transparent', marginBottom: -1 }}>{t}</button>
            ))}
          </div>

          {/* EXTRATO */}
          {tab === 0 && (
            <div>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{filteredOrders.length} pedidos</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[['all', 'Todos'], ['paid', 'Pagos'], ['pending', 'Pendentes'], ['cancelled', 'Cancelados']].map(([v, l]) => (
                    <button key={v} onClick={() => setFilterStatus(v)} style={{ padding: '4px 10px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: filterStatus === v ? 'var(--bg-accent)' : 'var(--surf-3)', border: `1px solid ${filterStatus === v ? 'var(--bg-accent)' : 'var(--hair-strong)'}`, color: '#fff', cursor: 'pointer' }}>{l}</button>
                  ))}
                </div>
              </div>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--fg3)' }}>Carregando...</div>
              ) : filteredOrders.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--fg3)' }}>
                  <Icon name="chart" size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>Nenhum pedido encontrado.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                      {['DATA', 'PEDIDO', 'CLIENTE', 'PAGAMENTO', 'TOTAL', 'STATUS'].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg3)' }}>{fmtDate(o.created_at)}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <Link href={`/admin/pedidos/${o.id}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--bg-accent-hot)', textDecoration: 'none' }}>#{o.id.slice(0, 8)}</Link>
                        </td>
                        <td style={{ padding: '10px 14px', fontSize: 12 }}>{o.customer_name || '—'}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg2)' }}>{PAYMENT_LABEL[o.payment_method] ?? o.payment_method ?? '—'}</span>
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-display-heavy)', fontSize: 13 }}>{fmt(o.total)}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_C[o.payment_status ?? o.status] ?? '#fff' }}>
                            {o.payment_status === 'paid' || o.status === 'paid' ? 'PAGO' : o.payment_status === 'pending' || o.status === 'pending' ? 'PENDENTE' : (o.payment_status ?? o.status ?? '—').toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* RECEBÍVEIS */}
          {tab === 1 && (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--fg3)' }}>
              <Icon name="truck" size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 14 }}>Recebíveis parcelados</p>
              <p style={{ fontSize: 12 }}>Integração com InfinitePay necessária para exibir agenda de recebimento. Configure em <Link href="/admin/integracoes" style={{ color: 'var(--bg-accent)' }}>Integrações</Link>.</p>
              <Link href="/admin/financeiro/recebiveis" style={{ display: 'inline-block', marginTop: 12, padding: '8px 16px', background: 'var(--bg-accent)', color: '#fff', fontSize: 11, fontFamily: 'var(--font-display-heavy)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ver recebíveis →</Link>
            </div>
          )}

          {/* TAXAS */}
          {tab === 2 && (
            <div style={{ padding: 24 }}>
              <Link href="/admin/financeiro/taxas" style={{ display: 'inline-block', marginBottom: 16, padding: '8px 16px', background: 'var(--surf-3)', color: '#fff', fontSize: 11, fontFamily: 'var(--font-display-heavy)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid var(--hair-strong)' }}>Ver tabela completa de taxas →</Link>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {[
                  { m: 'PIX', rate: '0,99%', settle: 'D+0', note: 'Liquidação no mesmo dia' },
                  { m: 'Cartão crédito 1x', rate: '2,49%', settle: 'D+1', note: '' },
                  { m: 'Cartão crédito 2-12x', rate: '3,49%', settle: 'D+30', note: 'Por parcela' },
                  { m: 'Boleto', rate: 'R$ 3,49', settle: 'D+2', note: 'Valor fixo por boleto' },
                ].map(r => (
                  <div key={r.m} style={{ background: 'var(--surf-3)', border: '1px solid var(--hair)', padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{r.m}</div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 22, color: 'var(--bg-accent-hot)', marginBottom: 2 }}>{r.rate}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg3)' }}>Liquidação {r.settle}{r.note ? ` · ${r.note}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAQUES */}
          {tab === 3 && (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--fg3)' }}>
              <Icon name="bolt" size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 14 }}>Solicitação de saques</p>
              <p style={{ fontSize: 12, maxWidth: 400, margin: '0 auto 16px' }}>Saques são realizados via InfinitePay. Configure suas credenciais e gerencie saques diretamente no painel da InfinitePay ou via API.</p>
              <Link href="/admin/financeiro/saques" style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--bg-accent)', color: '#fff', fontSize: 11, fontFamily: 'var(--font-display-heavy)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ver histórico de saques →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

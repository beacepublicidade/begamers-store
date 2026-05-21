'use client'
import { useState, useEffect, useCallback } from 'react'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'
import AdminTopbar from '@/components/admin/AdminTopbar'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string | null
  shipping_method: string | null
  total: number
  created_at: string
  customers: { name: string; email: string } | null
  order_items: { id: string }[]
}

const STATUS_LABELS: Record<string, string> = {
  pending:    'Aguardando',
  confirmed:  'Confirmado',
  processing: 'Em Separação',
  shipped:    'Enviado',
  delivered:  'Entregue',
  cancelled:  'Cancelado',
  refunded:   'Reembolsado',
}

const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  pending:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  confirmed:  { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)' },
  processing: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)' },
  shipped:    { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
  delivered:  { color: '#4cd680', bg: 'rgba(76,214,128,0.12)', border: 'rgba(76,214,128,0.3)' },
  cancelled:  { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
  refunded:   { color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', border: 'rgba(156,163,175,0.3)' },
}

const KPI_FILTERS = [
  { key: '',           label: 'TODOS' },
  { key: 'pending',    label: 'AGUARDANDO' },
  { key: 'processing', label: 'EM SEPARAÇÃO' },
  { key: 'shipped',    label: 'ENVIADOS' },
  { key: 'delivered',  label: 'ENTREGUES' },
  { key: 'cancelled',  label: 'PROBLEMAS' },
]

const PM_LABELS: Record<string, string> = {
  pix: 'PIX', credit: 'CARTÃO', boleto: 'BOLETO',
}

function fmtPrice(v: number) {
  return (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtDate(s: string) {
  const d = new Date(s)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.pending
  return (
    <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'recent' | 'value'>('recent')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [updating, setUpdating] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter) params.set('status', filter)
    if (search) params.set('q', search)
    const res = await fetch(`/api/admin/pedidos?${params}`)
    const data = await res.json()
    let list: Order[] = Array.isArray(data) ? data : []
    if (sort === 'value') list = [...list].sort((a, b) => b.total - a.total)
    setOrders(list)
    setLoading(false)
  }, [filter, search, sort])

  useEffect(() => { load() }, [load])

  // KPI counts from loaded orders (all statuses from last load without filter)
  const [allOrders, setAllOrders] = useState<Order[]>([])
  useEffect(() => {
    fetch('/api/admin/pedidos?limit=500')
      .then(r => r.json())
      .then(d => setAllOrders(Array.isArray(d) ? d : []))
      .catch(() => null)
  }, [])

  const kpiCounts: Record<string, number> = { '': allOrders.length }
  for (const o of allOrders) kpiCounts[o.status] = (kpiCounts[o.status] ?? 0) + 1
  // "PROBLEMAS" = cancelled + refunded
  kpiCounts['cancelled'] = (kpiCounts['cancelled'] ?? 0) + (kpiCounts['refunded'] ?? 0)

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    await fetch(`/api/admin/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdating(null)
    load()
  }

  async function bulkMark(status: string) {
    setBulkLoading(true)
    await Promise.all([...selected].map(id =>
      fetch(`/api/admin/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
    ))
    setBulkLoading(false)
    setSelected(new Set())
    load()
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const selectAll = () => setSelected(new Set(orders.map(o => o.id)))
  const clearSel  = () => setSelected(new Set())

  const inp: React.CSSProperties = {
    background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '8px 12px', fontSize: 12, borderRadius: 0,
  }

  return (
    <div>
      <AdminTopbar section="VENDAS" page="PEDIDOS" />
      <div style={{ padding: 32 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Pedidos</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--fg3)', fontSize: 12 }}>Filtros · {orders.length} resultado{orders.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => {
              const rows = orders.map(o => [o.order_number, o.customers?.name ?? '', fmtPrice(o.total), STATUS_LABELS[o.status], fmtDate(o.created_at)].join(','))
              const csv = ['Pedido,Cliente,Total,Status,Data', ...rows].join('\n')
              const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'pedidos.csv'; a.click()
            }} style={{ padding: '8px 16px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', color: '#fff', cursor: 'pointer' }}>
              Exportar CSV
            </button>
          </div>
        </div>

        {/* KPI tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--hair)' }}>
          {KPI_FILTERS.map(k => {
            const count = kpiCounts[k.key] ?? 0
            const active = filter === k.key
            return (
              <button key={k.key} onClick={() => { setFilter(k.key); setSelected(new Set()) }}
                style={{ padding: '10px 18px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'transparent', border: 'none', borderBottom: active ? '2px solid var(--bg-accent)' : '2px solid transparent', color: active ? '#fff' : 'var(--fg3)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: -1 }}>
                <span style={{ fontSize: 18, fontFamily: 'var(--font-display-heavy)', color: active ? '#fff' : 'var(--fg3)' }}>{count}</span>
                {k.label}
              </button>
            )
          })}
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: selected.size > 0 ? 8 : 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Icon name="search" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)' }} />
            <input style={{ ...inp, paddingLeft: 32, width: '100%', boxSizing: 'border-box' }}
              placeholder="Buscar por número, nome ou e-mail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load()}
            />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as 'recent' | 'value')} style={inp}>
            <option value="recent">Mais recentes</option>
            <option value="value">Maior valor</option>
          </select>
          <button onClick={load} style={{ padding: '8px 16px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer' }}>
            Filtrar
          </button>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 16px', background: 'rgba(204,0,0,0.08)', border: '1px solid rgba(204,0,0,0.3)' }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-display-heavy)', color: 'var(--bg-accent)' }}>{selected.size} pedido{selected.size !== 1 ? 's' : ''} selecionado{selected.size !== 1 ? 's' : ''}</span>
            <button onClick={() => bulkMark('processing')} disabled={bulkLoading} style={{ padding: '6px 12px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: '#a78bfa', cursor: 'pointer' }}>
              Marcar em separação
            </button>
            <button onClick={() => bulkMark('shipped')} disabled={bulkLoading} style={{ padding: '6px 12px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: '#34d399', cursor: 'pointer' }}>
              Marcar enviado
            </button>
            <button onClick={() => bulkMark('delivered')} disabled={bulkLoading} style={{ padding: '6px 12px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'rgba(76,214,128,0.15)', border: '1px solid rgba(76,214,128,0.4)', color: '#4cd680', cursor: 'pointer' }}>
              Marcar entregue
            </button>
            <button onClick={clearSel} style={{ marginLeft: 'auto', padding: '6px 10px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--hair-strong)', color: 'var(--fg3)', cursor: 'pointer' }}>
              Limpar seleção
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', overflowX: 'auto' }}>
          {loading ? (
            <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Carregando pedidos...</p>
          ) : orders.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--fg3)' }}>
              <Icon name="pkg" size={32} color="var(--hair-strong)" />
              <p style={{ marginTop: 12, fontSize: 13 }}>Nenhum pedido encontrado</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hair)', background: 'var(--surf-1)' }}>
                  <th style={{ width: 40, padding: '10px 12px' }}>
                    <input type="checkbox" checked={selected.size === orders.length && orders.length > 0}
                      onChange={e => e.target.checked ? selectAll() : clearSel()}
                      style={{ cursor: 'pointer', accentColor: 'var(--bg-accent)' }} />
                  </th>
                  {['PEDIDO', 'DATA', 'CLIENTE', 'ITENS', 'PAGAMENTO', 'ENVIO', 'VALOR', 'STATUS', 'AÇÕES'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const isSel = selected.has(o.id)
                  return (
                    <tr key={o.id}
                      style={{ borderBottom: '1px solid var(--hair)', background: isSel ? 'rgba(204,0,0,0.04)' : 'transparent', transition: 'background 0.1s' }}
                      onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surf-1)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = isSel ? 'rgba(204,0,0,0.04)' : 'transparent' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <input type="checkbox" checked={isSel} onChange={() => toggleSelect(o.id)} style={{ cursor: 'pointer', accentColor: 'var(--bg-accent)' }} />
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bg-accent-hot)', fontWeight: 600 }}>#{o.order_number}</span>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 11, color: 'var(--fg3)', whiteSpace: 'nowrap' }}>{fmtDate(o.created_at)}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{o.customers?.name ?? '—'}</div>
                        <div style={{ fontSize: 10, color: 'var(--fg3)' }}>{o.customers?.email}</div>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--fg2)' }}>{o.order_items?.length ?? 0}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', color: o.payment_status === 'paid' ? '#4cd680' : '#f59e0b' }}>
                          {PM_LABELS[o.payment_method ?? ''] ?? (o.payment_method?.toUpperCase() ?? '—')}
                        </span>
                        <div style={{ fontSize: 9, color: o.payment_status === 'paid' ? '#4cd680' : '#f59e0b', marginTop: 2 }}>
                          {o.payment_status === 'paid' ? '● PAGO' : '○ PENDENTE'}
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 10, color: 'var(--fg3)', whiteSpace: 'nowrap' }}>
                        {o.shipping_method ?? '—'}
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, color: '#fff', whiteSpace: 'nowrap' }}>
                        {fmtPrice(o.total)}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <select value={o.status} disabled={updating === o.id}
                          onChange={e => updateStatus(o.id, e.target.value)}
                          style={{ padding: '4px 6px', fontSize: 9, cursor: 'pointer', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase', color: STATUS_COLORS[o.status]?.color ?? '#fff', background: STATUS_COLORS[o.status]?.bg ?? 'transparent', border: `1px solid ${STATUS_COLORS[o.status]?.border ?? 'var(--hair)'}`, borderRadius: 0 }}>
                          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Link href={`/admin/pedidos/${o.id}`}
                          style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', color: '#fff', textDecoration: 'none' }}
                          title="Ver detalhes">
                          <Icon name="eye" size={13} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ marginTop: 12, fontSize: 11, color: 'var(--fg3)' }}>
          Mostrando {orders.length} pedido{orders.length !== 1 ? 's' : ''}
          {filter ? ` com status "${STATUS_LABELS[filter]}"` : ''}
        </p>
      </div>
    </div>
  )
}

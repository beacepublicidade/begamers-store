'use client'
import { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'
import AdminTopbar from '@/components/admin/AdminTopbar'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string | null
  total: number
  created_at: string
  customers: { name: string; email: string } | null
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  processing: 'Processando',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
}

const STATUS_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  pending:    { color: '#f59e0b', bg: '#1c1500', border: '#6b4c00' },
  confirmed:  { color: '#60a5fa', bg: '#0a1628', border: '#1e40af' },
  processing: { color: '#a78bfa', bg: '#130d28', border: '#4c1d95' },
  shipped:    { color: '#34d399', bg: '#051a10', border: '#065f46' },
  delivered:  { color: '#4cd680', bg: '#0e3a1f', border: '#1f9d55' },
  cancelled:  { color: '#f87171', bg: '#1a0808', border: '#3a1a1a' },
  refunded:   { color: '#9ca3af', bg: '#111', border: '#374151' },
}

function fmtPrice(v: number) {
  return (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  async function load() {
    const params = new URLSearchParams()
    if (filter) params.set('status', filter)
    if (search) params.set('q', search)
    const res = await fetch(`/api/admin/pedidos?${params}`)
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

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

  const inputStyle: React.CSSProperties = {
    background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '10px 14px', fontSize: 13, borderRadius: 0,
  }

  return (
    <div>
      <AdminTopbar section="VENDAS" page="PEDIDOS" />
      <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Pedidos
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--fg3)', fontSize: 13 }}>
            {orders.length} pedido{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)' }} />
          <input
            style={{ ...inputStyle, paddingLeft: 40, minWidth: 240 }}
            placeholder="Buscar por número..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ ...inputStyle, minWidth: 160 }}
        >
          <option value="">Todos status</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button onClick={load} style={{
          background: 'var(--surf-3)', border: '1px solid var(--hair-strong)',
          color: '#fff', padding: '10px 20px', fontSize: 12,
          fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em',
          textTransform: 'uppercase', cursor: 'pointer', borderRadius: 0,
        }}>Filtrar</button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 0 }}>
        {loading ? (
          <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Carregando...</p>
        ) : orders.length === 0 ? (
          <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Nenhum pedido encontrado</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                {['Pedido', 'Cliente', 'Total', 'Status', 'Data', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const sc = STATUS_COLORS[o.status] ?? STATUS_COLORS.pending
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg2)' }}>
                        #{o.order_number}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{o.customers?.name ?? '—'}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{o.customers?.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{fmtPrice(o.total)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={o.status}
                        disabled={updating === o.id}
                        onChange={e => updateStatus(o.id, e.target.value)}
                        style={{
                          padding: '4px 8px', fontSize: 11, cursor: 'pointer',
                          fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 0,
                        }}
                      >
                        {Object.entries(STATUS_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)' }}>{fmtDate(o.created_at)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link href={`/admin/pedidos/${o.id}`} style={{
                        width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', borderRadius: 0, color: '#fff',
                      }}>
                        <Icon name="eye" size={14} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </div>
  )
}

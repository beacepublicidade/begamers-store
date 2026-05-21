'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'

interface Tracking {
  id: string; carrier: string; tracking_code: string; status: string
  estimated_delivery: string; created_at: string
  orders?: { id: string; customer_name: string } | null
}

const STATUS_C: Record<string, { c: string; bg: string; label: string }> = {
  preparing:        { c: '#ffc940', bg: 'rgba(217,154,0,0.12)',    label: 'Preparando' },
  posted:           { c: '#a78bfa', bg: 'rgba(167,139,250,0.12)',  label: 'Postado' },
  in_transit:       { c: '#60a5fa', bg: 'rgba(96,165,250,0.12)',   label: 'Em trânsito' },
  out_for_delivery: { c: '#fb923c', bg: 'rgba(251,146,60,0.12)',   label: 'Saiu p/ entrega' },
  delivered:        { c: '#4cd680', bg: 'rgba(31,157,85,0.12)',    label: 'Entregue' },
  returned:         { c: '#f87171', bg: 'rgba(248,113,113,0.12)', label: 'Devolvido' },
}

export default function RastreamentosPage() {
  const [items, setItems] = useState<Tracking[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  async function load(query = '') {
    setLoading(true)
    const res = await fetch(`/api/admin/rastreamentos${query ? `?q=${query}` : ''}`)
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <AdminTopbar section="OPERAÇÃO" page="RASTREAMENTOS" />
      <div style={{ padding: 32 }}>
        <h1 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Rastreamentos</h1>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <Icon name="search" size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)', pointerEvents: 'none' }} />
            <input className="bg-input" placeholder="Buscar por código de rastreio..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(q)} style={{ paddingLeft: 36, fontSize: 12 }} />
          </div>
          <button onClick={() => load(q)} style={{ padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--surf-2)', border: '1px solid var(--hair-strong)', color: '#fff', cursor: 'pointer' }}>Buscar</button>
          <button onClick={() => load('')} style={{ padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--surf-2)', border: '1px solid var(--hair-strong)', color: '#fff', cursor: 'pointer' }}>Atualizar todos</button>
        </div>

        {loading ? <p style={{ color: 'var(--fg3)' }}>Carregando...</p> : items.length === 0 ? (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 40, textAlign: 'center', color: 'var(--fg3)' }}>
            <Icon name="truck" size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>Nenhum rastreamento encontrado.</p>
            <p style={{ fontSize: 12 }}>Os rastreamentos são criados ao marcar um pedido como "Enviado".</p>
          </div>
        ) : (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                  {['Pedido','Cliente','Transportadora','Código','Status','Previsão','Ação'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(r => {
                  const s = STATUS_C[r.status] ?? { c: '#fff', bg: 'transparent', label: r.status }
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bg-accent-hot)' }}>
                        {r.orders ? <Link href={`/admin/pedidos/${r.orders.id}`} style={{ color: 'var(--bg-accent-hot)', textDecoration: 'none' }}>#{r.orders.id.slice(0,8)}</Link> : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{r.orders?.customer_name ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg2)' }}>{r.carrier}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg2)' }}>{r.tracking_code}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg }}>{s.label}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)' }}>{r.estimated_delivery ? new Date(r.estimated_delivery).toLocaleDateString('pt-BR') : '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Link href={`/rastreamento/${r.id}`} target="_blank" style={{ padding: '6px 12px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', color: '#fff', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
                          Ver timeline
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

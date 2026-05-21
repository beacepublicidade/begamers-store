'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'

interface StockItem {
  id: string
  name: string
  brand: string | null
  stock: number
  price: number
  is_active: boolean
  categories: { name: string } | null
}

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function StockBadge({ qty }: { qty: number }) {
  const color = qty === 0 ? '#f87171' : qty <= 10 ? '#ffc940' : '#4cd680'
  const bg = qty === 0 ? 'rgba(248,113,113,0.12)' : qty <= 10 ? 'rgba(217,154,0,0.12)' : 'rgba(31,157,85,0.12)'
  const label = qty === 0 ? 'ESGOTADO' : qty <= 10 ? 'CRÍTICO' : 'OK'
  return (
    <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color, background: bg }}>
      {label}
    </span>
  )
}

export default function EstoquePage() {
  const [items, setItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/produtos?limit=200')
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = items.filter(p => {
    if (filter === 'low') return p.stock > 0 && p.stock <= 10
    if (filter === 'out') return p.stock === 0
    return true
  }).filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand ?? '').toLowerCase().includes(search.toLowerCase()))

  const outCount = items.filter(p => p.stock === 0).length
  const lowCount = items.filter(p => p.stock > 0 && p.stock <= 10).length
  const totalUnits = items.reduce((a, p) => a + p.stock, 0)

  return (
    <div>
      <AdminTopbar section="CATÁLOGO" page="ESTOQUE" />
      <div style={{ padding: 32 }}>
        <h1 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>
          Estoque
        </h1>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { l: 'TOTAL DE PRODUTOS', v: String(items.length), icon: 'rows', accent: false },
            { l: 'UNIDADES EM ESTOQUE', v: String(totalUnits), icon: 'pkg', accent: false },
            { l: 'ESTOQUE CRÍTICO', v: String(lowCount), icon: 'bolt', accent: lowCount > 0 },
            { l: 'ESGOTADOS', v: String(outCount), icon: 'trash', accent: outCount > 0 },
          ].map(k => (
            <div key={k.l} style={{ background: 'var(--surf-2)', border: `1px solid ${k.accent ? 'var(--bg-accent-hot)' : 'var(--hair)'}`, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon name={k.icon} size={13} color={k.accent ? 'var(--bg-accent-hot)' : 'var(--fg3)'} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>// {k.l}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, lineHeight: 1, color: k.accent ? 'var(--bg-accent-hot)' : '#fff' }}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Icon name="search" size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)', pointerEvents: 'none' }} />
            <input className="bg-input" placeholder="Buscar produto..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, fontSize: 12 }} />
          </div>
          {(['all', 'low', 'out'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', fontSize: 11, cursor: 'pointer',
              fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase',
              background: filter === f ? 'var(--bg-accent)' : 'var(--surf-2)',
              border: `1px solid ${filter === f ? 'var(--bg-accent)' : 'var(--hair-strong)'}`,
              color: '#fff',
            }}>
              {f === 'all' ? 'Todos' : f === 'low' ? `Crítico (${lowCount})` : `Esgotado (${outCount})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
          {loading ? (
            <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Carregando...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                  {['Produto', 'Categoria', 'Preço', 'Qtd. Estoque', 'Status', 'Ação'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--hair)', background: p.stock === 0 ? 'rgba(248,113,113,0.04)' : p.stock <= 10 ? 'rgba(217,154,0,0.04)' : 'transparent' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                      {p.brand && <div style={{ fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{p.brand}</div>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg2)' }}>{p.categories?.name ?? '—'}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 13 }}>{fmt(p.price)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 20, color: p.stock === 0 ? '#f87171' : p.stock <= 10 ? '#ffc940' : '#fff' }}>{p.stock}</span>
                      <span style={{ fontSize: 11, color: 'var(--fg3)', marginLeft: 4 }}>un.</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}><StockBadge qty={p.stock} /></td>
                    <td style={{ padding: '12px 16px' }}>
                      <Link href={`/admin/produtos/${p.id}/editar`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', fontSize: 10,
                        fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase',
                        background: 'var(--surf-3)', border: '1px solid var(--hair-strong)',
                        color: '#fff', textDecoration: 'none',
                      }}>
                        <Icon name="edit" size={11} /> Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

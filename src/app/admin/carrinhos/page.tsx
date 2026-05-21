'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

interface Cart {
  id: string; customer_name: string; customer_email: string
  total: number; status: string; created_at: string; updated_at: string
  items?: unknown
}

function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') }
function age(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff / 60000)}min atrás`
  if (h < 24) return `${h}h atrás`
  return `${Math.floor(h / 24)}d atrás`
}

export default function CarrinhosPage() {
  const [carts, setCarts] = useState<Cart[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/carrinhos')
    const data = await res.json()
    setCarts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const total = carts.reduce((a, c) => a + (c.total || 0), 0)

  return (
    <div>
      <AdminTopbar section="VENDAS" page="CARRINHOS" />
      <div style={{ padding: 32 }}>
        <h1 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Carrinhos Pendentes</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { l: 'CARRINHOS PENDENTES', v: String(carts.length), icon: 'cart', hot: true },
            { l: 'VALOR TOTAL PENDENTE', v: fmt(total), icon: 'chart', hot: false },
            { l: 'MÉDIA POR CARRINHO', v: carts.length > 0 ? fmt(total / carts.length) : 'R$ 0,00', icon: 'tag', hot: false },
          ].map(k => (
            <div key={k.l} style={{ background: 'var(--surf-2)', border: `1px solid ${k.hot ? 'var(--bg-accent-hot)' : 'var(--hair)'}`, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon name={k.icon} size={13} color={k.hot ? 'var(--bg-accent-hot)' : 'var(--fg3)'} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>// {k.l}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 24, lineHeight: 1, color: k.hot ? 'var(--bg-accent-hot)' : '#fff' }}>{k.v}</div>
            </div>
          ))}
        </div>

        {loading ? <p style={{ color: 'var(--fg3)' }}>Carregando...</p> : carts.length === 0 ? (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 40, textAlign: 'center', color: 'var(--fg3)' }}>
            <Icon name="cart" size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>Nenhum carrinho pendente.</p>
            <p style={{ fontSize: 12 }}>Pedidos aguardando pagamento aparecerão aqui.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                  {['Pedido', 'Cliente', 'E-mail', 'Valor', 'Status', 'Criado', 'Atualizado'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {carts.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bg-accent-hot)' }}>#{c.id.slice(0, 8)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.customer_name || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg2)' }}>{c.customer_email || '—'}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 14 }}>{fmt(c.total || 0)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffc940', background: 'rgba(217,154,0,0.12)' }}>
                        {c.status === 'pending' ? 'Pendente' : 'Ag. pagamento'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--fg3)' }}>{age(c.created_at)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--fg3)' }}>{age(c.updated_at || c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

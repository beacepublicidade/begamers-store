'use client'
import { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  created_at: string
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  async function load(q = '') {
    const params = q ? `?q=${encodeURIComponent(q)}` : ''
    const res = await fetch(`/api/admin/clientes${params}`)
    const data = await res.json()
    setCustomers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const inputStyle: React.CSSProperties = {
    background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '10px 14px', fontSize: 13, borderRadius: 2,
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Clientes
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--fg3)', fontSize: 13 }}>
            {customers.length} cliente{customers.length !== 1 ? 's' : ''} cadastrado{customers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Icon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)' }} />
          <input
            style={{ ...inputStyle, paddingLeft: 40, width: '100%' }}
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(search)}
          />
        </div>
        <button onClick={() => load(search)} style={{
          background: 'var(--surf-3)', border: '1px solid var(--hair-strong)',
          color: '#fff', padding: '10px 20px', fontSize: 12,
          fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em',
          textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
        }}>Buscar</button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2 }}>
        {loading ? (
          <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Carregando...</p>
        ) : customers.length === 0 ? (
          <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Nenhum cliente encontrado</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                {['Nome', 'Email', 'Telefone', 'Cadastro'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--fg2)' }}>{c.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>{c.phone ?? '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)' }}>
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

interface Campaign {
  id: string; name: string; type: string; status: string
  start_date: string; end_date: string; discount_pct: number
  products_count: number; revenue: number
}

function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.') }

const STATUS_C: Record<string, { c: string; bg: string }> = {
  active:    { c: '#4cd680', bg: 'rgba(31,157,85,0.12)' },
  scheduled: { c: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  ended:     { c: 'var(--fg3)', bg: 'var(--surf-3)' },
  paused:    { c: '#ffc940', bg: 'rgba(217,154,0,0.12)' },
}

export default function CampanhasPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'discount', start_date: '', end_date: '', discount_pct: '0' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/campanhas')
    const data = await res.json()
    setCampaigns(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create() {
    setSaving(true); setSaveError('')
    const res = await fetch('/api/admin/campanhas', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, discount_pct: parseInt(form.discount_pct) }),
    })
    if (!res.ok) { const j = await res.json(); setSaveError(j.error ?? 'Erro'); setSaving(false); return }
    setShowForm(false); setForm({ name: '', type: 'discount', start_date: '', end_date: '', discount_pct: '0' })
    setSaving(false); load()
  }

  async function del(id: string) {
    if (!confirm('Excluir campanha?')) return
    await fetch(`/api/admin/campanhas/${id}`, { method: 'DELETE' })
    load()
  }

  const active = campaigns.filter(c => c.status === 'active')

  return (
    <div>
      <AdminTopbar section="MARKETING" page="CAMPANHAS" />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Campanhas</h1>
          <button onClick={() => setShowForm(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <Icon name="plus" size={14} /> Nova campanha
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Nova Campanha</h3>
            {saveError && <div style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>{saveError}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
              {[['Nome', 'name', 'text'], ['Início', 'start_date', 'date'], ['Fim', 'end_date', 'date']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Tipo</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '9px 12px', fontSize: 13 }}>
                  <option value="discount">Desconto</option>
                  <option value="launch">Lançamento</option>
                  <option value="installment">Parcelamento</option>
                  <option value="bundle">Bundle</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Desconto %</label>
                <input type="number" value={form.discount_pct} onChange={e => setForm(f => ({ ...f, discount_pct: e.target.value }))} style={{ width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
              <button onClick={create} disabled={!form.name || saving} style={{ padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>{saving ? '...' : 'Criar'}</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { l: 'CAMPANHAS ATIVAS', v: String(active.length), icon: 'bolt', accent: true },
            { l: 'RECEITA GERADA', v: fmt(active.reduce((a,c) => a + (c.revenue||0), 0)), icon: 'chart', accent: false },
            { l: 'TOTAL CAMPANHAS', v: String(campaigns.length), icon: 'rows', accent: false },
          ].map(k => (
            <div key={k.l} style={{ background: 'var(--surf-2)', border: `1px solid ${k.accent ? 'var(--bg-accent-hot)' : 'var(--hair)'}`, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon name={k.icon} size={13} color={k.accent ? 'var(--bg-accent-hot)' : 'var(--fg3)'} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>// {k.l}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 24, lineHeight: 1, color: k.accent ? 'var(--bg-accent-hot)' : '#fff' }}>{k.v}</div>
            </div>
          ))}
        </div>

        {loading ? <p style={{ color: 'var(--fg3)' }}>Carregando...</p> : (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                  {['Campanha','Tipo','Período','Desconto','Produtos','Receita','Status','Ações'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => {
                  const s = STATUS_C[c.status] ?? { c: '#fff', bg: 'transparent' }
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--fg2)', fontFamily: 'var(--font-mono)' }}>{c.type}</td>
                      <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--fg3)' }}>{c.start_date} – {c.end_date}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 14, color: c.discount_pct > 0 ? 'var(--bg-accent-hot)' : 'var(--fg3)' }}>{c.discount_pct > 0 ? `${c.discount_pct}%` : '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.products_count}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 13 }}>{fmt(c.revenue||0)}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg }}>{c.status}</span></td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', color: '#fff', cursor: 'pointer' }}><Icon name="edit" size={12} /></button>
                          <button onClick={() => del(c.id)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0808', border: '1px solid #3a1a1a', color: '#f87171', cursor: 'pointer' }}><Icon name="trash" size={12} /></button>
                        </div>
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

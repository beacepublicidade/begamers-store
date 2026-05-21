'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

interface Automation {
  id: string; name: string; trigger_event: string; channel: string
  is_active: boolean; sent_count: number
}

export default function EmailsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', trigger_event: '', channel: 'email' })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/emails')
    const data = await res.json()
    setAutomations(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggle(id: string, current: boolean) {
    await fetch(`/api/admin/emails/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !current }) })
    load()
  }

  async function del(id: string) {
    if (!confirm('Excluir automação?')) return
    await fetch(`/api/admin/emails/${id}`, { method: 'DELETE' })
    load()
  }

  async function create() {
    setSaving(true)
    const res = await fetch('/api/admin/emails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { setShowForm(false); setForm({ name: '', trigger_event: '', channel: 'email' }); load() }
    setSaving(false)
  }

  return (
    <div>
      <AdminTopbar section="MARKETING" page="E-MAILS & SMS" />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>E-mails & SMS</h1>
          <button onClick={() => setShowForm(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <Icon name="plus" size={14} /> Nova automação
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 20, marginBottom: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            {[['Nome', 'name', 'text'], ['Gatilho', 'trigger_event', 'text']].map(([label, key]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
                <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Canal</label>
              <select value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))} style={{ width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '9px 12px', fontSize: 13 }}>
                <option value="email">E-mail</option>
                <option value="sms">SMS</option>
                <option value="email+sms">E-mail + SMS</option>
              </select>
            </div>
            <button onClick={create} disabled={!form.name || saving} style={{ padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer' }}>{saving ? '...' : 'Criar'}</button>
          </div>
        )}

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// AUTOMAÇÕES</span>

        {loading ? <p style={{ color: 'var(--fg3)' }}>Carregando...</p> : (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                  {['Nome','Gatilho','Canal','Disparos','Status','Ação'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {automations.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--hair)', opacity: a.is_active ? 1 : 0.5 }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>{a.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg2)' }}>{a.trigger_event}</td>
                    <td style={{ padding: '12px 16px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg3)' }}>{a.channel}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 16 }}>{(a.sent_count||0).toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => toggle(a.id, a.is_active)} style={{ padding: '3px 8px', fontSize: 9, cursor: 'pointer', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: a.is_active ? '#4cd680' : '#6b6b6b', background: a.is_active ? '#0e3a1f' : '#1a1a1a', border: `1px solid ${a.is_active ? '#1f9d55' : 'var(--hair-strong)'}` }}>
                        {a.is_active ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => del(a.id)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0808', border: '1px solid #3a1a1a', color: '#f87171', cursor: 'pointer' }}><Icon name="trash" size={12} /></button>
                    </td>
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

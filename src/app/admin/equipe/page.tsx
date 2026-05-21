'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

interface Member {
  id: string; name: string; email: string; role: string; is_active: boolean; last_access: string
}

const ROLE_C: Record<string, string> = {
  owner: 'var(--bg-accent-hot)', admin: '#60a5fa', operator: '#ffc940', marketing: '#a78bfa',
}

const PERMISSIONS = [
  { label: 'Dashboard', owner: true, admin: true, operator: true, marketing: false },
  { label: 'Pedidos', owner: true, admin: true, operator: true, marketing: false },
  { label: 'Clientes', owner: true, admin: true, operator: true, marketing: false },
  { label: 'Produtos', owner: true, admin: true, operator: false, marketing: false },
  { label: 'Financeiro', owner: true, admin: true, operator: false, marketing: false },
  { label: 'Marketing', owner: true, admin: true, operator: false, marketing: true },
  { label: 'Configurações', owner: true, admin: false, operator: false, marketing: false },
  { label: 'Equipe', owner: true, admin: false, operator: false, marketing: false },
]

export default function EquipePage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'operator' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/equipe')
    const data = await res.json()
    setMembers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create() {
    setSaving(true); setSaveError('')
    const res = await fetch('/api/admin/equipe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (!res.ok) { const j = await res.json(); setSaveError(j.error ?? 'Erro'); setSaving(false); return }
    setShowForm(false); setForm({ name: '', email: '', role: 'operator' }); setSaving(false); load()
  }

  async function del(id: string) {
    if (!confirm('Remover membro?')) return
    await fetch(`/api/admin/equipe/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <AdminTopbar section="CONFIG" page="EQUIPE & PERMISSÕES" />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Equipe & Permissões</h1>
          <button onClick={() => setShowForm(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <Icon name="plus" size={14} /> Convidar membro
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 20, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Novo Membro</h3>
            {saveError && <div style={{ color: '#f87171', fontSize: 12, marginBottom: 12 }}>{saveError}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              {[['Nome', 'name'], ['E-mail', 'email']].map(([label, key]) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
                  <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '9px 12px', fontSize: 13 }}>
                  <option value="admin">Admin</option>
                  <option value="operator">Operador</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <button onClick={create} disabled={!form.name || !form.email || saving} style={{ padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer' }}>{saving ? '...' : 'Convidar'}</button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// MEMBROS</span>
            {loading ? <p style={{ color: 'var(--fg3)' }}>Carregando...</p> : (
              <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
                {members.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--hair)', opacity: m.is_active ? 1 : 0.5 }}>
                    <div style={{ width: 40, height: 40, background: 'var(--bg-accent)', clipPath: 'polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display-heavy)', fontSize: 14, flexShrink: 0 }}>
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</span>
                        <span style={{ fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: ROLE_C[m.role] ?? '#fff' }}>{m.role.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{m.email}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: 'var(--fg3)', marginBottom: 8 }}>Último acesso: {m.last_access ? new Date(m.last_access).toLocaleDateString('pt-BR') : '—'}</div>
                      {m.role !== 'owner' && (
                        <button onClick={() => del(m.id)} style={{ padding: '4px 10px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#1a0808', border: '1px solid #3a1a1a', color: '#f87171', cursor: 'pointer' }}>Remover</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// PERMISSÕES POR ROLE</span>
            <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>Seção</th>
                    {['Owner','Admin','Op.','Mkt'].map(r => (
                      <th key={r} style={{ padding: '8px 8px', textAlign: 'center', fontFamily: 'var(--font-display-heavy)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS.map(p => (
                    <tr key={p.label} style={{ borderBottom: '1px solid var(--hair)' }}>
                      <td style={{ padding: '8px 12px', fontSize: 11, color: 'var(--fg2)' }}>{p.label}</td>
                      {[p.owner, p.admin, p.operator, p.marketing].map((v, i) => (
                        <td key={i} style={{ padding: '8px 8px', textAlign: 'center' }}>
                          <Icon name={v ? 'check' : 'x'} size={12} color={v ? '#4cd680' : 'var(--hair-strong)'} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

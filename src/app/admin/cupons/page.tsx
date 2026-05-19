'use client'
import { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'
import Btn from '@/components/ui/Btn'

interface Coupon {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  min_order: number | null
  max_uses: number | null
  uses_count: number
  is_active: boolean
  expires_at: string | null
}

const emptyForm: { code: string; type: 'percent' | 'fixed'; value: string; min_order: string; max_uses: string; expires_at: string } = { code: '', type: 'percent', value: '', min_order: '', max_uses: '', expires_at: '' }

export default function CuponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch('/api/admin/cupons')
    const data = await res.json()
    setCoupons(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      min_order: form.min_order ? Number(form.min_order) : null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: true,
    }
    if (editing) {
      await fetch(`/api/admin/cupons/${editing.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/admin/cupons', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
    }
    setForm(emptyForm)
    setEditing(null)
    setSaving(false)
    load()
  }

  async function toggle(id: string, current: boolean) {
    await fetch(`/api/admin/cupons/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !current }),
    })
    load()
  }

  async function del(id: string) {
    if (!confirm('Deletar cupom?')) return
    await fetch(`/api/admin/cupons/${id}`, { method: 'DELETE' })
    load()
  }

  function startEdit(c: Coupon) {
    setEditing(c)
    setForm({
      code: c.code, type: c.type, value: String(c.value),
      min_order: c.min_order != null ? String(c.min_order) : '',
      max_uses: c.max_uses != null ? String(c.max_uses) : '',
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '',
    })
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '10px 14px', fontSize: 13, borderRadius: 2, width: '100%',
  }

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ margin: '0 0 32px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>
        Cupons
      </h1>

      {/* Form */}
      <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {editing ? 'Editar Cupom' : 'Novo Cupom'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 140px 140px 160px auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Código</label>
            <input style={inputStyle} value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="EX: SAVE10" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Tipo</label>
            <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
              <option value="percent">%</option>
              <option value="fixed">R$</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Valor</label>
            <input type="number" style={inputStyle} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Pedido Mín (R$)</label>
            <input type="number" style={inputStyle} value={form.min_order} onChange={e => setForm(f => ({ ...f, min_order: e.target.value }))} placeholder="Opcional" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Usos Máx.</label>
            <input type="number" style={inputStyle} value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} placeholder="Ilimitado" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Expira em</label>
            <input type="date" style={inputStyle} value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="primary" onClick={save} disabled={!form.code || !form.value || saving}>
              {saving ? '...' : editing ? 'Salvar' : 'Criar'}
            </Btn>
            {editing && (
              <Btn variant="ghost" onClick={() => { setEditing(null); setForm(emptyForm) }}>X</Btn>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2 }}>
        {loading ? (
          <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Carregando...</p>
        ) : coupons.length === 0 ? (
          <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Nenhum cupom criado</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                {['Código', 'Desconto', 'Pedido Mín.', 'Usos', 'Expira', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>{c.code}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>
                    {c.type === 'percent' ? `${c.value}%` : `R$ ${(c.value / 100).toFixed(2)}`}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--fg2)' }}>
                    {c.min_order != null ? `R$ ${(c.min_order / 100).toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--fg2)' }}>
                    {c.uses_count}{c.max_uses != null ? ` / ${c.max_uses}` : ''}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)' }}>
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => toggle(c.id, c.is_active)} style={{
                      padding: '3px 8px', fontSize: 10, cursor: 'pointer',
                      fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: c.is_active ? '#4cd680' : '#6b6b6b',
                      background: c.is_active ? '#0e3a1f' : '#1a1a1a',
                      border: `1px solid ${c.is_active ? '#1f9d55' : 'var(--hair-strong)'}`,
                      borderRadius: 2,
                    }}>
                      {c.is_active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(c)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', borderRadius: 2, color: '#fff', cursor: 'pointer' }}>
                        <Icon name="edit" size={14} />
                      </button>
                      <button onClick={() => del(c.id)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0808', border: '1px solid #3a1a1a', borderRadius: 2, color: '#f87171', cursor: 'pointer' }}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
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

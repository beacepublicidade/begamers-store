'use client'
import { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'
import Btn from '@/components/ui/Btn'
import AdminTopbar from '@/components/admin/AdminTopbar'

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  sort_order: number
}

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', slug: '', sort_order: '0' })
  const [editing, setEditing] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch('/api/admin/categorias')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    const payload = { name: form.name, slug: form.slug || slugify(form.name), sort_order: parseInt(form.sort_order), is_active: true }
    if (editing) {
      await fetch(`/api/admin/categorias/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    } else {
      await fetch('/api/admin/categorias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    }
    setForm({ name: '', slug: '', sort_order: '0' })
    setEditing(null)
    setSaving(false)
    load()
  }

  async function toggle(id: string, current: boolean) {
    await fetch(`/api/admin/categorias/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !current }) })
    load()
  }

  async function del(id: string) {
    if (!confirm('Deletar categoria?')) return
    await fetch(`/api/admin/categorias/${id}`, { method: 'DELETE' })
    load()
  }

  function startEdit(c: Category) {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, sort_order: String(c.sort_order) })
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '10px 14px', fontSize: 13, borderRadius: 0, width: '100%',
  }

  return (
    <div>
      <AdminTopbar section="CATÁLOGO" page="CATEGORIAS" />
      <div style={{ padding: 32 }}>
      <h1 style={{ margin: '0 0 32px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>
        Categorias
      </h1>

      {/* Form */}
      <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 0, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {editing ? 'Editar Categoria' : 'Nova Categoria'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Nome</label>
            <input style={inputStyle} value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) })) }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Slug</label>
            <input style={inputStyle} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>Ordem</label>
            <input type="number" style={inputStyle} value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="primary" onClick={save} disabled={!form.name || saving}>
              {saving ? '...' : editing ? 'Salvar' : 'Criar'}
            </Btn>
            {editing && (
              <Btn variant="ghost" onClick={() => { setEditing(null); setForm({ name: '', slug: '', sort_order: '0' }) }}>
                Cancelar
              </Btn>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 0 }}>
        {loading ? (
          <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Carregando...</p>
        ) : categories.length === 0 ? (
          <p style={{ padding: 24, color: 'var(--fg3)', fontSize: 13 }}>Nenhuma categoria criada</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                {['Nome', 'Slug', 'Ordem', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)' }}>{c.slug}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--fg2)' }}>{c.sort_order}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => toggle(c.id, c.is_active)} style={{
                      padding: '3px 8px', fontSize: 10, cursor: 'pointer',
                      fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: c.is_active ? '#4cd680' : '#6b6b6b',
                      background: c.is_active ? '#0e3a1f' : '#1a1a1a',
                      border: `1px solid ${c.is_active ? '#1f9d55' : 'var(--hair-strong)'}`,
                      borderRadius: 0,
                    }}>
                      {c.is_active ? 'Ativa' : 'Inativa'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(c)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', borderRadius: 0, color: '#fff', cursor: 'pointer' }}>
                        <Icon name="edit" size={14} />
                      </button>
                      <button onClick={() => del(c.id)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0808', border: '1px solid #3a1a1a', borderRadius: 0, color: '#f87171', cursor: 'pointer' }}>
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
    </div>
  )
}

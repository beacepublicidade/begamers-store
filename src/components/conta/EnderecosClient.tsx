'use client'
import { useState } from 'react'

type Address = {
  id: string; label: string; recipient: string | null
  cep: string; street: string; number: string; complement: string | null
  district: string | null; city: string; state: string; is_default: boolean
}

const BLANK = { label: 'Casa', recipient: '', cep: '', street: '', number: '', complement: '', district: '', city: '', state: '', is_default: false }

function fmtCep(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8)
  return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d
}

async function fetchCep(cep: string) {
  const clean = cep.replace(/\D/g, '')
  if (clean.length !== 8) return null
  try {
    const r = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
    const d = await r.json()
    if (d.erro) return null
    return { street: d.logradouro, district: d.bairro, city: d.localidade, state: d.uf }
  } catch { return null }
}

function mono(text: string) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{text}</span>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {mono(label)}
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  )
}

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surf-2)', border: '1px solid var(--hair-strong)',
  color: '#fff', padding: '8px 12px', fontSize: 13, fontFamily: 'var(--font-body)',
  outline: 'none', boxSizing: 'border-box',
}

export default function EnderecosClient({ initial }: { initial: Address[] }) {
  const [addresses, setAddresses] = useState<Address[]>(initial)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)
  const [form, setForm] = useState({ ...BLANK })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  function openNew() {
    setEditing(null)
    setForm({ ...BLANK })
    setErr('')
    setShowForm(true)
  }

  function openEdit(addr: Address) {
    setEditing(addr)
    setForm({
      label: addr.label, recipient: addr.recipient ?? '',
      cep: fmtCep(addr.cep), street: addr.street, number: addr.number,
      complement: addr.complement ?? '', district: addr.district ?? '',
      city: addr.city, state: addr.state, is_default: addr.is_default,
    })
    setErr('')
    setShowForm(true)
  }

  async function onCepBlur() {
    const data = await fetchCep(form.cep)
    if (data) setForm(f => ({ ...f, street: data.street || f.street, district: data.district || f.district, city: data.city || f.city, state: data.state || f.state }))
  }

  async function save() {
    setLoading(true); setErr('')
    try {
      const url = editing ? `/api/conta/enderecos/${editing.id}` : '/api/conta/enderecos'
      const method = editing ? 'PUT' : 'POST'
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const d = await r.json()
      if (!r.ok) { setErr(d.error || 'Erro ao salvar'); setLoading(false); return }
      const updated = editing
        ? addresses.map(a => {
            if (form.is_default && a.id !== editing.id) return { ...a, is_default: false }
            return a.id === editing.id ? d : a
          })
        : [...(form.is_default ? addresses.map(a => ({ ...a, is_default: false })) : addresses), d]
      setAddresses(updated)
      setShowForm(false)
    } catch { setErr('Erro de conexão') }
    setLoading(false)
  }

  async function remove(id: string) {
    if (!confirm('Remover este endereço?')) return
    await fetch(`/api/conta/enderecos/${id}`, { method: 'DELETE' })
    setAddresses(addresses.filter(a => a.id !== id))
  }

  async function setDefault(addr: Address) {
    await fetch(`/api/conta/enderecos/${addr.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addr, cep: fmtCep(addr.cep), is_default: true }),
    })
    setAddresses(addresses.map(a => ({ ...a, is_default: a.id === addr.id })))
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>// MINHA CONTA</span>
          <h1 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', lineHeight: 1 }}>ENDEREÇOS.</h1>
        </div>
        <button onClick={openNew} style={{
          padding: '10px 20px', background: 'var(--bg-accent)', border: 'none',
          color: '#fff', fontFamily: 'var(--font-display-heavy)', fontSize: 11,
          letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
        }}>
          + Novo endereço
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', padding: '24px', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            {editing ? 'Editar endereço' : 'Novo endereço'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="// Apelido">
              <input style={inp} placeholder="Casa, Trabalho..." value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
            </Field>
            <Field label="// Destinatário">
              <input style={inp} placeholder="Nome de quem vai receber" value={form.recipient} onChange={e => setForm(f => ({ ...f, recipient: e.target.value }))} />
            </Field>
            <Field label="// CEP *">
              <input style={inp} placeholder="00000-000" value={form.cep}
                onChange={e => setForm(f => ({ ...f, cep: fmtCep(e.target.value) }))}
                onBlur={onCepBlur} />
            </Field>
            <Field label="// Bairro">
              <input style={inp} value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} />
            </Field>
            <Field label="// Rua / Logradouro *">
              <input style={{ ...inp }} value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} />
            </Field>
            <Field label="// Número *">
              <input style={inp} value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} />
            </Field>
            <Field label="// Complemento">
              <input style={inp} placeholder="Apto, Bloco..." value={form.complement} onChange={e => setForm(f => ({ ...f, complement: e.target.value }))} />
            </Field>
            <Field label="// Cidade *">
              <input style={inp} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            </Field>
            <Field label="// Estado *">
              <input style={inp} placeholder="SP" maxLength={2} value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase() }))} />
            </Field>
            <Field label="// Padrão">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
                <input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} />
                <span style={{ fontSize: 13, color: 'var(--fg2)' }}>Usar como endereço padrão</span>
              </label>
            </Field>
          </div>
          {err && <p style={{ color: '#f87171', fontSize: 13, marginTop: 12 }}>{err}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={save} disabled={loading} style={{
              padding: '10px 24px', background: 'var(--bg-accent)', border: 'none',
              color: '#fff', fontFamily: 'var(--font-display-heavy)', fontSize: 11,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', opacity: loading ? 0.6 : 1,
            }}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={() => setShowForm(false)} style={{
              padding: '10px 20px', background: 'transparent', border: '1px solid var(--hair-strong)',
              color: 'var(--fg2)', fontFamily: 'var(--font-display-heavy)', fontSize: 11,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
            }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {addresses.length === 0 ? (
        <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: '60px 32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--fg2)', fontSize: 15, marginBottom: 6 }}>Nenhum endereço salvo</p>
          <p style={{ color: 'var(--fg3)', fontSize: 13 }}>Seus endereços de entrega aparecerão aqui após o primeiro pedido, ou cadastre manualmente acima.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {addresses.map(addr => (
            <div key={addr.id} style={{
              background: 'var(--surf-1)', border: `1px solid ${addr.is_default ? 'var(--bg-accent)' : 'var(--hair)'}`,
              padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {addr.label}
                  </span>
                  {addr.is_default && (
                    <span style={{
                      fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'var(--bg-accent)',
                      border: '1px solid var(--bg-accent)', padding: '2px 6px',
                    }}>Padrão</span>
                  )}
                </div>
                {addr.recipient && <div style={{ fontSize: 12, color: 'var(--fg3)', marginBottom: 2 }}>{addr.recipient}</div>}
                <div style={{ fontSize: 13, color: 'var(--fg2)', lineHeight: 1.6 }}>
                  {addr.street}, {addr.number}{addr.complement ? `, ${addr.complement}` : ''}<br />
                  {addr.district && `${addr.district} · `}{addr.city} — {addr.state}<br />
                  CEP {addr.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                <button onClick={() => openEdit(addr)} style={{
                  padding: '6px 14px', background: 'transparent', border: '1px solid var(--hair-strong)',
                  color: 'var(--fg2)', fontFamily: 'var(--font-display-heavy)', fontSize: 10,
                  letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                }}>Editar</button>
                {!addr.is_default && (
                  <button onClick={() => setDefault(addr)} style={{
                    padding: '6px 14px', background: 'transparent', border: '1px solid var(--hair)',
                    color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', fontSize: 10,
                    letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                  }}>Padrão</button>
                )}
                <button onClick={() => remove(addr.id)} style={{
                  padding: '6px 14px', background: 'transparent', border: '1px solid rgba(248,113,113,0.3)',
                  color: '#f87171', fontFamily: 'var(--font-display-heavy)', fontSize: 10,
                  letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                }}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

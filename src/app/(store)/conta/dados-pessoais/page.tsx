'use client'
import { useEffect, useState } from 'react'
import ContaSidebar from '@/components/conta/ContaSidebar'
import Icon from '@/components/ui/Icon'

const INPUT: React.CSSProperties = {
  background: 'var(--surf-2)', border: '1px solid var(--hair-strong)',
  color: '#fff', padding: '12px 16px', fontSize: 14, width: '100%',
}
const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)',
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6,
}

export default function DadosPessoaisPage() {
  const [user, setUser] = useState<{ name: string; email: string; cpf: string; phone: string } | null>(null)
  const [form, setForm] = useState({ name: '', cpf: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/conta/me')
      .then(r => r.json())
      .then(data => {
        if (data) {
          setUser(data)
          setForm({ name: data.name, cpf: data.cpf, phone: data.phone })
        }
      })
      .catch(() => {})
  }, [])

  async function save() {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/conta/dados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!user) return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--fg3)', fontSize: 14 }}>Carregando...</div>
    </div>
  )

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <ContaSidebar name={user.name} email={user.email} activePath="/conta/dados-pessoais" />
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// MINHA CONTA</span>
            <h1 style={{ margin: '8px 0 0', fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', lineHeight: 1 }}>
              DADOS PESSOAIS.
            </h1>
          </div>
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: 24, maxWidth: 560 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={LABEL}>E-mail</label>
                <input style={{ ...INPUT, opacity: 0.5, cursor: 'not-allowed' }} value={user.email} readOnly />
                <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 6 }}>E-mail não pode ser alterado</div>
              </div>
              <div>
                <label style={LABEL}>Nome Completo</label>
                <input className="bg-input" style={INPUT} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={LABEL}>CPF</label>
                <input className="bg-input" style={INPUT} value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" />
              </div>
              <div>
                <label style={LABEL}>Telefone</label>
                <input className="bg-input" style={INPUT} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(11) 9 0000-0000" />
              </div>
            </div>
            {error && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,31,61,0.1)', border: '1px solid var(--bg-accent-hot)', fontSize: 13, color: '#ff6b6b' }}>
                {error}
              </div>
            )}
            {saved && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(31,157,85,0.1)', border: '1px solid #1f9d55', fontSize: 13, color: '#4cd680', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" size={14} color="#4cd680" stroke={2.5} /> Dados salvos com sucesso
              </div>
            )}
            <div style={{ marginTop: 20 }}>
              <button
                onClick={save}
                disabled={saving}
                style={{
                  padding: '13px 28px', background: 'var(--bg-accent)', color: '#fff', border: 'none',
                  fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em',
                  textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                  clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                }}
              >
                {saving ? 'Salvando...' : 'Salvar Dados'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

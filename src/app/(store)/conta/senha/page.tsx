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

export default function SenhaPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/conta/me')
      .then(r => r.json())
      .then(data => { if (data) setUser(data) })
      .catch(() => {})
  }, [])

  async function save() {
    if (form.password !== form.confirm) {
      setError('As senhas não coincidem')
      return
    }
    if (form.password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/conta/senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.password }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Erro ao alterar senha')
      }
      setSaved(true)
      setForm({ password: '', confirm: '' })
      setTimeout(() => setSaved(false), 4000)
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
        <ContaSidebar name={user.name} email={user.email} activePath="/conta/senha" />
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// MINHA CONTA</span>
            <h1 style={{ margin: '8px 0 0', fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', lineHeight: 1 }}>
              SENHA & SEGURANÇA.
            </h1>
          </div>
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: 24, maxWidth: 480 }}>
            <div style={{ marginBottom: 20, padding: '12px 14px', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)', fontSize: 13, color: 'var(--fg2)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="shield" size={14} color="#60a5fa" />
              Conta: {user.email}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={LABEL}>Nova Senha</label>
                <input
                  className="bg-input" type="password" style={INPUT}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label style={LABEL}>Confirmar Nova Senha</label>
                <input
                  className="bg-input" type="password" style={INPUT}
                  value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  placeholder="Repita a nova senha"
                />
              </div>
            </div>
            {error && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,31,61,0.1)', border: '1px solid var(--bg-accent-hot)', fontSize: 13, color: '#ff6b6b' }}>
                {error}
              </div>
            )}
            {saved && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(31,157,85,0.1)', border: '1px solid #1f9d55', fontSize: 13, color: '#4cd680', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" size={14} color="#4cd680" stroke={2.5} /> Senha alterada com sucesso
              </div>
            )}
            <div style={{ marginTop: 20 }}>
              <button
                onClick={save}
                disabled={saving || !form.password}
                style={{
                  padding: '13px 28px', background: 'var(--bg-accent)', color: '#fff', border: 'none',
                  fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em',
                  textTransform: 'uppercase', cursor: (saving || !form.password) ? 'not-allowed' : 'pointer',
                  opacity: (saving || !form.password) ? 0.5 : 1,
                  clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
                }}
              >
                {saving ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

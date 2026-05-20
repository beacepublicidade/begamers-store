'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'

const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)',
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg2)', marginBottom: 6,
}
const INPUT: React.CSSProperties = {
  background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
  color: '#fff', padding: '13px 16px', fontSize: 14, width: '100%',
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Senha incorreta. Tente novamente.')
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 500px', minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Left brand panel */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a0006 0%, #000 60%)',
        padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{
          position: 'absolute', left: -80, top: 100,
          fontFamily: 'var(--font-display-heavy)', fontSize: 280,
          color: '#0a0a0a', lineHeight: 0.78, letterSpacing: '-0.06em', textTransform: 'uppercase',
          userSelect: 'none',
        }}>ADMIN</div>
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 72,
          background: 'var(--bg-accent)',
          clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--bg-accent)' }}>BE</span>GAMERS STORE
          </span>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// CONSOLE DE OPERAÇÕES · ACESSO RESTRITO</span>
          <h1 style={{
            margin: '16px 0', fontFamily: 'var(--font-display-heavy)',
            fontSize: 80, lineHeight: 0.84, textTransform: 'uppercase', letterSpacing: '-0.04em',
          }}>
            CONTROLA<br />O <span style={{
              background: 'var(--bg-accent)', padding: '0 12px', display: 'inline-block',
              clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)',
            }}>SERVER.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, maxWidth: 420, lineHeight: 1.6 }}>
            Pedidos, financeiro, estoque e marketing num só lugar.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {[['Pedidos', 'pkg'], ['Produtos', 'rows'], ['Financeiro', 'bolt']].map(([l, i]) => (
            <div key={l} style={{ padding: 14, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--hair-strong)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name={i} size={16} color="var(--bg-accent-hot)" />
              <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div style={{ background: '#000', padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid var(--hair-strong)' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32,
          padding: '6px 14px', border: '1px solid var(--bg-accent)',
          alignSelf: 'flex-start', clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
        }}>
          <Icon name="lock" size={12} color="var(--bg-accent-hot)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' }}>ÁREA RESTRITA · ACESSO ADMIN</span>
        </div>

        <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 36, textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 0.95 }}>
          ENTRA<br />NA OPERAÇÃO.
        </h2>
        <p style={{ color: 'var(--fg2)', fontSize: 14, marginTop: 12 }}>Painel de controle da BeGamers Store.</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
          <div>
            <label style={LABEL}>Senha de Acesso</label>
            <input
              className="bg-input"
              type="password"
              style={INPUT}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
            />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(255,31,61,0.1)', border: '1px solid var(--bg-accent-hot)', fontSize: 13, color: '#ff6b6b' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: '16px', background: 'var(--bg-accent-hot)', color: '#fff', border: 'none',
              fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer',
              clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            }}
          >
            <Icon name="lock" size={16} />
            {loading ? 'Verificando...' : 'Acessar Console'}
          </button>
        </form>

        <div style={{ marginTop: 32, padding: 14, background: 'rgba(217,154,0,0.08)', border: '1px solid #d99a00', display: 'flex', gap: 12 }}>
          <Icon name="shield" size={18} color="#ffc940" />
          <div style={{ fontSize: 11, color: 'var(--fg2)', lineHeight: 1.5 }}>
            <strong style={{ color: '#ffc940' }}>Acesso monitorado.</strong> Toda ação é registrada. Acesso exclusivo para administradores autorizados.
          </div>
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span>BG STORE ADMIN v1.0</span>
          <span>STATUS · OPERACIONAL ●</span>
        </div>
      </div>
    </div>
  )
}

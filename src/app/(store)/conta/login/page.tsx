'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { signInAction, signUpAction } from './actions'
import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'

const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)',
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg2)', marginBottom: 6,
}
const INPUT: React.CSSProperties = {
  background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
  color: '#fff', padding: '13px 16px', fontSize: 14, width: '100%',
}
const BTN: React.CSSProperties = {
  padding: '16px', background: 'var(--bg-accent-hot)', color: '#fff', border: 'none',
  fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.08em',
  textTransform: 'uppercase', cursor: 'pointer', width: '100%',
  clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
}

export default function ContaLoginPage() {
  return (
    <Suspense fallback={null}>
      <ContaLoginInner />
    </Suspense>
  )
}

function ContaLoginInner() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/conta/minha-conta'

  const [cfg, setCfg] = useState({ title1: 'ENTRA', title2: 'NO SERVER.', eyebrow: '// COMUNIDADE BEGAMERS', subtitle: 'Cadastra-se e desbloqueia: drops exclusivos, cupons só pra membro, 10% off em todo PIX.' })
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then(r => r.json())
      .then((rows: Array<{ key: string; value: string }>) => {
        if (!Array.isArray(rows)) return
        const m: Record<string, string> = {}
        for (const r of rows) m[r.key] = r.value
        setCfg(prev => ({
          title1:   m.login_title1   || prev.title1,
          title2:   m.login_title2   || prev.title2,
          eyebrow:  m.login_eyebrow  || prev.eyebrow,
          subtitle: m.login_subtitle || prev.subtitle,
        }))
      })
      .catch(() => null)
  }, [])

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const fd = new FormData(e.currentTarget)
    const emailVal = (fd.get('email') as string ?? '').trim()
    const passwordVal = fd.get('password') as string ?? ''
    const result = await signInAction(emailVal, passwordVal)
    setLoading(false)
    if (result?.error) { setError('ERRO: ' + result.error); return }
    setSuccess('✅ Autenticado! Redirecionando...')
    window.location.href = redirectTo
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signUpAction(email, password, name)
    setLoading(false)
    if (result?.error) { setError(result.error); return }
    setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
  }

  const BENEFITS = [
    { icon: 'bolt', t: '10% OFF NO PIX' },
    { icon: 'fire', t: 'DROPS EXCLUSIVOS' },
    { icon: 'shield', t: 'GARANTIA ESTENDIDA' },
    { icon: 'pkg', t: 'FRETE PREFERENCIAL' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 540px', minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Left brand */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a0006 0%, #000 60%)',
        backgroundImage: 'var(--login-bg-image, none)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        padding: 64, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 72, background: 'var(--bg-accent)', clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/">
            <Image src="/images/logo-white.png" alt="BeGamers Store" width={140} height={36} style={{ objectFit: 'contain' }} />
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>{cfg.eyebrow}</span>
          <h1 style={{ margin: '16px 0', fontFamily: 'var(--font-display-heavy)', fontSize: 88, lineHeight: 0.82, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
            {cfg.title1}<br />
            <span style={{ background: 'var(--bg-accent)', padding: '0 12px', display: 'inline-block', clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>{cfg.title2}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, maxWidth: 440, lineHeight: 1.6 }}>{cfg.subtitle}</p>
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 480 }}>
          {BENEFITS.map(b => (
            <div key={b.t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--hair-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-accent-hot)' }}>
                <Icon name={b.icon} size={18} />
              </span>
              <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.1em' }}>{b.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div style={{ background: '#000', padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid var(--hair-strong)' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--fg2)', marginBottom: 32, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
          <Icon name="chevL" size={14} /> Voltar à loja
        </Link>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--hair-strong)', marginBottom: 32 }}>
          {(['login', 'signup'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess('') }} style={{
              flex: 1, padding: '14px 0', background: 'transparent', border: 0,
              color: tab === t ? '#fff' : 'var(--fg2)',
              borderBottom: tab === t ? '3px solid var(--bg-accent)' : '3px solid transparent',
              fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.12em',
              textTransform: 'uppercase', cursor: 'pointer', marginBottom: -1,
            }}>
              {t === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>BEM-VINDO DE VOLTA.</h2>
            <p style={{ color: 'var(--fg2)', fontSize: 14, marginTop: 8 }}>Entra com o teu time.</p>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
              <div><label style={LABEL}>E-mail</label><input name="email" className="bg-input" style={INPUT} type="email" autoComplete="email" placeholder="seu@email.com" /></div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={LABEL}>Senha</label>
                  <span style={{ fontSize: 11, color: 'var(--bg-accent-hot)', cursor: 'pointer' }}>Esqueci a senha</span>
                </div>
                <input name="password" className="bg-input" style={INPUT} type="password" autoComplete="current-password" placeholder="••••••••" />
              </div>
              {error && <div style={{ padding: '10px 14px', background: 'rgba(255,31,61,0.1)', border: '1px solid var(--bg-accent-hot)', fontSize: 13, color: '#ff6b6b' }}>{error}</div>}
              {success && <div style={{ padding: '10px 14px', background: 'rgba(31,157,85,0.1)', border: '1px solid #1f9d55', fontSize: 13, color: '#4cd680' }}>{success}</div>}
              <button type="submit" disabled={loading} style={BTN}>{loading ? 'Entrando...' : 'Entrar no Server'}</button>
            </form>
            <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: 'var(--fg2)' }}>
              Não tem conta?{' '}
              <button onClick={() => setTab('signup')} style={{ background: 'none', border: 0, color: 'var(--bg-accent-hot)', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                Cadastra-te grátis →
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>CRIA TUA CONTA.</h2>
            <p style={{ color: 'var(--fg2)', fontSize: 14, marginTop: 8 }}>É grátis e rápido.</p>
            {success ? (
              <div style={{ marginTop: 28, padding: 20, background: 'rgba(31,157,85,0.1)', border: '1px solid #1f9d55', fontSize: 14, color: '#4cd680', lineHeight: 1.6 }}>
                <Icon name="check" size={20} style={{ marginBottom: 8 }} /><br />
                {success}
              </div>
            ) : (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
                <div><label style={LABEL}>Seu Nome</label><input className="bg-input" style={INPUT} value={name} onChange={e => setName(e.target.value)} placeholder="Como te chamam?" /></div>
                <div><label style={LABEL}>E-mail</label><input className="bg-input" style={INPUT} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" /></div>
                <div><label style={LABEL}>Senha</label><input className="bg-input" style={INPUT} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" /></div>
                {error && <div style={{ padding: '10px 14px', background: 'rgba(255,31,61,0.1)', border: '1px solid var(--bg-accent-hot)', fontSize: 13, color: '#ff6b6b' }}>{error}</div>}
                <button type="submit" disabled={loading} style={BTN}>{loading ? 'Criando conta...' : 'Cadastrar Grátis'}</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

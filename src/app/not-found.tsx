import Link from 'next/link'
import Icon from '@/components/ui/Icon'

export default function NotFound() {
  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 32px', maxWidth: 600 }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
          <div style={{
            fontFamily: 'var(--font-display-heavy)', fontSize: 200, lineHeight: 0.85,
            color: 'var(--surf-2)', letterSpacing: '-0.04em', userSelect: 'none',
          }}>404</div>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="search" size={48} style={{ opacity: 0.4 }} />
          </div>
        </div>

        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>
            // PÁGINA NÃO ENCONTRADA
          </span>
          <h1 style={{ margin: '12px 0 8px', fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1, letterSpacing: '-0.02em' }}>
            ROTA<br /><span style={{ color: 'var(--bg-accent)' }}>INEXISTENTE.</span>
          </h1>
          <p style={{ color: 'var(--fg3)', fontSize: 14, margin: '0 0 32px', lineHeight: 1.6 }}>
            Essa página não existe ou foi removida.<br />
            Volta pra loja e continua a missão.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-accent)', color: '#fff', padding: '14px 28px',
              fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em',
              textTransform: 'uppercase', textDecoration: 'none',
              clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
            }}>
              <Icon name="home" size={16} /> Home
            </Link>
            <Link href="/produtos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'var(--fg2)', padding: '14px 28px',
              fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em',
              textTransform: 'uppercase', textDecoration: 'none',
              border: '1px solid var(--hair-strong)',
            }}>
              Ver produtos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

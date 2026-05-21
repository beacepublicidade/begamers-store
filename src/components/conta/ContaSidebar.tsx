import Link from 'next/link'
import Icon from '@/components/ui/Icon'

const NAV = [
  { href: '/conta/minha-conta',    label: 'Meus pedidos',      icon: 'pkg' },
  { href: '/conta/lista',          label: 'Lista de desejos',  icon: 'heart' },
  { href: '/conta/enderecos',      label: 'Endereços',         icon: 'truck' },
  { href: '/conta/cupons',         label: 'Cupons & BG Coins', icon: 'tag' },
  { href: '/conta/dados-pessoais', label: 'Dados pessoais',    icon: 'user' },
  { href: '/conta/senha',          label: 'Senha & segurança', icon: 'lock' },
]

interface Props { name: string; email: string; activePath?: string }

export default function ContaSidebar({ name, email, activePath }: Props) {
  const firstName = name.split(' ')[0]
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--surf-1)', border: '1px solid var(--hair)',
      alignSelf: 'flex-start', position: 'sticky', top: 24,
    }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--hair)', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72,
          clipPath: 'polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)',
          background: 'var(--bg-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display-heavy)', fontSize: 22,
          margin: '0 auto 12px',
        }}>{initials}</div>
        <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 15, textTransform: 'uppercase', marginBottom: 4 }}>
          {firstName}
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px' }}>
          {email}
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        {NAV.map(item => {
          const active = activePath === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 20px',
              borderBottom: '1px solid var(--hair)',
              color: active ? '#fff' : 'var(--fg2)',
              background: active ? 'var(--bg-accent)' : 'transparent',
              textDecoration: 'none',
              fontSize: 13,
              fontFamily: active ? 'var(--font-display-heavy)' : 'inherit',
              letterSpacing: active ? '0.04em' : 0,
            }}>
              <Icon name={item.icon} size={14} color={active ? '#fff' : 'var(--fg3)'} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <form action="/api/conta/logout" method="POST" style={{ padding: '16px 20px' }}>
        <button type="submit" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--fg3)', fontSize: 13, padding: 0,
        }}>
          <Icon name="logout" size={14} color="var(--fg3)" />
          Sair da conta
        </button>
      </form>
    </aside>
  )
}

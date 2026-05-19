'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/ui/Icon'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'chart' },
  { href: '/admin/produtos', label: 'Produtos', icon: 'package2' },
  { href: '/admin/categorias', label: 'Categorias', icon: 'tag' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: 'truck' },
  { href: '/admin/clientes', label: 'Clientes', icon: 'users' },
  { href: '/admin/cupons', label: 'Cupons', icon: 'bolt' },
  { href: '/admin/configuracoes', label: 'Configurações', icon: 'settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: 'var(--surf-1)',
        borderRight: '1px solid var(--hair-strong)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--hair)' }}>
          <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--bg-accent)' }}>BG</span> STORE ADMIN
          </span>
          <div style={{ fontSize: 10, color: 'var(--fg3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
            Console de Gestão
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px', margin: '2px 8px',
                color: isActive ? '#fff' : 'var(--fg2)',
                background: isActive ? 'var(--bg-accent)' : 'transparent',
                borderRadius: 2,
                fontFamily: 'var(--font-display-heavy)',
                fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 150ms',
              }}>
                <Icon name={item.icon} size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--hair)' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--fg3)', fontSize: 11,
            textDecoration: 'none',
          }}>
            <Icon name="eye" size={14} />
            Ver loja
          </Link>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--fg3)', fontSize: 11,
            background: 'transparent', border: 0,
            padding: '8px 0 0', width: '100%', cursor: 'pointer',
          }}>
            <Icon name="logout" size={14} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', background: '#000' }}>
        {children}
      </main>
    </div>
  )
}

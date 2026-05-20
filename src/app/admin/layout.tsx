'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Icon from '@/components/ui/Icon'

const W = 240

const NAV = [
  { sec: 'VISÃO', items: [
    { href: '/admin', label: 'Dashboard', icon: 'grid', exact: true },
  ]},
  { sec: 'VENDAS', items: [
    { href: '/admin/pedidos', label: 'Pedidos', icon: 'pkg' },
    { href: '/admin/clientes', label: 'Clientes', icon: 'user' },
    { href: '/admin/cupons', label: 'Cupons', icon: 'fire' },
  ]},
  { sec: 'CATÁLOGO', items: [
    { href: '/admin/produtos', label: 'Produtos', icon: 'rows' },
    { href: '/admin/categorias', label: 'Categorias', icon: 'menu' },
  ]},
  { sec: 'CONFIG', items: [
    { href: '/admin/configuracoes', label: 'Loja', icon: 'shield' },
  ]},
]

function VMark() {
  return (
    <svg width={28} height={28} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L30 10V22L16 30L2 22V10Z" fill="var(--bg-accent)" fillOpacity={0.12} />
      <path d="M16 2L30 10V22L16 30L2 22V10Z" stroke="var(--bg-accent)" strokeWidth={1.5} />
      <path d="M9 12L16 21L23 12" stroke="var(--bg-accent-hot)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function active(href: string, exact = false) {
    return exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'))
  }

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: '#fff' }}>
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: W,
        background: '#050505', borderRight: '1px solid var(--hair-strong)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--hair)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VMark />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 4 }}>
              <Image src="/images/logo.png" alt="BeGamers Store" width={100} height={24} style={{ objectFit: 'contain', objectPosition: 'left' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>// CONSOLE ADMIN</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--hair)' }}>
          <div style={{ position: 'relative' }}>
            <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)', pointerEvents: 'none' }} />
            <input className="bg-input" placeholder="Buscar tudo..." style={{ paddingLeft: 30, fontSize: 12, padding: '7px 12px 7px 30px', width: '100%' }} />
          </div>
        </div>

        {/* Nav */}
        <nav className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {NAV.map(s => (
            <div key={s.sec} style={{ marginBottom: 10 }}>
              <div style={{ padding: '6px 20px 4px', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--fg3)', textTransform: 'uppercase' }}>
                // {s.sec}
              </div>
              {s.items.map(item => {
                const on = active(item.href, (item as any).exact)
                return (
                  <Link key={item.href} href={item.href} style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '8px 20px',
                    color: on ? '#fff' : 'var(--fg2)',
                    background: on ? 'var(--surf-2)' : 'transparent',
                    borderLeft: on ? '3px solid var(--bg-accent)' : '3px solid transparent',
                    fontFamily: 'var(--font-display-heavy)', fontSize: 11,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    textDecoration: 'none', marginLeft: -3,
                    transition: 'all 120ms',
                  }}>
                    <Icon name={item.icon} size={14} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--hair-strong)', background: '#000', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 32, height: 32, background: 'var(--bg-accent)',
            clipPath: 'polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display-heavy)', fontSize: 11, flexShrink: 0, color: '#fff',
          }}>BG</span>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>Admin</div>
            <div style={{ fontSize: 9, color: 'var(--fg2)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>OWNER · LVL ROOT</div>
          </div>
          <Link href="/" style={{ fontSize: 9, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textDecoration: 'none' }}>
            VER LOJA
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: W, minHeight: '100vh', background: '#000' }}>
        {children}
      </main>
    </div>
  )
}

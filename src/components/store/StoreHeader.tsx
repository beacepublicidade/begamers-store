'use client'
import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import { useCart } from '@/lib/hooks/useCart'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'

interface NavCategory { id: string; name: string; slug: string }

const iconBtnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'transparent', border: 0, color: '#fff',
  cursor: 'pointer', padding: '10px 4px', position: 'relative',
}
const miniBadge: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 18, height: 18, padding: '0 5px',
  background: 'var(--bg-accent-hot)', color: '#fff',
  fontSize: 10, fontWeight: 900, borderRadius: 99,
  fontFamily: 'var(--font-display-heavy)',
}

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function StoreHeader({ activeCategory, categories = [] }: { activeCategory?: string; categories?: NavCategory[] }) {
  const { totalItems, totalPrice, openCart } = useCart()
  const [userName, setUserName] = useState<string | null>(null)
  const [catMenuOpen, setCatMenuOpen] = useState(false)
  const catMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) {
        setCatMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const name = user.user_metadata?.name ?? user.email?.split('@')[0] ?? ''
        setUserName(name.split(' ')[0].toUpperCase())
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.name ?? session.user.email?.split('@')[0] ?? ''
        setUserName(name.split(' ')[0].toUpperCase())
      } else {
        setUserName(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <header style={{ background: '#000', borderBottom: '1px solid var(--hair)' }}>
      {/* Announcement */}
      <div style={{
        background: 'var(--bg-accent)', color: '#fff',
        textAlign: 'center', padding: '8px 0',
        fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Icon name="bolt" size={14} /> FRETE GRÁTIS ACIMA DE R$ 299
        </span>
        <span style={{ opacity: 0.5 }}>///</span>
        <span>10% OFF NO PIX</span>
        <span style={{ opacity: 0.5 }}>///</span>
        <span>BEGAMERS DROP — COLEÇÃO RANKED DISPONÍVEL</span>
      </div>

      {/* Main bar */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '20px 32px',
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/images/logo-white.png" alt="BeGamers Store" width={160} height={40} style={{ objectFit: 'contain' }} priority />
        </Link>

        {/* Search */}
        <form method="GET" action="/busca" style={{ position: 'relative', maxWidth: 640, margin: '0 auto', width: '100%' }}>
          <Icon name="search" size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)', pointerEvents: 'none' }} />
          <input name="q" className="bg-input" placeholder="Buscar produtos, marcas, jogos..." style={{ paddingLeft: 44, paddingRight: 100 }} />
          <button type="submit" style={{
            position: 'absolute', right: 4, top: 4, bottom: 4,
            background: 'var(--bg-accent)', color: '#fff', border: 0, padding: '0 20px',
            fontFamily: 'var(--font-display-heavy)', fontWeight: 900, fontSize: 12, letterSpacing: '0.06em',
            textTransform: 'uppercase', cursor: 'pointer',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8% 100%)',
          }}>Buscar</button>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {userName ? (
            <Link href="/conta/minha-conta" style={iconBtnStyle}>
              <span style={{
                width: 28, height: 28, background: 'var(--bg-accent)',
                clipPath: 'polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display-heavy)', fontSize: 10, flexShrink: 0,
              }}>{userName.slice(0, 2)}</span>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{userName}</span>
            </Link>
          ) : (
            <Link href="/conta/login" style={iconBtnStyle}>
              <Icon name="user" size={20} />
              <span style={{ fontSize: 11, fontWeight: 600 }}>Entrar</span>
            </Link>
          )}
          <Link href="/conta/lista" style={iconBtnStyle}>
            <Icon name="heart" size={20} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Lista</span>
          </Link>
          <button
            onClick={openCart}
            style={{ ...iconBtnStyle, background: 'var(--bg-accent)', padding: '10px 16px', clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}
          >
            <Icon name="cart" size={20} />
            <span style={{ fontSize: 11, fontWeight: 700 }}>{fmt(totalPrice)}</span>
            {totalItems > 0 && (
              <span style={{ ...miniBadge, background: '#fff', color: 'var(--bg-accent)' }}>{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav style={{ borderTop: '1px solid var(--hair)', background: '#0a0a0a' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', gap: 28, height: 48,
        }}>
          <div ref={catMenuRef} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setCatMenuOpen(v => !v)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-display-heavy)', fontSize: 12,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff',
                paddingRight: 24, borderRight: '1px solid var(--hair-strong)',
                height: '100%', background: 'transparent', border: 'none',
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <Icon name="menu" size={16} /> TODAS CATEGORIAS
            </button>
            {catMenuOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 999,
                background: '#0a0a0a', border: '1px solid var(--hair-strong)',
                minWidth: 220, boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}>
                <Link
                  href="/produtos"
                  onClick={() => setCatMenuOpen(false)}
                  style={{
                    display: 'block', padding: '12px 20px',
                    fontFamily: 'var(--font-display-heavy)', fontSize: 12,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--fg2)', textDecoration: 'none',
                    borderBottom: '1px solid var(--hair)',
                  }}
                >
                  Todos os produtos
                </Link>
                {categories.map(c => (
                  <Link
                    key={c.id}
                    href={`/produtos?cat=${c.id}`}
                    onClick={() => setCatMenuOpen(false)}
                    style={{
                      display: 'block', padding: '12px 20px',
                      fontFamily: 'var(--font-display-heavy)', fontSize: 12,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: '#fff', textDecoration: 'none',
                      borderBottom: '1px solid var(--hair)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  href="/ofertas"
                  onClick={() => setCatMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                    fontFamily: 'var(--font-display-heavy)', fontSize: 12,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--bg-accent-hot)', textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surf-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="live-dot" /> OFERTAS
                </Link>
              </div>
            )}
          </div>
          {categories.map(c => (
            <Link key={c.id} href={`/produtos?cat=${c.id}`} style={{
              fontFamily: 'var(--font-display-heavy)', fontSize: 12,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: activeCategory === c.id ? '#fff' : 'var(--fg2)',
              borderBottom: activeCategory === c.id ? '2px solid var(--bg-accent)' : '2px solid transparent',
              padding: '16px 0',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              textDecoration: 'none',
            }}>
              {c.name}
            </Link>
          ))}
          <Link href="/ofertas" style={{
            fontFamily: 'var(--font-display-heavy)', fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--bg-accent-hot)',
            borderBottom: '2px solid transparent',
            padding: '16px 0',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            textDecoration: 'none',
          }}>
            <span className="live-dot" /> OFERTAS
          </Link>
        </div>
      </nav>
    </header>
  )
}

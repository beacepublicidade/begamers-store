'use client'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import { useCart } from '@/lib/hooks/useCart'

const CATEGORIES = ['PERIFÉRICOS', 'STREETWEAR', 'HARDWARE', 'CONSOLE', 'COLECIONÁVEIS', 'GIFT CARDS', 'OFERTAS']

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

export default function StoreHeader({ activeCategory }: { activeCategory?: string }) {
  const { totalItems, totalPrice, openCart } = useCart()

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
          <span style={{
            fontFamily: 'var(--font-display-heavy)',
            fontSize: 22, fontWeight: 900,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <span style={{ color: 'var(--bg-accent)' }}>BE</span>
            <span>GAMERS STORE</span>
          </span>
        </Link>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto', width: '100%' }}>
          <Icon name="search" size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)' }} />
          <input className="bg-input" placeholder="Buscar produtos, marcas, jogos..." style={{ paddingLeft: 44, paddingRight: 100 }} />
          <button style={{
            position: 'absolute', right: 4, top: 4, bottom: 4,
            background: 'var(--bg-accent)', color: '#fff', border: 0, padding: '0 20px',
            fontFamily: 'var(--font-display-heavy)', fontWeight: 900, fontSize: 12, letterSpacing: '0.06em',
            textTransform: 'uppercase', cursor: 'pointer',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8% 100%)',
          }}>Buscar</button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/conta" style={iconBtnStyle}>
            <Icon name="user" size={20} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Entrar</span>
          </Link>
          <button style={iconBtnStyle}>
            <Icon name="heart" size={20} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Lista</span>
          </button>
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
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--font-display-heavy)', fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff',
            paddingRight: 24, borderRight: '1px solid var(--hair-strong)',
            height: '100%',
          }}>
            <Icon name="menu" size={16} /> TODAS CATEGORIAS
          </span>
          {CATEGORIES.map(c => (
            <Link key={c} href={`/produtos?categoria=${c.toLowerCase()}`} style={{
              fontFamily: 'var(--font-display-heavy)', fontSize: 12,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: c === 'OFERTAS' ? 'var(--bg-accent-hot)' : (activeCategory === c ? '#fff' : 'var(--fg2)'),
              borderBottom: activeCategory === c ? '2px solid var(--bg-accent)' : '2px solid transparent',
              padding: '16px 0',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {c === 'OFERTAS' && <span className="live-dot" />}
              {c}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

'use client'
import Link from 'next/link'
import Image from 'next/image'
import Btn from '@/components/ui/Btn'
import Tag from '@/components/ui/Tag'
import Stars from '@/components/ui/Stars'
import Price from '@/components/ui/Price'
import Icon from '@/components/ui/Icon'
import { useCart } from '@/lib/hooks/useCart'
import { useWishlist } from '@/lib/hooks/useWishlist'

export interface ProductCardData {
  id: string
  name: string
  slug: string
  price: number
  price_old?: number | null
  brand?: string | null
  rating?: number
  review_count?: number
  tags?: string[]
  accent_color?: string
  primary_image?: string | null
}

interface ProductCardProps {
  product: ProductCardData
  layout?: 'grid' | 'list'
  size?: 'sm' | 'md'
}

function getTone(tag: string) {
  if (tag.startsWith('-')) return 'hot' as const
  if (tag === 'NOVO') return 'red' as const
  if (tag === 'DROP') return 'outline' as const
  return 'dark' as const
}

export default function ProductCard({ product: p, layout = 'grid', size = 'md' }: ProductCardProps) {
  const isList = layout === 'list'
  const { addItem } = useCart()
  const { toggle: wishToggle, has: wishHas } = useWishlist()
  const wished = wishHas(p.id)

  return (
    <article style={{
      background: 'var(--surf-2)',
      border: '1px solid var(--hair)',
      borderRadius: 2,
      display: 'flex',
      flexDirection: isList ? 'row' : 'column',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 220ms var(--ease-out)',
      cursor: 'pointer',
    }}>
      {/* Image */}
      <Link href={`/produto/${p.slug}`} style={{
        position: 'relative',
        width: isList ? 200 : '100%',
        aspectRatio: isList ? undefined : '1 / 1',
        height: isList ? 200 : undefined,
        background: `radial-gradient(at 50% 50%, ${p.accent_color ?? '#cc0000'}33, transparent 65%), linear-gradient(135deg, #181818, #0a0a0a)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        textDecoration: 'none',
      }}>
        {p.primary_image ? (
          <Image
            src={p.primary_image}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '55%',
            height: '55%',
            background: `linear-gradient(135deg, ${p.accent_color ?? '#cc0000'}, #000)`,
            clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)',
            opacity: 0.7,
          }} />
        )}
        {/* badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {(p.tags ?? []).map(t => (
            <Tag key={t} tone={getTone(t)}>{t}</Tag>
          ))}
        </div>
        <button
          title={wished ? 'Remover da lista' : 'Salvar na lista'}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32,
            background: wished ? 'rgba(220,30,30,0.85)' : 'rgba(0,0,0,0.7)',
            border: `1px solid ${wished ? '#f87171' : 'var(--hair-strong)'}`,
            borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', cursor: 'pointer',
            transition: 'background 150ms, border 150ms',
          }}
          onClick={e => { e.preventDefault(); e.stopPropagation(); wishToggle(p.id) }}
        >
          <Icon name="heart" size={16} />
        </button>
      </Link>

      {/* Body */}
      <div style={{
        padding: size === 'sm' ? 14 : 18,
        display: 'flex', flexDirection: 'column', gap: 8, flex: 1,
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {p.brand && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.16em', color: 'var(--fg3)', textTransform: 'uppercase',
            }}>
              {p.brand}
            </span>
          )}
          <h3 style={{
            margin: 0, color: '#fff', fontWeight: 600,
            fontSize: size === 'sm' ? 13 : 14, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {p.name}
          </h3>
          {p.rating && (
            <Stars value={p.rating} count={p.review_count} size={11} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Price
            value={p.price}
            old={p.price_old ?? undefined}
            size={size === 'sm' ? 'sm' : 'md'}
          />
          <Btn
            variant="primary"
            size={size === 'sm' ? 'sm' : 'md'}
            full
            onClick={() => addItem({ id: p.id, name: p.name, price: p.price, slug: p.slug, image: p.primary_image ?? undefined, quantity: 1 })}
          >
            Comprar
          </Btn>
        </div>
      </div>

      {/* Hover bar */}
      <span style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'var(--bg-accent)', transform: 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform 220ms var(--ease-out)',
      }} />
    </article>
  )
}

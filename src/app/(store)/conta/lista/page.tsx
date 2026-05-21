'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import { useWishlist } from '@/lib/hooks/useWishlist'

interface WishProduct {
  id: string
  name: string
  slug: string
  price: number
  price_old: number | null
  brand: string | null
  primary_image: string | null
}

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function ListaPage() {
  const { ids, toggle } = useWishlist()
  const [products, setProducts] = useState<WishProduct[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ids.length === 0) { setProducts([]); return }
    setLoading(true)
    fetch(`/api/wishlist?ids=${ids.join(',')}`)
      .then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [ids.join(',')])

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>
            // MINHA LISTA
          </span>
          <h1 style={{ margin: '8px 0 4px', fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
            LISTA DE DESEJOS
          </h1>
          <p style={{ margin: 0, color: 'var(--fg3)', fontSize: 13 }}>
            {ids.length} {ids.length === 1 ? 'item salvo' : 'itens salvos'}
          </p>
        </div>

        {ids.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg3)' }}>
            <Icon name="heart" size={64} style={{ marginBottom: 24, opacity: 0.15 }} />
            <h2 style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 24, textTransform: 'uppercase', margin: '0 0 12px' }}>
              Lista vazia
            </h2>
            <p style={{ fontSize: 14, marginBottom: 32 }}>Salva produtos clicando no coração em qualquer item.</p>
            <Link href="/produtos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-accent)', color: '#fff', padding: '14px 28px',
              fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em',
              textTransform: 'uppercase', textDecoration: 'none',
              clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
            }}>
              Ver produtos
            </Link>
          </div>
        ) : loading ? (
          <p style={{ color: 'var(--fg3)', fontSize: 13 }}>Carregando...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {products.map(p => (
              <div key={p.id} style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', position: 'relative' }}>
                {/* Remove button */}
                <button
                  onClick={() => toggle(p.id)}
                  style={{
                    position: 'absolute', top: 8, right: 8, zIndex: 2,
                    width: 28, height: 28, background: '#1a0808', border: '1px solid #3a1a1a',
                    color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title="Remover da lista"
                >
                  <Icon name="trash" size={12} />
                </button>

                <Link href={`/produto/${p.slug}`} style={{ textDecoration: 'none', color: '#fff', display: 'block' }}>
                  {p.primary_image ? (
                    <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--surf-2)' }}>
                      <Image src={p.primary_image} alt={p.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: '1', background: 'var(--surf-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="pkg" size={48} color="var(--fg3)" />
                    </div>
                  )}
                  <div style={{ padding: '14px 14px 16px' }}>
                    {p.brand && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 4 }}>{p.brand}</div>
                    )}
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 18 }}>{fmt(p.price)}</span>
                      {p.price_old && p.price_old > p.price && (
                        <span style={{ fontSize: 11, color: 'var(--fg3)', textDecoration: 'line-through' }}>{fmt(p.price_old)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

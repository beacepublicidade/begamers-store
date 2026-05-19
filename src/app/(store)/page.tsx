import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import type { Tables } from '@/lib/supabase/types'
import Btn from '@/components/ui/Btn'
import Icon from '@/components/ui/Icon'

async function getFeaturedProducts() {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      id, name, slug, price, price_old, brand, tags, accent_color,
      product_images(url, is_primary)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8)

  return data ?? []
}

async function getNewProducts() {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      id, name, slug, price, price_old, brand, tags, accent_color,
      product_images(url, is_primary)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return data ?? []
}

type ProductWithImages = Tables<'products'> & {
  product_images: Array<{ url: string; is_primary: boolean }>
}

function toCardData(p: ProductWithImages) {
  const primaryImg = p.product_images?.find((i) => i.is_primary)?.url
    ?? p.product_images?.[0]?.url
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    price_old: p.price_old,
    brand: p.brand,
    tags: p.tags,
    accent_color: p.accent_color,
    primary_image: primaryImg ?? null,
  }
}

const CATEGORIES = [
  { label: 'Periféricos', icon: 'monitor', slug: 'perifericos' },
  { label: 'Streetwear', icon: 'fire', slug: 'streetwear' },
  { label: 'Hardware', icon: 'bolt', slug: 'hardware' },
  { label: 'Console', icon: 'grid', slug: 'console' },
  { label: 'Colecionáveis', icon: 'pkg', slug: 'colecionaveis' },
  { label: 'Gift Cards', icon: 'star', slug: 'gift-cards' },
]

export default async function HomePage() {
  const [featured, newProducts] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
  ])

  return (
    <div style={{ background: '#000', color: '#fff' }}>
      {/* Hero */}
      <section className="chevron-bg grain" style={{
        minHeight: 560,
        display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #1a0006 0%, #0a0a0a 50%, #000 100%)',
        borderBottom: '1px solid var(--hair)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px', zIndex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span className="red-rule" />
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>
              // BEGAMERS DROP 2026
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display-heavy)',
            fontSize: 'clamp(56px, 8vw, 120px)',
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: '0 0 24px',
            maxWidth: 800,
          }}>
            <span style={{ color: '#fff' }}>EQUIPE-SE</span><br />
            <span style={{ color: 'var(--bg-accent)' }}>PARA</span><br />
            <span style={{ color: '#fff' }}>VENCER.</span>
          </h1>
          <p style={{ color: 'var(--fg2)', fontSize: 18, maxWidth: 480, lineHeight: 1.6, marginBottom: 40 }}>
            Periféricos pro-grade, streetwear gamer e colecionáveis exclusivos. Tudo que você precisa para dominar.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Btn variant="hot" size="xl" icon={<Icon name="bolt" size={18} />}>
              Ver Ofertas
            </Btn>
            <Btn variant="outline" size="xl">
              Explorar Loja
            </Btn>
          </div>
        </div>
        {/* Decorative */}
        <div style={{
          position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)',
          width: '45%', height: '120%',
          background: 'radial-gradient(at 60% 50%, rgba(204,0,0,0.15), transparent 70%)',
          pointerEvents: 'none',
        }} />
      </section>

      {/* Trust bar */}
      <div style={{ background: 'var(--surf-1)', borderBottom: '1px solid var(--hair)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { i: 'truck', t: 'FRETE GRÁTIS', s: 'Acima de R$ 299' },
            { i: 'shield', t: 'SITE SEGURO', s: 'SSL + AntiFraude' },
            { i: 'pkg', t: 'DEVOLUÇÃO', s: 'Até 30 dias' },
            { i: 'bolt', t: 'ENVIO RÁPIDO', s: 'Postagem em 24h' },
          ].map(f => (
            <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: 'var(--bg-accent-hot)' }}>
                <Icon name={f.i} size={24} stroke={1.6} />
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.t}</div>
                <div style={{ fontSize: 11, color: 'var(--fg2)' }}>{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px 0' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span className="red-rule" style={{ width: 32 }} />
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// CATEGORIAS</span>
          </div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
            EXPLORE A LOJA
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {CATEGORIES.map(cat => (
            <a key={cat.slug} href={`/produtos?categoria=${cat.slug}`} style={{
              background: 'var(--surf-2)', border: '1px solid var(--hair)',
              padding: '28px 16px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              transition: 'all 200ms var(--ease-out)',
              textDecoration: 'none', color: '#fff',
            }}>
              <Icon name={cat.icon} size={32} color="var(--bg-accent-hot)" stroke={1.5} />
              <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span className="red-rule" style={{ width: 32 }} />
                <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// EM DESTAQUE</span>
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
                MAIS VENDIDOS
              </h2>
            </div>
            <a href="/produtos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-display-heavy)', fontSize: 12,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              borderBottom: '2px solid var(--bg-accent)', paddingBottom: 4,
              color: '#fff', textDecoration: 'none',
            }}>
              Ver todos <Icon name="chevR" size={14} />
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {(featured as unknown as ProductWithImages[]).map(p => (
              <ProductCard key={p.id} product={toCardData(p)} />
            ))}
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span className="red-rule" style={{ width: 32 }} />
                <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// CHEGOU AGORA</span>
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
                LANÇAMENTOS
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {(newProducts as unknown as ProductWithImages[]).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={toCardData(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section style={{ background: 'linear-gradient(135deg, #1a0006, #000)', borderTop: '1px solid var(--hair)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)', display: 'block', marginBottom: 8 }}>// NEWSLETTER</span>
            <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
              ENTRA NO SERVER.
            </h2>
            <p style={{ color: 'var(--fg2)', margin: 0, fontSize: 14, maxWidth: 460 }}>
              Drops antes de todo mundo, cupons exclusivos e os melhores deals. Sem spam.
            </p>
          </div>
          <form action="/api/newsletter" method="POST" style={{ display: 'flex', gap: 8 }}>
            <input className="bg-input" name="email" type="email" placeholder="seu@email.com" style={{ flex: 1 }} required />
            <Btn variant="hot" size="lg" type="submit">Cadastrar</Btn>
          </form>
        </div>
      </section>
    </div>
  )
}

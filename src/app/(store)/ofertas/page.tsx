import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'
import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'

function toCard(p: any) {
  const img = p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null
  return { id: p.id, name: p.name, slug: p.slug, price: p.price, price_old: p.price_old, brand: p.brand, tags: p.tags, accent_color: p.accent_color, primary_image: img }
}

function discount(price: number, old: number) {
  return Math.round((1 - price / old) * 100)
}

const SORT_OPTIONS = [
  { value: 'discount', label: 'Maior desconto' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'newest', label: 'Mais recentes' },
]

interface PageProps {
  searchParams: { sort?: string; q?: string }
}

async function getOffers(params: PageProps['searchParams']) {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('id, name, slug, price, price_old, brand, stock, tags, accent_color, categories(id, name, slug), product_images(url, is_primary)')
    .eq('is_active', true)
    .not('price_old', 'is', null)
    .gt('price_old', 0)

  if (params.q) query = query.ilike('name', `%${params.q}%`)

  if (params.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (params.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query.limit(80)
  const products = (data ?? []) as unknown as any[]

  if (params.sort === 'discount' || !params.sort) {
    return products
      .filter(p => p.price_old && p.price_old > p.price)
      .sort((a, b) => discount(a.price, a.price_old) < discount(b.price, b.price_old) ? 1 : -1)
  }

  return products.filter(p => p.price_old && p.price_old > p.price)
}

export default async function OfertasPage({ searchParams }: PageProps) {
  const products = await getOffers(searchParams)
  const maxDiscount = products.length > 0
    ? Math.max(...products.map(p => discount(p.price, p.price_old)))
    : 0

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <StoreHeader activeCategory="OFERTAS" />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 80px' }}>

        {/* Breadcrumb */}
        <nav style={{
          display: 'flex', gap: 8, alignItems: 'center',
          fontSize: 11, fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--fg3)', marginBottom: 24,
        }}>
          <Link href="/" style={{ color: 'var(--fg2)', textDecoration: 'none' }}>HOME</Link>
          <span>/</span>
          <span style={{ color: 'var(--bg-accent-hot)' }}>OFERTAS</span>
        </nav>

        {/* Hero */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginBottom: 32,
          background: 'linear-gradient(135deg, #1a0006 0%, #000 50%)',
          padding: '40px 48px',
        }}>
          <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 120,
            background: 'var(--bg-accent-hot)', opacity: 0.08,
            clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%)',
          }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>
                <span className="live-dot" style={{ marginRight: 8 }} />
                // DROPS QUENTES · TEMPO LIMITADO
              </span>
              <h1 style={{
                margin: '10px 0', fontFamily: 'var(--font-display-heavy)',
                fontSize: 80, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.03em',
              }}>
                OFERTAS<br />
                <span style={{ color: 'var(--bg-accent-hot)' }}>ATIVAS.</span>
              </h1>
              <p style={{ margin: '16px 0 0', color: 'var(--fg2)', maxWidth: 480, fontSize: 14 }}>
                Produtos com desconto real. Sem enrolação.
              </p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 56, lineHeight: 1, color: 'var(--bg-accent-hot)' }}>
                  -{maxDiscount}%
                </div>
                <div className="eyebrow-mono">// MAIOR DESCONTO</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 40, lineHeight: 1 }}>{products.length}</div>
                <div className="eyebrow-mono">// PRODUTOS EM OFERTA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sort + Search bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', border: '1px solid var(--hair)', marginBottom: 24,
          background: 'var(--surf-1)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--fg2)' }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>{products.length} ofertas</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <form method="GET" action="/ofertas" style={{ position: 'relative' }}>
              {searchParams.sort && <input type="hidden" name="sort" value={searchParams.sort} />}
              <Icon name="search" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)', pointerEvents: 'none' }} />
              <input
                name="q"
                defaultValue={searchParams.q}
                placeholder="Buscar..."
                className="bg-input"
                style={{ paddingLeft: 34, fontSize: 12, width: 180, padding: '8px 12px 8px 34px' }}
              />
            </form>
            <form method="GET" action="/ofertas">
              {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}
              <select
                name="sort"
                defaultValue={searchParams.sort ?? 'discount'}
                className="bg-input"
                style={{ padding: '8px 12px', width: 200, fontSize: 12 }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </form>
          </div>
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg3)' }}>
            <Icon name="fire" size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p style={{ fontSize: 16 }}>Nenhuma oferta no momento</p>
            <Link href="/produtos" style={{ color: 'var(--bg-accent)', textDecoration: 'none', fontSize: 13 }}>
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {products.map(p => <ProductCard key={p.id} product={toCard(p)} />)}
          </div>
        )}

      </main>

      <StoreFooter />
    </div>
  )
}

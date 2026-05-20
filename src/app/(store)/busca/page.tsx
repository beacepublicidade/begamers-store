import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'
import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'

interface PageProps {
  searchParams: { q?: string; sort?: string }
}

function toCard(p: any) {
  const img = p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null
  return { id: p.id, name: p.name, slug: p.slug, price: p.price, price_old: p.price_old, brand: p.brand, tags: p.tags, accent_color: p.accent_color, primary_image: img }
}

async function search(q: string, sort?: string) {
  if (!q.trim()) return []
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('id, name, slug, price, price_old, brand, stock, tags, accent_color, categories(name), product_images(url, is_primary)')
    .eq('is_active', true)
    .or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`)

  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query.limit(60)
  return (data ?? []) as unknown as any[]
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Mais recentes' },
  { value: 'price_asc',  label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
]

export default async function BuscaPage({ searchParams }: PageProps) {
  const q = searchParams.q ?? ''
  const products = await search(q, searchParams.sort)

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <StoreHeader />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>

        {/* Search bar grande */}
        <form method="GET" action="/busca" style={{ marginBottom: 40 }}>
          <div style={{ position: 'relative' }}>
            <Icon name="search" size={24} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)' }} />
            <input
              name="q"
              defaultValue={q}
              autoFocus
              placeholder="Buscar produtos, marcas, categorias..."
              className="bg-input"
              style={{ paddingLeft: 60, paddingRight: 160, fontSize: 18, padding: '20px 160px 20px 60px', width: '100%' }}
            />
            <button type="submit" style={{
              position: 'absolute', right: 4, top: 4, bottom: 4,
              background: 'var(--bg-accent)', color: '#fff', border: 0, padding: '0 28px',
              fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: 'pointer',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 8% 100%)',
            }}>Buscar</button>
          </div>
        </form>

        {!q ? (
          /* Empty — no query */
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--fg3)' }}>
            <Icon name="search" size={64} style={{ marginBottom: 24, opacity: 0.2 }} />
            <h2 style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', margin: '0 0 12px' }}>
              O que procuras?
            </h2>
            <p style={{ fontSize: 14, color: 'var(--fg3)' }}>Digite o nome do produto, marca ou categoria acima.</p>
          </div>
        ) : products.length === 0 ? (
          /* No results */
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Icon name="search" size={64} style={{ marginBottom: 24, opacity: 0.2 }} />
            <h2 style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', margin: '0 0 12px' }}>
              Sem resultados para "{q}"
            </h2>
            <p style={{ fontSize: 14, color: 'var(--fg3)', marginBottom: 32 }}>Tenta uma busca diferente ou explore a loja.</p>
            <Link href="/produtos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-accent)', color: '#fff', padding: '14px 28px',
              fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em',
              textTransform: 'uppercase', textDecoration: 'none',
              clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
            }}>
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <>
            {/* Results header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '12px 16px', background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
              <div style={{ fontSize: 13 }}>
                <span style={{ color: 'var(--fg3)' }}>Resultados para </span>
                <span style={{ fontFamily: 'var(--font-display-heavy)', color: 'var(--bg-accent-hot)' }}>"{q}"</span>
                <span style={{ color: 'var(--fg3)' }}> — {products.length} produto{products.length !== 1 ? 's' : ''}</span>
              </div>
              <form method="GET" action="/busca" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="hidden" name="q" value={q} />
                <select
                  name="sort"
                  defaultValue={searchParams.sort ?? 'newest'}
                  className="bg-input"
                  style={{ padding: '8px 12px', fontSize: 12, width: 180 }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <button type="submit" style={{
                  background: 'var(--surf-2)', border: '1px solid var(--hair-strong)',
                  color: '#fff', padding: '8px 16px', fontSize: 11,
                  fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>Ordenar</button>
              </form>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {products.map(p => <ProductCard key={p.id} product={toCard(p)} />)}
            </div>
          </>
        )}
      </main>

      <StoreFooter />
    </div>
  )
}

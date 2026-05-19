import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'

function toCard(p: any) {
  const img = p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null
  return { id: p.id, name: p.name, slug: p.slug, price: p.price, price_old: p.price_old, brand: p.brand, tags: p.tags, primary_image: img }
}

interface PageProps {
  searchParams: { q?: string; cat?: string; sort?: string; page?: string }
}

async function getProducts(params: PageProps['searchParams']) {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select(`
      id, name, slug, price, price_old, brand, stock, is_active, is_featured, tags,
      categories(id, name, slug),
      product_images(url, is_primary)
    `)
    .eq('is_active', true)
    .gt('stock', 0)

  if (params.q) query = query.ilike('name', `%${params.q}%`)
  if (params.cat) query = query.eq('category_id', params.cat)

  const sort = params.sort ?? 'newest'
  if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'featured') query = query.eq('is_featured', true).order('created_at', { ascending: false })

  const { data } = await query.limit(60)
  return (data ?? []) as unknown as any[]
}

async function getCategories() {
  const supabase = createClient()
  const { data } = await supabase.from('categories').select('id, name, slug').eq('is_active', true).order('sort_order').order('name')
  return (data ?? []) as unknown as Array<{ id: string; name: string; slug: string }>
}

export default async function ProdutosPage({ searchParams }: PageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ])

  const SORT_OPTIONS = [
    { value: 'newest', label: 'Mais Recentes' },
    { value: 'featured', label: 'Destaques' },
    { value: 'price_asc', label: 'Menor Preço' },
    { value: 'price_desc', label: 'Maior Preço' },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, fontSize: 12, color: 'var(--fg3)' }}>
        <Link href="/" style={{ color: 'var(--fg3)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#fff' }}>Produtos</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Sidebar */}
        <aside>
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, padding: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
              Categorias
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Link
                href="/produtos"
                style={{
                  padding: '8px 12px', fontSize: 13, textDecoration: 'none', borderRadius: 2,
                  background: !searchParams.cat ? 'var(--bg-accent)' : 'transparent',
                  color: !searchParams.cat ? '#fff' : 'var(--fg2)',
                }}
              >
                Todos
              </Link>
              {categories.map(c => (
                <Link
                  key={c.id}
                  href={`/produtos?cat=${c.id}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
                  style={{
                    padding: '8px 12px', fontSize: 13, textDecoration: 'none', borderRadius: 2,
                    background: searchParams.cat === c.id ? 'var(--bg-accent)' : 'transparent',
                    color: searchParams.cat === c.id ? '#fff' : 'var(--fg2)',
                  }}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Header bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                {searchParams.q ? `Busca: "${searchParams.q}"` : searchParams.cat ? categories.find(c => c.id === searchParams.cat)?.name ?? 'Produtos' : 'Todos os Produtos'}
              </h1>
              <p style={{ margin: '4px 0 0', color: 'var(--fg3)', fontSize: 12 }}>
                {products.length} produto{products.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* Search */}
              <form method="GET" action="/produtos" style={{ position: 'relative' }}>
                {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
                <Icon name="search" size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)' }} />
                <input
                  name="q"
                  defaultValue={searchParams.q}
                  placeholder="Buscar..."
                  style={{
                    background: 'var(--surf-2)', border: '1px solid var(--hair-strong)',
                    color: '#fff', padding: '8px 12px 8px 32px', fontSize: 13, borderRadius: 2, width: 200,
                  }}
                />
              </form>

              {/* Sort */}
              <form method="GET" action="/produtos">
                {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
                {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}
                <select
                  name="sort"
                  defaultValue={searchParams.sort ?? 'newest'}
                  onChange={(e) => (e.target.form as HTMLFormElement).submit()}
                  style={{
                    background: 'var(--surf-2)', border: '1px solid var(--hair-strong)',
                    color: '#fff', padding: '8px 12px', fontSize: 13, borderRadius: 2,
                  }}
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
              <Icon name="search" size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p style={{ fontSize: 16 }}>Nenhum produto encontrado</p>
              <Link href="/produtos" style={{ color: 'var(--bg-accent)', textDecoration: 'none', fontSize: 13 }}>Ver todos os produtos</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {products.map(p => (
                <ProductCard key={p.id} product={toCard(p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

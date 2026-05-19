import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/store/ProductCard'
import Icon from '@/components/ui/Icon'
import Link from 'next/link'

function toCard(p: any) {
  const img = p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null
  return { id: p.id, name: p.name, slug: p.slug, price: p.price, price_old: p.price_old, brand: p.brand, tags: p.tags, accent_color: p.accent_color, primary_image: img }
}

interface PageProps {
  searchParams: { q?: string; cat?: string; sort?: string; page?: string; categoria?: string }
}

async function getProducts(params: PageProps['searchParams']) {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('id, name, slug, price, price_old, brand, stock, tags, accent_color, categories(id, name, slug), product_images(url, is_primary)')
    .eq('is_active', true)

  if (params.q) query = query.ilike('name', `%${params.q}%`)
  if (params.cat) query = query.eq('category_id', params.cat)

  const sort = params.sort ?? 'newest'
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query.limit(60)
  return (data ?? []) as unknown as any[]
}

async function getCategories() {
  const supabase = createClient()
  const { data } = await supabase.from('categories').select('id, name, slug').eq('is_active', true).order('name')
  return (data ?? []) as unknown as Array<{ id: string; name: string; slug: string }>
}

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Ordenar: Mais recentes' },
  { value: 'price_asc',  label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'featured',   label: 'Mais vendidos' },
]

const PAGE_BTN: React.CSSProperties = {
  width: 36, height: 36, background: 'transparent',
  border: '1px solid var(--hair-strong)', color: '#fff',
  fontFamily: 'var(--font-display-heavy)', fontSize: 13, cursor: 'pointer',
}

export default async function ProdutosPage({ searchParams }: PageProps) {
  const [products, categories] = await Promise.all([getProducts(searchParams), getCategories()])

  const activeCategory = searchParams.cat
    ? categories.find(c => c.id === searchParams.cat)
    : null

  const categoryName = activeCategory?.name?.toUpperCase() ?? 'TODOS OS PRODUTOS'

  return (
    <div style={{ background: '#000', color: '#fff' }}>
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
          <Link href="/produtos" style={{ color: 'var(--fg2)', textDecoration: 'none' }}>LOJA</Link>
          {activeCategory && (
            <>
              <span>/</span>
              <span style={{ color: '#fff' }}>{activeCategory.name.toUpperCase()}</span>
            </>
          )}
        </nav>

        {/* Category hero */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginBottom: 32,
          background: 'linear-gradient(135deg, #1a0006 0%, #000 50%)',
          padding: '40px 48px',
        }}>
          <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// CATEGORIA</span>
              <h1 style={{
                margin: '10px 0', fontFamily: 'var(--font-display-heavy)',
                fontSize: 80, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.03em',
              }}>{categoryName}.</h1>
              <p style={{ margin: 0, color: 'var(--fg2)', maxWidth: 540, fontSize: 14 }}>
                {activeCategory
                  ? `Explore todos os produtos de ${activeCategory.name}.`
                  : 'Periféricos, streetwear, hardware, colecionáveis e muito mais.'}
              </p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 56, lineHeight: 1 }}>{products.length}</div>
              <div className="eyebrow-mono">// PRODUTOS DISPONÍVEIS</div>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <Link href="/produtos" style={{
            padding: '10px 18px',
            background: !activeCategory ? 'var(--bg-accent)' : 'transparent',
            border: !activeCategory ? '1px solid var(--bg-accent)' : '1px solid var(--hair-strong)',
            color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            fontFamily: 'var(--font-display-heavy)', textDecoration: 'none', cursor: 'pointer',
          }}>Todos</Link>
          {categories.map(c => (
            <Link key={c.id} href={`/produtos?cat=${c.id}`} style={{
              padding: '10px 18px',
              background: searchParams.cat === c.id ? 'var(--bg-accent)' : 'transparent',
              border: searchParams.cat === c.id ? '1px solid var(--bg-accent)' : '1px solid var(--hair-strong)',
              color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              fontFamily: 'var(--font-display-heavy)', textDecoration: 'none',
            }}>{c.name}</Link>
          ))}
        </div>

        {/* Filters + Products */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>

          {/* Sidebar filters */}
          <aside>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>FILTROS</span>
              <Link href="/produtos" style={{ fontSize: 11, color: 'var(--fg2)', textDecoration: 'underline' }}>Limpar</Link>
            </div>

            {/* Price */}
            <div style={{ borderBottom: '1px solid var(--hair)', padding: '16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>PREÇO</span>
                <Icon name="minus" size={14} color="var(--fg2)" />
              </div>
              <form method="GET" action="/produtos" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
                {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}
                <div style={{ display: 'flex', gap: 6 }}>
                  <input className="bg-input" name="min_price" placeholder="Min" style={{ padding: '8px 10px', fontSize: 12 }} />
                  <input className="bg-input" name="max_price" placeholder="Max" style={{ padding: '8px 10px', fontSize: 12 }} />
                </div>
              </form>
            </div>

            {/* Sort (mobile-friendly in sidebar) */}
            <div style={{ borderBottom: '1px solid var(--hair)', padding: '16px 0' }}>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>ORDENAR</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SORT_OPTIONS.slice(1).map(o => (
                  <Link key={o.value} href={`/produtos?${searchParams.cat ? `cat=${searchParams.cat}&` : ''}sort=${o.value}`} style={{
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: 'none',
                  }}>
                    <span style={{
                      width: 16, height: 16, border: '1px solid var(--hair-strong)',
                      background: searchParams.sort === o.value ? 'var(--bg-accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {searchParams.sort === o.value && <Icon name="check" size={10} stroke={2.5} />}
                    </span>
                    <span style={{ fontSize: 12, color: searchParams.sort === o.value ? '#fff' : 'var(--fg2)' }}>{o.label.replace('Ordenar: ', '')}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Frete */}
            <div style={{ borderBottom: '1px solid var(--hair)', padding: '16px 0' }}>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>FRETE</div>
              {[['Frete grátis', 'free'], ['Chega amanhã', 'fast']].map(([label, val], i) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 8 }}>
                  <span style={{ width: 16, height: 16, border: '1px solid var(--hair-strong)', display: 'block', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--fg2)' }}>{label}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Product area */}
          <div>
            {/* Sort bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', border: '1px solid var(--hair)', marginBottom: 16,
              background: 'var(--surf-1)',
            }}>
              <div style={{ fontSize: 12, color: 'var(--fg2)' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>{products.length} produtos</span>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <form method="GET" action="/produtos">
                  {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
                  {searchParams.q && <input type="hidden" name="q" value={searchParams.q} />}
                  <select
                    name="sort"
                    defaultValue={searchParams.sort ?? 'newest'}
                    className="bg-input"
                    style={{ padding: '8px 12px', width: 240, fontSize: 12 }}
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </form>

                {/* Search */}
                <form method="GET" action="/produtos" style={{ position: 'relative' }}>
                  {searchParams.cat && <input type="hidden" name="cat" value={searchParams.cat} />}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {products.map(p => <ProductCard key={p.id} product={toCard(p)} />)}
              </div>
            )}

            {/* Pagination placeholder */}
            {products.length >= 60 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40, gap: 6 }}>
                <button style={PAGE_BTN}>‹</button>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} style={n === 1 ? { ...PAGE_BTN, background: 'var(--bg-accent)', borderColor: 'var(--bg-accent)' } : PAGE_BTN}>{n}</button>
                ))}
                <button style={PAGE_BTN}>›</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

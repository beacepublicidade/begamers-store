import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import Price from '@/components/ui/Price'
import Stars from '@/components/ui/Stars'
import Tag from '@/components/ui/Tag'
import ProductCard from '@/components/store/ProductCard'
import AddToCartBtn from '@/components/store/AddToCartBtn'
import ProductGallery from '@/components/store/ProductGallery'

function toCard(p: any) {
  const img = p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null
  return { id: p.id, name: p.name, slug: p.slug, price: p.price, price_old: p.price_old, brand: p.brand, tags: p.tags, accent_color: p.accent_color, primary_image: img }
}

interface PageProps { params: { slug: string } }

async function getProduct(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name, slug), product_images(id, url, is_primary, sort_order), product_variants(id, name, value, stock, price_delta), reviews(id, rating, comment, created_at, customers(name))')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data as unknown as any
}

async function getRelated(categoryId: string, excludeId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, price, price_old, brand, tags, accent_color, product_images(url, is_primary)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeId)
    .limit(4)
  return (data ?? []) as unknown as any[]
}

export default async function ProdutoPage({ params }: PageProps) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const related = product.categories?.id
    ? await getRelated(product.categories.id, product.id)
    : []

  const images = (product.product_images ?? []).sort((a: any, b: any) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
    : 0

  const reviewCount = product.reviews?.length ?? 0

  return (
    <div style={{ background: '#000', color: '#fff' }}>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px 64px' }}>

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
          {product.categories && (
            <>
              <span>/</span>
              <Link href={`/produtos?cat=${product.categories.id}`} style={{ color: 'var(--fg2)', textDecoration: 'none' }}>
                {product.categories.name.toUpperCase()}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: '#fff' }}>{product.name.toUpperCase()}</span>
        </nav>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, marginBottom: 64 }}>

          {/* Gallery */}
          <ProductGallery images={images} productName={product.name} />

          {/* Info panel */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              {product.brand && (
                <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// {product.brand}</span>
              )}
              <span style={{ color: 'var(--fg3)', fontSize: 11 }}>SKU {product.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <h1 style={{
              margin: 0, fontFamily: 'var(--font-display-heavy)',
              fontSize: 44, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em',
            }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 14 }}>
              {reviewCount > 0 && <Stars value={avgRating} count={reviewCount} size={14} />}
              {reviewCount > 0 && <span style={{ color: 'var(--fg3)', fontSize: 12 }}>|</span>}
              <a href="#reviews" style={{ fontSize: 12, color: 'var(--fg2)' }}>{reviewCount} avaliações</a>
              <span style={{ color: 'var(--fg3)', fontSize: 12 }}>|</span>
              <span style={{ fontSize: 12, color: product.stock > 0 ? '#4cd680' : '#f87171' }}>
                ● {product.stock > 0 ? 'Em estoque' : 'Fora de estoque'}
              </span>
            </div>

            {/* Price block */}
            <div style={{ marginTop: 24, padding: 24, background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
              <Price value={product.price} old={product.price_old ?? undefined} size="xl" pix />
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Tag tone="success">10% OFF NO PIX</Tag>
                <Tag tone="outline">FRETE GRÁTIS</Tag>
                {product.stock > 0 && product.stock < 10 && (
                  <Tag tone="hot">ÚLTIMAS {product.stock} UN.</Tag>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.product_variants?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  VARIANTE
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.product_variants.map((v: any) => (
                    <button key={v.id} style={{
                      padding: '10px 18px', fontSize: 12,
                      border: '1px solid var(--hair-strong)',
                      background: 'transparent', color: v.stock > 0 ? '#fff' : 'var(--fg3)',
                      cursor: v.stock > 0 ? 'pointer' : 'not-allowed',
                      fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em',
                      opacity: v.stock > 0 ? 1 : 0.4,
                    }}>
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CEP */}
            <div style={{ marginTop: 24, padding: 16, border: '1px solid var(--hair)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>CALCULAR FRETE</span>
                <Icon name="truck" size={16} color="var(--fg2)" />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="bg-input" placeholder="00000-000" style={{ flex: 1 }} />
                <button style={{
                  padding: '0 20px', background: 'transparent', border: '1px solid var(--hair-strong)',
                  color: '#fff', fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer',
                }}>OK</button>
              </div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { t: 'SEDEX · Chega em 2 dias', p: 'Grátis' },
                  { t: 'PAC · Chega em 5 dias', p: 'R$ 12,90' },
                ].map(o => (
                  <div key={o.t} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--fg2)' }}>{o.t}</span>
                    <span style={{ color: o.p === 'Grátis' ? '#4cd680' : '#fff', fontWeight: 700 }}>{o.p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <AddToCartBtn
                product={{ id: product.id, name: product.name, price: product.price, image: images[0]?.url, slug: product.slug }}
                disabled={product.stock === 0}
              />
            </div>
            <Link href="/checkout" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 8, padding: '14px 0', border: '1px solid var(--hair-strong)',
              color: '#fff', fontFamily: 'var(--font-display-heavy)', fontSize: 13,
              letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
            }}>Comprar agora</Link>

            {/* Trust 2x2 */}
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { i: 'shield', t: 'GARANTIA 12 MESES' },
                { i: 'pkg',    t: 'TROCA EM 30 DIAS' },
                { i: 'bolt',   t: 'POSTAGEM EM 24H' },
                { i: 'lock',   t: 'PAGAMENTO SEGURO' },
              ].map(t => (
                <div key={t.t} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 12, background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
                  <Icon name={t.i as any} size={18} color="var(--bg-accent-hot)" />
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em' }}>{t.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div style={{ borderTop: '1px solid var(--hair-strong)', paddingTop: 48 }}>
          <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--hair)', marginBottom: 32 }}>
            {['Descrição', 'Especificações', `Avaliações (${reviewCount})`].map((t, i) => (
              <button key={t} style={{
                background: 'transparent', border: 0, color: i === 0 ? '#fff' : 'var(--fg2)',
                padding: '12px 0', borderBottom: i === 0 ? '3px solid var(--bg-accent)' : '3px solid transparent',
                fontFamily: 'var(--font-display-heavy)', fontSize: 13,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48 }}>
            <div>
              {product.description ? (
                <>
                  <h3 style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                    FEITO PARA O CLUTCH.
                  </h3>
                  <p style={{ color: 'var(--fg2)', lineHeight: 1.7 }}>{product.description}</p>
                </>
              ) : (
                <p style={{ color: 'var(--fg2)', lineHeight: 1.7 }}>Sem descrição disponível.</p>
              )}
            </div>
            <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: 24 }}>
              <span className="eyebrow-mono">// ESPECIFICAÇÕES TÉCNICAS</span>
              <div style={{ marginTop: 16 }}>
                {[
                  ['Marca', product.brand ?? '—'],
                  ['Estoque', `${product.stock ?? 0} un.`],
                  ['Categoria', product.categories?.name ?? '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--hair)', fontSize: 13 }}>
                    <span style={{ color: 'var(--fg2)' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviewCount > 0 && (
          <div id="reviews" style={{ marginTop: 64, borderTop: '1px solid var(--hair)', paddingTop: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span className="red-rule" style={{ width: 32 }} />
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// AVALIAÇÕES</span>
            </div>
            <h2 style={{ margin: '0 0 28px', fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
              O QUE DIZEM.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {product.reviews.map((r: any) => (
                <div key={r.id} style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Stars value={r.rating} size={14} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{r.customers?.name ?? 'Cliente'}</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--fg3)' }}>
                      {new Date(r.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {r.comment && <p style={{ margin: 0, fontSize: 13, color: 'var(--fg2)', lineHeight: 1.6 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span className="red-rule" style={{ width: 32 }} />
                  <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// JOGUE COM</span>
                </div>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                  COMBINA COM.
                </h2>
              </div>
              <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '2px solid var(--bg-accent)', paddingBottom: 4, color: '#fff', textDecoration: 'none' }}>
                Setup completo <Icon name="chevR" size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {related.map(p => <ProductCard key={p.id} product={toCard(p)} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

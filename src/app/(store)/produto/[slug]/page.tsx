import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import Price from '@/components/ui/Price'
import Stars from '@/components/ui/Stars'
import Tag from '@/components/ui/Tag'
import ProductCard from '@/components/store/ProductCard'

function toCard(p: any) {
  const img = p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null
  return { id: p.id, name: p.name, slug: p.slug, price: p.price, price_old: p.price_old, brand: p.brand, tags: p.tags, primary_image: img }
}
import AddToCartBtn from '@/components/store/AddToCartBtn'
import ProductGallery from '@/components/store/ProductGallery'

interface PageProps { params: { slug: string } }

async function getProduct(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      categories(id, name, slug),
      product_images(id, url, is_primary, sort_order),
      product_variants(id, name, value, stock, price_delta),
      reviews(id, rating, comment, created_at, customers(name))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data as unknown as any
}

async function getRelated(categoryId: string, excludeId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`id, name, slug, price, price_old, brand, stock, is_active, is_featured, tags, categories(id, name, slug), product_images(url, is_primary)`)
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

  const fmtPrice = (v: number) => (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 32, fontSize: 12, color: 'var(--fg3)' }}>
        <Link href="/" style={{ color: 'var(--fg3)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href="/produtos" style={{ color: 'var(--fg3)', textDecoration: 'none' }}>Produtos</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link href={`/produtos?cat=${product.categories.id}`} style={{ color: 'var(--fg3)', textDecoration: 'none' }}>
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span style={{ color: '#fff' }}>{product.name}</span>
      </nav>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 48, alignItems: 'start', marginBottom: 64 }}>
        {/* Gallery */}
        <ProductGallery images={images} productName={product.name} />

        {/* Info */}
        <div>
          {product.brand && (
            <p style={{ margin: '0 0 8px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
              {product.brand}
            </p>
          )}
          <h1 style={{ margin: '0 0 12px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews?.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Stars value={avgRating} />
              <span style={{ fontSize: 12, color: 'var(--fg3)' }}>({product.reviews.length} avaliações)</span>
            </div>
          )}

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {product.tags.map((t: string) => <Tag key={t} tone="neutral">{t}</Tag>)}
            </div>
          )}

          {/* Price */}
          <div style={{ marginBottom: 24 }}>
            <Price value={product.price} old={product.price_old ?? undefined} size="xl" pix />
          </div>

          {/* Variants */}
          {product.product_variants?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
                Variante
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.product_variants.map((v: any) => (
                  <button key={v.id} style={{
                    padding: '8px 16px', fontSize: 13, border: '1px solid var(--hair-strong)',
                    background: 'var(--surf-2)', color: v.stock > 0 ? '#fff' : 'var(--fg3)',
                    cursor: v.stock > 0 ? 'pointer' : 'not-allowed', borderRadius: 2,
                    opacity: v.stock > 0 ? 1 : 0.4,
                  }}>
                    {v.name}: {v.value}
                    {v.price_delta !== 0 && (
                      <span style={{ fontSize: 11, color: 'var(--fg3)', marginLeft: 4 }}>
                        {v.price_delta > 0 ? `+${fmtPrice(v.price_delta)}` : fmtPrice(v.price_delta)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 0 ? '#4cd680' : '#f87171' }} />
            <span style={{ fontSize: 13, color: 'var(--fg2)' }}>
              {product.stock > 0
                ? product.stock < 10
                  ? `Apenas ${product.stock} em estoque`
                  : 'Em estoque'
                : 'Fora de estoque'}
            </span>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <AddToCartBtn product={{ id: product.id, name: product.name, price: product.price, image: images[0]?.url, slug: product.slug }} disabled={product.stock === 0} />
          </div>

          {/* Trust */}
          <div style={{ borderTop: '1px solid var(--hair)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'truck', text: 'Frete grátis acima de R$ 299' },
              { icon: 'shield', text: 'Pagamento 100% seguro' },
              { icon: 'refresh', text: 'Troca em até 30 dias' },
            ].map(item => (
              <div key={item.icon} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--fg2)' }}>
                <Icon name={item.icon as any} size={16} style={{ color: 'var(--bg-accent)', flexShrink: 0 }} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Descrição
          </h2>
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, padding: 24, fontSize: 14, lineHeight: 1.8, color: 'var(--fg2)' }}>
            {product.description}
          </div>
        </div>
      )}

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Avaliações ({product.reviews.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {product.reviews.map((r: any) => (
              <div key={r.id} style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, padding: 20 }}>
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
        <div>
          <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Produtos Relacionados
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {related.map(p => <ProductCard key={p.id} product={toCard(p)} />)}
          </div>
        </div>
      )}
    </div>
  )
}

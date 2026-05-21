import { createAdminClient as createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
import ProductCard from '@/components/store/ProductCard'
import type { Tables } from '@/lib/supabase/types'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

type ProductWithImages = Tables<'products'> & {
  product_images: Array<{ url: string; is_primary: boolean }>
}

function toCardData(p: ProductWithImages) {
  const primaryImg = p.product_images?.find((i) => i.is_primary)?.url ?? p.product_images?.[0]?.url
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    price_old: p.price_old,
    brand: p.brand,
    tags: p.tags as string[] | undefined,
    accent_color: p.accent_color,
    primary_image: primaryImg ?? null,
  }
}

async function getProductCount() {
  const supabase = createClient()
  const { count } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true)
  return count ?? 0
}

async function getProducts(limit = 8) {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, price, price_old, brand, tags, accent_color, product_images(url, is_primary)')
    .eq('is_active', true)
    .limit(limit)
  return (data ?? []) as unknown as ProductWithImages[]
}

async function getCategoriesWithCount() {
  const supabase = createClient()
  const { data: cats } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('sort_order')
    .order('name')
  if (!cats?.length) return []
  const { data: prods } = await supabase
    .from('products')
    .select('category_id')
    .eq('is_active', true)
    .in('category_id', (cats as Array<{ id: string }>).map(c => c.id))
  const countMap: Record<string, number> = {}
  for (const p of ((prods ?? []) as Array<{ category_id: string | null }>)) {
    if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1
  }
  return (cats as Array<{ id: string; name: string; slug: string }>).map(c => ({ ...c, count: countMap[c.id] ?? 0 }))
}

async function getBannerSettings() {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('settings').select('key, value')
    const map: Record<string, string> = {}
    ;(Array.isArray(data) ? data : []).forEach((s: any) => { map[s.key] = s.value })
    return map
  } catch {
    return {}
  }
}

function SectionHead({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span className="red-rule" style={{ width: 32, height: 4 }} />
          <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// {eyebrow}</span>
        </div>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>{title}</h2>
      </div>
      {link && (
        <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '2px solid var(--bg-accent)', paddingBottom: 4, color: '#fff', textDecoration: 'none' }}>
          {link} <Icon name="chevR" size={14} />
        </Link>
      )}
    </div>
  )
}

// Ticker items carregados no server via getBannerSettings()

const CAT_COLORS = [
  '#cc0000aa', '#1a4a8aaa', '#7a1a8aaa', '#cc4400aa', '#0e4a1faa', '#2a1a4aaa', '#4a3a00aa', '#1a1a4aaa',
]

export default async function HomePage() {
  const [products, banner, categories, productCount] = await Promise.all([getProducts(8), getBannerSettings(), getCategoriesWithCount(), getProductCount()])
  const bestSellers = products.slice(0, 4)
  const streetwear = products.slice(4, 8)
  const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]))
  const tickerItems = (banner.ticker_text || '🔴 LIVE DROP — COLEÇÃO RANKED /// 10% OFF NO PIX /// FRETE GRÁTIS ACIMA DE R$ 299')
    .split('///')
    .map((t: string) => t.trim())
    .filter(Boolean)

  const b = {
    badge:       banner.banner_badge        || '● LIVE — PRÉ-VENDA',
    eyebrow:     banner.banner_eyebrow      || '// EP.01 / DROP 2026',
    title1:      banner.banner_title1       || 'ENTRA',
    title2:      banner.banner_title2       || 'NO SERVER.',
    productName: banner.banner_product_name || 'VIPER X9',
    productDesc: banner.banner_product_desc || 'Mouse sem fio · 26K DPI · 90h',
    price:       banner.banner_price        || 'R$ 449,90',
    priceOld:    banner.banner_price_old    || 'de R$ 599,90',
    stock:       banner.banner_stock        || '378 un.',
    stockSub:    banner.banner_stock_sub    || 'Limitado a 1 por CPF',
    ctaText:     banner.banner_cta_text     || 'COMPRAR AGORA',
    ctaUrl:      banner.banner_cta_url      || '/produtos',
    imageUrl:    banner.banner_image_url    || '',
  }

  return (
    <div style={{ background: '#000', color: '#fff' }}>

      {/* ── TICKER ── */}
      <div style={{ background: 'var(--bg-accent-hot)', color: '#fff', overflow: 'hidden', borderBottom: '2px solid #000', position: 'relative', height: 44 }}>
        <div style={{
          display: 'flex', gap: 48, whiteSpace: 'nowrap',
          animation: 'tickerScroll 30s linear infinite',
          fontFamily: 'var(--font-display-heavy)', fontSize: 14,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          alignItems: 'center', height: '100%',
        }}>
          {[0, 1].map(n => (
            <span key={n} style={{ display: 'contents' }}>
              {tickerItems.map((item: string, i: number) => (
                <span key={i} style={{ marginRight: 48 }}>{item}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: 720, overflow: 'hidden', background: '#000' }}>
        {/* giant bg number */}
        <div style={{
          position: 'absolute', left: -40, top: 80, zIndex: 1,
          fontFamily: 'var(--font-display-heavy)', fontSize: 720,
          color: '#0e0e0e', lineHeight: 0.78, letterSpacing: '-0.08em',
          userSelect: 'none', pointerEvents: 'none',
        }}>26K</div>

        {/* diagonal red slash */}
        <div style={{
          position: 'absolute', top: 0, right: '12%', bottom: 0, width: 80,
          background: 'var(--bg-accent)',
          clipPath: 'polygon(60% 0, 100% 0, 40% 100%, 0 100%)',
          opacity: 0.95,
        }} />

        {/* product photo area */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '52%',
          background: 'radial-gradient(circle at 40% 60%, rgba(255,31,61,0.4), transparent 60%), linear-gradient(135deg, #0a0a0a 0%, #1a0006 50%, #000 100%)',
          clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
        }}>
          <div className="grain" style={{ position: 'absolute', inset: 0 }} />
          <div style={{
            position: 'absolute', left: '30%', top: '20%', width: '55%', height: '60%',
            background: 'linear-gradient(180deg, #cc0000 0%, #1a0006 100%)',
            clipPath: 'polygon(20% 5%, 80% 0, 95% 30%, 90% 75%, 75% 100%, 25% 100%, 10% 75%, 5% 30%)',
            boxShadow: '0 0 80px rgba(255,31,61,0.4)',
          }} />
        </div>

        {/* content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <span style={{
              padding: '6px 12px', background: 'var(--bg-accent-hot)', color: '#fff',
              fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.16em',
              textTransform: 'uppercase', clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
            }}>{b.badge}</span>
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>{b.eyebrow}</span>
          </div>

          <h1 style={{
            margin: 0, fontFamily: 'var(--font-display-heavy)',
            fontSize: 168, lineHeight: 0.82, letterSpacing: '-0.05em',
            textTransform: 'uppercase', maxWidth: 1000,
          }}>
            {b.title1}<br />
            <span style={{
              background: 'var(--bg-accent)', color: '#fff', padding: '0 16px',
              clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)',
            }}>{b.title2}</span>
          </h1>

          <div style={{ display: 'flex', gap: 80, marginTop: 48, maxWidth: 720 }}>
            <div>
              <div className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// PRODUTO EM DESTAQUE</div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, marginTop: 6, textTransform: 'uppercase' }}>{b.productName}</div>
              <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 4 }}>{b.productDesc}</div>
            </div>
            <div>
              <div className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// PREÇO</div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 32, marginTop: 6, color: 'var(--bg-accent-hot)' }}>{b.price}</div>
              {b.priceOld && <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 4, textDecoration: 'line-through' }}>{b.priceOld}</div>}
            </div>
            {b.stock && (
              <div>
                <div className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// ESTOQUE</div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, marginTop: 6 }}>{b.stock}</div>
                <div style={{ fontSize: 13, color: 'var(--fg2)', marginTop: 4 }}>{b.stockSub}</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <Link href={b.ctaUrl} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--bg-accent-hot)', color: '#fff', padding: '16px 32px',
              fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.08em',
              textTransform: 'uppercase', textDecoration: 'none',
              clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
            }}>
              <Icon name="bolt" size={20} /> {b.ctaText}
            </Link>
            <Link href="/produtos" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: '#fff', padding: '16px 32px',
              fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.08em',
              textTransform: 'uppercase', textDecoration: 'none',
              border: '1px solid var(--hair-strong)',
            }}>
              Ver todos os produtos →
            </Link>
          </div>
        </div>
      </section>

      {/* ── COLEÇÃO + DESTAQUE asymmetric ── */}
      <section style={{ padding: '80px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, height: 560 }}>
          {/* Big banner */}
          <Link href={catBySlug['streetwear'] ? `/produtos?cat=${catBySlug['streetwear'].id}` : '/produtos'} style={{
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #1a0006 0%, #000 60%)',
            display: 'flex', alignItems: 'flex-end', padding: 48,
            textDecoration: 'none', color: '#fff',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '60%', height: '100%',
              background: 'linear-gradient(135deg, #cc0000, #4a0006)',
              clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)', opacity: 0.9,
            }} />
            <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span className="eyebrow-mono">// EDIÇÃO LIMITADA · OUT/2026</span>
              <h2 style={{ margin: '12px 0', fontFamily: 'var(--font-display-heavy)', fontSize: 96, lineHeight: 0.85, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
                RANKED<br />DROP III
              </h2>
              <p style={{ margin: '0 0 24px', color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 460 }}>
                Hoodies, camisetas e bonés. Drop de 500 unidades. Quando acabou, acabou.
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#1a1a1a', color: '#fff', padding: '12px 24px',
                fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.06em',
                textTransform: 'uppercase', border: '1px solid var(--hair-strong)',
              }}>VESTE O TIME →</span>
            </div>
          </Link>

          {/* Stacked right */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16 }}>
            <Link href={catBySlug['hardware'] ? `/produtos?cat=${catBySlug['hardware'].id}` : '/produtos'} style={{
              position: 'relative', overflow: 'hidden', padding: 32,
              background: 'linear-gradient(135deg, #1a1a3a 0%, #050530 100%)',
              border: '1px solid var(--hair-strong)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              textDecoration: 'none', color: '#fff',
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 6, background: 'var(--bg-accent-hot)' }} />
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// SETUP COMPLETO</span>
              <div>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display-heavy)', fontSize: 36, lineHeight: 0.9, textTransform: 'uppercase' }}>HARDWARE<br />SEM JUROS</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--fg2)' }}>até 18x · placa, monitor, gabinete</p>
              </div>
            </Link>
            <Link href={catBySlug['colecionaveis'] ? `/produtos?cat=${catBySlug['colecionaveis'].id}` : '/produtos'} style={{
              position: 'relative', overflow: 'hidden', padding: 32,
              background: 'linear-gradient(135deg, #2a1a4a 0%, #000 100%)',
              border: '1px solid var(--hair-strong)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              textDecoration: 'none', color: '#fff',
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 6, background: 'var(--bg-accent)' }} />
              <span className="eyebrow-mono" style={{ color: '#a3a3a3' }}>// PRÉ-VENDA</span>
              <div>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display-heavy)', fontSize: 36, lineHeight: 0.9, textTransform: 'uppercase' }}>CYBER<br />SAMURAI 1/6</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--fg2)' }}>Action figure colecionável · R$ 899</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TROPHY ROW ── */}
      <section style={{
        background: 'linear-gradient(180deg, #050505, #000)',
        borderTop: '1px solid var(--hair)', borderBottom: '1px solid var(--hair)',
        padding: '64px 32px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[
            { n: productCount > 0 ? (productCount >= 1000 ? `${(productCount/1000).toFixed(1)}K` : String(productCount)) : '—', l: 'PRODUTOS NA LOJA' },
            { n: categories.length > 0 ? String(categories.length) : '—', l: 'CATEGORIAS ATIVAS' },
            { n: '4.9★', l: 'AVALIAÇÃO MÉDIA' },
            { n: '24H',  l: 'POSTAGEM ÚTIL' },
          ].map(s => (
            <div key={s.l}>
              <span className="red-rule" />
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 80, lineHeight: 0.9, marginTop: 14, letterSpacing: '-0.03em' }}>{s.n}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg2)', letterSpacing: '0.16em', marginTop: 8 }}>// {s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section style={{ padding: '80px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <SectionHead eyebrow="DROP DA SEMANA" title="OS MAIS COBIÇADOS." link="Ver todos" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {bestSellers.length > 0
            ? bestSellers.map(p => <ProductCard key={p.id} product={toCardData(p)} />)
            : [1, 2, 3, 4].map(i => (
                <div key={i} className="placeholder-grad" style={{ height: 360, border: '1px solid var(--hair)' }} />
              ))
          }
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '0 32px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <SectionHead eyebrow="EXPLORE" title="POR CATEGORIA." />
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg3)', fontSize: 14, border: '1px solid var(--hair)', background: 'var(--surf-1)' }}>
            Nenhuma categoria cadastrada. <Link href="/admin/categorias" style={{ color: 'var(--bg-accent)', textDecoration: 'none' }}>Cadastre no admin →</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {categories.slice(0, 6).map((cat, i) => (
              <Link key={cat.id} href={`/produtos?cat=${cat.id}`} style={{
                position: 'relative', overflow: 'hidden',
                background: `linear-gradient(135deg, ${CAT_COLORS[i % CAT_COLORS.length]} 0%, #050505 100%)`,
                minHeight: 200, padding: 32,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                border: '1px solid var(--hair)', textDecoration: 'none', color: '#fff',
              }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0, padding: '12px 16px',
                  background: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-mono)',
                  fontSize: 10, letterSpacing: '0.1em',
                }}>{cat.count} {cat.count === 1 ? 'ITEM' : 'ITENS'}</div>
                <span className="eyebrow-mono">// CATEGORIA</span>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 36, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{cat.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>EXPLORAR</span>
                  <Icon name="chevR" size={20} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── STREETWEAR STRIP ── */}
      <section style={{
        background: '#0a0a0a', padding: '80px 32px',
        borderTop: '1px solid var(--hair)', borderBottom: '1px solid var(--hair)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <SectionHead eyebrow="WEAR — DROP III" title="VESTE O TIME." link="Coleção completa" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {streetwear.length > 0
              ? streetwear.map(p => <ProductCard key={p.id} product={toCardData(p)} />)
              : [1, 2, 3, 4].map(i => (
                  <div key={i} className="placeholder-grad" style={{ height: 360, border: '1px solid var(--hair)' }} />
                ))
            }
          </div>
        </div>
      </section>

    </div>
  )
}

import { createAdminClient as createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import ProductsTable from '@/components/admin/ProductsTable'
import AdminTopbar from '@/components/admin/AdminTopbar'

async function getProducts(search?: string, category?: string) {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select(`
      id, name, slug, price, price_old, brand, stock, is_active, is_featured,
      tags, created_at, updated_at,
      categories(name),
      product_images(url, is_primary)
    `)
    .order('created_at', { ascending: false })

  if (search) query = query.ilike('name', `%${search}%`)
  if (category) query = query.eq('category_id', category)

  const { data } = await query
  return (data ?? []) as unknown as ProductRow[]
}

async function getCategories(): Promise<Array<{ id: string; name: string }>> {
  const supabase = createClient()
  const { data } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name')
  return (data ?? []) as unknown as Array<{ id: string; name: string }>
}

export interface ProductRow {
  id: string
  name: string
  slug: string
  price: number
  price_old: number | null
  brand: string | null
  stock: number
  is_active: boolean
  is_featured: boolean
  tags: string[]
  created_at: string
  categories: { name: string } | null
  product_images: Array<{ url: string; is_primary: boolean }>
}

interface PageProps {
  searchParams: { q?: string; cat?: string }
}

export default async function AdminProdutosPage({ searchParams }: PageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams.q, searchParams.cat),
    getCategories(),
  ])

  return (
    <div>
      <AdminTopbar section="CATÁLOGO" page="PRODUTOS" />
      <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Produtos
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--fg3)', fontSize: 13 }}>
            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/produtos/novo" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-accent)', color: '#fff',
          padding: '12px 20px',
          fontFamily: 'var(--font-display-heavy)', fontSize: 12,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          textDecoration: 'none',
          clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
        }}>
          <Icon name="plus" size={16} /> Novo Produto
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Icon name="search" size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg3)' }} />
          <input
            name="q"
            defaultValue={searchParams.q}
            className="bg-input"
            placeholder="Buscar produtos..."
            style={{ paddingLeft: 40, padding: '10px 12px 10px 40px' }}
          />
        </div>
        <select
          name="cat"
          defaultValue={searchParams.cat}
          style={{
            background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
            color: '#fff', padding: '10px 16px', fontSize: 13, borderRadius: 0,
            minWidth: 160,
          }}
        >
          <option value="">Todas categorias</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" style={{
          background: 'var(--surf-3)', border: '1px solid var(--hair-strong)',
          color: '#fff', padding: '10px 20px', fontSize: 12,
          fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em',
          textTransform: 'uppercase', cursor: 'pointer', borderRadius: 0,
        }}>
          Filtrar
        </button>
      </form>

      <ProductsTable products={products} />
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select(`*, product_images(*), product_variants(*)`)
    .eq('id', id)
    .single()
  return data
}

async function getCategories() {
  const supabase = createClient()
  const { data } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name')
  return data ?? []
}

interface PageProps { params: { id: string } }

export default async function EditarProdutoPage({ params }: PageProps) {
  const [productData, categories] = await Promise.all([getProduct(params.id), getCategories()])
  if (!productData) notFound()
  const product = productData as any

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/admin/produtos" style={{ color: 'var(--fg3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Icon name="chevL" size={16} /> Produtos
        </Link>
        <span style={{ color: 'var(--hair-strong)' }}>/</span>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Editar: {product.name}
        </h1>
      </div>
      <ProductForm categories={categories} product={product as any} />
    </div>
  )
}

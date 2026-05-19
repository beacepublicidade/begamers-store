import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

async function getCategories() {
  const supabase = createClient()
  const { data } = await supabase.from('categories').select('id, name').eq('is_active', true).order('name')
  return data ?? []
}

export default async function NovoProdutoPage() {
  const categories = await getCategories()

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link href="/admin/produtos" style={{ color: 'var(--fg3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <Icon name="chevL" size={16} /> Produtos
        </Link>
        <span style={{ color: 'var(--hair-strong)' }}>/</span>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Novo Produto
        </h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}

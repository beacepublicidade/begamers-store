import { createAdminClient } from '@/lib/supabase/server'
import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'
import CartDrawer from '@/components/store/CartDrawer'

export const dynamic = 'force-dynamic'

async function getCategories() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name')
    return (data ?? []) as Array<{ id: string; name: string; slug: string }>
  } catch {
    return []
  }
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories()

  return (
    <>
      <StoreHeader categories={categories} />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <StoreFooter />
      <CartDrawer />
    </>
  )
}

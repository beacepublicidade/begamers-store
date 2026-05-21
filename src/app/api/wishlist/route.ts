import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const ids = (searchParams.get('ids') ?? '').split(',').filter(Boolean)
  if (ids.length === 0) return NextResponse.json([])

  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, price, price_old, brand, product_images(url, is_primary)')
    .in('id', ids)
    .eq('is_active', true)

  const products = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    price_old: p.price_old,
    brand: p.brand,
    primary_image: p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null,
  }))

  return NextResponse.json(products)
}

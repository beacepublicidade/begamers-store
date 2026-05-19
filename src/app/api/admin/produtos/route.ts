import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*), categories(name)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createClient()
  const body = await req.json()
  const { images, variants, ...productData } = body

  const { data: product, error } = await supabase
    .from('products')
    .insert(productData as never)
    .select()
    .single() as unknown as { data: { id: string } | null; error: { message: string } | null }

  if (error || !product) return NextResponse.json({ error: error?.message ?? 'Insert failed' }, { status: 500 })
  const productId = (product as unknown as { id: string }).id

  if (images?.length) {
    await supabase.from('product_images').insert(
      images.map((img: any, i: number) => ({ ...img, product_id: productId, sort_order: i }))
    )
  }

  if (variants?.length) {
    await supabase.from('product_variants').insert(
      variants.map((v: any) => ({ ...v, product_id: productId }))
    )
  }

  return NextResponse.json(product, { status: 201 })
}

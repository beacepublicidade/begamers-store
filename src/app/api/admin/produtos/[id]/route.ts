import { createAdminClient as createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('id', params.id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: Params) {
  const supabase = createClient()
  const body = await req.json()
  const { images, variants, ...productData } = body

  const { error } = await supabase
    .from('products')
    .update(productData as never)
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Sync images
  if (images !== undefined) {
    await supabase.from('product_images').delete().eq('product_id', params.id)
    if (images.length) {
      await supabase.from('product_images').insert(
        images.map((img: any, i: number) => ({ ...img, product_id: params.id, sort_order: i }))
      )
    }
  }

  // Sync variants
  if (variants !== undefined) {
    await supabase.from('product_variants').delete().eq('product_id', params.id)
    if (variants.length) {
      await supabase.from('product_variants').insert(
        variants.map((v: any) => ({ ...v, product_id: params.id }))
      )
    }
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: Params) {
  const supabase = createClient()
  const body = await req.json()
  const { error } = await supabase.from('products').update(body as never).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: Params) {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers(name, email, phone),
      order_items(*, products(name, slug, product_images(url, is_primary)))
    `)
    .eq('id', params.id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: Params) {
  const supabase = createClient()
  const body = await req.json()
  const { error } = await supabase
    .from('orders')
    .update(body as never)
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

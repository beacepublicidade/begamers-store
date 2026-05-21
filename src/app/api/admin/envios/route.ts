import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('shipping_carriers').select('*').order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function PATCH(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, ...updates } = body
  const { error } = await supabase.from('shipping_carriers').update(updates as never).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

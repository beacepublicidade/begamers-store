import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  let query = supabase
    .from('order_tracking')
    .select('*, orders(id, customer_name, customer_email)')
    .order('created_at', { ascending: false })

  if (q) query = query.ilike('tracking_code', `%${q}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { data, error } = await supabase.from('order_tracking').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

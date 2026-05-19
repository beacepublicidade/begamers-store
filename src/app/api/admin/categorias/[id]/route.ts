import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface Params { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  const supabase = createClient()
  const body = await req.json()
  const { error } = await supabase.from('categories').update(body as never).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: Params) {
  const supabase = createClient()
  const body = await req.json()
  const { error } = await supabase.from('categories').update(body as never).eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: Params) {
  const supabase = createClient()
  const { error } = await supabase.from('categories').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

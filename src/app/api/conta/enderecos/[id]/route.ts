import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const { label, recipient, cep, street, number, complement, district, city, state, is_default } = body

  const admin = createAdminClient()

  if (is_default) {
    await admin.from('addresses').update({ is_default: false } as never).eq('customer_id', user.id)
  }

  const { data, error } = await admin
    .from('addresses')
    .update({
      label: label || 'Casa',
      recipient: recipient || null,
      cep: cep?.replace(/\D/g, '') ?? '',
      street, number,
      complement: complement || null,
      district: district || null,
      city, state,
      is_default: is_default ?? false,
    } as never)
    .eq('id', params.id)
    .eq('customer_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const admin = createAdminClient()
  const { error } = await admin
    .from('addresses')
    .delete()
    .eq('id', params.id)
    .eq('customer_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

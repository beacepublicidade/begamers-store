import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('addresses')
    .select('*')
    .eq('customer_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const { label, recipient, cep, street, number, complement, district, city, state, is_default } = body

  if (!street || !number || !cep || !city || !state) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const admin = createAdminClient()

  if (is_default) {
    await admin.from('addresses').update({ is_default: false } as never).eq('customer_id', user.id)
  }

  const { data, error } = await admin.from('addresses').insert({
    customer_id: user.id,
    label: label || 'Casa',
    recipient: recipient || null,
    cep: cep.replace(/\D/g, ''),
    street, number,
    complement: complement || null,
    district: district || null,
    city, state,
    is_default: is_default ?? false,
  } as never).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

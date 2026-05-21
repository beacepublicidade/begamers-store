import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { name, cpf, phone } = await req.json()
  if (!name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  const admin = createAdminClient()

  await supabase.auth.updateUser({ data: { name } })

  await admin
    .from('customers')
    .upsert({ id: user.id, full_name: name, cpf: cpf || null, phone: phone || null } as never, { onConflict: 'id' })

  return NextResponse.json({ success: true })
}

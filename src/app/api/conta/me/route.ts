import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json(null)

  const admin = createAdminClient()
  const { data: customer } = await admin
    .from('customers')
    .select('full_name, cpf, phone')
    .eq('id', user.id)
    .maybeSingle() as unknown as { data: { full_name?: string; cpf?: string; phone?: string } | null }

  return NextResponse.json({
    name:  customer?.full_name ?? (user.user_metadata?.name as string) ?? '',
    email: user.email ?? '',
    cpf:   customer?.cpf   ?? '',
    phone: customer?.phone ?? '',
  })
}

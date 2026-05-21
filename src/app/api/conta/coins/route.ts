import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ coins: 0 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('customers')
    .select('bg_coins')
    .eq('id', user.id)
    .maybeSingle() as unknown as { data: { bg_coins: number } | null }

  const transactions = await admin
    .from('bg_coins_transactions')
    .select('type, amount, description, created_at, order_id')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json({
    coins: data?.bg_coins ?? 0,
    history: transactions.data ?? [],
  })
}

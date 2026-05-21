import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('id, customer_name, customer_email, total, status, created_at, updated_at, items')
    .in('status', ['pending', 'awaiting_payment'])
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

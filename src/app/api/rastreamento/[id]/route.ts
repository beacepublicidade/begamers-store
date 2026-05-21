import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('order_tracking')
    .select('*, orders(id, customer_name, total, created_at, items)')
    .eq('id', params.id)
    .single()
  if (error || !data) return NextResponse.json({ error: 'Rastreamento não encontrado' }, { status: 404 })
  return NextResponse.json(data)
}

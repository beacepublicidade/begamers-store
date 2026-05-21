import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('orders')
    .select('payment_status')
    .eq('id', params.id)
    .single() as unknown as { data: { payment_status: string } | null }

  const paid = data?.payment_status === 'paid'
  return NextResponse.json({ paid })
}

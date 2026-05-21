import { createAdminClient as createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { orderId: string } }) {
  const supabase = createClient()
  const { data } = await supabase
    .from('orders')
    .select('payment_status, order_number, status')
    .eq('id', params.orderId)
    .single() as unknown as { data: { payment_status: string; order_number: string; status: string } | null }

  return NextResponse.json({
    payment_status: data?.payment_status ?? 'pending',
    order_number: data?.order_number ?? '',
    paid: data?.payment_status === 'paid',
  })
}

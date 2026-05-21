import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { error } = await supabase
    .from('order_tracking')
    .update({ ...body, updated_at: new Date().toISOString() } as never)
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

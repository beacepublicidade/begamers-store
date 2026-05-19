import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { code, total } = await req.json()

  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single() as unknown as { data: any }

  if (!coupon) return NextResponse.json({ error: 'Cupom inválido ou expirado' }, { status: 404 })

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Cupom expirado' }, { status: 400 })
  }

  if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: 'Cupom esgotado' }, { status: 400 })
  }

  if (coupon.min_order && total < coupon.min_order) {
    return NextResponse.json({ error: `Pedido mínimo de R$ ${(coupon.min_order / 100).toFixed(2)}` }, { status: 400 })
  }

  const discount = coupon.type === 'percent'
    ? Math.round(total * coupon.value / 100)
    : coupon.value

  return NextResponse.json({ ok: true, discount, code: coupon.code })
}

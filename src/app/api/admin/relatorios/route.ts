import { createAdminClient as createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const [ordersRes, itemsRes] = await Promise.all([
    supabase.from('orders').select('id, total, status, payment_method, created_at'),
    supabase.from('order_items').select('product_name, quantity, price'),
  ])

  const orders = (ordersRes.data ?? []) as Array<{ id: string; total: number; status: string; payment_method: string; created_at: string }>
  const items = (itemsRes.data ?? []) as Array<{ product_name: string; quantity: number; price: number }>

  const paid = orders.filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status))
  const totalRevenue = paid.reduce((a, o) => a + Number(o.total), 0)
  const totalOrders = orders.length

  const byStatus: Record<string, number> = {}
  orders.forEach(o => { byStatus[o.status] = (byStatus[o.status] ?? 0) + 1 })

  const byPayment: Record<string, number> = {}
  paid.forEach(o => {
    const k = o.payment_method ?? 'outro'
    byPayment[k] = (byPayment[k] ?? 0) + Number(o.total)
  })

  // Revenue by month — last 6 months
  const now = new Date()
  const byMonth: Array<{ month: string; revenue: number; orders: number }> = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).toUpperCase()
    const monthOrders = paid.filter(o => o.created_at.startsWith(key))
    byMonth.push({
      month: label,
      revenue: monthOrders.reduce((a, o) => a + Number(o.total), 0),
      orders: monthOrders.length,
    })
  }

  // Top products by revenue
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {}
  items.forEach(it => {
    const k = it.product_name ?? 'Produto'
    if (!productMap[k]) productMap[k] = { name: k, qty: 0, revenue: 0 }
    productMap[k].qty += it.quantity
    productMap[k].revenue += Number(it.price) * it.quantity
  })
  const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 8)

  return NextResponse.json({ totalRevenue, totalOrders, byStatus, byPayment, byMonth, topProducts })
}

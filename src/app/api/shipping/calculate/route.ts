import { calculateShipping } from '@/lib/melhorenvio'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { cep } = await req.json()
    if (!cep) return NextResponse.json({ error: 'CEP obrigatório' }, { status: 400 })
    const fromCep = process.env.MELHORENVIO_FROM_CEP
    if (!fromCep) return NextResponse.json({ error: 'CEP de origem não configurado' }, { status: 500 })
    const options = await calculateShipping({ fromCep, toCep: cep })
    return NextResponse.json(options)
  } catch (err: any) {
    console.error('[shipping/calculate]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

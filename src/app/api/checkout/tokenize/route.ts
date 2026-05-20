import { NextResponse } from 'next/server'
import { tokenizeCard } from '@/lib/infinitepay'

export async function POST(req: Request) {
  try {
    const { number, expiration_month, expiration_year, holder_name, cvv } = await req.json()
    const card_token = await tokenizeCard({ number, expiration_month, expiration_year, holder_name, cvv })
    return NextResponse.json({ card_token })
  } catch (err: any) {
    console.error('[tokenize]', err)
    return NextResponse.json({ error: err.message }, { status: 502 })
  }
}

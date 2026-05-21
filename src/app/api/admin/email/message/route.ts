import { getMessage } from '@/lib/zoho'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const accountId = searchParams.get('accountId')
    const messageId = searchParams.get('messageId')
    if (!accountId || !messageId) return NextResponse.json({ error: 'missing params' }, { status: 400 })
    const data = await getMessage(accountId, messageId)
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

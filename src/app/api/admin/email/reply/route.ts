import { sendEmail } from '@/lib/zoho'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { accountId, toAddress, subject, content, inReplyTo } = await req.json()
    if (!accountId || !toAddress || !subject || !content) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }
    const result = await sendEmail(accountId, { toAddress, subject, content, inReplyTo })
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

import { getAccounts, getInbox } from '@/lib/zoho'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const accountId = searchParams.get('accountId')
    const start = parseInt(searchParams.get('start') ?? '1', 10)

    if (!accountId) {
      const accounts = await getAccounts()
      if (accounts.status?.description === 'error') {
        return NextResponse.json({ error: 'ZOHO_NOT_CONNECTED' }, { status: 401 })
      }
      const firstAccount = accounts.data?.[0]
      if (!firstAccount) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
      const emailArr = firstAccount.emailAddress
      const primaryEmail = Array.isArray(emailArr)
        ? ((emailArr.find((e: any) => e.isPrimary) ?? emailArr[0])?.mailId ?? '')
        : (typeof emailArr === 'string' ? emailArr : '')
      const inbox = await getInbox(firstAccount.accountId, 25, start)
      return NextResponse.json({ accountId: firstAccount.accountId, accountAddress: primaryEmail, ...inbox })
    }

    const inbox = await getInbox(accountId, 25, start)
    return NextResponse.json(inbox)
  } catch (err: any) {
    if (err.message === 'ZOHO_NOT_CONNECTED') {
      return NextResponse.json({ error: 'ZOHO_NOT_CONNECTED' }, { status: 401 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

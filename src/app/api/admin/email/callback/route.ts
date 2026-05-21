import { exchangeCode, saveTokens } from '@/lib/zoho'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/admin/suporte?error=no_code', req.url))

  try {
    const data = await exchangeCode(code)
    if (!data.access_token || !data.refresh_token) {
      const reason = encodeURIComponent(data.error ?? data.message ?? JSON.stringify(data).slice(0, 120))
      return NextResponse.redirect(new URL(`/admin/suporte?error=${reason}`, req.url))
    }
    await saveTokens(data.access_token, data.refresh_token)
    return NextResponse.redirect(new URL('/admin/suporte?connected=1', req.url))
  } catch {
    return NextResponse.redirect(new URL('/admin/suporte?error=exchange_failed', req.url))
  }
}

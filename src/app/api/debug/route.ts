import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = cookies()
  const all = cookieStore.getAll()
  const sbCookies = all.filter(c => c.name.startsWith('sb-'))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  return NextResponse.json({
    totalCookies: all.length,
    cookieNames: all.map(c => c.name),
    supabaseCookies: sbCookies.map(c => ({ name: c.name, length: c.value.length })),
    user: user ? { id: user.id, email: user.email } : null,
    error: error?.message ?? null,
  })
}

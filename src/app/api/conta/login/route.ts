import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password, redirectTo } = await req.json()
  const dest = redirectTo ?? '/conta/minha-conta'

  const response = NextResponse.json({ ok: true, redirectTo: dest })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
    {
      cookies: {
        getAll: () => [],
        setAll: (cookiesToSet: { name: string; value: string; options?: any }[]) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options ?? {})
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return NextResponse.json({ error: error.message }, { status: 401 })

  return response
}

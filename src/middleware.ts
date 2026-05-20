import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin routes protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = req.cookies.get('admin_session')?.value
    const secret = process.env.ADMIN_SECRET

    if (!secret || session !== secret) {
      const loginUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Customer account protection
  if (pathname.startsWith('/conta/minha-conta') || pathname.startsWith('/conta/pedidos')) {
    const session = req.cookies.get('sb-access-token')?.value
      ?? req.cookies.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`)?.value

    if (!session) {
      const loginUrl = new URL('/conta/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/conta/minha-conta/:path*', '/conta/pedidos/:path*'],
}

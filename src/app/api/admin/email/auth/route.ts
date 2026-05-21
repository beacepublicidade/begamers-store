export const dynamic = 'force-dynamic'

import { getAuthUrl } from '@/lib/zoho'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect(getAuthUrl())
}

import { createAdminClient } from '@/lib/supabase/server'

const CLIENT_ID = process.env.ZOHO_CLIENT_ID!
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/email/callback`
const AUTH_BASE = 'https://accounts.zoho.com/oauth/v2'
const MAIL_BASE = 'https://mail.zoho.com/api'

let cachedToken: { token: string; exp: number } | null = null

export function getAuthUrl() {
  const scope = 'ZohoMail.messages.ALL,ZohoMail.accounts.READ'
  return `${AUTH_BASE}/auth?scope=${scope}&client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&access_type=offline`
}

export async function exchangeCode(code: string) {
  const res = await fetch(`${AUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })
  return res.json()
}

async function getRefreshToken(): Promise<string | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'zoho_refresh_token')
    .single() as unknown as { data: { value: string } | null }
  return data?.value ?? null
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  const supabase = createAdminClient()
  await supabase.from('settings').upsert([
    { key: 'zoho_refresh_token', value: refreshToken },
  ] as never)
  cachedToken = { token: accessToken, exp: Date.now() + 50 * 60 * 1000 }
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now()) return cachedToken.token

  const refreshToken = await getRefreshToken()
  if (!refreshToken) throw new Error('ZOHO_NOT_CONNECTED')

  const res = await fetch(`${AUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('ZOHO_REFRESH_FAILED')

  cachedToken = { token: data.access_token, exp: Date.now() + 50 * 60 * 1000 }
  return data.access_token
}

async function zohoGet(path: string) {
  const token = await getAccessToken()
  const res = await fetch(`${MAIL_BASE}${path}`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  })
  return res.json()
}

async function zohoPost(path: string, body: object) {
  const token = await getAccessToken()
  const res = await fetch(`${MAIL_BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function getAccounts() {
  return zohoGet('/accounts')
}

export async function getInbox(accountId: string, count = 25, start = 1) {
  return zohoGet(`/accounts/${accountId}/messages/view?mailbox=INBOX&count=${count}&start=${start}&sortby=date&order=desc`)
}

export async function getMessage(accountId: string, messageId: string) {
  return zohoGet(`/accounts/${accountId}/messages/${messageId}/content`)
}

export async function sendEmail(accountId: string, opts: {
  toAddress: string
  subject: string
  content: string
  inReplyTo?: string
}) {
  return zohoPost(`/accounts/${accountId}/messages`, {
    toAddress: opts.toAddress,
    subject: opts.subject,
    content: opts.content,
    mailFormat: 'html',
    ...(opts.inReplyTo ? { inReplyTo: opts.inReplyTo } : {}),
  })
}

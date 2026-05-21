import type { Metadata } from 'next'
import './globals.css'
import { createAdminClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'BeGamers Store',
  description: 'A loja oficial da comunidade BEGAMERS. Periféricos, streetwear, colecionáveis e o que mais o gamer precisa.',
}

export const dynamic = 'force-dynamic'

const THEME_KEYS = [
  'theme_accent_color', 'theme_accent_hot',
  'login_bg_image',
]

async function getTheme() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('settings').select('key, value').in('key', THEME_KEYS)
    const map: Record<string, string> = {}
    for (const row of (data ?? []) as Array<{ key: string; value: string }>) map[row.key] = row.value
    return map
  } catch {
    return {}
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme()

  const vars: string[] = []
  if (theme.theme_accent_color) vars.push(`--bg-accent: ${theme.theme_accent_color}`)
  if (theme.theme_accent_hot)   vars.push(`--bg-accent-hot: ${theme.theme_accent_hot}`)
  if (theme.login_bg_image)     vars.push(`--login-bg-image: url("${theme.login_bg_image.replace(/"/g, '\\"')}")`)

  const themeCSS = vars.length ? `:root { ${vars.join(';') } }` : ''

  return (
    <html lang="pt-BR">
      <body>
        {themeCSS && <style dangerouslySetInnerHTML={{ __html: themeCSS }} />}
        {children}
      </body>
    </html>
  )
}

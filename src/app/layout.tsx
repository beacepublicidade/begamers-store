import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BeGamers Store',
  description: 'A loja oficial da comunidade BEGAMERS. Periféricos, streetwear, colecionáveis e o que mais o gamer precisa.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

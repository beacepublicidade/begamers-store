'use client'
import type { ReactNode, CSSProperties } from 'react'

type Tone = 'neutral' | 'red' | 'hot' | 'outline' | 'success' | 'warning' | 'dark'

interface TagProps {
  children: ReactNode
  tone?: Tone
  style?: CSSProperties
}

const TONES: Record<Tone, CSSProperties> = {
  neutral: { background: '#1a1a1a', color: '#fff', border: '1px solid var(--hair-strong)' },
  red:     { background: 'var(--bg-accent)', color: '#fff' },
  hot:     { background: 'var(--bg-accent-hot)', color: '#fff', boxShadow: 'var(--neon-glow)' },
  outline: { background: 'transparent', color: '#fff', border: '1px solid #fff' },
  success: { background: '#0e3a1f', color: '#4cd680', border: '1px solid #1f9d55' },
  warning: { background: '#3a2a00', color: '#ffc940', border: '1px solid #d99a00' },
  dark:    { background: '#000', color: '#fff', border: '1px solid var(--hair-strong)' },
}

export default function Tag({ children, tone = 'neutral', style = {} }: TagProps) {
  return (
    <span style={{
      fontFamily: 'var(--font-display-heavy)',
      fontWeight: 900,
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      padding: '5px 8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      lineHeight: 1,
      ...TONES[tone],
      ...style,
    }}>
      {children}
    </span>
  )
}

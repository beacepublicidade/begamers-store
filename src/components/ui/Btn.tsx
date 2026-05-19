'use client'
import type { ReactNode, CSSProperties } from 'react'

type Variant = 'primary' | 'hot' | 'outline' | 'ghost' | 'dark'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface BtnProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  full?: boolean
  icon?: ReactNode
  style?: CSSProperties
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const SIZES: Record<Size, CSSProperties> = {
  sm: { padding: '8px 14px', fontSize: 11 },
  md: { padding: '12px 20px', fontSize: 13 },
  lg: { padding: '16px 28px', fontSize: 14 },
  xl: { padding: '20px 36px', fontSize: 16 },
}

const VARIANTS: Record<Variant, CSSProperties> = {
  primary: { background: 'var(--bg-accent)', color: '#fff', border: '0' },
  hot:     { background: 'var(--bg-accent-hot)', color: '#fff', border: '0', boxShadow: 'var(--neon-glow)' },
  outline: { background: 'transparent', color: '#fff', border: '2px solid #fff' },
  ghost:   { background: 'transparent', color: '#fff', border: '1px solid var(--hair-strong)' },
  dark:    { background: '#fff', color: '#000', border: '0' },
}

export default function Btn({ variant = 'primary', size = 'md', children, full, icon, style = {}, onClick, type = 'button', disabled }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: 'var(--font-display-heavy)',
        fontWeight: 900,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: full ? '100%' : 'auto',
        clipPath: variant !== 'ghost' && variant !== 'outline' ? 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' : 'none',
        transition: 'all 180ms var(--ease-out)',
        opacity: disabled ? 0.5 : 1,
        ...SIZES[size],
        ...VARIANTS[variant],
        ...style,
      }}
    >
      {icon}<span>{children}</span>
    </button>
  )
}

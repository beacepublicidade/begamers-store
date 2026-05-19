'use client'

type PriceSize = 'sm' | 'md' | 'lg' | 'xl'

interface PriceProps {
  value: number
  old?: number
  size?: PriceSize
  parcelas?: number
  pix?: boolean
}

const SIZES = {
  sm: { current: 16, old: 11, sub: 10 },
  md: { current: 22, old: 12, sub: 11 },
  lg: { current: 32, old: 14, sub: 12 },
  xl: { current: 48, old: 18, sub: 13 },
}

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace(/\.(?=\d{2}$)/, ',')
}

export default function Price({ value, old, size = 'md', parcelas = 12, pix = true }: PriceProps) {
  const s = SIZES[size]
  const pixValue = pix ? value * 0.9 : value

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {old && (
        <span style={{ fontSize: s.old, color: 'var(--fg3)', textDecoration: 'line-through' }}>
          {fmt(old)}
        </span>
      )}
      <span style={{
        fontFamily: 'var(--font-display-heavy)',
        fontWeight: 900,
        fontSize: s.current,
        lineHeight: 1,
        color: '#fff',
        letterSpacing: '-0.01em',
      }}>
        {fmt(value)}
      </span>
      {pix && (
        <span style={{ fontSize: s.sub, color: '#4cd680', fontWeight: 700, letterSpacing: 0.4 }}>
          {fmt(pixValue)} no PIX
        </span>
      )}
      <span style={{ fontSize: s.sub, color: 'var(--fg2)' }}>
        ou {parcelas}x de {fmt(value / parcelas)} sem juros
      </span>
    </div>
  )
}

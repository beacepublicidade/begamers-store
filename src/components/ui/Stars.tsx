'use client'
import Icon from './Icon'

interface StarsProps {
  value?: number
  size?: number
  showNumber?: boolean
  count?: number
}

export default function Stars({ value = 4.6, size = 12, showNumber = true, count }: StarsProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ display: 'inline-flex', gap: 1 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <Icon
            key={i}
            name="star"
            size={size}
            color={i < Math.round(value) ? '#ffb800' : '#3a3a3a'}
            stroke={1.2}
            style={{ fill: i < Math.round(value) ? '#ffb800' : 'transparent' }}
          />
        ))}
      </span>
      {showNumber && (
        <span style={{ fontSize: 11, color: 'var(--fg2)' }}>
          {value.toString().replace('.', ',')}
          {count ? ` (${count})` : ''}
        </span>
      )}
    </span>
  )
}

'use client'
import { useEffect, useState } from 'react'

export default function CountdownClient({ estimatedDelivery }: { estimatedDelivery: string }) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    function update() {
      const diff = new Date(estimatedDelivery).getTime() - Date.now()
      if (diff <= 0) { setDisplay('CHEGANDO'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setDisplay(h > 0 ? `${h}H ${m}M` : `${m}M`)
    }
    update()
    const t = setInterval(update, 30000)
    return () => clearInterval(t)
  }, [estimatedDelivery])

  if (!display) return null

  return (
    <div style={{
      fontFamily: 'var(--font-display-heavy)',
      fontSize: 72,
      lineHeight: 0.9,
      letterSpacing: '-0.04em',
      textTransform: 'uppercase',
      marginBottom: 20,
    }}>
      CHEGA EM<br />
      <span style={{ color: 'var(--bg-accent-hot)', textShadow: '0 0 40px rgba(255,31,61,0.5)' }}>
        {display}.
      </span>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'

export default function GPSMapClient({
  origin,
  destination,
  status,
}: {
  origin: string
  destination: string
  status: string
}) {
  const [secsAgo, setSecsAgo] = useState(14)

  useEffect(() => {
    const t = setInterval(() => setSecsAgo(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const isMoving = ['out_for_delivery', 'in_transit'].includes(status)
  const dotLeft = isMoving ? '58%' : '20%'

  return (
    <div style={{
      background: '#05000a',
      border: '1px solid rgba(255,31,61,0.15)',
      padding: '24px 28px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--bg-accent-hot)',
            boxShadow: '0 0 8px var(--bg-accent-hot)',
            display: 'inline-block',
            animation: 'livePulse 1.5s infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>
            // LOCALIZAÇÃO AO VIVO
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg3)', letterSpacing: '0.1em' }}>
          GPS ATUALIZADO HÁ {secsAgo}S
        </span>
      </div>

      {/* Route visualization */}
      <div style={{ position: 'relative', height: 60, marginBottom: 20 }}>
        {/* Base line */}
        <div style={{
          position: 'absolute', top: '50%', left: '10%', right: '10%', height: 1,
          background: 'rgba(255,255,255,0.06)',
          transform: 'translateY(-50%)',
        }} />
        {/* Filled line (progress) */}
        <div style={{
          position: 'absolute', top: '50%', left: '10%',
          width: isMoving ? '50%' : '0%', height: 2,
          background: 'linear-gradient(90deg, rgba(255,31,61,0.3), var(--bg-accent-hot))',
          boxShadow: '0 0 8px rgba(255,31,61,0.5)',
          transform: 'translateY(-50%)',
          transition: 'width 2s ease',
        }} />

        {/* Origin dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '10%',
          width: 8, height: 8, borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          border: '1px solid rgba(255,255,255,0.2)',
          transform: 'translate(-50%, -50%)',
        }} />

        {/* Moving dot */}
        <div style={{
          position: 'absolute', top: '50%',
          left: dotLeft,
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--bg-accent-hot)',
          boxShadow: '0 0 20px rgba(255,31,61,0.9), 0 0 40px rgba(255,31,61,0.4)',
          transform: 'translate(-50%, -50%)',
          transition: 'left 3s ease-in-out',
          animation: isMoving ? 'dotGlow 2s infinite' : 'none',
        }} />

        {/* Destination dot */}
        <div style={{
          position: 'absolute', top: '50%', right: '10%',
          width: 12, height: 12, borderRadius: '50%',
          background: '#4cd680',
          border: '2px solid rgba(76,214,128,0.3)',
          boxShadow: '0 0 16px rgba(76,214,128,0.6)',
          transform: 'translate(50%, -50%)',
        }} />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 3 }}>ORIGEM</div>
          <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{origin}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4cd680', marginBottom: 3 }}>VOCÊ</div>
          <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {destination.split(',')[0] ?? destination}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14, display: 'flex', gap: 28, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg3)', letterSpacing: '0.08em' }}>
          <span style={{ color: '#fff', fontFamily: 'var(--font-display-heavy)', fontSize: 16 }}>~14</span> KM
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--bg-accent-hot)', animation: 'livePulse 1.5s infinite', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Em rota</span>
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {isMoving ? 'GPS ATIVO' : 'AGUARDANDO'}
        </span>
      </div>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        @keyframes dotGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,31,61,0.9), 0 0 40px rgba(255,31,61,0.4); }
          50% { box-shadow: 0 0 30px rgba(255,31,61,1), 0 0 60px rgba(255,31,61,0.6); }
        }
      `}</style>
    </div>
  )
}

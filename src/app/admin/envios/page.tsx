'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

interface Carrier {
  id: string; name: string; code: string; type: string; is_active: boolean
  min_days: number; max_days: number; base_price: number
}

function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.',',') }

export default function EnviosPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [loading, setLoading] = useState(true)
  const [freeThreshold, setFreeThreshold] = useState('')
  const [originZip, setOriginZip] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const [carRes, cfgRes] = await Promise.all([
      fetch('/api/admin/envios'),
      fetch('/api/admin/configuracoes'),
    ])
    const cars = await carRes.json()
    setCarriers(Array.isArray(cars) ? cars : [])
    const cfg = await cfgRes.json()
    const map: Record<string, string> = {}
    for (const row of (Array.isArray(cfg) ? cfg : []) as Array<{ key: string; value: string }>) map[row.key] = row.value
    setFreeThreshold(map.free_shipping_threshold ?? '299')
    setOriginZip(map.origin_zipcode ?? '')
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleCarrier(id: string, current: boolean) {
    await fetch('/api/admin/envios', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active: !current }) })
    load()
  }

  async function saveSettings() {
    setSaving(true)
    await fetch('/api/admin/configuracoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ free_shipping_threshold: freeThreshold, origin_zipcode: originZip }) })
    setSaving(false)
  }

  const inputStyle = { width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' as const }

  return (
    <div>
      <AdminTopbar section="OPERAÇÃO" page="ENVIOS & LOGÍSTICA" />
      <div style={{ padding: 32 }}>
        <h1 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Envios & Logística</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// TRANSPORTADORAS</span>
            {loading ? <p style={{ color: 'var(--fg3)' }}>Carregando...</p> : (
              <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
                {carriers.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--hair)', opacity: c.is_active ? 1 : 0.5 }}>
                    <div style={{ width: 40, height: 40, background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="truck" size={18} color="var(--fg2)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{c.min_days === 0 ? 'Retirada' : `${c.min_days}–${c.max_days} dias úteis`} · {fmt(c.base_price)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 10, color: c.is_active ? '#4cd680' : 'var(--fg3)' }}>{c.is_active ? 'Ativo' : 'Inativo'}</span>
                      <button onClick={() => toggleCarrier(c.id, c.is_active)} style={{ width: 40, height: 22, borderRadius: 11, background: c.is_active ? 'var(--bg-accent)' : 'var(--hair-strong)', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                        <span style={{ position: 'absolute', top: 3, left: c.is_active ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// CONFIGURAÇÕES</span>
            <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Frete grátis acima de (R$)</label>
                <input value={freeThreshold} onChange={e => setFreeThreshold(e.target.value)} style={inputStyle} placeholder="Ex: 299" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>CEP de origem</label>
                <input value={originZip} onChange={e => setOriginZip(e.target.value)} style={inputStyle} placeholder="00000-000" />
              </div>
              <button onClick={saveSettings} disabled={saving} style={{ width: '100%', padding: '10px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer' }}>
                {saving ? 'Salvando...' : 'Salvar configurações'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

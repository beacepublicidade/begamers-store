'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Btn from '@/components/ui/Btn'

const FIELDS = [
  { key: 'banner_badge',       label: 'Badge (ex: ● LIVE — PRÉ-VENDA)',        type: 'text' },
  { key: 'banner_eyebrow',     label: 'Eyebrow (ex: // EP.01 / DROP 2026)',     type: 'text' },
  { key: 'banner_title1',      label: 'Título linha 1 (ex: ENTRA)',             type: 'text' },
  { key: 'banner_title2',      label: 'Título linha 2 (ex: NO SERVER.)',        type: 'text' },
  { key: 'banner_product_name',label: 'Nome do produto',                        type: 'text' },
  { key: 'banner_product_desc',label: 'Descrição do produto',                   type: 'text' },
  { key: 'banner_price',       label: 'Preço (ex: R$ 449,90)',                  type: 'text' },
  { key: 'banner_price_old',   label: 'Preço antigo (ex: de R$ 599,90)',        type: 'text' },
  { key: 'banner_stock',       label: 'Estoque (ex: 378 un.)',                  type: 'text' },
  { key: 'banner_stock_sub',   label: 'Sub-estoque (ex: Limitado a 1 por CPF)',  type: 'text' },
  { key: 'banner_cta_text',    label: 'Texto do botão (ex: COMPRAR AGORA)',     type: 'text' },
  { key: 'banner_cta_url',     label: 'Link do botão (ex: /produto/viper-x9)',  type: 'text' },
  { key: 'banner_image_url',   label: 'URL da imagem do produto',               type: 'url'  },
]

export default function BannersPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then(r => r.json())
      .then((data: Array<{ key: string; value: string }>) => {
        const map: Record<string, string> = {}
        data.forEach(s => { map[s.key] = s.value })
        setValues(map)
        setLoading(false)
      })
  }, [])

  async function save() {
    setSaving(true)
    const bannerValues: Record<string, string> = {}
    FIELDS.forEach(f => { bannerValues[f.key] = values[f.key] ?? '' })
    await fetch('/api/admin/configuracoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bannerValues),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '10px 14px', fontSize: 13, width: '100%',
  }

  if (loading) return <div><AdminTopbar section="CONFIG" page="BANNERS" /><div style={{ padding: 32, color: 'var(--fg3)' }}>Carregando...</div></div>

  return (
    <div>
      <AdminTopbar section="CONFIG" page="BANNERS" />
      <div style={{ padding: 32, maxWidth: 800 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>
              Banner da Home
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--fg3)', fontSize: 13 }}>
              Edite o hero principal da página inicial
            </p>
          </div>
          <Btn variant="primary" onClick={save} disabled={saving}>
            {saved ? '✓ Salvo!' : saving ? 'Salvando...' : 'Salvar Banner'}
          </Btn>
        </div>

        {/* Preview strip */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginBottom: 32,
          background: 'linear-gradient(135deg, #1a0006 0%, #000 50%)',
          padding: '24px 32px', border: '1px solid var(--hair)',
        }}>
          <div className="chevron-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
          <div style={{ position: 'relative' }}>
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)', fontSize: 9 }}>// PREVIEW DO BANNER</span>
            <div style={{ marginTop: 8, fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', lineHeight: 1 }}>
              {values.banner_title1 || 'ENTRA'}<br />
              <span style={{ color: 'var(--bg-accent)' }}>{values.banner_title2 || 'NO SERVER.'}</span>
            </div>
            {values.banner_product_name && (
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--fg2)' }}>
                {values.banner_product_name} — {values.banner_price}
              </div>
            )}
          </div>
        </div>

        {/* Fields */}
        <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: 24 }}>
          <span className="eyebrow-mono" style={{ color: 'var(--fg3)', display: 'block', marginBottom: 20 }}>// CAMPOS DO BANNER</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FIELDS.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  style={inputStyle}
                  value={values[f.key] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.label}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

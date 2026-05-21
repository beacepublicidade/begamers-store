'use client'
import { useState, useEffect, useRef } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Btn from '@/components/ui/Btn'

function UploadBtn({ onUrl }: { onUrl: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    setUploading(false)
    if (res.ok) { const d = await res.json(); onUrl(d.url ?? d.publicUrl ?? '') }
    else alert('Erro no upload. Verifique o Storage do Supabase.')
    if (ref.current) ref.current.value = ''
  }
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      disabled={uploading}
      style={{ padding: '10px 16px', background: uploading ? 'var(--surf-3)' : 'var(--bg-accent)', border: '1px solid var(--hair-strong)', color: '#fff', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: uploading ? 'wait' : 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
      {uploading ? '⏳ Enviando...' : '↑ Enviar imagem'}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handle} />
    </button>
  )
}

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
        if (Array.isArray(data)) data.forEach(s => { map[s.key] = s.value })
        setValues(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
                {f.key === 'banner_image_url' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: 'rgba(255,193,64,0.06)', border: '1px solid rgba(255,193,64,0.2)', padding: '12px 16px', fontSize: 12, color: 'var(--fg2)', lineHeight: 1.6 }}>
                      <strong style={{ color: '#ffc940', display: 'block', marginBottom: 6 }}>Como adicionar a imagem do produto:</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span>① Clique em <strong style={{ color: '#fff' }}>↑ Enviar imagem</strong> e escolha o arquivo no seu computador</span>
                        <span>② A URL é gerada automaticamente e já aparece no campo acima</span>
                        <span>③ Clique em <strong style={{ color: '#fff' }}>Salvar Banner</strong> para aplicar no site</span>
                        <span style={{ marginTop: 4, fontSize: 11, color: 'var(--fg3)' }}>Ou cole uma URL externa diretamente no campo. Recomendado: PNG/WebP com fundo transparente, mín. 800×600px.</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="text" style={{ ...inputStyle, flex: 1 }} value={values[f.key] ?? ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} placeholder="A URL aparece aqui automaticamente após o upload" />
                      <UploadBtn onUrl={url => setValues(v => ({ ...v, banner_image_url: url }))} />
                    </div>
                    {values.banner_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={values.banner_image_url} alt="preview" style={{ maxHeight: 120, maxWidth: 240, objectFit: 'contain', border: '1px solid var(--hair)', background: '#111' }} />
                    )}
                  </div>
                ) : (
                  <input type={f.type} style={inputStyle} value={values[f.key] ?? ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} placeholder={f.label} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

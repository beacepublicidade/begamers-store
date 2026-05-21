'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Btn from '@/components/ui/Btn'

export default function SeoPage() {
  const [values, setValues] = useState({
    meta_title: '', meta_description: '', og_title: '', og_description: '',
    og_image: '', robots: 'index, follow', canonical: '', sitemap_url: '',
    google_analytics: '', google_tag: '', facebook_pixel: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then(r => r.json())
      .then((data: Array<{ key: string; value: string }>) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {}
          data.forEach(s => { map[s.key] = s.value })
          setValues(v => ({ ...v, ...map }))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/configuracoes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const input: React.CSSProperties = {
    background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '10px 14px', fontSize: 13, width: '100%',
  }

  const groups = [
    {
      title: 'Meta Tags', fields: [
        { key: 'meta_title', label: 'Meta Title', hint: 'Máx. 60 caracteres', type: 'text' },
        { key: 'meta_description', label: 'Meta Description', hint: 'Máx. 160 caracteres', type: 'textarea' },
      ]
    },
    {
      title: 'Open Graph (Redes Sociais)', fields: [
        { key: 'og_title', label: 'OG Title', hint: '', type: 'text' },
        { key: 'og_description', label: 'OG Description', hint: '', type: 'textarea' },
        { key: 'og_image', label: 'OG Image URL', hint: '1200×630px recomendado', type: 'text' },
      ]
    },
    {
      title: 'Configurações Técnicas', fields: [
        { key: 'robots', label: 'Robots', hint: 'ex: index, follow', type: 'text' },
        { key: 'canonical', label: 'Canonical URL', hint: '', type: 'text' },
        { key: 'sitemap_url', label: 'Sitemap URL', hint: 'ex: https://begamerstore.com.br/sitemap.xml', type: 'text' },
      ]
    },
    {
      title: 'Rastreamento & Analytics', fields: [
        { key: 'google_analytics', label: 'Google Analytics ID', hint: 'ex: G-XXXXXXXXXX', type: 'text' },
        { key: 'google_tag', label: 'Google Tag Manager ID', hint: 'ex: GTM-XXXXXXX', type: 'text' },
        { key: 'facebook_pixel', label: 'Facebook Pixel ID', hint: '', type: 'text' },
      ]
    },
  ]

  return (
    <div>
      <AdminTopbar section="MARKETING" page="SEO" />
      <div style={{ padding: 32, maxWidth: 800 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>SEO</h1>
          <Btn variant="primary" onClick={save} disabled={saving || loading}>
            {saved ? '✓ Salvo!' : saving ? 'Salvando...' : 'Salvar SEO'}
          </Btn>
        </div>

        {/* Preview */}
        <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 20, marginBottom: 24 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 12 }}>// PREVIEW · RESULTADO GOOGLE</span>
          <div style={{ padding: 16, background: '#fff', borderRadius: 4 }}>
            <div style={{ fontSize: 13, color: '#202124', fontFamily: 'Arial, sans-serif', marginBottom: 2 }}>begamerstore.com.br</div>
            <div style={{ fontSize: 18, color: '#1a0dab', fontFamily: 'Arial, sans-serif', marginBottom: 4 }}>{values.meta_title || 'BeGamers Store — Periféricos & Streetwear Gamer'}</div>
            <div style={{ fontSize: 13, color: '#4d5156', fontFamily: 'Arial, sans-serif', lineHeight: 1.4 }}>{values.meta_description || 'Os melhores periféricos e streetwear gamer. Frete grátis acima de R$ 299. 10% off no PIX.'}</div>
          </div>
        </div>

        {groups.map(g => (
          <div key={g.title} style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{g.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {g.fields.map(f => (
                <div key={f.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{f.label}</label>
                    {f.hint && <span style={{ fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>{f.hint}</span>}
                  </div>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} style={{ ...input, resize: 'vertical' }} value={(values as any)[f.key] ?? ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} />
                  ) : (
                    <input type="text" style={input} value={(values as any)[f.key] ?? ''} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

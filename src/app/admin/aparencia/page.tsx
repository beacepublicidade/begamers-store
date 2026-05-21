'use client'
import { useState, useEffect, useRef } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

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
      style={{ width: '100%', marginTop: 6, padding: '9px', background: uploading ? 'var(--surf-3)' : 'var(--surf-1)', border: `1px dashed ${uploading ? 'var(--hair-strong)' : 'var(--bg-accent)'}`, color: uploading ? 'var(--fg3)' : 'var(--bg-accent)', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: uploading ? 'wait' : 'pointer', textAlign: 'center' }}>
      {uploading ? '⏳ Enviando imagem...' : '↑ Clique para fazer upload'}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handle} />
    </button>
  )
}

type Device = 'desktop' | 'tablet' | 'mobile'
type LeftTab = 'SEÇÕES' | 'BANNERS' | 'GLOBAL'

interface Settings {
  theme_accent_color: string
  theme_accent_hot: string
  banner_badge: string; banner_eyebrow: string
  banner_title1: string; banner_title2: string
  banner_product_name: string; banner_product_desc: string
  banner_price: string; banner_price_old: string
  banner_stock: string; banner_stock_sub: string
  banner_cta_text: string; banner_cta_url: string
  banner_image_url: string
  ticker_text: string
  [key: string]: string
}

const DEF: Settings = {
  theme_accent_color: '#E63946', theme_accent_hot: '#ff1f3d',
  banner_badge: '● LIVE — PRÉ-VENDA', banner_eyebrow: '// EP.01 / DROP 2026',
  banner_title1: 'ENTRA', banner_title2: 'NO SERVER.',
  banner_product_name: 'VIPER X9', banner_product_desc: 'Mouse sem fio · 26K DPI · 90h',
  banner_price: 'R$ 449,90', banner_price_old: 'de R$ 599,90',
  banner_stock: '378 un.', banner_stock_sub: 'Limitado a 1 por CPF',
  banner_cta_text: 'COMPRAR AGORA', banner_cta_url: '/produtos',
  banner_image_url: '',
  ticker_text: '🔴 LIVE DROP — COLEÇÃO RANKED /// VIPER X9 EM PRÉ-VENDA /// 10% OFF NO PIX /// FRETE GRÁTIS ACIMA DE R$ 299',
  section_ticker_visible: 'true', section_hero_visible: 'true',
  section_trust_visible: 'true', section_categories_visible: 'true',
  section_bestsellers_visible: 'true', section_banner2col_visible: 'true',
  section_streetwear_visible: 'true', section_stats_visible: 'true',
  section_testimonials_visible: 'false', section_newsletter_visible: 'true',
  hero_height: '540', hero_autoplay: 'true', hero_interval: '6', hero_overlay: '45',
  login_bg_image: '', login_title1: 'ENTRA', login_title2: 'NO SERVER.',
  login_eyebrow: '// COMUNIDADE BEGAMERS',
  login_subtitle: 'Cadastra-se e desbloqueia: drops exclusivos, cupons só pra membro, 10% off em todo PIX.',
  ofertas_bg_image: '', ofertas_title1: 'OFERTAS', ofertas_title2: 'IMPERDÍVEIS.',
  ofertas_eyebrow: '// DESCONTOS EXCLUSIVOS', ofertas_subtitle: 'Os melhores preços em periféricos e streetwear gamer.',
}

const SECTIONS = [
  { id: 'header',       name: 'Cabeçalho',                icon: 'rows',   locked: true,  desc: 'Header com logo, menu e carrinho' },
  { id: 'ticker',       name: 'Barra de anúncio',         icon: 'bolt',   locked: false, desc: 'Faixa vermelha com mensagens rolantes no topo' },
  { id: 'hero',         name: 'Hero · Carrossel',         icon: 'photo',  locked: false, desc: 'Banner principal com produto em destaque' },
  { id: 'trust',        name: 'Selos de confiança',       icon: 'shield', locked: false, desc: 'Ícones de benefícios (frete, segurança, troca)' },
  { id: 'categories',   name: 'Grade de categorias',      icon: 'tag',    locked: false, desc: 'Seção "Por categoria" com cards linkados' },
  { id: 'bestsellers',  name: 'Mais vendidos',            icon: 'star',   locked: false, desc: 'Grid de 4 produtos em destaque' },
  { id: 'banner2col',   name: 'Banner promocional 2-col', icon: 'photo',  locked: false, desc: 'Dois banners lado a lado com CTA' },
  { id: 'streetwear',   name: 'Streetwear · Drop',        icon: 'tag',    locked: false, desc: 'Coleção "Veste o time" com 4 produtos' },
  { id: 'stats',        name: 'Stats da loja',            icon: 'chart',  locked: false, desc: 'Números da loja (produtos, avaliações, clientes)' },
  { id: 'testimonials', name: 'Depoimentos',              icon: 'star',   locked: false, desc: 'Avaliações em destaque de clientes' },
  { id: 'newsletter',   name: 'Newsletter',               icon: 'mail',   locked: false, desc: 'Formulário de captura de e-mails' },
  { id: 'footer',       name: 'Rodapé',                   icon: 'rows',   locked: true,  desc: 'Footer com links, redes sociais e newsletter' },
  { id: 'login',        name: 'Login / Cadastro',         icon: 'shield', locked: false, desc: 'Página de login — fundo, título e texto do painel esquerdo' },
  { id: 'ofertas',      name: 'Página de Ofertas',        icon: 'tag',    locked: false, desc: 'Banner de topo e textos da página de ofertas' },
]

const PAGES = [
  { value: '/',                  label: 'Home — página inicial',  section: 'hero' },
  { value: '/produtos',          label: 'Listagem de produtos',   section: null },
  { value: '/produto/demo',      label: 'Página de produto',      section: null },
  { value: '/carrinho',          label: 'Carrinho',               section: null },
  { value: '/checkout',          label: 'Checkout',               section: null },
  { value: '/conta/login',       label: 'Login / Cadastro',       section: 'login' },
  { value: '/conta/minha-conta', label: 'Minha Conta',            section: null },
  { value: '/busca',             label: 'Busca',                  section: null },
  { value: '/ofertas',           label: 'Ofertas',                section: 'ofertas' },
]

// Qual seção edita cada página (para o callout no centro)
const PAGE_EDIT_HINT: Record<string, { section: string; label: string }> = {
  '/':            { section: 'hero',    label: 'Hero · Carrossel' },
  '/conta/login': { section: 'login',   label: 'Login / Cadastro' },
  '/ofertas':     { section: 'ofertas', label: 'Página de Ofertas' },
}

const DEVICE_FRAMES: Record<Device, { width: string; label: string }> = {
  desktop: { width: '100%', label: 'DESKTOP' },
  tablet:  { width: '768px',  label: 'TABLET · 768px' },
  mobile:  { width: '390px',  label: 'MOBILE · 390px' },
}

const ACCENT_COLORS = ['#E63946','#ff1f3d','#6C63FF','#00B4D8','#FB8500','#f59e0b','#10b981','#4CC9F0']

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
  color: '#fff', padding: '8px 10px', fontSize: 12, boxSizing: 'border-box',
}

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 9, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</label>
      {children}
      {note && <div style={{ marginTop: 4, fontSize: 9, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>↳ {note}</div>}
    </div>
  )
}

export default function AparenciaPage() {
  const [leftTab, setLeftTab]           = useState<LeftTab>('SEÇÕES')
  const [device, setDevice]             = useState<Device>('desktop')
  const [previewPage, setPreviewPage]   = useState('/')
  const [selectedSection, setSection]   = useState<string | null>('hero')
  const [s, setS]                       = useState<Settings>(DEF)
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [saved, setSaved]               = useState(false)
  const [dirty, setDirty]               = useState(0)
  const [error, setError]               = useState('')
  const iframeRef                       = useRef<HTMLIFrameElement>(null)

  const set = (k: string, v: string) => {
    setS(prev => ({ ...prev, [k]: v }))
    setDirty(d => d + 1)
  }

  const toggle = (sectionId: string) => {
    const key = `section_${sectionId}_visible`
    const current = s[key] === 'true'
    set(key, current ? 'false' : 'true')
  }

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then(r => r.json())
      .then((rows: Array<{ key: string; value: string }>) => {
        if (!Array.isArray(rows)) return
        const map: Record<string, string> = {}
        for (const r of rows) map[r.key] = r.value
        setS(prev => ({ ...prev, ...Object.fromEntries(Object.entries(map).filter(([k]) => k in DEF || k.startsWith('section_') || k.startsWith('hero_') || k.startsWith('banner_') || k.startsWith('theme_') || k === 'ticker_text')) }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function publish() {
    setSaving(true); setError('')
    const res = await fetch('/api/admin/configuracoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    })
    setSaving(false)
    if (!res.ok) { setError('Erro ao salvar'); return }
    setSaved(true); setDirty(0)
    setTimeout(() => setSaved(false), 2500)
    iframeRef.current?.contentWindow?.location.reload()
  }

  async function saveDraft() {
    await fetch('/api/admin/configuracoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s),
    })
  }

  if (loading) return (
    <div><AdminTopbar section="MARKETING" page="APARÊNCIA" />
      <div style={{ padding: 80, textAlign: 'center', color: 'var(--fg3)' }}>Carregando configurações...</div>
    </div>
  )

  const section = SECTIONS.find(s => s.id === selectedSection)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AdminTopbar section="MARKETING" page="APARÊNCIA" />

      {/* ── ACTION BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: 44, borderBottom: '1px solid var(--hair)', background: 'var(--surf-2)', flexShrink: 0, gap: 12 }}>
        {/* Device switcher */}
        <div style={{ display: 'flex', gap: 2 }}>
          {(['desktop','tablet','mobile'] as Device[]).map(d => (
            <button key={d} onClick={() => setDevice(d)}
              title={DEVICE_FRAMES[d].label}
              style={{ width: 32, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: device === d ? 'var(--bg-accent)' : 'transparent', border: `1px solid ${device === d ? 'var(--bg-accent)' : 'var(--hair-strong)'}`, color: device === d ? '#fff' : 'var(--fg3)', cursor: 'pointer', fontSize: 10 }}>
              {d === 'desktop' ? '🖥' : d === 'tablet' ? '⬛' : '📱'}
            </button>
          ))}
          <span style={{ marginLeft: 8, fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--fg3)', alignSelf: 'center', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{DEVICE_FRAMES[device].label}</span>
        </div>

        {/* Status + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {dirty > 0 && (
            <span style={{ fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', color: '#ffc940', background: 'rgba(217,154,0,0.12)', border: '1px solid rgba(217,154,0,0.3)', padding: '3px 8px' }}>
              ● {dirty} ALTERAÇ{dirty === 1 ? 'ÃO' : 'ÕES'} NÃO PUBLICADAS
            </span>
          )}
          {error && <span style={{ fontSize: 10, color: '#f87171' }}>{error}</span>}
          <a href="/" target="_blank" rel="noreferrer"
            style={{ padding: '5px 12px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--hair-strong)', color: '#fff', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Visualizar ↗
          </a>
          <button onClick={saveDraft}
            style={{ padding: '5px 12px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--hair-strong)', color: 'var(--fg2)', cursor: 'pointer' }}>
            Salvar rascunho
          </button>
          <button onClick={publish} disabled={saving}
            style={{ padding: '5px 16px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: saved ? '#1f9d55' : 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saved ? '✓ Publicado' : saving ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </div>

      {/* ── 3-PANEL BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── LEFT PANEL (280px) ── */}
        <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid var(--hair)', display: 'flex', flexDirection: 'column', background: 'var(--surf-2)', overflow: 'hidden' }}>
          {/* Left tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--hair)', flexShrink: 0 }}>
            {(['SEÇÕES','BANNERS','GLOBAL'] as LeftTab[]).map(t => (
              <button key={t} onClick={() => setLeftTab(t)}
                style={{ flex: 1, padding: '10px 4px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', background: leftTab === t ? 'var(--surf-3)' : 'transparent', border: 'none', borderBottom: leftTab === t ? '2px solid var(--bg-accent)' : '2px solid transparent', color: leftTab === t ? '#fff' : 'var(--fg3)', cursor: 'pointer' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Left content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>

            {/* ── SEÇÕES TAB ── */}
            {leftTab === 'SEÇÕES' && (
              <div>
                {/* Page selector */}
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--hair)', background: 'var(--surf-1)' }}>
                  <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 5 }}>// EDITANDO PÁGINA</div>
                  <select value={previewPage} onChange={e => {
                      const page = PAGES.find(p => p.value === e.target.value)
                      setPreviewPage(e.target.value)
                      if (page?.section) setSection(page.section)
                    }}
                    style={{ width: '100%', background: 'var(--surf-2)', border: '1px solid var(--hair-strong)', color: '#fff', padding: '6px 8px', fontSize: 11, cursor: 'pointer' }}>
                    {PAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>

                {/* Section count */}
                <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 8, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>SEÇÕES · {SECTIONS.length}</span>
                </div>

                {/* Section list */}
                {SECTIONS.map((sec) => {
                  const visible = s[`section_${sec.id}_visible`] !== 'false'
                  const isActive = selectedSection === sec.id
                  return (
                    <div key={sec.id}
                      onClick={() => { setSection(sec.id); setLeftTab('SEÇÕES') }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--hair)', cursor: 'pointer', background: isActive ? 'rgba(204,0,0,0.08)' : 'transparent', borderLeft: isActive ? '2px solid var(--bg-accent)' : '2px solid transparent', transition: 'background 0.1s' }}>
                      <span style={{ color: 'var(--fg3)', fontSize: 12, cursor: 'grab', flexShrink: 0 }}>⠿</span>
                      <Icon name={sec.icon} size={13} color={isActive ? 'var(--bg-accent)' : 'var(--fg3)'} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? '#fff' : 'var(--fg2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sec.name}</div>
                      </div>
                      {sec.locked ? (
                        <span style={{ fontSize: 8, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>🔒</span>
                      ) : (
                        <div
                          onClick={e => { e.stopPropagation(); toggle(sec.id) }}
                          style={{ width: 32, height: 18, borderRadius: 9, background: visible ? 'var(--bg-accent)' : 'var(--surf-3)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s', border: '1px solid var(--hair-strong)' }}>
                          <span style={{ position: 'absolute', top: 2, left: visible ? 15 : 2, width: 12, height: 12, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── BANNERS TAB ── */}
            {leftTab === 'BANNERS' && (
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>// SLOTS DE BANNER</div>
                {[
                  { id: 'hero', label: 'Hero principal', desc: 'Banner de destaque na Home' },
                ].map(b => (
                  <div key={b.id}
                    onClick={() => { setSection(b.id); setLeftTab('SEÇÕES') }}
                    style={{ padding: '12px 14px', border: '1px solid var(--hair)', background: 'var(--surf-1)', marginBottom: 8, cursor: 'pointer' }}>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{b.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 2 }}>{b.desc}</div>
                    <div style={{ marginTop: 8, fontSize: 9, color: 'var(--bg-accent)', fontFamily: 'var(--font-mono)' }}>→ Editar campos</div>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(255,193,64,0.06)', border: '1px solid rgba(255,193,64,0.2)', fontSize: 10, color: 'var(--fg2)' }}>
                  Para upload de imagem de banner, acesse <strong>Config → Banners</strong> no menu lateral.
                </div>
              </div>
            )}

            {/* ── GLOBAL TAB ── */}
            {leftTab === 'GLOBAL' && (
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>// CORES DO TEMA</div>

                <Field label="Cor de destaque principal" note="Botões, links ativos, bordas">
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    {ACCENT_COLORS.map(c => (
                      <div key={c} onClick={() => set('theme_accent_color', c)}
                        style={{ width: 24, height: 24, background: c, cursor: 'pointer', border: c === s.theme_accent_color ? '2px solid #fff' : '1px solid transparent', outline: c === s.theme_accent_color ? `2px solid ${c}` : 'none', borderRadius: 2 }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="color" value={s.theme_accent_color} onChange={e => set('theme_accent_color', e.target.value)} style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
                    <input value={s.theme_accent_color} onChange={e => set('theme_accent_color', e.target.value)} style={{ ...inp, width: 90, fontFamily: 'var(--font-mono)', fontSize: 11 }} />
                    <div style={{ width: 30, height: 30, background: s.theme_accent_color, border: '1px solid var(--hair-strong)', borderRadius: 2 }} />
                  </div>
                </Field>

                <Field label="Cor de destaque quente (hot)" note="Preços, badges, alertas">
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                    {ACCENT_COLORS.map(c => (
                      <div key={c} onClick={() => set('theme_accent_hot', c)}
                        style={{ width: 24, height: 24, background: c, cursor: 'pointer', border: c === s.theme_accent_hot ? '2px solid #fff' : '1px solid transparent', outline: c === s.theme_accent_hot ? `2px solid ${c}` : 'none', borderRadius: 2 }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="color" value={s.theme_accent_hot} onChange={e => set('theme_accent_hot', e.target.value)} style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
                    <input value={s.theme_accent_hot} onChange={e => set('theme_accent_hot', e.target.value)} style={{ ...inp, width: 90, fontFamily: 'var(--font-mono)', fontSize: 11 }} />
                    <div style={{ width: 30, height: 30, background: s.theme_accent_hot, border: '1px solid var(--hair-strong)', borderRadius: 2 }} />
                  </div>
                </Field>

                {/* Color preview */}
                <div style={{ marginTop: 4, background: 'var(--surf-1)', border: '1px solid var(--hair)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 10 }}>// PREVIEW</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <button style={{ padding: '7px 14px', background: s.theme_accent_color, border: 'none', color: '#fff', fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'default' }}>COMPRAR</button>
                    <span style={{ color: s.theme_accent_hot, fontFamily: 'var(--font-display-heavy)', fontSize: 16 }}>R$ 449,90</span>
                    <span style={{ padding: '3px 8px', background: s.theme_accent_hot, color: '#fff', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>OFERTA</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CENTER PANEL (flex-1) ── */}
        <div style={{ flex: 1, background: '#0d0d0d', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 16px 0' }}>
          {/* Preview header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
            <span>// PREVIEW ·</span>
            <span style={{ color: 'var(--bg-accent)' }}>{previewPage}</span>
            <span>·</span>
            <span>{DEVICE_FRAMES[device].label}</span>
          </div>

          {/* Edit hint callout */}
          {(() => {
            const hint = PAGE_EDIT_HINT[previewPage]
            if (!hint) return (
              <div style={{ width: '100%', maxWidth: DEVICE_FRAMES[device].width, marginBottom: 8, padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--hair)', fontSize: 10, color: 'var(--fg3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>ℹ️</span>
                <span>Esta página ainda não tem campos editáveis no painel. Use as <strong style={{ color: '#fff' }}>SEÇÕES</strong> à esquerda para ajustes globais.</span>
              </div>
            )
            const isEditing = selectedSection === hint.section
            return (
              <div style={{ width: '100%', maxWidth: DEVICE_FRAMES[device].width, marginBottom: 8, padding: '8px 14px', background: isEditing ? 'rgba(204,0,0,0.1)' : 'rgba(255,193,64,0.08)', border: `1px solid ${isEditing ? 'rgba(204,0,0,0.4)' : 'rgba(255,193,64,0.3)'}`, fontSize: 10, color: 'var(--fg2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                {isEditing
                  ? <><span style={{ color: '#4cd680' }}>✓</span><span>Editando <strong style={{ color: '#fff' }}>{hint.label}</strong> — ajuste os campos no painel à direita →</span></>
                  : <><span>✏️</span><span>Para editar o banner desta página: <button onClick={() => { setSection(hint.section); setLeftTab('SEÇÕES') }} style={{ background: 'none', border: 'none', color: 'var(--bg-accent-hot)', fontWeight: 700, cursor: 'pointer', fontSize: 10, padding: 0, textDecoration: 'underline' }}>clique aqui → {hint.label}</button></span></>
                }
              </div>
            )
          })()}

          {/* Device frame */}
          <div style={{
            width: DEVICE_FRAMES[device].width,
            maxWidth: '100%',
            flex: 1,
            minHeight: 0,
            border: '1px solid var(--hair-strong)',
            overflow: 'hidden',
            position: 'relative',
            background: '#000',
            transition: 'width 0.3s ease',
          }}>
            <iframe
              ref={iframeRef}
              src={previewPage}
              style={{ width: '100%', height: '100%', minHeight: 600, border: 'none', display: 'block' }}
              title="Preview do site"
            />
          </div>
        </div>

        {/* ── RIGHT PANEL (320px) ── */}
        <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--hair)', background: 'var(--surf-2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Right panel header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hair)', flexShrink: 0 }}>
            <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 3 }}>// EDITANDO · {section ? section.name.toUpperCase() : 'SELECIONE UMA SEÇÃO'}</div>
            {section && <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 3 }}>{section.desc}</div>}
          </div>

          {/* Right panel content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

            {!selectedSection && (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--fg3)', fontSize: 12 }}>
                Selecione uma seção na lista à esquerda para editar
              </div>
            )}

            {/* ── HERO EDITOR ── */}
            {selectedSection === 'hero' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', marginBottom: 14, background: 'rgba(204,0,0,0.08)', border: '1px solid rgba(204,0,0,0.25)', fontSize: 10, color: 'var(--fg2)' }}>
                  <Icon name="photo" size={12} color="var(--bg-accent-hot)" />
                  Alterações publicam direto na Home
                </div>

                <Field label="Altura do hero (px)" note="Altura mínima do banner. Recomendado: 540–720px">
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['480','540','600','720'].map(h => (
                      <button key={h} onClick={() => set('hero_height', h)}
                        style={{ flex: 1, padding: '6px 4px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', background: s.hero_height === h ? 'var(--bg-accent)' : 'var(--surf-1)', border: `1px solid ${s.hero_height === h ? 'var(--bg-accent)' : 'var(--hair-strong)'}`, color: '#fff', cursor: 'pointer' }}>
                        {h}
                      </button>
                    ))}
                  </div>
                </Field>

                <div style={{ height: 1, background: 'var(--hair)', margin: '14px 0' }} />
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>// CONTEÚDO DO BANNER</div>

                <Field label="Badge / etiqueta" note="Canto esquerdo do hero (ex: ● LIVE — PRÉ-VENDA)">
                  <input value={s.banner_badge} onChange={e => set('banner_badge', e.target.value)} style={inp} placeholder="● LIVE — PRÉ-VENDA" />
                </Field>
                <Field label="Eyebrow (texto pequeno)" note="Linha acima do título">
                  <input value={s.banner_eyebrow} onChange={e => set('banner_eyebrow', e.target.value)} style={inp} placeholder="// EP.01 / DROP 2026" />
                </Field>
                <Field label="Título linha 1">
                  <input value={s.banner_title1} onChange={e => set('banner_title1', e.target.value)} style={inp} placeholder="ENTRA" />
                </Field>
                <Field label="Título linha 2 (destaque colorido)">
                  <input value={s.banner_title2} onChange={e => set('banner_title2', e.target.value)} style={inp} placeholder="NO SERVER." />
                </Field>
                <Field label="Nome do produto em destaque">
                  <input value={s.banner_product_name} onChange={e => set('banner_product_name', e.target.value)} style={inp} placeholder="VIPER X9" />
                </Field>
                <Field label="Descrição do produto">
                  <input value={s.banner_product_desc} onChange={e => set('banner_product_desc', e.target.value)} style={inp} placeholder="Mouse sem fio · 26K DPI · 90h" />
                </Field>
                <Field label="Preço em destaque">
                  <input value={s.banner_price} onChange={e => set('banner_price', e.target.value)} style={inp} placeholder="R$ 449,90" />
                </Field>
                <Field label="Preço antigo (riscado)" note="Deixe vazio para ocultar">
                  <input value={s.banner_price_old} onChange={e => set('banner_price_old', e.target.value)} style={inp} placeholder="de R$ 599,90" />
                </Field>
                <Field label="Estoque">
                  <input value={s.banner_stock} onChange={e => set('banner_stock', e.target.value)} style={inp} placeholder="378 un." />
                </Field>
                <Field label="Restrição de estoque">
                  <input value={s.banner_stock_sub} onChange={e => set('banner_stock_sub', e.target.value)} style={inp} placeholder="Limitado a 1 por CPF" />
                </Field>
                <Field label="Texto do botão CTA">
                  <input value={s.banner_cta_text} onChange={e => set('banner_cta_text', e.target.value)} style={inp} placeholder="COMPRAR AGORA" />
                </Field>
                <Field label="Link do botão CTA">
                  <input value={s.banner_cta_url} onChange={e => set('banner_cta_url', e.target.value)} style={inp} placeholder="/produtos" />
                </Field>
                <Field label="Imagem do produto no hero">
                  <div style={{ padding: '10px 12px', background: 'rgba(255,193,64,0.06)', border: '1px solid rgba(255,193,64,0.2)', fontSize: 10, color: 'var(--fg2)', lineHeight: 1.7, marginBottom: 6 }}>
                    <strong style={{ color: '#ffc940' }}>Como funciona:</strong><br />
                    ① Clique em <strong style={{ color: '#fff' }}>↑ Clique para fazer upload</strong><br />
                    ② URL preenche automaticamente no campo abaixo<br />
                    ③ Clique em <strong style={{ color: '#fff' }}>Publicar</strong> para aplicar no site
                  </div>
                  <input value={s.banner_image_url} onChange={e => set('banner_image_url', e.target.value)} style={inp} placeholder="A URL aparece aqui após o upload" />
                  <UploadBtn onUrl={url => set('banner_image_url', url)} />
                  {s.banner_image_url && (
                    <div style={{ marginTop: 6, border: '1px solid var(--hair)', background: '#111', padding: 4 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.banner_image_url} alt="" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                    </div>
                  )}
                </Field>

                <div style={{ height: 1, background: 'var(--hair)', margin: '14px 0' }} />
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>// AUTO-PLAY</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 11 }}>Avançar automaticamente</span>
                  <div onClick={() => set('hero_autoplay', s.hero_autoplay === 'true' ? 'false' : 'true')}
                    style={{ width: 36, height: 20, borderRadius: 10, background: s.hero_autoplay === 'true' ? 'var(--bg-accent)' : 'var(--surf-3)', position: 'relative', cursor: 'pointer', border: '1px solid var(--hair-strong)', transition: 'background 0.2s' }}>
                    <span style={{ position: 'absolute', top: 3, left: s.hero_autoplay === 'true' ? 17 : 3, width: 12, height: 12, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                  </div>
                </div>

                {s.hero_autoplay === 'true' && (
                  <Field label="Intervalo entre slides" note="Tempo em segundos antes de avançar">
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['4','6','8','12'].map(sec => (
                        <button key={sec} onClick={() => set('hero_interval', sec)}
                          style={{ flex: 1, padding: '6px 4px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', background: s.hero_interval === sec ? 'var(--bg-accent)' : 'var(--surf-1)', border: `1px solid ${s.hero_interval === sec ? 'var(--bg-accent)' : 'var(--hair-strong)'}`, color: '#fff', cursor: 'pointer' }}>
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </Field>
                )}

                <div style={{ height: 1, background: 'var(--hair)', margin: '14px 0' }} />
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 10 }}>// OVERLAY</div>
                <Field label="Opacidade do gradiente de proteção (%)" note="0 = sem gradiente, 100 = preto total">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="range" min="0" max="100" value={s.hero_overlay || '45'} onChange={e => set('hero_overlay', e.target.value)} style={{ flex: 1 }} />
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', minWidth: 30 }}>{s.hero_overlay || 45}%</span>
                  </div>
                </Field>

                {/* Mini preview */}
                <div style={{ marginTop: 8, background: 'linear-gradient(135deg,#1a0006 0%,#000 60%)', padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: s.theme_accent_hot, marginBottom: 6 }}>{s.banner_eyebrow}</div>
                  <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 22, lineHeight: 0.95, textTransform: 'uppercase' }}>
                    {s.banner_title1}<br/>
                    <span style={{ background: s.theme_accent_color, color: '#fff', padding: '0 4px' }}>{s.banner_title2}</span>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 16, color: s.theme_accent_hot, fontFamily: 'var(--font-display-heavy)' }}>{s.banner_price}</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ padding: '5px 12px', background: s.theme_accent_hot, color: '#fff', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.banner_cta_text}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── TICKER EDITOR ── */}
            {selectedSection === 'ticker' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', marginBottom: 14, background: 'rgba(255,31,61,0.06)', border: '1px solid rgba(255,31,61,0.2)', fontSize: 10, color: 'var(--fg2)' }}>
                  <Icon name="bolt" size={12} color="var(--bg-accent-hot)" />
                  Separe os itens com <code style={{ background: 'var(--surf-3)', padding: '1px 4px' }}>///</code>
                </div>

                <Field label="Itens da barra de anúncios" note="Faixa colorida no topo do site — rolagem automática">
                  <textarea
                    value={s.ticker_text}
                    onChange={e => set('ticker_text', e.target.value)}
                    rows={5}
                    style={{ ...inp, fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.6, resize: 'vertical' }}
                    placeholder="🔴 LIVE DROP /// VIPER X9 EM PRÉ-VENDA /// 10% OFF NO PIX"
                  />
                </Field>

                <div style={{ background: s.theme_accent_hot, color: '#fff', padding: '8px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: 4 }}>
                  {s.ticker_text.split('///').map(t => t.trim()).filter(Boolean).join('   ///   ')}
                </div>
              </div>
            )}

            {/* ── LOGIN EDITOR ── */}
            {selectedSection === 'login' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', marginBottom: 14, background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', fontSize: 10, color: 'var(--fg2)' }}>
                  <Icon name="shield" size={12} color="#6C63FF" />
                  Edita o painel esquerdo da página de login/cadastro
                </div>

                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>// IMAGEM DE FUNDO</div>
                <Field label="Imagem de fundo (painel esquerdo)" note="Substitui o gradiente escuro. PNG/JPG, mín. 1200×900px">
                  <input value={s.login_bg_image} onChange={e => set('login_bg_image', e.target.value)} style={inp} placeholder="https://... ou faça upload abaixo" />
                  <UploadBtn onUrl={url => set('login_bg_image', url)} />
                  {s.login_bg_image && (
                    <div style={{ marginTop: 6, border: '1px solid var(--hair)', background: '#111', padding: 4 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.login_bg_image} alt="" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                </Field>

                <div style={{ height: 1, background: 'var(--hair)', margin: '14px 0' }} />
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>// TEXTOS DO PAINEL ESQUERDO</div>

                <Field label="Eyebrow (texto pequeno acima do título)" note="Ex: // COMUNIDADE BEGAMERS">
                  <input value={s.login_eyebrow} onChange={e => set('login_eyebrow', e.target.value)} style={inp} placeholder="// COMUNIDADE BEGAMERS" />
                </Field>
                <Field label="Título linha 1" note="Primeira linha do título gigante">
                  <input value={s.login_title1} onChange={e => set('login_title1', e.target.value)} style={inp} placeholder="ENTRA" />
                </Field>
                <Field label="Título linha 2 (destaque colorido)" note="Aparece com fundo da cor de destaque">
                  <input value={s.login_title2} onChange={e => set('login_title2', e.target.value)} style={inp} placeholder="NO SERVER." />
                </Field>
                <Field label="Subtítulo / descrição" note="Parágrafo abaixo do título com os benefícios">
                  <textarea value={s.login_subtitle} onChange={e => set('login_subtitle', e.target.value)} rows={3}
                    style={{ ...inp, fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5, resize: 'vertical' }}
                    placeholder="Cadastra-se e desbloqueia: drops exclusivos..." />
                </Field>

                {/* Mini preview */}
                <div style={{ marginTop: 4, background: 'linear-gradient(135deg,#1a0006 0%,#000 60%)', padding: '16px 20px', position: 'relative', overflow: 'hidden',
                  ...(s.login_bg_image ? { backgroundImage: `url(${s.login_bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: s.theme_accent_hot, letterSpacing: '0.14em', marginBottom: 6 }}>{s.login_eyebrow}</div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 24, lineHeight: 0.9, textTransform: 'uppercase' }}>
                      {s.login_title1}<br/>
                      <span style={{ background: s.theme_accent_color, color: '#fff', padding: '0 4px' }}>{s.login_title2}</span>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{s.login_subtitle}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── OFERTAS EDITOR ── */}
            {selectedSection === 'ofertas' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', marginBottom: 14, background: 'rgba(251,133,0,0.08)', border: '1px solid rgba(251,133,0,0.25)', fontSize: 10, color: 'var(--fg2)' }}>
                  <Icon name="tag" size={12} color="#FB8500" />
                  Edita o banner de topo da página de Ofertas
                </div>

                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>// IMAGEM DE FUNDO</div>
                <Field label="Imagem de fundo do banner" note="Aparece no topo da página de ofertas. Mín. 1400×400px">
                  <input value={s.ofertas_bg_image} onChange={e => set('ofertas_bg_image', e.target.value)} style={inp} placeholder="https://... ou faça upload abaixo" />
                  <UploadBtn onUrl={url => set('ofertas_bg_image', url)} />
                  {s.ofertas_bg_image && (
                    <div style={{ marginTop: 6, border: '1px solid var(--hair)', background: '#111', padding: 4 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.ofertas_bg_image} alt="" style={{ maxHeight: 60, maxWidth: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                </Field>

                <div style={{ height: 1, background: 'var(--hair)', margin: '14px 0' }} />
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 12 }}>// TEXTOS DO BANNER</div>
                <Field label="Eyebrow (texto pequeno)">
                  <input value={s.ofertas_eyebrow} onChange={e => set('ofertas_eyebrow', e.target.value)} style={inp} placeholder="// DESCONTOS EXCLUSIVOS" />
                </Field>
                <Field label="Título linha 1">
                  <input value={s.ofertas_title1} onChange={e => set('ofertas_title1', e.target.value)} style={inp} placeholder="OFERTAS" />
                </Field>
                <Field label="Título linha 2 (destaque colorido)">
                  <input value={s.ofertas_title2} onChange={e => set('ofertas_title2', e.target.value)} style={inp} placeholder="IMPERDÍVEIS." />
                </Field>
                <Field label="Subtítulo">
                  <input value={s.ofertas_subtitle} onChange={e => set('ofertas_subtitle', e.target.value)} style={inp} placeholder="Os melhores preços em periféricos e streetwear gamer." />
                </Field>

                {/* Mini preview */}
                <div style={{ marginTop: 4, background: '#0a0a0a', padding: '16px 20px', position: 'relative', overflow: 'hidden',
                  ...(s.ofertas_bg_image ? { backgroundImage: `url(${s.ofertas_bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(135deg, #0a0006 0%, #000 60%)' }) }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: s.theme_accent_hot, letterSpacing: '0.14em', marginBottom: 4 }}>{s.ofertas_eyebrow}</div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 22, lineHeight: 0.9, textTransform: 'uppercase' }}>
                      {s.ofertas_title1}<br/>
                      <span style={{ background: s.theme_accent_color, color: '#fff', padding: '0 4px' }}>{s.ofertas_title2}</span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{s.ofertas_subtitle}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── GLOBAL (seção selecionada) ── */}
            {selectedSection === 'header' && (
              <div style={{ padding: '12px 0' }}>
                <div style={{ padding: '10px 12px', background: 'rgba(255,193,64,0.06)', border: '1px solid rgba(255,193,64,0.2)', fontSize: 11, color: 'var(--fg2)' }}>
                  O cabeçalho é fixo e não pode ser desativado. Logo e menu são configurados automaticamente.
                </div>
              </div>
            )}

            {selectedSection === 'footer' && (
              <div style={{ padding: '12px 0' }}>
                <div style={{ padding: '10px 12px', background: 'rgba(255,193,64,0.06)', border: '1px solid rgba(255,193,64,0.2)', fontSize: 11, color: 'var(--fg2)' }}>
                  O rodapé é fixo e não pode ser desativado. Links e redes sociais em breve editáveis aqui.
                </div>
              </div>
            )}

            {selectedSection && !['hero','ticker','header','footer','login','ofertas'].includes(selectedSection) && (
              <div>
                {/* Visibility toggle */}
                {!SECTIONS.find(x => x.id === selectedSection)?.locked && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--hair)', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>Visível na loja</div>
                      <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 2 }}>Liga/desliga esta seção no site</div>
                    </div>
                    <div onClick={() => toggle(selectedSection)}
                      style={{ width: 40, height: 22, borderRadius: 11, background: s[`section_${selectedSection}_visible`] !== 'false' ? 'var(--bg-accent)' : 'var(--surf-3)', position: 'relative', cursor: 'pointer', border: '1px solid var(--hair-strong)', transition: 'background 0.2s' }}>
                      <span style={{ position: 'absolute', top: 3, left: s[`section_${selectedSection}_visible`] !== 'false' ? 19 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                    </div>
                  </div>
                )}
                <div style={{ padding: '10px 12px', background: 'var(--surf-1)', border: '1px solid var(--hair)', fontSize: 11, color: 'var(--fg3)', lineHeight: 1.5 }}>
                  <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 8 }}>// EDIÇÃO AVANÇADA</div>
                  Personalização detalhada desta seção (título, padding, cores individuais) chegará em breve. Por enquanto, controle a visibilidade pela chave acima.
                </div>
              </div>
            )}
          </div>

          {/* Right panel footer */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--hair)', flexShrink: 0 }}>
            <button onClick={publish} disabled={saving}
              style={{ width: '100%', padding: '10px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase', background: saved ? '#1f9d55' : 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saved ? '✓ PUBLICADO COM SUCESSO' : saving ? 'PUBLICANDO...' : 'PUBLICAR ALTERAÇÕES'}
            </button>
            {error && <div style={{ marginTop: 6, fontSize: 10, color: '#f87171', textAlign: 'center' }}>{error}</div>}
          </div>
        </div>

      </div>
    </div>
  )
}

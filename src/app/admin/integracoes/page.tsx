'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

interface Integration {
  id: string; name: string; desc: string; icon: string; tag: string
  settingKey?: string; placeholder?: string; type?: string
  connected?: boolean; envConnected?: boolean
}

const INTEGRATIONS: Integration[] = [
  // Pagamentos
  { id: 'infinitepay', name: 'InfinitePay', desc: 'Processador principal — PIX (taxa 0,99%), cartão de crédito (2,49% à vista / 3,49% parcelado) e boleto (R$3,49). Configurado via .env.', icon: 'bolt', tag: 'Pagamentos', envConnected: true, type: 'readonly' },
  { id: 'pix', name: 'PIX via InfinitePay', desc: 'Geração de QR Code PIX integrada ao InfinitePay. Liquidação D+0. Já está ativo automaticamente.', icon: 'bolt', tag: 'Pagamentos', envConnected: true, type: 'readonly' },
  // E-mails
  { id: 'resend', name: 'Resend', desc: 'Envio de e-mails transacionais: confirmação de pedido, rastreamento, recuperação de carrinho. Cole a API Key gerada em resend.com.', icon: 'mail', tag: 'E-mails', settingKey: 'resend_api_key', placeholder: 're_xxxxxxxxxxxxxxxx' },
  // SMS
  { id: 'twilio', name: 'Twilio', desc: 'SMS e notificações WhatsApp. Necessita Account SID + Auth Token. Crie em twilio.com/console.', icon: 'headset', tag: 'SMS', settingKey: 'twilio_account_sid', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
  // Logística
  { id: 'melhorenvio', name: 'Melhor Envio', desc: 'Cotação automática de frete (PAC, SEDEX, Jadlog, Total Express, Loggi). Crie conta em melhorenvio.com.br, gere o token OAuth2 e cole abaixo.', icon: 'truck', tag: 'Logística', settingKey: 'melhorenvio_token', placeholder: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...' },
  { id: 'correios', name: 'Correios (API)', desc: 'Rastreamento e cotação via API oficial dos Correios. Necessita usuário e senha do Correios Online.', icon: 'truck', tag: 'Logística', settingKey: 'correios_user', placeholder: 'usuario@correios.com.br' },
  { id: 'jadlog', name: 'Jadlog', desc: 'Cotação e rastreamento Jadlog. Solicite credenciais em jadlog.com.br/site/jadlog-api.', icon: 'truck', tag: 'Logística', settingKey: 'jadlog_token', placeholder: 'token-jadlog...' },
  // Analytics
  { id: 'ga4', name: 'Google Analytics 4', desc: 'Analytics e rastreamento de conversões. Crie uma propriedade em analytics.google.com e cole o Measurement ID.', icon: 'chart', tag: 'Analytics', settingKey: 'ga4_measurement_id', placeholder: 'G-XXXXXXXXXX' },
  { id: 'gtm', name: 'Google Tag Manager', desc: 'Gerenciador de tags — injete scripts sem deploy. Crie container em tagmanager.google.com.', icon: 'tag', tag: 'Analytics', settingKey: 'gtm_id', placeholder: 'GTM-XXXXXXX' },
  // Ads
  { id: 'meta', name: 'Meta Pixel', desc: 'Rastreamento para Facebook & Instagram Ads. Encontre o Pixel ID no Gerenciador de Eventos da Meta.', icon: 'chart', tag: 'Ads', settingKey: 'meta_pixel_id', placeholder: '1234567890123456' },
  { id: 'tiktok', name: 'TikTok Pixel', desc: 'Rastreamento de eventos para TikTok Ads. Encontre o ID em ads.tiktok.com → Assets → Events.', icon: 'chart', tag: 'Ads', settingKey: 'tiktok_pixel_id', placeholder: 'XXXXXXXXXXXXXXXXXX' },
  // Infraestrutura
  { id: 'supabase', name: 'Supabase', desc: 'Banco de dados PostgreSQL, autenticação e storage. Configurado via variáveis de ambiente — não editar aqui.', icon: 'shield', tag: 'Infraestrutura', envConnected: true, type: 'readonly' },
  { id: 'vercel', name: 'Vercel', desc: 'Hospedagem e deploy automático. Configurado pelo CLI. Acesse vercel.com para gerenciar domínios e env vars.', icon: 'bolt', tag: 'Infraestrutura', envConnected: true, type: 'readonly' },
]

const TAGS = ['Todos', 'Pagamentos', 'E-mails', 'SMS', 'Logística', 'Analytics', 'Ads', 'Infraestrutura']

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
  color: '#fff', padding: '8px 12px', fontSize: 12, boxSizing: 'border-box',
  fontFamily: 'var(--font-mono)',
}

export default function IntegracoesPage() {
  const [filter, setFilter] = useState('Todos')
  const [keys, setKeys] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then(r => r.json())
      .then((rows: Array<{ key: string; value: string }>) => {
        if (!Array.isArray(rows)) return
        const map: Record<string, string> = {}
        for (const r of rows) map[r.key] = r.value
        setKeys(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function save(integration: Integration) {
    if (!integration.settingKey) return
    setSaving(integration.id)
    const res = await fetch('/api/admin/configuracoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [integration.settingKey]: keys[integration.settingKey] ?? '' }),
    })
    setSaving(null)
    if (res.ok) {
      setSaved(integration.id)
      setTimeout(() => setSaved(null), 2000)
    }
  }

  function mask(val: string) {
    if (!val) return ''
    return val.slice(0, 4) + '••••••••' + val.slice(-4)
  }

  const visible = INTEGRATIONS.filter(i => filter === 'Todos' || i.tag === filter)

  return (
    <div>
      <AdminTopbar section="CONFIG" page="INTEGRAÇÕES" />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Integrações</h1>
            <p style={{ margin: 0, color: 'var(--fg3)', fontSize: 13 }}>Conecte ferramentas externas à sua loja. As chaves são salvas de forma segura.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {TAGS.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: '6px 14px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: filter === t ? 'var(--bg-accent)' : 'var(--surf-2)', border: `1px solid ${filter === t ? 'var(--bg-accent)' : 'var(--hair-strong)'}`, color: '#fff', cursor: 'pointer' }}>{t}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {visible.map(item => {
            const val = item.settingKey ? (keys[item.settingKey] ?? '') : ''
            const isConnected = item.envConnected || (item.settingKey ? val.length > 0 : false)
            const isSaving = saving === item.id
            const isSaved = saved === item.id

            return (
              <div key={item.id} style={{ background: 'var(--surf-2)', border: `1px solid ${isConnected ? 'rgba(76,214,128,0.4)' : 'var(--hair)'}`, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={item.icon} size={16} color="var(--fg2)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{item.name}</div>
                      <div style={{ fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)', marginTop: 2 }}>{item.tag}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: isConnected ? '#4cd680' : 'var(--hair-strong)' }} />
                    <span style={{ fontSize: 10, color: isConnected ? '#4cd680' : 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>{isConnected ? 'Conectado' : 'Desconectado'}</span>
                  </div>
                </div>

                <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--fg3)', lineHeight: 1.5 }}>{item.desc}</p>

                {item.type === 'readonly' && (
                  <div style={{ background: 'var(--surf-3)', border: '1px solid var(--hair)', padding: '8px 12px', fontSize: 11, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>
                    Configurado via variáveis de ambiente (.env) — não editável aqui
                  </div>
                )}

                {item.settingKey && !loading && (
                  <div>
                    <div style={{ marginBottom: 8, fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {item.settingKey.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <input
                          type={showKey[item.id] ? 'text' : 'password'}
                          value={val}
                          onChange={e => setKeys(k => ({ ...k, [item.settingKey!]: e.target.value }))}
                          placeholder={item.placeholder}
                          style={inp}
                        />
                      </div>
                      <button onClick={() => setShowKey(v => ({ ...v, [item.id]: !v[item.id] }))} style={{ width: 36, background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', color: 'var(--fg2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={showKey[item.id] ? 'x' : 'search'} size={12} />
                      </button>
                      <button onClick={() => save(item)} disabled={isSaving} style={{ padding: '0 16px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: isSaved ? '#1f9d55' : 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {isSaved ? '✓' : isSaving ? '...' : 'Salvar'}
                      </button>
                    </div>
                    {val && !showKey[item.id] && (
                      <div style={{ marginTop: 4, fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>
                        {mask(val)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 24, background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="shield" size={16} color="var(--fg3)" />
          <div style={{ fontSize: 12, color: 'var(--fg3)' }}>
            As chaves de API são armazenadas na tabela <code style={{ background: 'var(--surf-3)', padding: '1px 6px', fontFamily: 'var(--font-mono)' }}>settings</code> do banco de dados.
            Credenciais críticas (Supabase, InfinitePay) devem ser configuradas diretamente nas variáveis de ambiente da Vercel.
          </div>
        </div>
      </div>
    </div>
  )
}

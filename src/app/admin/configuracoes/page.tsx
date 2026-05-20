'use client'
import { useState, useEffect } from 'react'
import Btn from '@/components/ui/Btn'
import AdminTopbar from '@/components/admin/AdminTopbar'

interface Setting { key: string; value: string; label: string; type: 'text' | 'number' | 'textarea' | 'url' }

const SETTINGS_SCHEMA: Setting[] = [
  { key: 'store_name',        label: 'Nome da Loja',           type: 'text',     value: '' },
  { key: 'store_email',       label: 'Email de Contato',       type: 'text',     value: '' },
  { key: 'store_phone',       label: 'Telefone',               type: 'text',     value: '' },
  { key: 'store_whatsapp',    label: 'WhatsApp',               type: 'text',     value: '' },
  { key: 'store_instagram',   label: 'Instagram',              type: 'url',      value: '' },
  { key: 'store_description', label: 'Descrição da Loja',      type: 'textarea', value: '' },
  { key: 'shipping_free_min', label: 'Frete Grátis Acima (R$)',type: 'number',   value: '' },
  { key: 'pix_discount',      label: 'Desconto PIX (%)',       type: 'number',   value: '' },
  { key: 'installments_max',  label: 'Parcelas Máximas',       type: 'number',   value: '' },
  { key: 'meta_title',        label: 'Meta Title (SEO)',       type: 'text',     value: '' },
  { key: 'meta_description',  label: 'Meta Description (SEO)', type: 'textarea', value: '' },
]

export default function ConfiguracoesPage() {
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
      .catch(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/configuracoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '10px 14px', fontSize: 13, borderRadius: 0, width: '100%',
  }

  if (loading) return <div style={{ padding: 32, color: 'var(--fg3)' }}>Carregando...</div>

  const groups = [
    { title: 'Informações da Loja', keys: ['store_name', 'store_email', 'store_phone', 'store_whatsapp', 'store_instagram', 'store_description'] },
    { title: 'Configurações de Vendas', keys: ['shipping_free_min', 'pix_discount', 'installments_max'] },
    { title: 'SEO', keys: ['meta_title', 'meta_description'] },
  ]

  return (
    <div>
      <AdminTopbar section="CONFIG" page="LOJA" />
      <div style={{ padding: 32, maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Configurações
        </h1>
        <Btn variant="primary" onClick={save} disabled={saving}>
          {saved ? '✓ Salvo!' : saving ? 'Salvando...' : 'Salvar Alterações'}
        </Btn>
      </div>

      {groups.map(group => (
        <div key={group.title} style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 0, padding: 24, marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
            {group.title}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {group.keys.map(key => {
              const schema = SETTINGS_SCHEMA.find(s => s.key === key)!
              return (
                <div key={key} style={{ gridColumn: schema.type === 'textarea' ? '1 / -1' : undefined }}>
                  <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6 }}>
                    {schema.label}
                  </label>
                  {schema.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type={schema.type === 'number' ? 'number' : 'text'}
                      style={inputStyle}
                      value={values[key] ?? ''}
                      onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

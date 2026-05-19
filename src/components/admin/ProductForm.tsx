'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import Btn from '@/components/ui/Btn'

interface Category { id: string; name: string }
interface Variant { id?: string; name: string; value: string; price_modifier: number; stock: number; sku: string }
interface ProductImage { id?: string; url: string; is_primary: boolean; sort_order: number }

interface ProductFormProps {
  categories: Category[]
  product?: {
    id: string
    name: string
    slug: string
    description: string | null
    brand: string | null
    category_id: string | null
    price: number
    price_old: number | null
    stock: number
    sku: string | null
    weight: number | null
    is_active: boolean
    is_featured: boolean
    tags: string[]
    accent_color: string
    installments: number
    product_images: ProductImage[]
    product_variants: Variant[]
  }
}

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<ProductImage[]>(product?.product_images ?? [])
  const [variants, setVariants] = useState<Variant[]>(product?.product_variants ?? [])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(product?.tags ?? [])
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    brand: product?.brand ?? '',
    category_id: product?.category_id ?? '',
    price: String(product?.price ?? ''),
    price_old: String(product?.price_old ?? ''),
    stock: String(product?.stock ?? '0'),
    sku: product?.sku ?? '',
    weight: String(product?.weight ?? ''),
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    accent_color: product?.accent_color ?? '#cc0000',
    installments: String(product?.installments ?? '12'),
  })

  function set(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function uploadImage(file: File) {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const { url } = await res.json()
    setUploading(false)
    return url as string
  }

  async function handleImageFiles(files: FileList | null) {
    if (!files) return
    for (const file of Array.from(files)) {
      const url = await uploadImage(file)
      setImages(prev => [...prev, { url, is_primary: prev.length === 0, sort_order: prev.length }])
    }
  }

  function setPrimary(idx: number) {
    setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === idx })))
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  function addVariant() {
    setVariants(prev => [...prev, { name: '', value: '', price_modifier: 0, stock: 0, sku: '' }])
  }

  function updateVariant(idx: number, key: string, value: string | number) {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [key]: value } : v))
  }

  function removeVariant(idx: number) {
    setVariants(prev => prev.filter((_, i) => i !== idx))
  }

  function addTag() {
    const t = tagInput.trim().toUpperCase()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      price: parseFloat(form.price),
      price_old: form.price_old ? parseFloat(form.price_old) : null,
      stock: parseInt(form.stock),
      weight: form.weight ? parseFloat(form.weight) : null,
      installments: parseInt(form.installments),
      tags,
      images,
      variants,
    }

    const url = isEdit ? `/api/admin/produtos/${product.id}` : '/api/admin/produtos'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg ?? 'Erro ao salvar')
      setLoading(false)
      return
    }

    router.push('/admin/produtos')
    router.refresh()
  }

  const sectionStyle: React.CSSProperties = {
    background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, padding: 24, marginBottom: 20,
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)',
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6,
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
    color: '#fff', padding: '10px 14px', fontSize: 13, borderRadius: 2,
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 900 }}>
      {error && (
        <div style={{ background: '#1a0808', border: '1px solid #3a1a1a', color: '#f87171', padding: '12px 16px', borderRadius: 2, marginBottom: 20, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Informações básicas */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Informações Básicas
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Nome *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Slug (URL)</label>
            <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Marca</label>
            <input style={inputStyle} value={form.brand} onChange={e => set('brand', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Descrição</label>
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Categoria</label>
            <select style={{ ...inputStyle }} value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">Sem categoria</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Cor Destaque (hex)</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={form.accent_color} onChange={e => set('accent_color', e.target.value)}
                style={{ width: 40, height: 40, border: '1px solid var(--hair-strong)', borderRadius: 2, background: 'none', cursor: 'pointer' }} />
              <input style={{ ...inputStyle, flex: 1 }} value={form.accent_color} onChange={e => set('accent_color', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Preço e estoque */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Preço & Estoque
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div>
            <label style={labelStyle}>Preço (R$) *</label>
            <input type="number" step="0.01" style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} required />
          </div>
          <div>
            <label style={labelStyle}>Preço Antigo (R$)</label>
            <input type="number" step="0.01" style={inputStyle} value={form.price_old} onChange={e => set('price_old', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Estoque</label>
            <input type="number" style={inputStyle} value={form.stock} onChange={e => set('stock', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Parcelas máx.</label>
            <input type="number" style={inputStyle} value={form.installments} onChange={e => set('installments', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>SKU</label>
            <input style={inputStyle} value={form.sku} onChange={e => set('sku', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Peso (kg)</label>
            <input type="number" step="0.001" style={inputStyle} value={form.weight} onChange={e => set('weight', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Imagens */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Imagens
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 16 }}>
          {images.map((img, idx) => (
            <div key={idx} style={{
              position: 'relative', aspectRatio: '1 / 1',
              border: `2px solid ${img.is_primary ? 'var(--bg-accent)' : 'var(--hair-strong)'}`,
              borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
            }} onClick={() => setPrimary(idx)}>
              <Image src={img.url} alt="" fill style={{ objectFit: 'cover' }} />
              {img.is_primary && (
                <span style={{
                  position: 'absolute', top: 4, left: 4, background: 'var(--bg-accent)',
                  color: '#fff', fontSize: 8, padding: '2px 5px',
                  fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em',
                }}>PRINCIPAL</span>
              )}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeImage(idx) }}
                style={{
                  position: 'absolute', top: 4, right: 4, width: 22, height: 22,
                  background: 'rgba(0,0,0,0.8)', border: 0, borderRadius: 2,
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="x" size={12} />
              </button>
            </div>
          ))}

          {/* Upload button */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              aspectRatio: '1 / 1', border: '2px dashed var(--hair-strong)',
              borderRadius: 2, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer', color: 'var(--fg3)',
              background: uploading ? 'var(--surf-1)' : 'transparent',
            }}
          >
            {uploading ? (
              <span style={{ fontSize: 11 }}>Enviando...</span>
            ) : (
              <>
                <Icon name="upload" size={24} />
                <span style={{ fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Adicionar
                </span>
              </>
            )}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleImageFiles(e.target.files)} />
        <p style={{ margin: 0, fontSize: 11, color: 'var(--fg3)' }}>
          Clique na imagem para definir como principal. Formatos: JPG, PNG, WebP. Máx. 5MB por imagem.
        </p>
      </div>

      {/* Tags */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Tags
        </h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Ex: NOVO, -20%, DROP, PRÉ-VENDA..."
          />
          <button type="button" onClick={addTag} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', background: 'var(--surf-3)' }}>
            + Add
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tags.map(t => (
            <span key={t} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-accent)', color: '#fff', padding: '4px 10px',
              fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em',
            }}>
              {t}
              <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))}
                style={{ background: 'transparent', border: 0, color: '#fff', cursor: 'pointer', padding: 0, lineHeight: 1 }}>
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Variantes */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Variantes
          </h3>
          <button type="button" onClick={addVariant} style={{
            background: 'transparent', border: '1px solid var(--hair-strong)', color: '#fff',
            padding: '6px 14px', fontSize: 11, fontFamily: 'var(--font-display-heavy)',
            letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
          }}>
            + Adicionar
          </button>
        </div>
        {variants.length === 0 ? (
          <p style={{ color: 'var(--fg3)', fontSize: 12, margin: 0 }}>Sem variantes (tamanho, cor, etc.)</p>
        ) : variants.map((v, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px 100px 120px auto', gap: 10, marginBottom: 10 }}>
            <input style={inputStyle} placeholder="Nome (ex: Tamanho)" value={v.name} onChange={e => updateVariant(idx, 'name', e.target.value)} />
            <input style={inputStyle} placeholder="Valor (ex: GG)" value={v.value} onChange={e => updateVariant(idx, 'value', e.target.value)} />
            <input type="number" step="0.01" style={inputStyle} placeholder="+ Preço" value={v.price_modifier} onChange={e => updateVariant(idx, 'price_modifier', parseFloat(e.target.value))} />
            <input type="number" style={inputStyle} placeholder="Estoque" value={v.stock} onChange={e => updateVariant(idx, 'stock', parseInt(e.target.value))} />
            <input style={inputStyle} placeholder="SKU" value={v.sku} onChange={e => updateVariant(idx, 'sku', e.target.value)} />
            <button type="button" onClick={() => removeVariant(idx)} style={{ background: '#1a0808', border: '1px solid #3a1a1a', color: '#f87171', cursor: 'pointer', borderRadius: 2, padding: '0 10px' }}>
              <Icon name="trash" size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Publicação */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Publicação
        </h3>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { key: 'is_active', label: 'Produto Ativo' },
            { key: 'is_featured', label: 'Em Destaque (Home)' },
          ].map(opt => (
            <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div
                onClick={() => set(opt.key, !form[opt.key as keyof typeof form])}
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: form[opt.key as keyof typeof form] ? 'var(--bg-accent)' : 'var(--surf-4)',
                  position: 'relative', transition: 'background 200ms', cursor: 'pointer',
                  border: '1px solid var(--hair-strong)',
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, left: form[opt.key as keyof typeof form] ? 18 : 2,
                  width: 16, height: 16, borderRadius: 8, background: '#fff',
                  transition: 'left 200ms',
                }} />
              </div>
              <span style={{ fontSize: 13, color: '#fff' }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={() => router.push('/admin/produtos')} type="button">
          Cancelar
        </Btn>
        <Btn variant="primary" type="submit" disabled={loading} icon={<Icon name="save" size={16} />}>
          {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Produto'}
        </Btn>
      </div>
    </form>
  )
}

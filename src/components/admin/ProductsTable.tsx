'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import type { ProductRow } from '@/app/admin/produtos/page'

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',')
}

export default function ProductsTable({ products }: { products: ProductRow[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/admin/produtos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current }),
    })
    window.location.reload()
  }

  async function deleteProduct(id: string) {
    if (!confirm('Deletar produto? Ação irreversível.')) return
    setDeleting(id)
    await fetch(`/api/admin/produtos/${id}`, { method: 'DELETE' })
    window.location.reload()
  }

  if (products.length === 0) {
    return (
      <div style={{
        background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2,
        padding: '64px 32px', textAlign: 'center',
      }}>
        <Icon name="package2" size={40} color="var(--fg3)" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--fg3)', fontSize: 14, margin: 0 }}>Nenhum produto cadastrado</p>
        <Link href="/admin/produtos/novo" style={{ display: 'inline-block', marginTop: 16, color: 'var(--bg-accent-hot)', fontSize: 13 }}>
          + Cadastrar primeiro produto
        </Link>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--hair)' }}>
            {['Produto', 'Categoria', 'Preço', 'Estoque', 'Status', 'Ações'].map(h => (
              <th key={h} style={{
                padding: '10px 16px', textAlign: 'left',
                fontFamily: 'var(--font-display-heavy)', fontSize: 10,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--fg3)', fontWeight: 900,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const img = p.product_images?.find(i => i.is_primary)?.url ?? p.product_images?.[0]?.url
            return (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--hair)', opacity: deleting === p.id ? 0.4 : 1 }}>
                {/* Produto */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 48, height: 48, flexShrink: 0,
                      background: 'var(--surf-3)', borderRadius: 2, overflow: 'hidden',
                      position: 'relative',
                    }}>
                      {img ? (
                        <Image src={img} alt={p.name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="package2" size={20} color="var(--fg3)" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#fff', marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg3)', letterSpacing: '0.1em' }}>
                        {p.brand ?? '—'} · {p.slug}
                      </div>
                      {p.is_featured && (
                        <span style={{ fontSize: 9, background: 'var(--bg-accent)', color: '#fff', padding: '2px 6px', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em' }}>
                          DESTAQUE
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Categoria */}
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg2)' }}>
                  {(p.categories as any)?.name ?? '—'}
                </td>

                {/* Preço */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, fontWeight: 900 }}>
                    {fmt(p.price)}
                  </div>
                  {p.price_old && (
                    <div style={{ fontSize: 10, color: 'var(--fg3)', textDecoration: 'line-through' }}>
                      {fmt(p.price_old)}
                    </div>
                  )}
                </td>

                {/* Estoque */}
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: p.stock === 0 ? '#f87171' : p.stock <= 5 ? '#ffc940' : '#4cd680',
                  }}>
                    {p.stock} un.
                  </span>
                </td>

                {/* Status */}
                <td style={{ padding: '12px 16px' }}>
                  <button
                    onClick={() => toggleActive(p.id, p.is_active)}
                    style={{
                      padding: '4px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: p.is_active ? '#4cd680' : '#6b6b6b',
                      background: p.is_active ? '#0e3a1f' : '#1a1a1a',
                      border: `1px solid ${p.is_active ? '#1f9d55' : 'var(--hair-strong)'}`,
                      borderRadius: 2,
                    }}
                  >
                    {p.is_active ? 'Ativo' : 'Inativo'}
                  </button>
                </td>

                {/* Ações */}
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/admin/produtos/${p.id}/editar`} style={{
                      width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', borderRadius: 2,
                      color: '#fff', textDecoration: 'none',
                    }}>
                      <Icon name="edit" size={15} />
                    </Link>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      style={{
                        width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#1a0808', border: '1px solid #3a1a1a', borderRadius: 2,
                        color: '#f87171', cursor: 'pointer',
                      }}
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

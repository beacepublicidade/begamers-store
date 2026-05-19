'use client'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import Image from 'next/image'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

function fmtPrice(v: number) {
  return (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, zIndex: 1000,
        background: 'var(--surf-1)', borderLeft: '1px solid var(--hair)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--hair)' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Carrinho ({items.length})
          </h2>
          <button onClick={closeCart} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--hair-strong)', borderRadius: 2, color: '#fff', cursor: 'pointer' }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--fg3)' }}>
              <Icon name="cart" size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p style={{ fontSize: 14 }}>Seu carrinho está vazio</p>
              <button onClick={closeCart} style={{ marginTop: 12, color: 'var(--bg-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>
                Continuar comprando
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--hair)' }}>
                  {item.image && (
                    <div style={{ width: 64, height: 64, flexShrink: 0, position: 'relative', background: 'var(--surf-2)', borderRadius: 2, overflow: 'hidden' }}>
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain', padding: 4 }} sizes="64px" />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/produto/${item.slug}`} onClick={closeCart} style={{ fontSize: 13, fontWeight: 600, textDecoration: 'none', color: '#fff', display: 'block', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </Link>
                    <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--bg-accent-hot)', fontWeight: 700 }}>
                      {fmtPrice(item.price)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', borderRadius: 2, color: '#fff', cursor: 'pointer' }}>
                        <Icon name="minus" size={12} />
                      </button>
                      <span style={{ minWidth: 24, textAlign: 'center', fontSize: 13 }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', borderRadius: 2, color: '#fff', cursor: 'pointer' }}>
                        <Icon name="plus" size={12} />
                      </button>
                      <button onClick={() => removeItem(item.id)} style={{ marginLeft: 'auto', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0808', border: '1px solid #3a1a1a', borderRadius: 2, color: '#f87171', cursor: 'pointer' }}>
                        <Icon name="trash" size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--hair)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: 'var(--fg2)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 20 }}>{fmtPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '16px', width: '100%', background: 'var(--bg-accent)', color: '#fff',
                fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase',
                textDecoration: 'none',
                clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)',
              }}
            >
              <Icon name="shield" size={16} /> Finalizar Compra
            </Link>
            <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 11, color: 'var(--fg3)' }}>
              Frete calculado no checkout
            </p>
          </div>
        )}
      </div>
    </>
  )
}

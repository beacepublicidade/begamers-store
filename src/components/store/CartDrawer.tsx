'use client'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import Image from 'next/image'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const QTY_BTN: React.CSSProperties = {
  width: 32, height: 36, background: 'transparent',
  border: 0, color: '#fff', cursor: 'pointer',
  fontFamily: 'var(--font-display-heavy)', fontSize: 16,
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, totalItems } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const pixTotal = Math.round(total * 0.9 * 100) / 100

  return (
    <>
      {isOpen && (
        <div onClick={closeCart} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, backdropFilter: 'blur(4px)' }} />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, zIndex: 1000,
        background: 'var(--surf-1)', borderLeft: '1px solid var(--hair-strong)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 320ms var(--ease-out)',
      }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--hair)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>
                // CARRINHO · {totalItems} {totalItems === 1 ? 'ITEM' : 'ITENS'}
              </span>
              <h2 style={{ margin: '8px 0 0', fontFamily: 'var(--font-display-heavy)', fontSize: 40, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                SEU LOOTBAG.
              </h2>
            </div>
            <button onClick={closeCart} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--hair-strong)', color: '#fff', cursor: 'pointer', flexShrink: 0, marginTop: 4 }}>
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--fg3)' }}>
              <Icon name="cart" size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p style={{ fontSize: 14 }}>Seu carrinho está vazio</p>
              <button onClick={closeCart} style={{ marginTop: 12, color: 'var(--bg-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>
                Continuar comprando
              </button>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--hair)', borderTop: 'none' }}>
              {items.map((item, idx) => (
                <div key={item.id} style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr auto auto',
                  gap: 14, padding: 16, alignItems: 'center',
                  borderBottom: idx < items.length - 1 ? '1px solid var(--hair)' : 0,
                }}>
                  {/* Image */}
                  <div style={{
                    width: 80, height: 80, background: 'var(--surf-2)', position: 'relative', overflow: 'hidden', flexShrink: 0,
                  }}>
                    {item.image
                      ? <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain', padding: 4 }} sizes="80px" />
                      : <div className="placeholder-grad" style={{ width: '100%', height: '100%' }} />
                    }
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 16, color: 'var(--bg-accent-hot)' }}>
                      {fmt(item.price * item.quantity)}
                    </div>
                  </div>

                  {/* Qty */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--hair-strong)' }}>
                    <button style={QTY_BTN} onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                    <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-display-heavy)', fontSize: 14 }}>{item.quantity}</span>
                    <button style={QTY_BTN} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 0, color: 'var(--fg2)', padding: 6, cursor: 'pointer' }}>
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--hair-strong)' }}>
            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--fg2)' }}>Subtotal</span>
                <span>{fmt(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--fg2)' }}>Frete</span>
                <span style={{ color: '#4cd680' }}>Calculado no checkout</span>
              </div>
            </div>

            {/* PIX highlight */}
            <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(31,157,85,0.08)', border: '1px dashed #1f9d55', fontSize: 12, color: '#4cd680' }}>
              ⚡ <strong>{fmt(pixTotal)}</strong> no PIX (10% off)
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
              <div className="eyebrow-mono">// TOTAL</div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 32, lineHeight: 1, letterSpacing: '-0.02em' }}>{fmt(total)}</div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '16px', width: '100%', background: 'var(--bg-accent-hot)', color: '#fff',
                fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase',
                textDecoration: 'none', clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)',
              }}
            >
              <Icon name="chevR" size={18} /> Finalizar Pedido
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 11, color: 'var(--fg3)', justifyContent: 'center' }}>
              <Icon name="lock" size={12} /> Site seguro · SSL 256-bit
            </div>
          </div>
        )}
      </div>
    </>
  )
}

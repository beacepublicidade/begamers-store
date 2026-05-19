'use client'
import { useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import Icon from '@/components/ui/Icon'

interface Props {
  product: { id: string; name: string; price: number; image?: string; slug: string }
  disabled?: boolean
}

export default function AddToCartBtn({ product, disabled }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    if (disabled) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image ?? '',
      slug: product.slug,
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={disabled || added}
      style={{
        flex: 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        padding: '16px 32px',
        background: disabled ? 'var(--surf-3)' : added ? '#0e3a1f' : 'var(--bg-accent)',
        color: disabled ? 'var(--fg3)' : '#fff',
        fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
        transition: 'background 0.2s',
      }}
    >
      <Icon name={added ? 'check' : 'cart'} size={18} />
      {disabled ? 'Indisponível' : added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
    </button>
  )
}

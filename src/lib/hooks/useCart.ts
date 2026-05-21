'use client'
import { useState, useEffect, useCallback } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  slug?: string
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  total: number
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

let globalCart: CartItem[] = []
let globalIsOpen = false
let listeners: Array<() => void> = []

function notify() {
  listeners.forEach(fn => fn())
}

export function useCart(): CartStore {
  const [items, setItems] = useState<CartItem[]>(globalCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const update = () => { setItems([...globalCart]); setIsOpen(globalIsOpen) }
    listeners.push(update)
    return () => { listeners = listeners.filter(l => l !== update) }
  }, [])

  const addItem = useCallback((item: CartItem) => {
    const existing = globalCart.find(i => i.id === item.id)
    if (existing) {
      existing.quantity += item.quantity ?? 1
    } else {
      globalCart.push({ ...item, quantity: item.quantity ?? 1 })
    }
    globalIsOpen = true
    notify()
  }, [])

  const removeItem = useCallback((id: string) => {
    globalCart = globalCart.filter(i => i.id !== id)
    notify()
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      globalCart = globalCart.filter(i => i.id !== id)
    } else {
      const item = globalCart.find(i => i.id === id)
      if (item) item.quantity = qty
    }
    notify()
  }, [])

  const clearCart = useCallback(() => {
    globalCart = []
    notify()
  }, [])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return {
    items,
    totalItems,
    totalPrice,
    total: totalPrice,
    isOpen,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    openCart: () => { globalIsOpen = true; notify() },
    closeCart: () => { globalIsOpen = false; notify() },
  }
}

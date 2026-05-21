'use client'
import { useState, useEffect, useCallback } from 'react'

const KEY = 'bg_wishlist'

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setIds(JSON.parse(raw))
    } catch {}
  }, [])

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  return { ids, toggle, has, count: ids.length }
}

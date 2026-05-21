'use client'
import { useState, useEffect } from 'react'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

interface Review {
  id: string; customer_name: string; customer_email: string
  rating: number; comment: string; status: 'pending'|'published'|'rejected'
  created_at: string; products?: { name: string } | null
}

const S: Record<string, { c: string; bg: string; label: string }> = {
  pending:   { c: '#ffc940', bg: 'rgba(217,154,0,0.12)',    label: 'Pendente' },
  published: { c: '#4cd680', bg: 'rgba(31,157,85,0.12)',    label: 'Publicada' },
  rejected:  { c: '#f87171', bg: 'rgba(248,113,113,0.12)', label: 'Rejeitada' },
}

export default function AvaliacoesPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  async function load() {
    setLoading(true)
    const q = filter !== 'all' ? `?status=${filter}` : ''
    const res = await fetch(`/api/admin/avaliacoes${q}`)
    const data = await res.json()
    setReviews(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function patch(id: string, status: string) {
    await fetch(`/api/admin/avaliacoes/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    load()
  }

  async function del(id: string) {
    if (!confirm('Excluir avaliação?')) return
    await fetch(`/api/admin/avaliacoes/${id}`, { method: 'DELETE' })
    load()
  }

  const pending = reviews.filter(r => r.status === 'pending').length

  return (
    <div>
      <AdminTopbar section="OPERAÇÃO" page="AVALIAÇÕES" />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>
            Avaliações {pending > 0 && <span style={{ fontSize: 13, color: '#ffc940', fontFamily: 'var(--font-mono)' }}>({pending} pendentes)</span>}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[['all','Todas'],['pending','Pendentes'],['published','Publicadas'],['rejected','Rejeitadas']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding: '6px 14px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: filter===v ? 'var(--bg-accent)' : 'var(--surf-2)', border: `1px solid ${filter===v ? 'var(--bg-accent)' : 'var(--hair-strong)'}`, color: '#fff', cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
        {loading ? <p style={{ color: 'var(--fg3)' }}>Carregando...</p> : reviews.length === 0 ? <p style={{ color: 'var(--fg3)' }}>Nenhuma avaliação.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map(r => {
              const s = S[r.status]
              return (
                <div key={r.id} style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{r.customer_name}</span>
                        <span style={{ color: '#ffc940' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                        <span style={{ padding: '2px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg }}>{s.label}</span>
                      </div>
                      {r.products && <div style={{ fontSize: 11, color: 'var(--fg3)' }}>Produto: {r.products.name}</div>}
                      <div style={{ fontSize: 11, color: 'var(--fg3)' }}>{r.customer_email} · {new Date(r.created_at).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status !== 'published' && <button onClick={() => patch(r.id,'published')} style={{ padding: '5px 12px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#0e3a1f', border: '1px solid #1f9d55', color: '#4cd680', cursor: 'pointer' }}>Aprovar</button>}
                      {r.status !== 'rejected' && <button onClick={() => patch(r.id,'rejected')} style={{ padding: '5px 12px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: '#1a0808', border: '1px solid #3a1a1a', color: '#f87171', cursor: 'pointer' }}>Rejeitar</button>}
                      <button onClick={() => del(r.id)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0808', border: '1px solid #3a1a1a', color: '#f87171', cursor: 'pointer' }}><Icon name="trash" size={12} /></button>
                    </div>
                  </div>
                  {r.comment && <p style={{ margin: 0, fontSize: 13, color: 'var(--fg2)', lineHeight: 1.5, borderLeft: '2px solid var(--hair-strong)', paddingLeft: 12 }}>{r.comment}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

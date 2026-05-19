'use client'
import { useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import Image from 'next/image'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

type Step = 'identificacao' | 'endereco' | 'frete' | 'pagamento' | 'confirmacao'

const STEPS: { id: Step; label: string }[] = [
  { id: 'identificacao', label: 'IDENTIFICAÇÃO' },
  { id: 'endereco',      label: 'ENDEREÇO' },
  { id: 'frete',         label: 'ENTREGA' },
  { id: 'pagamento',     label: 'PAGAMENTO' },
  { id: 'confirmacao',   label: 'REVISÃO' },
]

function fmt(v: number) {
  return 'R$ ' + (v / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const INPUT: React.CSSProperties = {
  background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
  color: '#fff', padding: '12px 16px', fontSize: 14, width: '100%',
}
const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)',
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6,
}
const CONTINUE_BTN: React.CSSProperties = {
  padding: '14px 32px', background: 'var(--bg-accent)', color: '#fff', border: 'none',
  fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em',
  textTransform: 'uppercase', cursor: 'pointer',
  clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
}
const BACK_BTN: React.CSSProperties = {
  padding: '14px 24px', background: 'transparent', color: '#fff',
  border: '1px solid var(--hair-strong)',
  fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.06em',
  textTransform: 'uppercase', cursor: 'pointer',
}

function CheckoutSection({ title, done, active, pending, children }: {
  title: string; done?: boolean; active?: boolean; pending?: boolean; children?: React.ReactNode
}) {
  return (
    <section style={{
      border: active ? '2px solid var(--bg-accent-hot)' : '1px solid var(--hair-strong)',
      background: pending ? 'var(--surf-1)' : 'var(--surf-2)',
      opacity: pending ? 0.5 : 1,
      boxShadow: active ? '0 0 0 1px rgba(255,31,61,0.3), 0 0 24px rgba(255,31,61,0.15)' : 'none',
    }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: children ? '1px solid var(--hair)' : 0 }}>
        <span style={{
          width: 24, height: 24, borderRadius: 99, flexShrink: 0,
          background: done ? '#1f9d55' : (active ? 'var(--bg-accent-hot)' : 'transparent'),
          color: '#fff', border: pending ? '1px solid var(--hair-strong)' : 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display-heavy)', fontSize: 11,
        }}>
          {done ? <Icon name="check" size={12} stroke={2.5} /> : (active ? '●' : '')}
        </span>
        <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', flex: 1 }}>{title}</span>
        {done && <span style={{ fontSize: 11, color: '#4cd680' }}>OK</span>}
      </div>
      {children && <div style={{ padding: 20 }}>{children}</div>}
    </section>
  )
}

export default function CheckoutPage() {
  const { items, total, totalItems } = useCart()
  const [step, setStep] = useState<Step>('identificacao')
  const [loading, setLoading] = useState(false)

  const [customer, setCustomer] = useState({ name: '', email: '', cpf: '', phone: '' })
  const [address, setAddress] = useState({ zip: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' })
  const [shipping, setShipping] = useState<'pac' | 'sedex'>('sedex')
  const [payment, setPayment] = useState<'pix' | 'credit' | 'boleto'>('pix')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)

  const shippingCost = shipping === 'pac' ? 1590 : 2990
  const orderTotal = total - discount + shippingCost
  const pixPrice = Math.round(orderTotal * 0.9)

  const currentIdx = STEPS.findIndex(s => s.id === step)

  function isDone(id: Step) { return currentIdx > STEPS.findIndex(s => s.id === id) }
  function isActive(id: Step) { return step === id }
  function isPending(id: Step) { return currentIdx < STEPS.findIndex(s => s.id === id) }

  function next() {
    const next = STEPS[currentIdx + 1]
    if (next) setStep(next.id)
  }

  async function applyCoupon() {
    if (!couponCode) return
    const res = await fetch('/api/coupon/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, total }),
    })
    if (res.ok) {
      const data = await res.json()
      setDiscount(data.discount)
      setCouponApplied(true)
    }
  }

  async function placeOrder() {
    setLoading(true)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        address,
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price, product_name: i.name })),
        shipping_method: shipping,
        shipping_cost: shippingCost,
        payment_method: payment,
        coupon_code: couponCode || null,
        discount,
        subtotal: total,
        total: orderTotal,
      }),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      if (data.payment_url) window.location.href = data.payment_url
      else setStep('confirmacao')
    }
  }

  if (items.length === 0 && step !== 'confirmacao') {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <Icon name="cart" size={64} style={{ marginBottom: 24, opacity: 0.3 }} />
        <h1 style={{ fontFamily: 'var(--font-display-heavy)', textTransform: 'uppercase', marginBottom: 16 }}>Carrinho vazio</h1>
        <Link href="/produtos" style={{ color: 'var(--bg-accent)', textDecoration: 'none', fontSize: 14 }}>Ver produtos →</Link>
      </div>
    )
  }

  if (step === 'confirmacao') {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#0e3a1f', border: '2px solid #1f9d55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <Icon name="check" size={40} style={{ color: '#4cd680' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 12 }}>Pedido Realizado!</h1>
        <p style={{ color: 'var(--fg2)', marginBottom: 32, lineHeight: 1.7, fontSize: 15 }}>
          Você receberá um e-mail em <strong style={{ color: '#fff' }}>{customer.email}</strong> com os detalhes do pedido.
        </p>
        <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-accent)', color: '#fff', padding: '14px 32px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}>
          Continuar Comprando
        </Link>
        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--fg3)' }}>Você receberá um e-mail com os detalhes do pedido em breve.</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', color: '#fff' }}>
      {/* Minimal checkout header */}
      <header style={{ background: '#000', borderBottom: '1px solid var(--hair-strong)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 20, letterSpacing: '0.04em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff' }}>
            <span style={{ color: 'var(--bg-accent)' }}>BE</span>GAMERS STORE
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#4cd680', fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
            <Icon name="lock" size={14} color="#4cd680" /> CHECKOUT SEGURO · SSL 256-BIT
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 64px' }}>

        {/* Steps bar */}
        <div style={{ display: 'flex', marginBottom: 32, background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{
              flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10,
              background: i === currentIdx ? 'var(--bg-accent)' : 'transparent',
              borderRight: i < STEPS.length - 1 ? '1px solid var(--hair)' : 0,
              opacity: i > currentIdx ? 0.5 : 1,
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: 99, flexShrink: 0,
                background: i < currentIdx ? '#1f9d55' : (i === currentIdx ? '#fff' : 'transparent'),
                color: i < currentIdx ? '#000' : (i === currentIdx ? 'var(--bg-accent)' : 'var(--fg2)'),
                border: i >= currentIdx && i !== currentIdx ? '1px solid var(--hair-strong)' : 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display-heavy)', fontSize: 11,
              }}>
                {i < currentIdx ? <Icon name="check" size={11} stroke={2.5} /> : (i + 1)}
              </span>
              <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.08em' }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

          {/* Left: steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Identificação */}
            <CheckoutSection title="Identificação" done={isDone('identificacao')} active={isActive('identificacao')} pending={isPending('identificacao')}>
              {isActive('identificacao') && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={LABEL}>Nome Completo</label>
                      <input className="bg-input" style={INPUT} value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={LABEL}>E-mail</label>
                      <input className="bg-input" type="email" style={INPUT} value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))} />
                    </div>
                    <div>
                      <label style={LABEL}>CPF</label>
                      <input className="bg-input" style={INPUT} value={customer.cpf} onChange={e => setCustomer(c => ({ ...c, cpf: e.target.value }))} placeholder="000.000.000-00" />
                    </div>
                    <div>
                      <label style={LABEL}>Telefone</label>
                      <input className="bg-input" style={INPUT} value={customer.phone} onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))} placeholder="(11) 9 0000-0000" />
                    </div>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <button onClick={next} disabled={!customer.name || !customer.email} style={CONTINUE_BTN}>Continuar →</button>
                  </div>
                </div>
              )}
              {isDone('identificacao') && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--fg2)' }}>
                  <span>{customer.email} · {customer.name}</span>
                  <button onClick={() => setStep('identificacao')} style={{ background: 'none', border: 0, color: 'var(--fg2)', cursor: 'pointer', fontSize: 11, textDecoration: 'underline' }}>Trocar</button>
                </div>
              )}
            </CheckoutSection>

            {/* Endereço */}
            <CheckoutSection title="Endereço de entrega" done={isDone('endereco')} active={isActive('endereco')} pending={isPending('endereco')}>
              {isActive('endereco') && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={LABEL}>CEP</label>
                      <input className="bg-input" style={INPUT} value={address.zip} onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))} placeholder="00000-000" />
                    </div>
                    <div />
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={LABEL}>Rua / Logradouro</label>
                      <input className="bg-input" style={INPUT} value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
                    </div>
                    <div>
                      <label style={LABEL}>Número</label>
                      <input className="bg-input" style={INPUT} value={address.number} onChange={e => setAddress(a => ({ ...a, number: e.target.value }))} />
                    </div>
                    <div>
                      <label style={LABEL}>Complemento</label>
                      <input className="bg-input" style={INPUT} value={address.complement} onChange={e => setAddress(a => ({ ...a, complement: e.target.value }))} placeholder="Apto, bloco..." />
                    </div>
                    <div>
                      <label style={LABEL}>Bairro</label>
                      <input className="bg-input" style={INPUT} value={address.neighborhood} onChange={e => setAddress(a => ({ ...a, neighborhood: e.target.value }))} />
                    </div>
                    <div>
                      <label style={LABEL}>Cidade</label>
                      <input className="bg-input" style={INPUT} value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                    </div>
                    <div>
                      <label style={LABEL}>Estado</label>
                      <input className="bg-input" style={INPUT} value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} placeholder="SP" maxLength={2} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button onClick={() => setStep('identificacao')} style={BACK_BTN}>← Voltar</button>
                    <button onClick={next} disabled={!address.zip || !address.street || !address.number} style={CONTINUE_BTN}>Continuar →</button>
                  </div>
                </div>
              )}
              {isDone('endereco') && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: 13 }}>
                  <div style={{ color: 'var(--fg2)', lineHeight: 1.5 }}>
                    {address.street}, {address.number}{address.complement ? `, ${address.complement}` : ''} · {address.neighborhood}<br />
                    {address.city} / {address.state} — {address.zip}
                  </div>
                  <button onClick={() => setStep('endereco')} style={{ background: 'none', border: 0, color: 'var(--fg2)', cursor: 'pointer', fontSize: 11, textDecoration: 'underline' }}>Trocar</button>
                </div>
              )}
            </CheckoutSection>

            {/* Frete */}
            <CheckoutSection title="Opção de entrega" done={isDone('frete')} active={isActive('frete')} pending={isPending('frete')}>
              {isActive('frete') && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { id: 'sedex', label: 'SEDEX', desc: 'Entrega em 2-4 dias úteis', price: 2990 },
                      { id: 'pac',   label: 'PAC',   desc: 'Entrega em 8-12 dias úteis', price: 1590 },
                    ].map(opt => (
                      <label key={opt.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer',
                        background: shipping === opt.id ? 'rgba(255,31,61,0.06)' : 'var(--surf-1)',
                        border: shipping === opt.id ? '2px solid var(--bg-accent-hot)' : '1px solid var(--hair-strong)',
                      }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: 99, flexShrink: 0,
                          border: '2px solid var(--bg-accent-hot)',
                          background: shipping === opt.id ? 'var(--bg-accent-hot)' : 'transparent',
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.06em' }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--fg2)', marginTop: 2 }}>{opt.desc}</div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 14 }}>{fmt(opt.price)}</span>
                        <input type="radio" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id as any)} style={{ display: 'none' }} />
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button onClick={() => setStep('endereco')} style={BACK_BTN}>← Voltar</button>
                    <button onClick={next} style={CONTINUE_BTN}>Continuar →</button>
                  </div>
                </div>
              )}
              {isDone('frete') && (
                <div style={{ fontSize: 13, color: 'var(--fg2)' }}>
                  {shipping.toUpperCase()} · {fmt(shippingCost)}
                </div>
              )}
            </CheckoutSection>

            {/* Pagamento */}
            <CheckoutSection title="Pagamento" done={isDone('pagamento')} active={isActive('pagamento')} pending={isPending('pagamento')}>
              {isActive('pagamento') && (
                <div>
                  {/* Methods grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                    {[
                      { id: 'pix',    label: 'PIX',    sub: '10% off · imediato', c: '#4cd680' },
                      { id: 'credit', label: 'CARTÃO', sub: 'Até 12x s/ juros',   c: undefined },
                      { id: 'boleto', label: 'BOLETO', sub: 'Vence em 3 dias',    c: undefined },
                    ].map(m => (
                      <button key={m.id} onClick={() => setPayment(m.id as any)} style={{
                        padding: 16, textAlign: 'left', cursor: 'pointer',
                        background: payment === m.id ? 'rgba(255,31,61,0.08)' : 'var(--surf-1)',
                        border: payment === m.id ? '2px solid var(--bg-accent-hot)' : '1px solid var(--hair-strong)',
                        color: '#fff',
                        boxShadow: payment === m.id ? '0 0 0 1px rgba(255,31,61,0.3), 0 0 24px rgba(255,31,61,0.15)' : 'none',
                      }}>
                        <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 16, letterSpacing: '0.06em' }}>{m.label}</div>
                        <div style={{ fontSize: 11, color: m.c ?? 'var(--fg2)', marginTop: 4 }}>{m.sub}</div>
                      </button>
                    ))}
                  </div>

                  {/* PIX info */}
                  {payment === 'pix' && (
                    <div style={{ padding: 20, background: 'rgba(31,157,85,0.06)', border: '1px solid #1f9d55', marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Icon name="bolt" size={20} color="#4cd680" />
                        <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 18, color: '#4cd680' }}>10% OFF NO PIX</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 36, lineHeight: 1 }}>{fmt(pixPrice)}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg2)', marginTop: 6 }}>
                        Economia de {fmt(orderTotal - pixPrice)} pagando no PIX
                      </div>
                      <p style={{ margin: '12px 0 0', fontSize: 12, color: '#4cd680', lineHeight: 1.5 }}>
                        ⚡ Após confirmar, um QR Code PIX será gerado automaticamente. Pedido processado imediatamente.
                      </p>
                    </div>
                  )}

                  {/* Coupon */}
                  <div style={{ marginBottom: 20, padding: 16, border: '1px solid var(--hair)', background: 'var(--surf-1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em' }}>CUPOM DE DESCONTO</span>
                      <Icon name="bolt" size={14} color="var(--bg-accent-hot)" />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input className="bg-input" placeholder="DIGITA AÊ" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }} />
                      <button onClick={applyCoupon} style={{ padding: '0 20px', background: 'transparent', border: '1px solid var(--hair-strong)', color: '#fff', fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.06em', cursor: 'pointer' }}>Aplicar</button>
                    </div>
                    {couponApplied && discount > 0 && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(31,157,85,0.1)', border: '1px solid #1f9d55', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#4cd680' }}>
                        <Icon name="check" size={12} stroke={2.5} /> {couponCode} aplicado · −{fmt(discount)}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setStep('frete')} style={BACK_BTN}>← Voltar</button>
                    <button onClick={placeOrder} disabled={loading} style={{ ...CONTINUE_BTN, flex: 1, padding: '16px' }}>
                      {loading ? 'Processando...' : `Confirmar Pedido — ${fmt(payment === 'pix' ? pixPrice : orderTotal)}`}
                    </button>
                  </div>
                </div>
              )}
            </CheckoutSection>

            {/* Revisão */}
            <CheckoutSection title="Revisão do pedido" pending={isPending('confirmacao')} />
          </div>

          {/* Summary sidebar */}
          <aside>
            <div style={{ position: 'sticky', top: 24, border: '1px solid var(--hair-strong)', background: 'var(--surf-2)' }}>
              <div style={{ padding: 20, borderBottom: '1px solid var(--hair)' }}>
                <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)' }}>// SEU PEDIDO</span>
                <h3 style={{ margin: '10px 0 0', fontFamily: 'var(--font-display-heavy)', fontSize: 18, textTransform: 'uppercase' }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                </h3>
              </div>

              {/* Mini items */}
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--hair)' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, background: 'var(--surf-3)', position: 'relative', overflow: 'hidden' }}>
                      {item.image
                        ? <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain', padding: 3 }} sizes="44px" />
                        : <div className="placeholder-grad" style={{ width: '100%', height: '100%' }} />
                      }
                      <span style={{ position: 'absolute', top: -5, right: -5, width: 18, height: 18, borderRadius: 99, background: 'var(--bg-accent)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.3, color: 'var(--fg2)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 13, flexShrink: 0 }}>
                      {fmt(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Subtotal', fmt(total)],
                  ...(discount > 0 ? [['Cupom ' + couponCode, '−' + fmt(discount), '#4cd680']] : []),
                  ['Frete ' + shipping.toUpperCase(), fmt(shippingCost), undefined],
                ].map(([k, v, c]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--fg2)' }}>{k}</span>
                    <span style={{ color: (c as string) || '#fff', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Total / PIX */}
              <div style={{ borderTop: '1px solid var(--hair-strong)', padding: 20 }}>
                {payment === 'pix' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div className="eyebrow-mono">// PIX</div>
                      <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 36, color: '#4cd680', lineHeight: 1 }}>{fmt(pixPrice)}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg2)', textAlign: 'right', marginTop: 4 }}>
                      De {fmt(orderTotal)} · economia de {fmt(orderTotal - pixPrice)}
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div className="eyebrow-mono">// TOTAL</div>
                    <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 36, lineHeight: 1 }}>{fmt(orderTotal)}</div>
                  </div>
                )}
                <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(31,157,85,0.08)', border: '1px dashed #1f9d55', fontSize: 12, color: '#4cd680' }}>
                  ⚡ <strong>{fmt(pixPrice)}</strong> no PIX (10% off)
                </div>
              </div>

              <div style={{ padding: 20, paddingTop: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--fg3)', justifyContent: 'center' }}>
                  <Icon name="lock" size={12} /> Site seguro · SSL 256-bit
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}

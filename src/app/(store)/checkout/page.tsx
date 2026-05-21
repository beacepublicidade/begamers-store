'use client'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import Image from 'next/image'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

type Step = 'identificacao' | 'endereco' | 'frete' | 'pagamento' | 'confirmacao'
type PayMethod = 'pix' | 'credit' | 'boleto'

const STEPS: { id: Step; label: string }[] = [
  { id: 'identificacao', label: 'IDENTIFICAÇÃO' },
  { id: 'endereco',      label: 'ENDEREÇO' },
  { id: 'frete',         label: 'ENTREGA' },
  { id: 'pagamento',     label: 'PAGAMENTO' },
  { id: 'confirmacao',   label: 'REVISÃO' },
]

function fmt(v: number) {
  return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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

function detectCardBrand(number: string): string {
  const n = number.replace(/\s/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'master'
  if (/^3[47]/.test(n)) return 'amex'
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011)/.test(n)) return 'elo'
  return 'visa'
}

function CardInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label style={LABEL}>{label}</label>
      <input className="bg-input" style={INPUT} {...props} />
    </div>
  )
}

export default function CheckoutPage() {
  const { items, total, totalItems, clearCart, removeItem } = useCart()
  const [step, setStep] = useState<Step>('identificacao')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [customer, setCustomer] = useState({ name: '', email: '', cpf: '', phone: '' })
  const [address, setAddress] = useState({ zip: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' })
  const [shipping, setShipping] = useState<'pac' | 'sedex'>('sedex')
  const [payment, setPayment] = useState<PayMethod>('pix')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [freeShipping, setFreeShipping] = useState(false)
  const [installments, setInstallments] = useState(1)

  // Card form
  const [cardData, setCardData] = useState({ number: '', holder: '', expMonth: '', expYear: '', cvv: '' })
  const [showCardForm, setShowCardForm] = useState(false)

  // PIX QR state
  const [pixQR, setPixQR] = useState<{ br_code: string; orderId: string; orderNumber: string } | null>(null)
  const [pixPaid, setPixPaid] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Order result
  const [orderResult, setOrderResult] = useState<{ orderNumber: string; email: string } | null>(null)

  const shippingCost = freeShipping ? 0 : shipping === 'pac' ? 15.90 : 29.90
  const orderTotal = total - discount + shippingCost
  const pixPrice = Math.round(orderTotal * 0.9)

  const currentIdx = STEPS.findIndex(s => s.id === step)
  function isDone(id: Step) { return currentIdx > STEPS.findIndex(s => s.id === id) }
  function isActive(id: Step) { return step === id }
  function isPending(id: Step) { return currentIdx < STEPS.findIndex(s => s.id === id) }
  function next() { const n = STEPS[currentIdx + 1]; if (n) setStep(n.id) }

  // Load Mercado Pago SDK
  useEffect(() => {
    if ((window as any).MercadoPago) return
    const s = document.createElement('script')
    s.src = 'https://sdk.mercadopago.com/js/v2'
    document.head.appendChild(s)
  }, [])

  // Stop polling on unmount
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  function startPixPolling(orderId: string, orderNumber: string) {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkout/status/${orderId}`)
        const data = await res.json()
        if (data.paid) {
          clearInterval(pollRef.current!)
          setPixPaid(true)
          setOrderResult({ orderNumber, email: customer.email })
          clearCart?.()
          setTimeout(() => setStep('confirmacao'), 1500)
        }
      } catch { /* ignore */ }
    }, 3000)
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
      setDiscount(data.discount ?? 0)
      setCouponApplied(true)
      if (data.free_shipping) setFreeShipping(true)
    }
  }

  async function placeOrder(cardToken?: string, cardBrand?: string) {
    setLoading(true)
    setError(null)
    const finalAmount = payment === 'pix' ? pixPrice : orderTotal
    try {
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
          total: finalAmount,
          card_token: cardToken,
          card_payment_method_id: cardBrand,
          installments,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro ao processar pedido')

      if (data.payment_url) {
        window.location.href = data.payment_url
        return
      }

      if (data.br_code) {
        setPixQR({ br_code: data.br_code, orderId: data.order_id, orderNumber: data.order_number })
        startPixPolling(data.order_id, data.order_number)
        return
      }

      // Card approved or confirmed
      setOrderResult({ orderNumber: data.order_number, email: customer.email })
      clearCart?.()
      setStep('confirmacao')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCardSubmit() {
    setLoading(true)
    setError(null)
    try {
      const MPClass = (window as any).MercadoPago
      if (!MPClass) throw new Error('SDK de pagamento não carregado. Aguarde e tente novamente.')
      const mp = new MPClass(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, { locale: 'pt-BR' })
      const result = await mp.createCardToken({
        cardNumber: cardData.number.replace(/\s/g, ''),
        cardholderName: cardData.holder.toUpperCase(),
        cardExpirationMonth: cardData.expMonth.padStart(2, '0'),
        cardExpirationYear: cardData.expYear.length === 2 ? '20' + cardData.expYear : cardData.expYear,
        securityCode: cardData.cvv,
        identificationType: 'CPF',
        identificationNumber: customer.cpf.replace(/\D/g, ''),
      })
      if (!result?.id) throw new Error('Falha ao processar dados do cartão')
      await placeOrder(result.id, detectCardBrand(cardData.number))
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
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
    const num = orderResult?.orderNumber ?? ''
    const email = orderResult?.email ?? customer.email
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#0e3a1f', border: '2px solid #1f9d55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <Icon name="check" size={40} style={{ color: '#4cd680' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 12 }}>Pedido Realizado!</h1>
        {num && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bg-accent-hot)', marginBottom: 8 }}>// PEDIDO #{num}</p>}
        <p style={{ color: 'var(--fg2)', marginBottom: 32, lineHeight: 1.7, fontSize: 15 }}>
          Você receberá um e-mail em <strong style={{ color: '#fff' }}>{email}</strong> com os detalhes do pedido.
        </p>
        <Link href="/produtos" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-accent)', color: '#fff', padding: '14px 32px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}>
          Continuar Comprando
        </Link>
      </div>
    )
  }

  return (
    <div style={{ background: '#000', color: '#fff' }}>
      <header style={{ background: '#000', borderBottom: '1px solid var(--hair-strong)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/">
            <Image src="/images/logo-white.png" alt="BeGamers Store" width={140} height={36} style={{ objectFit: 'contain' }} />
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
                      { id: 'sedex', label: 'SEDEX', desc: 'Entrega em 2-4 dias úteis', price: 29.90 },
                      { id: 'pac',   label: 'PAC',   desc: 'Entrega em 8-12 dias úteis', price: 15.90 },
                    ].map(opt => (
                      <label key={opt.id} style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer',
                        background: shipping === opt.id ? 'rgba(255,31,61,0.06)' : 'var(--surf-1)',
                        border: shipping === opt.id ? '2px solid var(--bg-accent-hot)' : '1px solid var(--hair-strong)',
                      }}>
                        <span style={{ width: 18, height: 18, borderRadius: 99, flexShrink: 0, border: '2px solid var(--bg-accent-hot)', background: shipping === opt.id ? 'var(--bg-accent-hot)' : 'transparent' }} />
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
                <div style={{ fontSize: 13, color: 'var(--fg2)' }}>{shipping.toUpperCase()} · {fmt(shippingCost)}</div>
              )}
            </CheckoutSection>

            {/* Pagamento */}
            <CheckoutSection title="Pagamento" done={isDone('pagamento')} active={isActive('pagamento')} pending={isPending('pagamento')}>
              {isActive('pagamento') && (
                <div>
                  {/* ── PIX QR CODE INLINE ── */}
                  {pixQR ? (
                    <div style={{ textAlign: 'center' }}>
                      {pixPaid ? (
                        <div style={{ padding: 40 }}>
                          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#0e3a1f', border: '2px solid #1f9d55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Icon name="check" size={32} style={{ color: '#4cd680' }} />
                          </div>
                          <p style={{ color: '#4cd680', fontFamily: 'var(--font-display-heavy)', fontSize: 18 }}>PAGAMENTO CONFIRMADO!</p>
                          <p style={{ color: 'var(--fg2)', fontSize: 13 }}>Redirecionando...</p>
                        </div>
                      ) : (
                        <>
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 4 }}>
                              <Icon name="bolt" size={16} color="#4cd680" />
                              <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 16, color: '#4cd680' }}>
                                PAGUE {fmt(pixPrice)} NO PIX
                              </span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--fg2)' }}>QR Code válido por 30 minutos</p>
                          </div>

                          {/* QR Code image via public API */}
                          <div style={{ display: 'inline-block', padding: 16, background: '#fff', marginBottom: 20 }}>
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixQR.br_code)}&bgcolor=ffffff&color=000000`}
                              alt="QR Code PIX"
                              width={220}
                              height={220}
                            />
                          </div>

                          {/* Copy & paste */}
                          <div style={{ marginBottom: 20, padding: '12px 16px', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)', textAlign: 'left' }}>
                            <div style={{ fontSize: 10, color: 'var(--fg3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>// PIX COPIA E COLA</div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <code style={{ flex: 1, fontSize: 10, color: 'var(--fg2)', wordBreak: 'break-all', lineHeight: 1.4 }}>
                                {pixQR.br_code.slice(0, 60)}...
                              </code>
                              <button
                                onClick={() => navigator.clipboard.writeText(pixQR.br_code)}
                                style={{ padding: '8px 12px', background: 'var(--bg-accent)', color: '#fff', border: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.06em', cursor: 'pointer', flexShrink: 0 }}
                              >
                                COPIAR
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: 'var(--fg3)', fontSize: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4cd680', animation: 'pulse 1.5s ease-in-out infinite' }} />
                            Aguardando pagamento...
                          </div>
                        </>
                      )}
                    </div>
                  ) : showCardForm ? (
                    /* ── FORMULÁRIO CARTÃO INLINE ── */
                    <div>
                      <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(255,31,61,0.06)', border: '1px solid var(--bg-accent-hot)', fontSize: 13, color: 'var(--fg2)' }}>
                        <Icon name="lock" size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                        Dados criptografados · PCI DSS compliance
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <CardInput
                            label="Número do Cartão"
                            value={cardData.number}
                            onChange={e => setCardData(d => ({ ...d, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19) }))}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <CardInput
                            label="Nome no Cartão"
                            value={cardData.holder}
                            onChange={e => setCardData(d => ({ ...d, holder: e.target.value.toUpperCase() }))}
                            placeholder="NOME COMO NO CARTÃO"
                          />
                        </div>
                        <div>
                          <label style={LABEL}>Validade</label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input className="bg-input" style={{ ...INPUT, width: '50%' }} placeholder="MM" maxLength={2} value={cardData.expMonth} onChange={e => setCardData(d => ({ ...d, expMonth: e.target.value.replace(/\D/g, '') }))} />
                            <input className="bg-input" style={{ ...INPUT, width: '50%' }} placeholder="AA" maxLength={2} value={cardData.expYear} onChange={e => setCardData(d => ({ ...d, expYear: e.target.value.replace(/\D/g, '') }))} />
                          </div>
                        </div>
                        <div>
                          <CardInput
                            label="CVV"
                            value={cardData.cvv}
                            onChange={e => setCardData(d => ({ ...d, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            placeholder="000"
                            maxLength={4}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={LABEL}>Parcelamento</label>
                          <select
                            className="bg-input"
                            style={{ ...INPUT, cursor: 'pointer' }}
                            value={installments}
                            onChange={e => setInstallments(Number(e.target.value))}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(n => {
                              const v = Math.round(orderTotal / n)
                              return <option key={n} value={n}>{n}x de {fmt(v)}{n > 1 ? ' sem juros' : ''}</option>
                            })}
                          </select>
                        </div>
                      </div>
                      {error && (
                        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,31,61,0.1)', border: '1px solid var(--bg-accent-hot)', fontSize: 13, color: '#ff6b6b' }}>
                          {error}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button onClick={() => setShowCardForm(false)} style={BACK_BTN}>← Voltar</button>
                        <button
                          onClick={handleCardSubmit}
                          disabled={loading || !cardData.number || !cardData.holder || !cardData.expMonth || !cardData.expYear || !cardData.cvv}
                          style={{ ...CONTINUE_BTN, flex: 1, padding: '16px' }}
                        >
                          {loading ? 'Processando...' : `Pagar ${fmt(orderTotal)}`}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── SELEÇÃO DO MÉTODO DE PAGAMENTO ── */
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                        {[
                          { id: 'pix',    label: 'PIX',    sub: '10% off · imediato', c: '#4cd680' },
                          { id: 'credit', label: 'CARTÃO', sub: 'Até 12x s/ juros',   c: undefined },
                          { id: 'boleto', label: 'BOLETO', sub: 'Vence em 3 dias',    c: undefined },
                        ].map(m => (
                          <button key={m.id} onClick={() => setPayment(m.id as PayMethod)} style={{
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
                            ⚡ QR Code PIX gerado aqui mesmo. Pedido processado imediatamente ao pagar.
                          </p>
                        </div>
                      )}

                      {/* Cupom */}
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

                      {error && (
                        <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(255,31,61,0.1)', border: '1px solid var(--bg-accent-hot)', fontSize: 13, color: '#ff6b6b' }}>
                          {error}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => setStep('frete')} style={BACK_BTN}>← Voltar</button>
                        <button
                          onClick={() => {
                            if (payment === 'credit') {
                              setShowCardForm(true)
                            } else {
                              placeOrder()
                            }
                          }}
                          disabled={loading}
                          style={{ ...CONTINUE_BTN, flex: 1, padding: '16px' }}
                        >
                          {loading ? 'Processando...' : payment === 'pix'
                            ? `Gerar QR PIX — ${fmt(pixPrice)}`
                            : payment === 'credit'
                            ? `Pagar com Cartão — ${fmt(orderTotal)}`
                            : `Confirmar Pedido — ${fmt(orderTotal)}`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CheckoutSection>

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

              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--hair)' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto auto', gap: 10, alignItems: 'center' }}>
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
                    <button onClick={() => removeItem(item.id)} title="Remover" style={{ background: 'transparent', border: 0, color: 'var(--fg3)', cursor: 'pointer', padding: 2, lineHeight: 1, fontSize: 14 }}>×</button>
                  </div>
                ))}
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Subtotal', fmt(total)],
                  ...(discount > 0 ? [['Cupom ' + couponCode, '−' + fmt(discount), '#4cd680']] : []),
                  ['Frete ' + shipping.toUpperCase(), fmt(shippingCost), undefined],
                ].map(([k, v, c]) => (
                  <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--fg2)' }}>{k}</span>
                    <span style={{ color: (c as string) || '#fff', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

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

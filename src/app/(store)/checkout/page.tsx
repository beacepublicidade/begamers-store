'use client'
import { useState } from 'react'
import { useCart } from '@/lib/hooks/useCart'
import Image from 'next/image'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

type Step = 'identificacao' | 'endereco' | 'frete' | 'pagamento' | 'confirmacao'

const STEPS: { id: Step; label: string }[] = [
  { id: 'identificacao', label: 'Identificação' },
  { id: 'endereco',      label: 'Endereço' },
  { id: 'frete',         label: 'Frete' },
  { id: 'pagamento',     label: 'Pagamento' },
  { id: 'confirmacao',   label: 'Confirmação' },
]

function fmtPrice(v: number) {
  return (v / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const inputStyle: React.CSSProperties = {
  background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
  color: '#fff', padding: '12px 16px', fontSize: 14, borderRadius: 2, width: '100%',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontFamily: 'var(--font-display-heavy)',
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 6,
}

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [step, setStep] = useState<Step>('identificacao')
  const [loading, setLoading] = useState(false)

  const [customer, setCustomer] = useState({ name: '', email: '', cpf: '', phone: '' })
  const [address, setAddress] = useState({ zip: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' })
  const [shipping, setShipping] = useState<'pac' | 'sedex'>('pac')
  const [payment, setPayment] = useState<'pix' | 'credit'>('pix')
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const shippingCost = shipping === 'pac' ? 1590 : 2990
  const pixDiscount = payment === 'pix' ? Math.round(total * 0.05) : 0
  const orderTotal = total - discount - pixDiscount + shippingCost

  const currentIdx = STEPS.findIndex(s => s.id === step)

  function next() {
    const nextStep = STEPS[currentIdx + 1]
    if (nextStep) setStep(nextStep.id)
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
    if (res.ok) setStep('confirmacao')
  }

  if (items.length === 0 && step !== 'confirmacao') {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <Icon name="cart" size={64} style={{ marginBottom: 24, opacity: 0.3 }} />
        <h1 style={{ fontFamily: 'var(--font-display-heavy)', textTransform: 'uppercase', marginBottom: 16 }}>Carrinho vazio</h1>
        <Link href="/produtos" style={{ color: 'var(--bg-accent)', textDecoration: 'none', fontSize: 14 }}>
          Ver produtos →
        </Link>
      </div>
    )
  }

  if (step === 'confirmacao') {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#0e3a1f', border: '2px solid #1f9d55', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Icon name="check" size={36} style={{ color: '#4cd680' }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase', marginBottom: 12 }}>Pedido Realizado!</h1>
        <p style={{ color: 'var(--fg2)', marginBottom: 32, lineHeight: 1.6 }}>
          Você receberá um email de confirmação em <strong>{customer.email}</strong> com os detalhes do seu pedido.
        </p>
        <Link href="/produtos" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-accent)', color: '#fff', padding: '14px 28px',
          fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
          textDecoration: 'none', clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
        }}>
          Continuar Comprando
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ margin: '0 0 32px', fontFamily: 'var(--font-display-heavy)', fontSize: 24, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        Checkout
      </h1>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {STEPS.slice(0, 4).map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < currentIdx ? '#0e3a1f' : i === currentIdx ? 'var(--bg-accent)' : 'var(--surf-2)',
                border: `1px solid ${i < currentIdx ? '#1f9d55' : i === currentIdx ? 'var(--bg-accent)' : 'var(--hair-strong)'}`,
                color: i <= currentIdx ? '#fff' : 'var(--fg3)', fontSize: 12, fontFamily: 'var(--font-display-heavy)', flexShrink: 0,
              }}>
                {i < currentIdx ? <Icon name="check" size={12} /> : i + 1}
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase', color: i === currentIdx ? '#fff' : 'var(--fg3)', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 1, background: 'var(--hair)', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
        {/* Form */}
        <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, padding: 28 }}>

          {step === 'identificacao' && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Seus Dados</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Nome Completo</label>
                  <input style={inputStyle} value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" style={inputStyle} value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>CPF</label>
                  <input style={inputStyle} value={customer.cpf} onChange={e => setCustomer(c => ({ ...c, cpf: e.target.value }))} placeholder="000.000.000-00" />
                </div>
                <div>
                  <label style={labelStyle}>Telefone</label>
                  <input style={inputStyle} value={customer.phone} onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))} placeholder="(11) 9 0000-0000" />
                </div>
              </div>
              <button onClick={next} disabled={!customer.name || !customer.email} style={{ marginTop: 24, padding: '14px 32px', background: 'var(--bg-accent)', color: '#fff', border: 'none', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}>
                Continuar →
              </button>
            </div>
          )}

          {step === 'endereco' && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Endereço de Entrega</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>CEP</label>
                  <input style={inputStyle} value={address.zip} onChange={e => setAddress(a => ({ ...a, zip: e.target.value }))} placeholder="00000-000" />
                </div>
                <div />
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Rua / Logradouro</label>
                  <input style={inputStyle} value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Número</label>
                  <input style={inputStyle} value={address.number} onChange={e => setAddress(a => ({ ...a, number: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Complemento</label>
                  <input style={inputStyle} value={address.complement} onChange={e => setAddress(a => ({ ...a, complement: e.target.value }))} placeholder="Apto, bloco..." />
                </div>
                <div>
                  <label style={labelStyle}>Bairro</label>
                  <input style={inputStyle} value={address.neighborhood} onChange={e => setAddress(a => ({ ...a, neighborhood: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Cidade</label>
                  <input style={inputStyle} value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Estado</label>
                  <input style={inputStyle} value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} placeholder="SP" maxLength={2} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setStep('identificacao')} style={{ padding: '14px 24px', background: 'var(--surf-3)', color: '#fff', border: '1px solid var(--hair-strong)', fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
                  ← Voltar
                </button>
                <button onClick={next} disabled={!address.zip || !address.street || !address.number} style={{ padding: '14px 32px', background: 'var(--bg-accent)', color: '#fff', border: 'none', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {step === 'frete' && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Opção de Frete</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'pac', label: 'PAC', desc: 'Entrega em 8-12 dias úteis', price: 1590 },
                  { id: 'sedex', label: 'SEDEX', desc: 'Entrega em 2-4 dias úteis', price: 2990 },
                ].map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: shipping === opt.id ? '#0a1628' : 'var(--surf-1)', border: `1px solid ${shipping === opt.id ? '#1e40af' : 'var(--hair-strong)'}`, borderRadius: 2, cursor: 'pointer' }}>
                    <input type="radio" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id as any)} style={{ accentColor: 'var(--bg-accent)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em' }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 2 }}>{opt.desc}</div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{fmtPrice(opt.price)}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setStep('endereco')} style={{ padding: '14px 24px', background: 'var(--surf-3)', color: '#fff', border: '1px solid var(--hair-strong)', fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
                  ← Voltar
                </button>
                <button onClick={next} style={{ padding: '14px 32px', background: 'var(--bg-accent)', color: '#fff', border: 'none', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)' }}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {step === 'pagamento' && (
            <div>
              <h2 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Forma de Pagamento</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[
                  { id: 'pix', label: 'PIX', desc: '5% de desconto', icon: '⚡' },
                  { id: 'credit', label: 'Cartão de Crédito', desc: 'Até 12x sem juros', icon: '💳' },
                ].map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: payment === opt.id ? '#0a1628' : 'var(--surf-1)', border: `1px solid ${payment === opt.id ? '#1e40af' : 'var(--hair-strong)'}`, borderRadius: 2, cursor: 'pointer' }}>
                    <input type="radio" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id as any)} style={{ accentColor: 'var(--bg-accent)' }} />
                    <span style={{ fontSize: 20 }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.06em' }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg3)', marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Coupon */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Cupom de Desconto</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Insira o cupom" />
                  <button onClick={applyCoupon} style={{ padding: '12px 20px', background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', color: '#fff', fontSize: 12, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
                    Aplicar
                  </button>
                </div>
                {discount > 0 && <p style={{ margin: '6px 0 0', fontSize: 12, color: '#4cd680' }}>✓ Desconto de {fmtPrice(discount)} aplicado!</p>}
              </div>

              {payment === 'pix' && (
                <div style={{ padding: 16, background: '#0a1628', border: '1px solid #1e3a6e', borderRadius: 2, marginBottom: 24 }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#60a5fa', lineHeight: 1.5 }}>
                    ⚡ Após confirmar, um QR Code PIX será gerado. O pedido será processado automaticamente após a confirmação do pagamento.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep('frete')} style={{ padding: '14px 24px', background: 'var(--surf-3)', color: '#fff', border: '1px solid var(--hair-strong)', fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
                  ← Voltar
                </button>
                <button onClick={placeOrder} disabled={loading} style={{ flex: 1, padding: '16px', background: 'var(--bg-accent)', color: '#fff', border: 'none', fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)' }}>
                  {loading ? 'Processando...' : `Confirmar Pedido — ${fmtPrice(orderTotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', borderRadius: 2, padding: 24, position: 'sticky', top: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg3)' }}>
            Resumo do Pedido
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {item.image && (
                  <div style={{ width: 44, height: 44, position: 'relative', background: 'var(--surf-1)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain', padding: 2 }} sizes="44px" />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--fg3)' }}>x{item.quantity}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{fmtPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--hair)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--fg2)' }}>
              <span>Subtotal</span><span>{fmtPrice(total)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4cd680' }}>
                <span>Cupom</span><span>-{fmtPrice(discount)}</span>
              </div>
            )}
            {pixDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4cd680' }}>
                <span>Desconto PIX 5%</span><span>-{fmtPrice(pixDiscount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--fg2)' }}>
              <span>Frete ({shipping.toUpperCase()})</span><span>{fmtPrice(shippingCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontFamily: 'var(--font-display-heavy)', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--hair)' }}>
              <span>Total</span><span>{fmtPrice(orderTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

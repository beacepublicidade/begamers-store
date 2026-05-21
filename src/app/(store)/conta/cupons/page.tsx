import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ContaSidebar from '@/components/conta/ContaSidebar'
import Icon from '@/components/ui/Icon'

export default async function CuponsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/conta/login')

  const name = user.user_metadata?.name ?? user.email?.split('@')[0] ?? ''
  const firstName = name.split(' ')[0].toUpperCase()

  const admin = createAdminClient()

  const [{ data: customerData }, { data: coupons }] = await Promise.all([
    admin.from('customers').select('bg_coins').eq('id', user.id).maybeSingle() as unknown as Promise<{ data: { bg_coins: number } | null }>,
    admin.from('coupons').select('code, discount_type, discount_value, min_order, expires_at').eq('is_active', true).order('created_at', { ascending: false }) as unknown as Promise<{ data: Array<{ code: string; discount_type: string; discount_value: number; min_order: number; expires_at: string }> | null }>,
  ])

  const bgCoins: number = customerData?.bg_coins ?? 0
  const coinsValue = Math.floor(bgCoins / 100) * 5
  const activeCoupons = (coupons ?? []).filter(c => !c.expires_at || new Date(c.expires_at) > new Date())

  function fmtDiscount(c: { discount_type: string; discount_value: number }) {
    if (c.discount_type === 'percent') return `${c.discount_value}% OFF`
    if (c.discount_type === 'fixed') return `R$ ${Number(c.discount_value).toFixed(2).replace('.', ',')} OFF`
    return 'FRETE GRÁTIS'
  }

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <ContaSidebar name={name} email={user.email ?? ''} activePath="/conta/cupons" />
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>// MINHA CONTA</span>
            <h1 style={{ margin: '6px 0 0', fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', lineHeight: 1 }}>
              CUPONS & BG COINS.
            </h1>
          </div>

          {/* ===== BG COINS ===== */}
          <div style={{
            marginBottom: 24, overflow: 'hidden',
            border: '1px solid rgba(255,31,61,0.2)',
            background: '#050000',
          }}>
            {/* Hero row */}
            <div style={{
              padding: '36px 36px 28px',
              background: 'linear-gradient(120deg, #1c0003 0%, #0a0001 60%, #000 100%)',
              borderBottom: '1px solid rgba(255,31,61,0.1)',
              display: 'flex', alignItems: 'stretch', gap: 0,
            }}>
              {/* Left: headline */}
              <div style={{ flex: 1, paddingRight: 36 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,31,61,0.7)', marginBottom: 16 }}>
                  // BG COINS
                </div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 56, lineHeight: 0.92, letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 20 }}>
                  CADA REAL<br />
                  <span style={{ color: 'var(--bg-accent-hot)', textShadow: '0 0 40px rgba(255,31,61,0.6)' }}>É UM COIN.</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--fg2)', lineHeight: 1.7, maxWidth: 340 }}>
                  Acumule BG Coins a cada compra e troque por descontos reais na próxima. Quanto mais você compra, mais você economiza.
                </p>
              </div>

              {/* Right: saldo */}
              <div style={{
                borderLeft: '1px solid rgba(255,31,61,0.15)',
                paddingLeft: 36, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', minWidth: 200,
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg3)', marginBottom: 12 }}>
                  SEU SALDO
                </div>
                <div style={{
                  fontFamily: 'var(--font-display-heavy)',
                  fontSize: bgCoins > 0 ? 72 : 64,
                  lineHeight: 1, letterSpacing: '-0.04em',
                  color: bgCoins > 0 ? 'var(--bg-accent-hot)' : 'var(--fg3)',
                  textShadow: bgCoins > 0 ? '0 0 30px rgba(255,31,61,0.5)' : 'none',
                }}>
                  {bgCoins.toLocaleString('pt-BR')}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)', marginTop: 6 }}>
                  BG COINS
                </div>
                {bgCoins > 0 && (
                  <div style={{ marginTop: 10, fontSize: 13, color: '#4cd680', fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.04em' }}>
                    = R$ {coinsValue.toFixed(2).replace('.', ',')} em desconto
                  </div>
                )}
                {bgCoins >= 100 ? (
                  <div style={{
                    marginTop: 16, padding: '10px 24px',
                    background: 'var(--bg-accent)', color: '#fff',
                    fontFamily: 'var(--font-display-heavy)', fontSize: 11,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', textAlign: 'center',
                  }}>
                    Resgatar no checkout →
                  </div>
                ) : bgCoins > 0 ? (
                  <div style={{ marginTop: 14, fontSize: 11, color: 'var(--fg3)', textAlign: 'center', lineHeight: 1.5 }}>
                    Faltam <span style={{ color: '#fff' }}>{100 - bgCoins} coins</span><br />para seu primeiro resgate
                  </div>
                ) : (
                  <div style={{ marginTop: 14, fontSize: 11, color: 'var(--fg3)', textAlign: 'center', lineHeight: 1.5 }}>
                    Faça sua primeira compra<br />e ganhe coins automaticamente
                  </div>
                )}
              </div>
            </div>

            {/* Como funciona — 3 colunas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[
                {
                  num: '01',
                  icon: 'cart',
                  title: 'COMPRE',
                  value: 'R$ 1 = 1 coin',
                  desc: 'A cada real gasto, 1 BG Coin cai na sua conta após o pagamento confirmado.',
                },
                {
                  num: '02',
                  icon: 'bolt',
                  title: 'ACUMULE',
                  value: '100 coins = R$ 5',
                  desc: 'Seus coins ficam guardados sem prazo. Quanto mais você junta, maior o desconto.',
                },
                {
                  num: '03',
                  icon: 'tag',
                  title: 'RESGATE',
                  value: 'Máx. 10% por pedido',
                  desc: 'Use no checkout com um clique. Aplica antes de qualquer outro desconto.',
                },
              ].map((step, i) => (
                <div key={step.num} style={{
                  padding: '28px 28px',
                  borderRight: i < 2 ? '1px solid rgba(255,31,61,0.1)' : 'none',
                  borderTop: '1px solid rgba(255,31,61,0.1)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 36, color: 'rgba(255,31,61,0.2)', lineHeight: 1, letterSpacing: '-0.03em' }}>{step.num}</span>
                    <Icon name={step.icon} size={18} color="var(--bg-accent-hot)" />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 8 }}>
                    {step.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--bg-accent-hot)', marginBottom: 12, textTransform: 'uppercase' }}>
                    {step.value}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--fg3)', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Rodapé com regras */}
            <div style={{ padding: '14px 28px', borderTop: '1px solid rgba(255,31,61,0.08)', display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {['Mín. para resgatar: 100 coins', 'Máx. por pedido: 10% do total', 'Não acumula com cupom', 'Válidos por 12 meses'].map(r => (
                <span key={r} style={{ fontSize: 11, color: 'var(--fg3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'rgba(255,31,61,0.5)', fontSize: 8 }}>▶</span> {r}
                </span>
              ))}
            </div>
          </div>

          {/* ===== CUPONS ===== */}
          <div style={{ background: 'var(--surf-1)', border: '1px solid var(--hair)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="tag" size={13} color="var(--bg-accent-hot)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bg-accent-hot)' }}>
                // CUPONS DISPONÍVEIS
              </span>
              {activeCoupons.length > 0 && (
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, background: 'var(--bg-accent)', color: '#fff', padding: '2px 6px' }}>
                  {activeCoupons.length}
                </span>
              )}
            </div>
            {activeCoupons.length === 0 ? (
              <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--fg3)' }}>
                <p style={{ margin: '0 0 6px', fontSize: 14, color: 'var(--fg2)' }}>Nenhum cupom disponível agora</p>
                <p style={{ margin: 0, fontSize: 12 }}>Cupons exclusivos aparecem em datas especiais e para membros ativos. Fique ligado.</p>
              </div>
            ) : (
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeCoupons.map(c => (
                  <div key={c.code} style={{
                    padding: '16px 20px', border: '1px dashed rgba(255,31,61,0.25)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,31,61,0.02)',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 20, letterSpacing: '0.08em', color: 'var(--bg-accent-hot)' }}>{c.code}</div>
                      <div style={{ fontSize: 12, color: 'var(--fg2)', marginTop: 4 }}>
                        {fmtDiscount(c)}{c.min_order > 0 ? ` · Pedido mínimo R$ ${Number(c.min_order).toFixed(2).replace('.', ',')}` : ''}
                      </div>
                      {c.expires_at && (
                        <div style={{ fontSize: 11, color: 'var(--fg3)', marginTop: 2 }}>
                          Válido até {new Date(c.expires_at).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                    <span style={{ padding: '8px 18px', background: 'rgba(255,31,61,0.1)', border: '1px solid rgba(255,31,61,0.35)', color: 'var(--bg-accent-hot)', fontFamily: 'var(--font-display-heavy)', fontSize: 14, letterSpacing: '0.06em' }}>
                      {fmtDiscount(c)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

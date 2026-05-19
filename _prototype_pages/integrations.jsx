/* global React, BG */
const { useState } = React;
const { StoreHeader, MobileHeader, MobileBottomNav, StoreFooter, ProductCard, PRODUCTS, Btn, Tag, Icon, Stars, Price, SectionHead, StoreLogo, PageScroll } = BG;

const fmtBRL = v => "R$ " + v.toFixed(2).replace(".", ",");

/* ============================================================
   FRETE — Calculadora white-label (Melhor Envio por trás)
   Mostra 5 opções de envio em formato BeGamers, sem nomear
   nenhuma transportadora. Lógica/ETA seriam servidas pela API
   /shipment/calculate do Melhor Envio.
   ============================================================ */
const SHIPPING_OPTIONS = [
  { id: "next", name: "BG NEXT DAY", desc: "Capitais selecionadas · Pedido até 14h", eta: "Amanhã, 23/05", days: "1 dia útil", price: 29.90, badge: "⚡ MAIS RÁPIDO", badgeColor: "var(--bg-accent-hot)" },
  { id: "express", name: "BG EXPRESS", desc: "Coleta no mesmo dia · Rastreamento ao vivo", eta: "Seg, 25/05", days: "2 dias úteis", price: 19.90 },
  { id: "padrao", name: "BG ENVIO PADRÃO", desc: "Postagem em até 24h úteis", eta: "Qua, 27/05", days: "4 dias úteis", price: 0, free: true, recommended: true },
  { id: "eco", name: "BG ECONÔMICO", desc: "Postagem em até 24h úteis", eta: "Seg, 01/06", days: "7 dias úteis", price: 6.90 },
  { id: "pickup", name: "RETIRA NA LOJA", desc: "Av. Paulista 1000, São Paulo / SP · Seg–Sáb 10–20h", eta: "Pronto em 2h", days: "Hoje", price: 0, free: true, pickup: true },
];

function ShippingOption({ o, selected, onSelect }) {
  return (
    <button onClick={onSelect} style={{
      width: "100%", textAlign: "left", cursor: "pointer",
      background: selected ? "rgba(255,31,61,0.06)" : "var(--surf-1)",
      border: selected ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
      padding: "18px 20px", color: "#fff",
      boxShadow: selected ? "var(--neon-glow)" : "none",
      transition: "all 180ms var(--ease-out)",
      display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 16, alignItems: "center",
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: 99,
        border: "2px solid " + (selected ? "var(--bg-accent-hot)" : "var(--hair-strong)"),
        position: "relative", flexShrink: 0,
      }}>
        {selected && <span style={{ position: "absolute", inset: 3, background: "var(--bg-accent-hot)", borderRadius: 99 }} />}
      </span>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{
            fontFamily: "var(--font-display-heavy)", fontSize: 14,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>{o.name}</span>
          {o.badge && (
            <Tag tone="hot" style={{ background: o.badgeColor || "var(--bg-accent-hot)" }}>{o.badge}</Tag>
          )}
          {o.recommended && <Tag tone="success">RECOMENDADO</Tag>}
        </div>
        <div style={{ fontSize: 12, color: "var(--fg2)", marginBottom: 4 }}>{o.desc}</div>
        <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--fg3)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
          <span style={{ color: "#fff" }}>{o.pickup ? <Icon name="pkg" size={11} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} /> : <Icon name="truck" size={11} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }} />}{o.eta}</span>
          <span>· {o.days}</span>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        {o.free ? (
          <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, color: "#4cd680", letterSpacing: "0.04em" }}>GRÁTIS</div>
        ) : (
          <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18 }}>{fmtBRL(o.price)}</div>
        )}
      </div>
    </button>
  );
}

function FreteDesktop() {
  const [sel, setSel] = useState("padrao");
  return (
    <PageScroll>
      <StoreHeader />
      <main style={{ maxWidth: 980, margin: "0 auto", padding: "32px 32px 64px" }}>
        <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// PASSO 3 DE 5 · ENTREGA</span>
        <h1 style={{
          margin: "10px 0 0", fontFamily: "var(--font-display-heavy)",
          fontSize: 56, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.03em",
        }}>ESCOLHA O ENVIO.</h1>
        <p style={{ color: "var(--fg2)", fontSize: 14, margin: "12px 0 32px", maxWidth: 540 }}>
          Calculamos para o seu CEP em tempo real. Frete grátis em pedidos acima de R$ 299.
        </p>

        {/* Address card */}
        <div style={{
          padding: 20, border: "1px solid var(--hair)", background: "var(--surf-1)",
          marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              width: 44, height: 44, background: "var(--bg-accent)",
              clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Icon name="truck" size={20} /></span>
            <div>
              <span className="eyebrow-mono" style={{ color: "var(--fg2)" }}>// ENTREGAR EM</span>
              <div style={{ fontSize: 14, marginTop: 4 }}>
                <strong>Av. Paulista, 1000, Ap. 1207</strong> · Bela Vista, São Paulo / SP — <span style={{ fontFamily: "var(--font-mono)" }}>01310-100</span>
              </div>
            </div>
          </div>
          <Btn variant="ghost" size="sm">Trocar endereço</Btn>
        </div>

        {/* Live calculation badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// 5 OPÇÕES DE ENVIO CALCULADAS</span>
          <span style={{ fontSize: 11, color: "var(--fg2)", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)" }}>
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            Atualizado agora · cotação válida por 30min
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SHIPPING_OPTIONS.map(o => (
            <ShippingOption key={o.id} o={o} selected={sel === o.id} onSelect={() => setSel(o.id)} />
          ))}
        </div>

        {/* Insurance */}
        <div style={{ marginTop: 24, padding: 16, background: "var(--surf-2)", border: "1px dashed var(--hair-strong)" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <span style={{
              width: 18, height: 18, border: "1px solid var(--hair-strong)",
              background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
            }}><Icon name="check" size={12} stroke={2.5} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13, letterSpacing: "0.06em" }}>SEGURO BG · R$ 4,90</div>
              <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 4, lineHeight: 1.5 }}>
                Reembolso 100% em caso de extravio ou avaria. Recomendado para pedidos acima de R$ 500.
              </div>
            </div>
          </label>
        </div>

        {/* Summary + CTA */}
        <div style={{
          marginTop: 24, display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center",
          padding: 20, border: "1px solid var(--hair-strong)", background: "#000",
        }}>
          <div>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// TOTAL COM ENVIO</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 8 }}>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 1 }}>R$ 1.443,65</div>
              <div style={{ fontSize: 12, color: "#4cd680" }}>R$ 1.299,29 no PIX (−10%)</div>
            </div>
            <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 4 }}>
              Subtotal R$ 1.438,75 + Envio Padrão Grátis + Seguro R$ 4,90
            </div>
          </div>
          <Btn variant="hot" size="lg" icon={<Icon name="chevR" size={18} />}>Continuar para pagamento</Btn>
        </div>

        {/* Trust footer */}
        <div style={{
          marginTop: 32, padding: 20, display: "flex", alignItems: "center", gap: 24,
          fontSize: 11, color: "var(--fg2)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em",
          textTransform: "uppercase", justifyContent: "center", borderTop: "1px solid var(--hair)",
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon name="shield" size={14} color="var(--bg-accent-hot)" /> RASTREAMENTO EM TEMPO REAL
          </span>
          <span>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon name="pkg" size={14} color="var(--bg-accent-hot)" /> EMBALAGEM REFORÇADA
          </span>
          <span>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={14} color="var(--bg-accent-hot)" /> TROCA EM 30 DIAS
          </span>
        </div>
      </main>
    </PageScroll>
  );
}

function FreteMobile() {
  const [sel, setSel] = useState("padrao");
  return (
    <PageScroll>
      <MobileHeader title="ENTREGA" subtitle="Passo 3 de 5" showBack showSearch={false} />

      {/* Steps */}
      <div style={{ display: "flex", padding: "12px 16px", gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{ flex: 1, height: 4, background: i <= 3 ? "var(--bg-accent)" : "var(--hair-strong)" }} />
        ))}
      </div>

      <div style={{ padding: "12px 16px" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display-heavy)", fontSize: 30, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em" }}>ESCOLHA O ENVIO.</h1>
        <p style={{ color: "var(--fg2)", fontSize: 12, margin: "6px 0 0" }}>5 opções calculadas para o seu CEP.</p>
      </div>

      {/* Address */}
      <div style={{ margin: "16px", padding: 12, background: "var(--surf-1)", border: "1px solid var(--hair)", display: "flex", gap: 10, alignItems: "center" }}>
        <Icon name="truck" size={18} color="var(--bg-accent-hot)" />
        <div style={{ flex: 1, fontSize: 11, lineHeight: 1.5 }}>
          <div style={{ fontWeight: 700 }}>Av. Paulista, 1000, Ap. 1207</div>
          <div style={{ color: "var(--fg2)", fontFamily: "var(--font-mono)" }}>São Paulo / SP — 01310-100</div>
        </div>
        <button style={{ background: "transparent", border: 0, color: "var(--fg2)", fontSize: 11, textDecoration: "underline" }}>Trocar</button>
      </div>

      {/* Live */}
      <div style={{ padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)", fontSize: 9 }}>// 5 OPÇÕES</span>
        <span style={{ fontSize: 10, color: "var(--fg2)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span className="live-dot" style={{ width: 5, height: 5 }} /> Cotação ao vivo
        </span>
      </div>

      {/* Options */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {SHIPPING_OPTIONS.map(o => (
          <button key={o.id} onClick={() => setSel(o.id)} style={{
            width: "100%", textAlign: "left", cursor: "pointer",
            background: sel === o.id ? "rgba(255,31,61,0.06)" : "var(--surf-1)",
            border: sel === o.id ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
            padding: "12px 14px", color: "#fff",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>{o.name}</span>
              <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, color: o.free ? "#4cd680" : "#fff" }}>
                {o.free ? "GRÁTIS" : fmtBRL(o.price)}
              </span>
            </div>
            <div style={{ fontSize: 10, color: "var(--fg2)" }}>{o.eta} · {o.days}</div>
            {(o.badge || o.recommended) && (
              <div style={{ marginTop: 6 }}>
                {o.badge && <Tag tone="hot">{o.badge}</Tag>}
                {o.recommended && <Tag tone="success">RECOMENDADO</Tag>}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Insurance */}
      <div style={{ margin: "16px", padding: 12, background: "var(--surf-2)", border: "1px dashed var(--hair-strong)", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ width: 16, height: 16, border: "1px solid var(--hair-strong)", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={11} stroke={2.5} />
        </span>
        <div style={{ flex: 1, fontSize: 11 }}>
          <strong>SEGURO BG · R$ 4,90</strong>
          <div style={{ color: "var(--fg2)" }}>Reembolso 100% por extravio/avaria.</div>
        </div>
      </div>

      <div style={{ padding: "8px 16px 24px" }}>
        <div style={{ padding: 14, background: "#000", border: "1px solid var(--hair-strong)" }}>
          <div className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// TOTAL COM ENVIO</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 }}>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 24, lineHeight: 1 }}>R$ 1.443,65</div>
            <div style={{ fontSize: 11, color: "#4cd680" }}>R$ 1.299,29 PIX</div>
          </div>
        </div>
        <Btn variant="hot" size="lg" full style={{ marginTop: 12 }} icon={<Icon name="chevR" size={16} />}>Continuar</Btn>
      </div>
    </PageScroll>
  );
}

/* ============================================================
   CARTÃO — Checkout com formulário e parcelamento
   InfinitePay processa por trás. Visualmente é só "Checkout BG".
   Diferencial InfinitePay: 12x sem juros + aprovação instantânea.
   ============================================================ */
function CartaoDesktop() {
  const [installments, setInstallments] = useState(12);
  const total = 1438.75;
  return (
    <PageScroll>
      <header style={{ background: "#000", borderBottom: "1px solid var(--hair-strong)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <StoreLogo height={36} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--fg2)", fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
            <Icon name="lock" size={14} color="#4cd680" /> CHECKOUT SEGURO · TLS 1.3 · 3DS 2.0
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Steps */}
        <div style={{ display: "flex", marginBottom: 32, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          {["CARRINHO", "IDENTIFICAÇÃO", "ENTREGA", "PAGAMENTO", "REVISÃO"].map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
              background: i === 3 ? "var(--bg-accent)" : "transparent",
              borderRight: i < 4 ? "1px solid var(--hair)" : 0,
              opacity: i < 3 ? 0.6 : 1,
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: 99,
                background: i < 3 ? "#1f9d55" : (i === 3 ? "#fff" : "transparent"),
                color: i < 3 ? "#000" : (i === 3 ? "var(--bg-accent)" : "var(--fg2)"),
                border: i > 3 ? "1px solid var(--hair-strong)" : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display-heavy)", fontSize: 11,
              }}>{i < 3 ? <Icon name="check" size={12} stroke={2.5} /> : (i + 1)}</span>
              <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.1em" }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Method selector */}
            <section style={{ border: "2px solid var(--bg-accent-hot)", background: "var(--surf-2)", boxShadow: "var(--neon-glow)" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 99, background: "var(--bg-accent-hot)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>●</span>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>FORMA DE PAGAMENTO</span>
              </div>

              <div style={{ padding: 20 }}>
                {/* methods grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
                  {[
                    { k: "pix", t: "PIX", s: "10% off · imediato", c: "#4cd680" },
                    { k: "credit", t: "CARTÃO", s: "Até 12x sem juros", sel: true },
                    { k: "boleto", t: "BOLETO", s: "Vence em 3 dias" },
                  ].map(m => (
                    <button key={m.k} style={{
                      padding: 16, textAlign: "left", cursor: "pointer",
                      background: m.sel ? "rgba(255,31,61,0.08)" : "var(--surf-1)",
                      border: m.sel ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
                      color: "#fff",
                    }}>
                      <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 16, letterSpacing: "0.06em" }}>{m.t}</div>
                      <div style={{ fontSize: 11, color: m.c || "var(--fg2)", marginTop: 4 }}>{m.s}</div>
                    </button>
                  ))}
                </div>

                {/* Card form */}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32, alignItems: "flex-start" }}>
                  {/* form */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <span className="eyebrow-mono">// DADOS DO CARTÃO</span>
                    <div>
                      <label style={fieldLabel}>NÚMERO DO CARTÃO</label>
                      <div style={{ position: "relative" }}>
                        <input className="bg-input" defaultValue="•••• •••• •••• 4242" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }} />
                        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{
                            padding: "3px 8px", background: "linear-gradient(135deg, #1a1f71, #0a1454)",
                            color: "#fff", fontFamily: "var(--font-display-heavy)", fontSize: 9,
                            letterSpacing: "0.16em",
                          }}>VISA</span>
                          <Icon name="check" size={14} color="#4cd680" stroke={2.5} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label style={fieldLabel}>NOME IMPRESSO NO CARTÃO</label>
                      <input className="bg-input" defaultValue="DIEGO L ANDRADE" style={{ textTransform: "uppercase", letterSpacing: "0.04em" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 8 }}>
                      <div>
                        <label style={fieldLabel}>VALIDADE</label>
                        <input className="bg-input" defaultValue="08/29" style={{ fontFamily: "var(--font-mono)" }} />
                      </div>
                      <div>
                        <label style={fieldLabel}>CVV</label>
                        <input className="bg-input" defaultValue="•••" style={{ fontFamily: "var(--font-mono)" }} />
                      </div>
                      <div>
                        <label style={fieldLabel}>CPF DO TITULAR</label>
                        <input className="bg-input" defaultValue="000.000.000-00" style={{ fontFamily: "var(--font-mono)" }} />
                      </div>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginTop: 4 }}>
                      <span style={{
                        width: 16, height: 16, border: "1px solid var(--hair-strong)",
                        background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center",
                      }}><Icon name="check" size={11} stroke={2.5} /></span>
                      <span style={{ fontSize: 12, color: "var(--fg2)" }}>Salvar cartão com criptografia tokenizada (PCI DSS)</span>
                    </label>
                  </div>

                  {/* card visual */}
                  <div style={{
                    width: "100%", aspectRatio: "1.6 / 1",
                    background: "linear-gradient(135deg, #cc0000 0%, #1a0006 100%)",
                    padding: 20, position: "relative", overflow: "hidden",
                    clipPath: "polygon(0 0, 100% 0, 100% 92%, 95% 100%, 0 100%)",
                    color: "#fff", fontFamily: "var(--font-mono)",
                  }}>
                    <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <StoreLogo height={20} />
                        <span style={{ width: 36, height: 26, background: "linear-gradient(135deg, #ffd700, #b8860b)" }} />
                      </div>
                      <div style={{ fontSize: 18, letterSpacing: "0.18em", fontWeight: 700 }}>
                        •••• •••• •••• 4242
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <div style={{ fontSize: 8, opacity: 0.6, marginBottom: 2 }}>TITULAR</div>
                          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>DIEGO L ANDRADE</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 8, opacity: 0.6, marginBottom: 2 }}>VAL</div>
                          <div style={{ fontSize: 11, fontWeight: 700 }}>08/29</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Installments */}
                <div style={{ marginTop: 32 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="eyebrow-mono">// PARCELAMENTO</span>
                    <span style={{ fontSize: 11, color: "#4cd680", display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Icon name="bolt" size={12} /> TODAS AS PARCELAS SEM JUROS
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                      <button key={n} onClick={() => setInstallments(n)} style={{
                        padding: "12px 14px", textAlign: "left", cursor: "pointer",
                        background: installments === n ? "rgba(255,31,61,0.08)" : "var(--surf-1)",
                        border: installments === n ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
                        color: "#fff",
                      }}>
                        <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 15 }}>{n}x de {fmtBRL(total / n)}</div>
                        <div style={{ fontSize: 10, color: n <= 12 ? "#4cd680" : "var(--fg2)", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {n === 1 ? "À vista no cartão" : "Sem juros"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <div style={{
              padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)",
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
            }}>
              {[
                { i: "lock", t: "PCI DSS LEVEL 1", s: "Tokenização" },
                { i: "shield", t: "3DS 2.0", s: "Autenticação 2FA" },
                { i: "bolt", t: "APROVAÇÃO < 3s", s: "Antifraude próprio" },
                { i: "check", t: "CHARGEBACK 0,1%", s: "Padrão da indústria" },
              ].map(b => (
                <div key={b.t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name={b.i} size={20} color="var(--bg-accent-hot)" />
                  <div>
                    <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.08em" }}>{b.t}</div>
                    <div style={{ fontSize: 10, color: "var(--fg2)" }}>{b.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* summary */}
          <aside>
            <div style={{ position: "sticky", top: 24, border: "1px solid var(--hair-strong)", background: "var(--surf-2)" }}>
              <div style={{ padding: 20, borderBottom: "1px solid var(--hair)" }}>
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// PEDIDO #14275</span>
                <h3 style={{ margin: "10px 0 0", fontFamily: "var(--font-display-heavy)", fontSize: 18, textTransform: "uppercase" }}>4 itens · BG Express</h3>
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Subtotal", "R$ 1.598,80"],
                  ["Cupom GAMER10", "−R$ 159,88", "#4cd680"],
                  ["Envio BG Padrão", "Grátis", "#4cd680"],
                  ["Seguro BG", "R$ 4,90"],
                ].map(([k, v, c]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "var(--fg2)" }}>{k}</span>
                    <span style={{ color: c || "#fff", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--hair-strong)", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div className="eyebrow-mono">// TOTAL</div>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 32, lineHeight: 1 }}>{fmtBRL(total)}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--fg2)", textAlign: "right", marginTop: 4 }}>
                  {installments}x de {fmtBRL(total / installments)} sem juros
                </div>
              </div>
              <div style={{ padding: 20, paddingTop: 0 }}>
                <Btn variant="hot" size="lg" full icon={<Icon name="lock" size={16} />}>Pagar {fmtBRL(total)}</Btn>
                <div style={{ marginTop: 12, fontSize: 10, color: "var(--fg3)", textAlign: "center", lineHeight: 1.5 }}>
                  Ao continuar, você aceita os <a href="#" style={{ color: "var(--fg2)" }}>Termos de Uso</a> · CVV ≠ armazenado
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </PageScroll>
  );
}

const fieldLabel = {
  display: "block", fontSize: 10, fontFamily: "var(--font-display-heavy)",
  letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg2)",
  marginBottom: 6,
};

function CartaoMobile() {
  const [installments, setInstallments] = useState(12);
  const total = 1438.75;
  return (
    <PageScroll>
      <header style={{ padding: "16px", borderBottom: "1px solid var(--hair)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#000" }}>
        <StoreLogo height={26} />
        <span style={{ fontSize: 10, color: "#4cd680", display: "inline-flex", gap: 4, alignItems: "center" }}>
          <Icon name="lock" size={12} /> 3DS 2.0
        </span>
      </header>
      <div style={{ display: "flex", padding: "12px 16px", gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{ flex: 1, height: 4, background: i <= 4 ? "var(--bg-accent)" : "var(--hair-strong)" }} />
        ))}
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// PASSO 4 DE 5</span>
        <h1 style={{ margin: "6px 0 6px", fontFamily: "var(--font-display-heavy)", fontSize: 26, lineHeight: 0.95, textTransform: "uppercase" }}>CARTÃO DE CRÉDITO.</h1>
        <p style={{ margin: 0, fontSize: 11, color: "#4cd680" }}>⚡ Até 12x sem juros · aprovação em até 3s</p>
      </div>

      {/* Method pill */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 16px 12px" }}>
        {[
          { k: "pix", t: "PIX −10%", c: "#4cd680" },
          { k: "credit", t: "CARTÃO 12X", sel: true },
          { k: "boleto", t: "BOLETO" },
        ].map(m => (
          <span key={m.k} style={{
            flexShrink: 0, padding: "8px 14px",
            background: m.sel ? "var(--bg-accent-hot)" : "transparent",
            border: m.sel ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
            color: m.sel ? "#fff" : (m.c || "#fff"),
            fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.08em",
          }}>{m.t}</span>
        ))}
      </div>

      {/* Card visual */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{
          width: "100%", aspectRatio: "1.6 / 1",
          background: "linear-gradient(135deg, #cc0000 0%, #1a0006 100%)",
          padding: 18, position: "relative", overflow: "hidden",
          clipPath: "polygon(0 0, 100% 0, 100% 92%, 95% 100%, 0 100%)",
          color: "#fff", fontFamily: "var(--font-mono)",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
          <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <StoreLogo height={18} />
              <span style={{ width: 32, height: 24, background: "linear-gradient(135deg, #ffd700, #b8860b)" }} />
            </div>
            <div style={{ fontSize: 15, letterSpacing: "0.16em", fontWeight: 700 }}>•••• •••• •••• 4242</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 7, opacity: 0.6 }}>TITULAR</div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>DIEGO L ANDRADE</div>
              </div>
              <div>
                <div style={{ fontSize: 7, opacity: 0.6 }}>VAL</div>
                <div style={{ fontSize: 10, fontWeight: 700 }}>08/29</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={fieldLabel}>NÚMERO DO CARTÃO</label>
          <div style={{ position: "relative" }}>
            <input className="bg-input" defaultValue="•••• •••• •••• 4242" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }} />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", padding: "2px 6px", background: "linear-gradient(135deg, #1a1f71, #0a1454)", color: "#fff", fontFamily: "var(--font-display-heavy)", fontSize: 8, letterSpacing: "0.14em" }}>VISA</span>
          </div>
        </div>
        <div>
          <label style={fieldLabel}>NOME NO CARTÃO</label>
          <input className="bg-input" defaultValue="DIEGO L ANDRADE" style={{ textTransform: "uppercase" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <label style={fieldLabel}>VALIDADE</label>
            <input className="bg-input" defaultValue="08/29" style={{ fontFamily: "var(--font-mono)" }} />
          </div>
          <div>
            <label style={fieldLabel}>CVV</label>
            <input className="bg-input" defaultValue="•••" style={{ fontFamily: "var(--font-mono)" }} />
          </div>
        </div>
      </div>

      {/* Installments */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="eyebrow-mono">// PARCELAS</span>
          <span style={{ fontSize: 10, color: "#4cd680" }}>⚡ TODAS SEM JUROS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[12, 6, 3, 1].map(n => (
            <button key={n} onClick={() => setInstallments(n)} style={{
              width: "100%", padding: "10px 14px", textAlign: "left", cursor: "pointer",
              background: installments === n ? "rgba(255,31,61,0.08)" : "var(--surf-1)",
              border: installments === n ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
              color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14 }}>{n}x</div>
                <div style={{ fontSize: 10, color: "#4cd680" }}>Sem juros</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700 }}>{fmtBRL(total / n)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Total + CTA */}
      <div style={{ padding: 16, background: "#000", borderTop: "1px solid var(--hair-strong)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
          <div>
            <div className="eyebrow-mono">// TOTAL</div>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 22, lineHeight: 1 }}>{fmtBRL(total)}</div>
            <div style={{ fontSize: 10, color: "var(--fg2)" }}>{installments}x {fmtBRL(total / installments)}</div>
          </div>
          <Btn variant="hot" size="lg" icon={<Icon name="lock" size={14} />}>Pagar</Btn>
        </div>
        <div style={{ fontSize: 9, color: "var(--fg3)", textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          PCI DSS · 3DS 2.0 · APROVAÇÃO &lt; 3s
        </div>
      </div>
    </PageScroll>
  );
}

/* ============================================================
   RASTREAMENTO — Detalhe da entrega white-label
   Mostraria dados da API Melhor Envio (eventos da transportadora,
   coordenadas para o mapa, ETA, etc) sob a marca BG.
   ============================================================ */
const TRACK_EVENTS = [
  { t: "Saiu para entrega", d: "Hoje · 09:14", l: "Centro de Distribuição · São Paulo / SP", icon: "truck", current: true },
  { t: "Em rota", d: "Hoje · 06:30", l: "Centro de Distribuição · São Paulo / SP", icon: "truck", done: true },
  { t: "Chegou no destino", d: "Ontem · 22:48", l: "Centro de Distribuição · São Paulo / SP", icon: "pkg", done: true },
  { t: "Em trânsito", d: "Ontem · 14:12", l: "Filial · Campinas / SP → São Paulo / SP", icon: "truck", done: true },
  { t: "Coletado pela transportadora", d: "20/05 · 18:30", l: "Filial · Campinas / SP", icon: "pkg", done: true },
  { t: "Embalado e despachado", d: "20/05 · 09:42", l: "Centro Logístico BG · Campinas / SP", icon: "pkg", done: true },
  { t: "Pagamento aprovado", d: "19/05 · 21:05", l: "Aprovação em 2,4s", icon: "check", done: true },
  { t: "Pedido feito", d: "19/05 · 21:03", l: "Pedido #14275", icon: "check", done: true },
];

function TrackingDesktop() {
  return (
    <PageScroll>
      <StoreHeader />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Top header */}
        <nav style={{
          display: "flex", gap: 8, alignItems: "center",
          fontSize: 11, fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--fg3)", marginBottom: 24,
        }}>
          <a href="#" style={{ color: "var(--fg2)" }}>MINHA CONTA</a>
          <span>/</span>
          <a href="#" style={{ color: "var(--fg2)" }}>PEDIDOS</a>
          <span>/</span>
          <span style={{ color: "#fff" }}>#14275 · RASTREAMENTO</span>
        </nav>

        {/* Status hero */}
        <div style={{
          position: "relative", padding: "32px 40px", marginBottom: 24, overflow: "hidden",
          background: "linear-gradient(135deg, #1a0006 0%, #000 50%)",
          border: "1px solid var(--bg-accent)",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span className="live-dot" />
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// SAIU PARA ENTREGA · CHEGA HOJE</span>
              </div>
              <h1 style={{ margin: 0, fontFamily: "var(--font-display-heavy)", fontSize: 64, lineHeight: 0.9, textTransform: "uppercase", letterSpacing: "-0.03em" }}>
                CHEGA EM <span style={{ color: "var(--bg-accent-hot)" }}>2H 14M.</span>
              </h1>
              <p style={{ color: "var(--fg2)", fontSize: 14, marginTop: 12, maxWidth: 540 }}>
                Janela estimada: hoje, 22/05, entre 13h e 16h. O entregador vai chegar no Ap. 1207.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Btn variant="outline" size="md" icon={<Icon name="user" size={14} />}>Chamar entregador</Btn>
              <Btn variant="hot" size="md">Mudar endereço</Btn>
            </div>
          </div>

          {/* Big progress bar */}
          <div style={{ marginTop: 32, position: "relative" }}>
            <div style={{ height: 4, background: "var(--surf-3)" }}>
              <div style={{ height: "100%", width: "85%", background: "var(--bg-accent-hot)", boxShadow: "var(--neon-glow)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", marginTop: 16 }}>
              {["FEITO", "PAGO", "EMBALADO", "EM ROTA", "ENTREGUE"].map((s, i) => (
                <div key={s} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  color: i <= 3 ? "var(--bg-accent-hot)" : "var(--fg3)",
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 99,
                    background: i <= 3 ? "var(--bg-accent-hot)" : "var(--surf-2)",
                    border: i <= 3 ? "0" : "1px solid var(--hair-strong)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                    color: "#fff",
                  }}>{i <= 3 ? <Icon name="check" size={12} stroke={2.5} /> : i + 1}</span>
                  <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 10, letterSpacing: "0.14em" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
          {/* Left — map + timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Map */}
            <div style={{
              position: "relative", height: 320, overflow: "hidden",
              border: "1px solid var(--hair-strong)", background: "#0a1a0a",
            }}>
              {/* Map placeholder pattern */}
              <div style={{
                position: "absolute", inset: 0,
                background: `
                  repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(76,214,128,0.15) 39px, rgba(76,214,128,0.15) 40px),
                  repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(76,214,128,0.15) 39px, rgba(76,214,128,0.15) 40px),
                  radial-gradient(at 30% 70%, rgba(76,214,128,0.2), transparent 50%),
                  radial-gradient(at 70% 30%, rgba(255,31,61,0.2), transparent 50%),
                  linear-gradient(135deg, #0a1a0a, #001a0a)
                `,
              }} />
              {/* Streets */}
              <svg viewBox="0 0 600 320" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
                <path d="M 0 220 C 100 180, 200 220, 350 160 C 450 130, 550 110, 600 120" fill="none" stroke="rgba(76,214,128,0.4)" strokeWidth="3" strokeDasharray="6 6" />
                <path d="M 80 0 L 80 320" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="40" />
                <path d="M 0 100 L 600 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="30" />
              </svg>
              {/* Pin: origin */}
              <div style={{ position: "absolute", left: "8%", top: "62%" }}>
                <div style={{ width: 16, height: 16, background: "#4cd680", borderRadius: 99, boxShadow: "0 0 0 4px rgba(76,214,128,0.3)" }} />
                <div style={{ marginTop: 6, padding: "4px 8px", background: "rgba(0,0,0,0.8)", border: "1px solid rgba(76,214,128,0.4)", fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4cd680" }}>ORIGEM · CD SP</div>
              </div>
              {/* Pin: truck (moving) */}
              <div style={{ position: "absolute", left: "62%", top: "32%" }}>
                <div style={{
                  width: 44, height: 44, background: "var(--bg-accent-hot)",
                  clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 20px rgba(255,31,61,0.5)",
                  animation: "pulseDot 2s infinite",
                }}>
                  <Icon name="truck" size={18} color="#fff" />
                </div>
                <div style={{ marginTop: 6, padding: "5px 10px", background: "var(--bg-accent-hot)", fontSize: 10, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>● 2H 14M</div>
              </div>
              {/* Pin: destination */}
              <div style={{ position: "absolute", right: "12%", top: "18%" }}>
                <div style={{ width: 16, height: 16, background: "#fff", borderRadius: 99, boxShadow: "0 0 0 4px rgba(255,255,255,0.3)" }} />
                <div style={{ marginTop: 6, padding: "4px 8px", background: "rgba(0,0,0,0.8)", border: "1px solid var(--hair-strong)", fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>VOCÊ · AP. 1207</div>
              </div>

              {/* HUD top */}
              <div style={{ position: "absolute", top: 12, left: 12, padding: "8px 12px", background: "rgba(0,0,0,0.7)", border: "1px solid var(--hair-strong)", display: "flex", alignItems: "center", gap: 10, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
                <span className="live-dot" style={{ width: 6, height: 6 }} />
                <span>LOCALIZAÇÃO AO VIVO · GPS ATUALIZADO HÁ 14S</span>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12, padding: "8px 12px", background: "rgba(0,0,0,0.7)", border: "1px solid var(--hair-strong)", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>14,2 KM · 27 PARADAS</div>
            </div>

            {/* Driver card */}
            <div style={{
              padding: 20, border: "1px solid var(--hair)", background: "var(--surf-1)",
              display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center",
            }}>
              <div style={{
                width: 64, height: 64,
                background: "linear-gradient(135deg, #cc0000, #1a0006)",
                clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display-heavy)", fontSize: 22,
              }}>RS</div>
              <div>
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// SEU ENTREGADOR</span>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 20, marginTop: 4, textTransform: "uppercase" }}>RAFAEL SILVA</div>
                <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--fg2)", marginTop: 6, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
                  <span>★ 4.92 · 2.847 entregas</span>
                  <span>·</span>
                  <span>VEÍCULO XXX-1A24</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" size="sm">Mensagem</Btn>
                <Btn variant="outline" size="sm" icon={<Icon name="user" size={14} />}>Ligar</Btn>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ padding: 24, border: "1px solid var(--hair)", background: "var(--surf-1)" }}>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// HISTÓRICO COMPLETO</span>
              <h3 style={{ margin: "10px 0 24px", fontFamily: "var(--font-display-heavy)", fontSize: 22, textTransform: "uppercase" }}>TIMELINE</h3>
              <div style={{ position: "relative" }}>
                {/* vertical line */}
                <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "var(--hair-strong)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {TRACK_EVENTS.map((e, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 16, position: "relative" }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 99,
                        background: e.current ? "var(--bg-accent-hot)" : (e.done ? "#1f9d55" : "var(--surf-3)"),
                        border: e.current ? "0" : (e.done ? "0" : "1px solid var(--hair-strong)"),
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: e.current ? "0 0 12px rgba(255,31,61,0.5)" : "none",
                        animation: e.current ? "pulseDot 1.6s infinite" : "none",
                        flexShrink: 0, position: "relative", zIndex: 1,
                      }}><Icon name={e.icon} size={11} stroke={2.5} /></span>
                      <div>
                        <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: e.current ? "var(--bg-accent-hot)" : "#fff" }}>
                          {e.t}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 4 }}>{e.l}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--fg3)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textAlign: "right", paddingTop: 2 }}>{e.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — order summary */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: 20, border: "1px solid var(--hair)", background: "var(--surf-1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// PEDIDO #14275</span>
                <span style={{ fontSize: 10, color: "var(--fg2)", fontFamily: "var(--font-mono)" }}>BG-RST-7K2X4Q</span>
              </div>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 16, textTransform: "uppercase", marginBottom: 16 }}>4 ITENS · BG EXPRESS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[PRODUCTS[0], PRODUCTS[1], PRODUCTS[3]].map((p, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 48, height: 48, background: `radial-gradient(at 50% 50%, ${p.color}55, #000), #111` }} />
                    <div style={{ fontSize: 11, lineHeight: 1.3, color: "var(--fg2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.name}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg3)" }}>×{i === 2 ? 2 : 1}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--hair)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "var(--fg2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>TOTAL PAGO</span>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18 }}>R$ 1.294,87</span>
              </div>
            </div>

            {/* Delivery details */}
            <div style={{ padding: 20, border: "1px solid var(--hair)", background: "var(--surf-1)" }}>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// ENTREGA</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
                {[
                  ["Modalidade", "BG EXPRESS · 2 dias úteis"],
                  ["Endereço", "Av. Paulista, 1000, Ap. 1207\nBela Vista, São Paulo / SP\n01310-100"],
                  ["Janela", "Hoje, 22/05 · 13h–16h"],
                  ["Código de rastreio", "BG2026-RT-14275"],
                  ["Embalagem", "Caixa reforçada + Seguro BG"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: "var(--fg3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 12, whiteSpace: "pre-line" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn variant="ghost" size="md" full icon={<Icon name="search" size={14} />}>Nota fiscal</Btn>
              <Btn variant="ghost" size="md" full icon={<Icon name="x" size={14} />}>Problema com entrega?</Btn>
              <Btn variant="ghost" size="md" full icon={<Icon name="pkg" size={14} />}>Pedir reembolso</Btn>
            </div>
          </aside>
        </div>
      </main>
      <StoreFooter />
    </PageScroll>
  );
}

function TrackingMobile() {
  return (
    <React.Fragment>
      <PageScroll style={{ bottom: 64 }}>
        <MobileHeader title="RASTREAMENTO" subtitle="#14275" showBack showSearch={false} />

        {/* Status hero */}
        <div style={{
          position: "relative", padding: "20px 16px", overflow: "hidden",
          background: "linear-gradient(135deg, #1a0006 0%, #000 50%)",
          borderBottom: "1px solid var(--bg-accent)",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)", fontSize: 9 }}>// SAIU PARA ENTREGA</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display-heavy)", fontSize: 40, lineHeight: 0.9, textTransform: "uppercase" }}>
              CHEGA EM<br /><span style={{ color: "var(--bg-accent-hot)" }}>2H 14M.</span>
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 11, color: "var(--fg2)" }}>Janela: hoje, 22/05 · 13h–16h</p>
          </div>
          {/* progress */}
          <div style={{ marginTop: 16, position: "relative" }}>
            <div style={{ height: 4, background: "var(--surf-3)" }}>
              <div style={{ height: "100%", width: "85%", background: "var(--bg-accent-hot)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", marginTop: 8, fontSize: 8, color: "var(--fg2)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
              {["FEITO", "PAGO", "EMB.", "EM ROTA", "ENTREG."].map((s, i) => (
                <span key={s} style={{ textAlign: "center", color: i <= 3 ? "var(--bg-accent-hot)" : "var(--fg3)" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div style={{
          position: "relative", height: 220, overflow: "hidden",
          background: "#0a1a0a",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `
              repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(76,214,128,0.15) 29px, rgba(76,214,128,0.15) 30px),
              repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(76,214,128,0.15) 29px, rgba(76,214,128,0.15) 30px),
              linear-gradient(135deg, #0a1a0a, #001a0a)
            `,
          }} />
          <svg viewBox="0 0 400 220" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
            <path d="M 0 160 C 80 130, 160 160, 250 100 C 320 70, 380 60, 400 60" fill="none" stroke="rgba(76,214,128,0.4)" strokeWidth="3" strokeDasharray="6 6" />
          </svg>
          <div style={{ position: "absolute", left: "8%", top: "62%" }}>
            <div style={{ width: 12, height: 12, background: "#4cd680", borderRadius: 99, boxShadow: "0 0 0 4px rgba(76,214,128,0.3)" }} />
          </div>
          <div style={{ position: "absolute", left: "55%", top: "28%" }}>
            <div style={{
              width: 36, height: 36, background: "var(--bg-accent-hot)",
              clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "pulseDot 2s infinite",
            }}><Icon name="truck" size={14} color="#fff" /></div>
          </div>
          <div style={{ position: "absolute", right: "10%", top: "20%" }}>
            <div style={{ width: 12, height: 12, background: "#fff", borderRadius: 99, boxShadow: "0 0 0 4px rgba(255,255,255,0.3)" }} />
          </div>
          <div style={{ position: "absolute", top: 8, left: 8, padding: "5px 8px", background: "rgba(0,0,0,0.7)", fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
            <span className="live-dot" style={{ width: 5, height: 5, display: "inline-block", marginRight: 4, verticalAlign: "middle" }} />
            GPS · 14S ATRÁS
          </div>
        </div>

        {/* Driver */}
        <div style={{
          padding: 14, margin: 16, border: "1px solid var(--hair)", background: "var(--surf-1)",
          display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, alignItems: "center",
        }}>
          <div style={{
            width: 44, height: 44,
            background: "linear-gradient(135deg, #cc0000, #1a0006)",
            clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display-heavy)", fontSize: 14,
          }}>RS</div>
          <div>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13, textTransform: "uppercase" }}>RAFAEL SILVA</div>
            <div style={{ fontSize: 10, color: "var(--fg2)" }}>★ 4.92 · 2.847 entregas</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={iconCircle}><Icon name="search" size={14} /></button>
            <button style={{ ...iconCircle, background: "var(--bg-accent)" }}><Icon name="user" size={14} /></button>
          </div>
        </div>

        {/* Timeline compact */}
        <div style={{ padding: "0 16px 16px" }}>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// HISTÓRICO</span>
          <div style={{ position: "relative", marginTop: 16 }}>
            <div style={{ position: "absolute", left: 10, top: 8, bottom: 8, width: 2, background: "var(--hair-strong)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {TRACK_EVENTS.map((e, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 12, position: "relative" }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 99,
                    background: e.current ? "var(--bg-accent-hot)" : (e.done ? "#1f9d55" : "var(--surf-3)"),
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", zIndex: 1,
                  }}><Icon name={e.icon} size={10} stroke={2.5} /></span>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: e.current ? "var(--bg-accent-hot)" : "#fff" }}>{e.t}</div>
                      <div style={{ fontSize: 9, color: "var(--fg3)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{e.d}</div>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--fg2)", marginTop: 3 }}>{e.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: "0 16px 32px", display: "flex", flexDirection: "column", gap: 8 }}>
          <Btn variant="ghost" size="md" full>Nota fiscal</Btn>
          <Btn variant="ghost" size="md" full>Problema com entrega?</Btn>
        </div>
      </PageScroll>
      <MobileBottomNav active="me" />
    </React.Fragment>
  );
}
const iconCircle = {
  width: 32, height: 32, background: "var(--surf-2)",
  border: "1px solid var(--hair-strong)", color: "#fff",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};

Object.assign(window, { FreteDesktop, FreteMobile, CartaoDesktop, CartaoMobile, TrackingDesktop, TrackingMobile });

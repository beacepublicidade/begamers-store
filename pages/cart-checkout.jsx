/* global React, BG */
const { StoreHeader, MobileHeader, MobileBottomNav, StoreFooter, ProductCard, PRODUCTS, Btn, Tag, Icon, Stars, Price, SectionHead, StoreLogo, PageScroll } = BG;

const CART_ITEMS = [
  { ...PRODUCTS[0], qty: 1 },
  { ...PRODUCTS[1], qty: 1 },
  { ...PRODUCTS[3], qty: 2 },
];

const fmtBRL = v => "R$ " + v.toFixed(2).replace(".", ",");

/* ─────────── CART ─────────── */
function CartDesktop() {
  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const desconto = subtotal * 0.10;
  const total = subtotal - desconto;
  return (
    <PageScroll>
      <StoreHeader />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// CARRINHO · 4 ITENS</span>
            <h1 style={{ margin: "10px 0 0", fontFamily: "var(--font-display-heavy)", fontSize: 64, lineHeight: 0.9, textTransform: "uppercase", letterSpacing: "-0.03em" }}>SEU LOOTBAG.</h1>
          </div>
          <a href="#" style={{ fontSize: 12, color: "var(--fg2)", textDecoration: "underline", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-display-heavy)" }}>← Continuar comprando</a>
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", marginBottom: 32, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          {["CARRINHO", "ENDEREÇO", "PAGAMENTO", "CONFIRMAÇÃO"].map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 12,
              background: i === 0 ? "var(--bg-accent)" : "transparent",
              borderRight: i < 3 ? "1px solid var(--hair)" : 0,
              position: "relative",
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 99,
                background: i === 0 ? "#fff" : "transparent",
                color: i === 0 ? "var(--bg-accent)" : "var(--fg2)",
                border: i === 0 ? "0" : "1px solid var(--hair-strong)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display-heavy)", fontSize: 12,
              }}>{i + 1}</span>
              <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.1em" }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
          {/* items */}
          <div>
            <div style={{ border: "1px solid var(--hair)", background: "var(--surf-1)" }}>
              {CART_ITEMS.map((it, idx) => (
                <div key={idx} style={{
                  display: "grid", gridTemplateColumns: "100px 1fr auto auto auto",
                  gap: 20, padding: 20, alignItems: "center",
                  borderBottom: idx < CART_ITEMS.length - 1 ? "1px solid var(--hair)" : 0,
                }}>
                  <div style={{
                    width: 100, height: 100,
                    background: `radial-gradient(at 50% 50%, ${it.color}55, #000), #111`,
                  }} />
                  <div>
                    <span className="eyebrow-mono" style={{ color: "var(--fg2)" }}>{it.brand}</span>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{it.name}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: "var(--fg2)" }}>
                      <span>Cor: <span style={{ color: "#fff" }}>Phantom Red</span></span>
                      <span style={{ color: "#4cd680" }}>● Em estoque</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--hair-strong)" }}>
                    <button style={qtyBtn}>−</button>
                    <span style={{ width: 36, textAlign: "center", fontFamily: "var(--font-display-heavy)", fontSize: 14 }}>{it.qty}</span>
                    <button style={qtyBtn}>+</button>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18 }}>{fmtBRL(it.price * it.qty)}</div>
                    {it.old && <div style={{ fontSize: 11, color: "var(--fg3)", textDecoration: "line-through" }}>{fmtBRL(it.old * it.qty)}</div>}
                  </div>
                  <button style={{ background: "transparent", border: "0", color: "var(--fg2)", padding: 8, cursor: "pointer" }}>
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Cupom */}
            <div style={{ marginTop: 16, padding: 20, border: "1px solid var(--hair)", background: "var(--surf-1)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.1em" }}>CUPOM DE DESCONTO</span>
                <Icon name="bolt" size={16} color="var(--bg-accent-hot)" />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input className="bg-input" placeholder="DIGITA AÊ" defaultValue="GAMER10" style={{ flex: 1, textTransform: "uppercase", letterSpacing: "0.08em" }} />
                <Btn variant="ghost" size="md">Aplicar</Btn>
              </div>
              <div style={{ marginTop: 12, padding: 10, background: "rgba(31,157,85,0.1)", border: "1px solid #1f9d55", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#4cd680", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="check" size={14} stroke={2.5} /> GAMER10 aplicado · −10% do subtotal
                </span>
                <button style={{ background: "transparent", border: 0, color: "#4cd680", cursor: "pointer" }}><Icon name="x" size={14} /></button>
              </div>
            </div>

            {/* Suggestions */}
            <div style={{ marginTop: 32 }}>
              <SectionHead eyebrow="LEVE TAMBÉM" title="Combina com o seu carrinho." />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {PRODUCTS.slice(2, 6).map(p => <ProductCard key={p.id} p={p} size="sm" />)}
              </div>
            </div>
          </div>

          {/* Summary */}
          <aside>
            <div style={{ position: "sticky", top: 24, border: "1px solid var(--hair-strong)", background: "var(--surf-2)" }}>
              <div style={{ padding: 20, borderBottom: "1px solid var(--hair)" }}>
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// RESUMO DO PEDIDO</span>
                <h3 style={{ margin: "10px 0 0", fontFamily: "var(--font-display-heavy)", fontSize: 22, textTransform: "uppercase" }}>4 itens no LootBag</h3>
              </div>
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Subtotal", fmtBRL(subtotal)],
                  ["Frete", "Grátis", "#4cd680"],
                  ["Cupom GAMER10", "−" + fmtBRL(desconto), "#4cd680"],
                ].map(([k, v, c]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "var(--fg2)" }}>{k}</span>
                    <span style={{ color: c || "#fff", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--hair-strong)", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div className="eyebrow-mono">// TOTAL</div>
                    <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 4 }}>ou 12x de {fmtBRL(total / 12)} sem juros</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 1, letterSpacing: "-0.02em" }}>{fmtBRL(total)}</div>
                </div>
                <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(31,157,85,0.08)", border: "1px dashed #1f9d55", fontSize: 12, color: "#4cd680" }}>
                  ⚡ <strong>{fmtBRL(total * 0.9)}</strong> no PIX (10% off)
                </div>
              </div>
              <div style={{ padding: 20, paddingTop: 0 }}>
                <Btn variant="hot" size="lg" full icon={<Icon name="chevR" size={18} />}>Finalizar pedido</Btn>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 11, color: "var(--fg3)", justifyContent: "center" }}>
                  <Icon name="lock" size={12} /> Site seguro · SSL 256-bit
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <StoreFooter />
    </PageScroll>
  );
}
const qtyBtn = { width: 32, height: 36, background: "transparent", border: 0, color: "#fff", cursor: "pointer", fontFamily: "var(--font-display-heavy)" };

function CartMobile() {
  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const desconto = subtotal * 0.1;
  const total = subtotal - desconto;
  return (
    <React.Fragment>
      <PageScroll style={{ bottom: 124 }}>
        <MobileHeader title="LOOTBAG" subtitle="4 itens" showBack showSearch={false} />

        {/* Steps */}
        <div style={{ display: "flex", padding: "12px 16px", gap: 4 }}>
          {[1, 2, 3, 4].map(i => (
            <span key={i} style={{ flex: 1, height: 4, background: i === 1 ? "var(--bg-accent)" : "var(--hair-strong)" }} />
          ))}
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", padding: "0 16px", gap: 12 }}>
          {CART_ITEMS.map((it, idx) => (
            <div key={idx} style={{
              display: "flex", gap: 12, padding: 12,
              background: "var(--surf-2)", border: "1px solid var(--hair)",
            }}>
              <div style={{
                width: 80, height: 80, flexShrink: 0,
                background: `radial-gradient(at 50% 50%, ${it.color}55, #000), #111`,
              }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="eyebrow-mono" style={{ color: "var(--fg2)", fontSize: 9 }}>{it.brand}</span>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{it.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--hair-strong)" }}>
                    <button style={{ ...qtyBtn, width: 26, height: 28 }}>−</button>
                    <span style={{ width: 26, textAlign: "center", fontSize: 12, fontFamily: "var(--font-display-heavy)" }}>{it.qty}</span>
                    <button style={{ ...qtyBtn, width: 26, height: 28 }}>+</button>
                  </div>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14 }}>{fmtBRL(it.price * it.qty)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div style={{ margin: "16px", padding: 14, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <input className="bg-input" placeholder="CUPOM" defaultValue="GAMER10" style={{ flex: 1, padding: "8px 10px", textTransform: "uppercase", letterSpacing: "0.06em" }} />
            <Btn variant="ghost" size="sm">OK</Btn>
          </div>
          <div style={{ marginTop: 8, padding: 8, fontSize: 11, color: "#4cd680", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="check" size={12} stroke={2.5} /> GAMER10 · −10% aplicado
          </div>
        </div>

        {/* Suggestion strip */}
        <div style={{ paddingBottom: 24 }}>
          <div style={{ padding: "0 16px" }}><SectionHead mobile eyebrow="LEVA JUNTO" title="Combina com o seu kit." /></div>
          <div className="no-scrollbar" style={{ display: "flex", gap: 10, padding: "0 16px", overflowX: "auto" }}>
            {PRODUCTS.slice(2, 6).map(p => <div key={p.id} style={{ width: 180, flexShrink: 0 }}><ProductCard p={p} size="sm" /></div>)}
          </div>
        </div>
      </PageScroll>
      {/* Sticky checkout */}
      <div style={{
        position: "absolute", bottom: 64, left: 0, right: 0,
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(14px)",
        borderTop: "1px solid var(--hair-strong)", padding: 12,
        zIndex: 5,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--fg2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>TOTAL</div>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 22, lineHeight: 1 }}>{fmtBRL(total)}</div>
            <div style={{ fontSize: 9, color: "#4cd680" }}>{fmtBRL(total * 0.9)} no PIX</div>
          </div>
          <Btn variant="hot" size="lg" icon={<Icon name="chevR" size={18} />}>Finalizar</Btn>
        </div>
      </div>
      <MobileBottomNav active="cart" />
    </React.Fragment>
  );
}

/* ─────────── CHECKOUT ─────────── */
function CheckoutDesktop() {
  const total = 1438.75;
  return (
    <PageScroll>
      {/* Minimal header for checkout */}
      <header style={{ background: "#000", borderBottom: "1px solid var(--hair-strong)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="#"><StoreLogo height={36} /></a>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--fg2)", fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
            <Icon name="lock" size={14} color="#4cd680" /> CHECKOUT SEGURO · SSL 256-BIT
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
          {/* form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Identification (done) */}
            <CheckoutSection title="Identificação" done>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "var(--fg2)" }}>
                <span>diego@begamersstore.com.br · Diego Andrade</span>
                <a href="#" style={{ color: "var(--fg2)", textDecoration: "underline", fontSize: 11 }}>Trocar</a>
              </div>
            </CheckoutSection>

            {/* Address (done) */}
            <CheckoutSection title="Endereço de entrega" done>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontSize: 13 }}>
                <div style={{ color: "var(--fg2)", lineHeight: 1.5 }}>
                  Av. Paulista, 1000, Ap. 1207 · Bela Vista<br />
                  São Paulo / SP — 01310-100<br />
                  <span style={{ fontSize: 11, color: "var(--fg3)" }}>SEDEX · Chega 23/05 (sex) · Grátis</span>
                </div>
                <a href="#" style={{ color: "var(--fg2)", textDecoration: "underline", fontSize: 11 }}>Trocar</a>
              </div>
            </CheckoutSection>

            {/* Payment (active) */}
            <CheckoutSection title="Pagamento" active>
              {/* methods */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
                {[
                  { k: "pix", t: "PIX", s: "10% off · imediato", sel: true, c: "#4cd680" },
                  { k: "credit", t: "CARTÃO", s: "Até 12x s/ juros" },
                  { k: "boleto", t: "BOLETO", s: "Vence em 3 dias" },
                ].map(m => (
                  <button key={m.k} style={{
                    padding: 16, textAlign: "left", cursor: "pointer",
                    background: m.sel ? "rgba(255,31,61,0.08)" : "var(--surf-1)",
                    border: m.sel ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
                    color: "#fff",
                    boxShadow: m.sel ? "var(--neon-glow)" : "none",
                  }}>
                    <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 16, letterSpacing: "0.06em" }}>{m.t}</div>
                    <div style={{ fontSize: 11, color: m.c || "var(--fg2)", marginTop: 4 }}>{m.s}</div>
                  </button>
                ))}
              </div>

              {/* PIX info */}
              <div style={{ padding: 20, background: "rgba(31,157,85,0.06)", border: "1px solid #1f9d55" }}>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 24, alignItems: "center" }}>
                  <div style={{
                    width: 120, height: 120, background: "#fff",
                    backgroundImage: "repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)",
                    backgroundSize: "12px 12px",
                  }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Icon name="bolt" size={20} color="#4cd680" />
                      <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, color: "#4cd680" }}>10% OFF NO PIX</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 1 }}>{fmtBRL(total * 0.9)}</div>
                    <div style={{ fontSize: 12, color: "var(--fg2)", marginTop: 6 }}>Economia de {fmtBRL(total * 0.1)} pagando no PIX</div>
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <Btn variant="ghost" size="sm">Copiar código</Btn>
                      <Btn variant="ghost" size="sm">Abrir banco</Btn>
                    </div>
                  </div>
                </div>
              </div>
            </CheckoutSection>

            <CheckoutSection title="Revisão do pedido" pending />
          </div>

          {/* summary */}
          <aside>
            <div style={{ position: "sticky", top: 24, border: "1px solid var(--hair-strong)", background: "var(--surf-2)" }}>
              <div style={{ padding: 20, borderBottom: "1px solid var(--hair)" }}>
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// SEU PEDIDO</span>
                <h3 style={{ margin: "10px 0 0", fontFamily: "var(--font-display-heavy)", fontSize: 18, textTransform: "uppercase" }}>4 itens · Pedido #14275</h3>
              </div>
              {/* mini items */}
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, borderBottom: "1px solid var(--hair)" }}>
                {CART_ITEMS.map((it, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, background: `radial-gradient(at 50% 50%, ${it.color}55, #000), #111`, position: "relative" }}>
                      <span style={{
                        position: "absolute", top: -6, right: -6,
                        width: 18, height: 18, borderRadius: 99,
                        background: "var(--bg-accent)", color: "#fff",
                        fontSize: 10, fontWeight: 700, display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>{it.qty}</span>
                    </div>
                    <div style={{ fontSize: 12, lineHeight: 1.3, color: "var(--fg2)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{it.name}</div>
                    <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13 }}>{fmtBRL(it.price * it.qty)}</div>
                  </div>
                ))}
              </div>
              {/* totals */}
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Subtotal", "R$ 1.598,80"], ["Cupom GAMER10", "−R$ 159,88", "#4cd680"], ["Frete SEDEX", "Grátis", "#4cd680"]].map(([k, v, c]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "var(--fg2)" }}>{k}</span>
                    <span style={{ color: c || "#fff", fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--hair-strong)", padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div className="eyebrow-mono">// PIX</div>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 36, color: "#4cd680", lineHeight: 1 }}>{fmtBRL(total * 0.9)}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--fg2)", textAlign: "right", marginTop: 4 }}>De {fmtBRL(total)} · economia de {fmtBRL(total * 0.1)}</div>
              </div>
              <div style={{ padding: 20, paddingTop: 0 }}>
                <Btn variant="hot" size="lg" full>Pagar R$ 1.294,87</Btn>
                <div style={{ marginTop: 12, fontSize: 10, color: "var(--fg3)", textAlign: "center", lineHeight: 1.5 }}>
                  Ao continuar, você aceita os <a href="#" style={{ color: "var(--fg2)" }}>Termos de Uso</a> e a <a href="#" style={{ color: "var(--fg2)" }}>Política de Privacidade</a>.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </PageScroll>
  );
}

const CheckoutSection = ({ title, done, active, pending, children }) => (
  <section style={{
    border: active ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
    background: pending ? "var(--surf-1)" : "var(--surf-2)",
    opacity: pending ? 0.5 : 1,
    boxShadow: active ? "var(--neon-glow)" : "none",
  }}>
    <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: children ? "1px solid var(--hair)" : 0 }}>
      <span style={{
        width: 24, height: 24, borderRadius: 99,
        background: done ? "#1f9d55" : (active ? "var(--bg-accent-hot)" : "transparent"),
        color: "#fff", border: pending ? "1px solid var(--hair-strong)" : 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-display-heavy)", fontSize: 11,
      }}>
        {done ? <Icon name="check" size={12} stroke={2.5} /> : (active ? "●" : "")}
      </span>
      <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", flex: 1 }}>{title}</span>
      {done && <span style={{ fontSize: 11, color: "#4cd680" }}>OK</span>}
    </div>
    {children && <div style={{ padding: 20 }}>{children}</div>}
  </section>
);

function CheckoutMobile() {
  const total = 1438.75;
  return (
    <PageScroll>
      <header style={{ padding: "16px", borderBottom: "1px solid var(--hair)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#000" }}>
        <StoreLogo height={26} />
        <span style={{ fontSize: 10, color: "#4cd680", display: "inline-flex", gap: 4, alignItems: "center" }}>
          <Icon name="lock" size={12} /> SSL
        </span>
      </header>
      {/* Steps */}
      <div style={{ display: "flex", padding: "12px 16px", gap: 4 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{ flex: 1, height: 4, background: i <= 4 ? "var(--bg-accent)" : "var(--hair-strong)" }} />
        ))}
      </div>
      <div style={{ padding: "8px 16px 16px", fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.1em", color: "var(--fg2)" }}>PASSO 4 DE 5</div>

      {/* Section header */}
      <div style={{ padding: "0 16px" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 0.95, textTransform: "uppercase" }}>PAGAMENTO.</h1>
        <p style={{ margin: "6px 0 20px", fontSize: 12, color: "var(--fg2)" }}>Escolhe como quer pagar e finaliza.</p>
      </div>

      {/* Methods */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { k: "pix", t: "PIX", s: "Aprovação imediata · 10% off", sel: true },
          { k: "credit", t: "CARTÃO DE CRÉDITO", s: "Até 12x sem juros" },
          { k: "boleto", t: "BOLETO", s: "Vence em 3 dias úteis" },
        ].map(m => (
          <button key={m.k} style={{
            padding: 14, textAlign: "left", cursor: "pointer",
            background: m.sel ? "rgba(255,31,61,0.08)" : "var(--surf-1)",
            border: m.sel ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
            color: "#fff", display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 99,
              border: "2px solid var(--bg-accent-hot)",
              background: m.sel ? "var(--bg-accent-hot)" : "transparent",
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13, letterSpacing: "0.06em" }}>{m.t}</div>
              <div style={{ fontSize: 10, color: m.k === "pix" ? "#4cd680" : "var(--fg2)" }}>{m.s}</div>
            </div>
          </button>
        ))}
      </div>

      {/* PIX QR */}
      <div style={{ padding: 16 }}>
        <div style={{ padding: 16, background: "rgba(31,157,85,0.06)", border: "1px solid #1f9d55", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 160, height: 160, background: "#fff",
            backgroundImage: "repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)",
            backgroundSize: "14px 14px",
          }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 1, color: "#4cd680" }}>{fmtBRL(total * 0.9)}</div>
            <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 4 }}>Economia de {fmtBRL(total * 0.1)}</div>
          </div>
          <Btn variant="ghost" size="md" full>Copiar código PIX</Btn>
        </div>
      </div>

      {/* Summary collapsed */}
      <div style={{ margin: "0 16px", padding: 14, background: "var(--surf-2)", border: "1px solid var(--hair)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.1em" }}>RESUMO · 4 ITENS</span>
          <Icon name="chevD" size={14} color="var(--fg2)" />
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--fg2)" }}>SEDEX · Chega 23/05 · Grátis</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 12, color: "var(--fg2)" }}>Total no PIX</span>
          <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, color: "#4cd680" }}>{fmtBRL(total * 0.9)}</span>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <Btn variant="hot" size="lg" full>Finalizar pedido</Btn>
        <div style={{ marginTop: 10, fontSize: 10, color: "var(--fg3)", textAlign: "center" }}>
          Ao continuar, você aceita os Termos de Uso.
        </div>
      </div>
    </PageScroll>
  );
}

Object.assign(window, { CartDesktop, CartMobile, CheckoutDesktop, CheckoutMobile });

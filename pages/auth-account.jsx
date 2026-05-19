/* global React, BG */
const { StoreHeader, MobileHeader, MobileBottomNav, StoreFooter, ProductCard, PRODUCTS, Btn, Tag, Icon, Stars, Price, SectionHead, StoreLogo, VMark, PageScroll } = BG;

/* ─────────── LOGIN / SIGN UP ─────────── */
function AuthDesktop() {
  return (
    <PageScroll>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 540px", minHeight: "100%" }}>
        {/* Left side — brand */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #1a0006 0%, #000 60%)",
          padding: 64, display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: 80,
            background: "var(--bg-accent)",
            clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
          }} />
          {/* Top */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <StoreLogo height={44} />
          </div>
          {/* Middle */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// COMUNIDADE BEGAMERS</span>
            <h1 style={{
              margin: "16px 0", fontFamily: "var(--font-display-heavy)",
              fontSize: 96, lineHeight: 0.82, textTransform: "uppercase", letterSpacing: "-0.04em",
            }}>
              ENTRA<br />NO <span style={{
                background: "var(--bg-accent)", padding: "0 14px", display: "inline-block",
                clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
              }}>SERVER.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, maxWidth: 440, lineHeight: 1.6 }}>
              Cadastra-se e desbloqueia: drops exclusivos, cupons só pra membro, 10% off em todo PIX e o BeGamers Sync gratuito.
            </p>
          </div>
          {/* Benefits */}
          <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 480 }}>
            {[
              { i: "bolt", t: "10% OFF NO PIX" },
              { i: "fire", t: "DROPS EXCLUSIVOS" },
              { i: "shield", t: "GARANTIA ESTENDIDA" },
              { i: "pkg", t: "FRETE PREFERENCIAL" },
            ].map(b => (
              <div key={b.t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 36, height: 36, background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--hair-strong)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--bg-accent-hot)",
                }}><Icon name={b.i} size={18} /></span>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.1em" }}>{b.t}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right — form */}
        <div style={{ background: "#000", padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--fg2)", marginBottom: 32, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <Icon name="chevL" size={14} /> Voltar à loja
          </a>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--hair-strong)", marginBottom: 32 }}>
            <button style={tabBtn(true)}>ENTRAR</button>
            <button style={tabBtn(false)}>CRIAR CONTA</button>
          </div>

          <h2 style={{ margin: 0, fontFamily: "var(--font-display-heavy)", fontSize: 32, textTransform: "uppercase", letterSpacing: "-0.01em" }}>BEM-VINDO DE VOLTA.</h2>
          <p style={{ color: "var(--fg2)", fontSize: 14, marginTop: 8 }}>Entra com o teu time.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 32 }}>
            <Field label="E-mail" placeholder="seu@email.com" />
            <Field label="Senha" type="password" placeholder="••••••••••••" showForgot />
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 12, color: "var(--fg2)" }}>
              <span style={{ width: 16, height: 16, border: "1px solid var(--hair-strong)", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={12} stroke={2.5} />
              </span>
              Lembrar de mim por 30 dias
            </label>
            <Btn variant="hot" size="lg" full style={{ marginTop: 8 }}>Entrar no Server</Btn>
          </div>
          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0", color: "var(--fg3)", fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.16em" }}>
            <span style={{ flex: 1, height: 1, background: "var(--hair-strong)" }} />
            OU ENTRA COM
            <span style={{ flex: 1, height: 1, background: "var(--hair-strong)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {["Google", "Discord", "Steam"].map(p => (
              <Btn key={p} variant="ghost" size="md">{p}</Btn>
            ))}
          </div>
          <div style={{ marginTop: 32, textAlign: "center", fontSize: 12, color: "var(--fg2)" }}>
            Não tem conta? <a href="#" style={{ color: "var(--bg-accent-hot)", textDecoration: "none", borderBottom: "1px solid var(--bg-accent-hot)", fontWeight: 700 }}>Cadastra-te grátis →</a>
          </div>
        </div>
      </div>
    </PageScroll>
  );
}
const tabBtn = active => ({
  flex: 1, padding: "14px 0", background: "transparent",
  border: 0, color: active ? "#fff" : "var(--fg2)",
  borderBottom: active ? "3px solid var(--bg-accent)" : "3px solid transparent",
  fontFamily: "var(--font-display-heavy)", fontSize: 14, letterSpacing: "0.12em",
  cursor: "pointer", marginBottom: -1,
});
const Field = ({ label, type = "text", placeholder, showForgot, defaultValue }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <label style={{ fontSize: 11, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg2)" }}>{label}</label>
      {showForgot && <a href="#" style={{ fontSize: 11, color: "var(--bg-accent-hot)", textDecoration: "none" }}>Esqueci a senha</a>}
    </div>
    <input className="bg-input" type={type} placeholder={placeholder} defaultValue={defaultValue} />
  </div>
);

function AuthMobile() {
  return (
    <PageScroll>
      {/* Top banner */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(180deg, #1a0006, #000)",
        padding: "32px 20px 24px",
      }}>
        <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
        <button style={{ background: "transparent", border: 0, color: "#fff", padding: 0, marginBottom: 20, position: "relative" }}><Icon name="chevL" size={22} /></button>
        <div style={{ position: "relative" }}>
          <StoreLogo height={32} />
          <h1 style={{
            margin: "16px 0 6px", fontFamily: "var(--font-display-heavy)",
            fontSize: 48, lineHeight: 0.85, textTransform: "uppercase", letterSpacing: "-0.03em",
          }}>
            ENTRA NO<br />
            <span style={{ background: "var(--bg-accent)", padding: "0 8px", display: "inline-block", clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" }}>SERVER.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: 0 }}>Drops, cupons e 10% off no PIX.</p>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--hair-strong)" }}>
        <button style={{ ...tabBtn(true), fontSize: 12 }}>ENTRAR</button>
        <button style={{ ...tabBtn(false), fontSize: 12 }}>CRIAR CONTA</button>
      </div>
      {/* Form */}
      <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="E-mail" placeholder="seu@email.com" />
        <Field label="Senha" type="password" placeholder="••••••••••" showForgot />
        <Btn variant="hot" size="lg" full style={{ marginTop: 6 }}>Entrar no Server</Btn>
      </div>
      {/* Divider */}
      <div style={{ padding: "0 16px", display: "flex", alignItems: "center", gap: 12, color: "var(--fg3)", fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.16em", margin: "8px 0" }}>
        <span style={{ flex: 1, height: 1, background: "var(--hair-strong)" }} />
        OU
        <span style={{ flex: 1, height: 1, background: "var(--hair-strong)" }} />
      </div>
      <div style={{ padding: "12px 16px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
        {["Continuar com Google", "Continuar com Discord", "Continuar com Steam"].map(p => (
          <Btn key={p} variant="ghost" size="md" full>{p}</Btn>
        ))}
      </div>
      <div style={{ padding: "0 16px 32px", textAlign: "center", fontSize: 12, color: "var(--fg2)" }}>
        Sem conta? <a href="#" style={{ color: "var(--bg-accent-hot)", fontWeight: 700 }}>Cadastra grátis →</a>
      </div>
    </PageScroll>
  );
}

/* ─────────── ACCOUNT / ORDERS ─────────── */
function AccountDesktop() {
  return (
    <PageScroll>
      <StoreHeader />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Hero */}
        <div style={{
          position: "relative", padding: "32px 40px", marginBottom: 32, overflow: "hidden",
          background: "linear-gradient(135deg, #1a0006 0%, #000 50%)",
          border: "1px solid var(--hair)",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{
                width: 96, height: 96, background: "var(--bg-accent)",
                clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display-heavy)", fontSize: 32,
              }}>DA</div>
              <div>
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// MEMBRO DESDE 2024 · LVL 7</span>
                <h1 style={{ margin: "8px 0 4px", fontFamily: "var(--font-display-heavy)", fontSize: 48, textTransform: "uppercase", lineHeight: 1, letterSpacing: "-0.02em" }}>FALA, DIEGO.</h1>
                <p style={{ margin: 0, color: "var(--fg2)", fontSize: 13 }}>diego@begamersstore.com.br · 12 pedidos · R$ 8.493 gasto</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 32 }}>
              {[["BG COINS", "2.840"], ["CUPONS ATIVOS", "3"], ["LISTA DESEJOS", "14"]].map(([l, v]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 32, lineHeight: 1, color: "var(--bg-accent-hot)" }}>{v}</div>
                  <div className="eyebrow-mono" style={{ marginTop: 6 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 }}>
          {/* Sidebar */}
          <aside>
            <nav style={{ display: "flex", flexDirection: "column" }}>
              {[
                { i: "user", t: "Visão geral", a: false },
                { i: "pkg", t: "Meus pedidos", a: true, count: 12 },
                { i: "heart", t: "Lista de desejos", count: 14 },
                { i: "truck", t: "Endereços" },
                { i: "bolt", t: "Cupons & BG Coins" },
                { i: "shield", t: "Dados pessoais" },
                { i: "lock", t: "Senha & segurança" },
                { i: "x", t: "Sair" },
              ].map(it => (
                <a key={it.t} href="#" style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", fontSize: 13,
                  color: it.a ? "#fff" : "var(--fg2)",
                  background: it.a ? "var(--surf-2)" : "transparent",
                  borderLeft: it.a ? "3px solid var(--bg-accent)" : "3px solid transparent",
                  fontFamily: "var(--font-display-heavy)",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  <Icon name={it.i} size={16} />
                  <span style={{ flex: 1 }}>{it.t}</span>
                  {it.count && <span style={{ fontSize: 11, color: "var(--fg3)" }}>{it.count}</span>}
                </a>
              ))}
            </nav>
          </aside>
          {/* Orders */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// HISTÓRICO</span>
                <h2 style={{ margin: "8px 0 0", fontFamily: "var(--font-display-heavy)", fontSize: 32, textTransform: "uppercase", letterSpacing: "-0.01em" }}>MEUS PEDIDOS.</h2>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <select className="bg-input" style={{ padding: "10px 14px", fontSize: 12, width: 160 }}>
                  <option>Últimos 6 meses</option>
                  <option>Último ano</option>
                  <option>Todos</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--hair)", marginBottom: 16 }}>
              {[
                ["Todos", 12],
                ["Em entrega", 1],
                ["A caminho", 2],
                ["Entregues", 8],
                ["Cancelados", 1],
              ].map(([t, n], i) => (
                <button key={t} style={{
                  background: "transparent", border: 0, padding: "12px 20px",
                  color: i === 0 ? "#fff" : "var(--fg2)",
                  borderBottom: i === 0 ? "2px solid var(--bg-accent)" : "2px solid transparent",
                  fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.1em",
                  textTransform: "uppercase", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>{t} <span style={{ fontSize: 10, opacity: 0.6 }}>{n}</span></button>
              ))}
            </div>

            {[
              { n: "14275", date: "21/05/2026", st: "EM TRÂNSITO", stc: "var(--bg-accent-hot)", track: "Saiu para entrega — chega hoje", items: CART_ITEMS_SAMPLE.slice(0, 3), total: 1438.75, prog: 0.85 },
              { n: "14102", date: "08/05/2026", st: "ENTREGUE", stc: "#4cd680", track: "Entregue em 10/05 às 14:32", items: CART_ITEMS_SAMPLE.slice(1, 4), total: 829.80, prog: 1 },
              { n: "13988", date: "23/04/2026", st: "ENTREGUE", stc: "#4cd680", track: "Entregue em 26/04 às 09:15", items: CART_ITEMS_SAMPLE.slice(2, 5), total: 249.90, prog: 1 },
            ].map(o => <OrderCard key={o.n} order={o} />)}
          </div>
        </div>
      </main>
      <StoreFooter />
    </PageScroll>
  );
}

const CART_ITEMS_SAMPLE = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[2], PRODUCTS[3], PRODUCTS[4]];
const fmtBRL = v => "R$ " + v.toFixed(2).replace(".", ",");

const OrderCard = ({ order }) => (
  <div style={{ marginBottom: 16, border: "1px solid var(--hair)", background: "var(--surf-1)" }}>
    {/* Header */}
    <div style={{
      padding: "16px 20px", borderBottom: "1px solid var(--hair)",
      display: "grid", gridTemplateColumns: "auto auto 1fr auto auto", gap: 32, alignItems: "center",
    }}>
      <div>
        <div className="eyebrow-mono">// PEDIDO</div>
        <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, marginTop: 4 }}>#{order.n}</div>
      </div>
      <div>
        <div className="eyebrow-mono">// FEITO EM</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, marginTop: 4 }}>{order.date}</div>
      </div>
      <div>
        <Tag tone={order.stc === "#4cd680" ? "success" : "hot"}>● {order.st}</Tag>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="eyebrow-mono">// TOTAL</div>
        <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, marginTop: 4 }}>{fmtBRL(order.total)}</div>
      </div>
      <Btn variant="ghost" size="sm">Detalhes →</Btn>
    </div>
    {/* Tracking */}
    <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "var(--fg2)", borderBottom: "1px solid var(--hair)" }}>
      <Icon name="truck" size={16} color={order.stc} />
      <span>{order.track}</span>
      <span style={{ flex: 1, height: 3, background: "var(--surf-3)", position: "relative", borderRadius: 99 }}>
        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (order.prog * 100) + "%", background: order.stc, borderRadius: 99 }} />
      </span>
      <a href="#" style={{ color: "#fff", textDecoration: "underline", fontSize: 11 }}>Rastrear</a>
    </div>
    {/* Items */}
    <div style={{ padding: "16px 20px", display: "flex", gap: 12, alignItems: "center" }}>
      {order.items.slice(0, 4).map((it, i) => (
        <div key={i} style={{ width: 56, height: 56, background: `radial-gradient(at 50% 50%, ${it.color}55, #000), #111`, flexShrink: 0 }} />
      ))}
      <div style={{ fontSize: 12, color: "var(--fg2)" }}>+ {order.items.length} {order.items.length === 1 ? "item" : "itens"}</div>
    </div>
  </div>
);

function AccountMobile() {
  return (
    <React.Fragment>
      <PageScroll style={{ bottom: 64 }}>
        <MobileHeader title="MINHA CONTA" showBack showSearch={false} />
        {/* Profile card */}
        <div style={{
          margin: "16px", padding: 20,
          background: "linear-gradient(135deg, #1a0006, #000)",
          border: "1px solid var(--hair)", position: "relative", overflow: "hidden",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
          <div style={{ position: "relative", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{
              width: 64, height: 64, background: "var(--bg-accent)",
              clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display-heavy)", fontSize: 22, flexShrink: 0,
            }}>DA</div>
            <div>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)", fontSize: 9 }}>// LVL 7 · DESDE 2024</span>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 22, textTransform: "uppercase", marginTop: 4 }}>FALA, DIEGO.</div>
              <div style={{ fontSize: 10, color: "var(--fg2)", marginTop: 2 }}>diego@begamersstore.com.br</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16, position: "relative" }}>
            {[["2.840", "BG COINS"], ["3", "CUPONS"], ["14", "DESEJOS"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center", padding: 10, background: "rgba(0,0,0,0.4)" }}>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, color: "var(--bg-accent-hot)" }}>{v}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--fg2)", letterSpacing: "0.14em", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu grid */}
        <div style={{ padding: "0 16px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { i: "pkg", t: "Pedidos", c: 12 },
            { i: "heart", t: "Desejos", c: 14 },
            { i: "truck", t: "Endereços" },
            { i: "bolt", t: "Cupons" },
            { i: "shield", t: "Dados" },
            { i: "lock", t: "Segurança" },
          ].map(it => (
            <a key={it.t} href="#" style={{
              padding: 16, background: "var(--surf-2)", border: "1px solid var(--hair)",
              display: "flex", flexDirection: "column", gap: 8, position: "relative",
            }}>
              <Icon name={it.i} size={22} color="var(--bg-accent-hot)" />
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}>{it.t}</div>
              {it.c && <div style={{ position: "absolute", top: 10, right: 12, fontSize: 11, color: "var(--fg2)" }}>{it.c}</div>}
            </a>
          ))}
        </div>

        {/* Latest order */}
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ marginBottom: 12 }}>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// PEDIDO ATUAL</span>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, marginTop: 4, textTransform: "uppercase" }}>#14275 · EM TRÂNSITO</div>
          </div>
          <div style={{ padding: 14, background: "var(--surf-2)", border: "1px solid var(--bg-accent-hot)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Tag tone="hot">● SAIU PARA ENTREGA</Tag>
              <span style={{ fontSize: 11, color: "var(--fg2)" }}>Chega hoje</span>
            </div>
            <div style={{ height: 4, background: "var(--surf-3)", position: "relative", marginBottom: 12 }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "85%", background: "var(--bg-accent-hot)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--fg2)", marginBottom: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
              <span>PAGO</span><span>EMBALADO</span><span style={{ color: "var(--bg-accent-hot)" }}>● TRÂNSITO</span><span>ENTREGUE</span>
            </div>
            <Btn variant="ghost" size="sm" full>Rastrear pedido →</Btn>
          </div>
        </div>

        {/* Orders list */}
        <div style={{ padding: "0 16px 32px" }}>
          <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Histórico</div>
          {[
            { n: "14102", d: "08/05", st: "ENTREGUE", c: "#4cd680", t: 829.80 },
            { n: "13988", d: "23/04", st: "ENTREGUE", c: "#4cd680", t: 249.90 },
            { n: "13845", d: "12/04", st: "ENTREGUE", c: "#4cd680", t: 1124.00 },
          ].map(o => (
            <div key={o.n} style={{ padding: 12, background: "var(--surf-1)", border: "1px solid var(--hair)", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div className="eyebrow-mono">// #{o.n}</div>
                <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 2 }}>{o.d}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ fontSize: 9, color: o.c, fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>● {o.st}</span>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14 }}>{fmtBRL(o.t)}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "0 16px 32px" }}>
          <Btn variant="ghost" size="md" full>Sair da conta</Btn>
        </div>
      </PageScroll>
      <MobileBottomNav active="me" />
    </React.Fragment>
  );
}

Object.assign(window, { AuthDesktop, AuthMobile, AccountDesktop, AccountMobile });

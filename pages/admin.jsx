/* global React, BG */
/* BeGamers Store — Admin Panel (back-office)
   Login, Dashboard, Pedidos, Financeiro, Produtos.
   Visualmente próprio (BG), mas a lógica financeira segue
   o padrão InfinitePay (recebíveis D+1, antecipação, taxas).
*/
const { useState } = React;
const { StoreLogo, VMark, Btn, Tag, Icon, PageScroll } = BG;

const fmtBRL = v => "R$ " + (v >= 0 ? "" : "−") + Math.abs(v).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/\.(?=\d{2}$)/, ",");
const fmtInt = v => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* ─────────── Admin shell ─────────── */
const SIDEBAR_W = 240;

function AdminLogo({ size = 32 }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <VMark size={size} color="#fff" accent="var(--bg-accent-hot)" />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 2 }}>
        <span style={{
          fontFamily: "var(--font-display-heavy)", fontSize: 14,
          letterSpacing: "0.02em", textTransform: "uppercase",
        }}>
          <span style={{ color: "var(--bg-accent)" }}>BE</span>GAMERS
        </span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg2)",
          letterSpacing: "0.2em", textTransform: "uppercase",
        }}>// CONSOLE ADMIN</span>
      </div>
    </div>
  );
}

function AdminSidebar({ active = "dashboard" }) {
  const NAV = [
    { sec: "VISÃO", items: [
      { k: "dashboard", t: "Dashboard", i: "grid" },
      { k: "live", t: "Live · agora", i: "bolt", live: true },
    ]},
    { sec: "VENDAS", items: [
      { k: "orders", t: "Pedidos", i: "pkg", badge: 14 },
      { k: "abandoned", t: "Carrinhos perdidos", i: "cart", badge: 38 },
      { k: "customers", t: "Clientes", i: "user" },
      { k: "discounts", t: "Cupons & promos", i: "fire" },
    ]},
    { sec: "CATÁLOGO", items: [
      { k: "products", t: "Produtos", i: "rows", badge: "2.8K" },
      { k: "categories", t: "Categorias", i: "menu" },
      { k: "inventory", t: "Estoque", i: "shield", badgeColor: "#d99a00", badge: "12 baixo" },
    ]},
    { sec: "FINANCEIRO", items: [
      { k: "financial", t: "Financeiro", i: "bolt" },
      { k: "receivables", t: "Recebíveis", i: "check" },
      { k: "fees", t: "Taxas & limites", i: "lock" },
      { k: "payouts", t: "Saques", i: "chevR" },
    ]},
    { sec: "OPERAÇÃO", items: [
      { k: "shipping", t: "Envios & logística", i: "truck" },
      { k: "tracking", t: "Rastreamentos", i: "search" },
      { k: "reviews", t: "Avaliações", i: "star", badge: 7 },
    ]},
    { sec: "MARKETING", items: [
      { k: "campaigns", t: "Campanhas", i: "fire" },
      { k: "emails", t: "E-mails & SMS", i: "instagram" },
      { k: "seo", t: "SEO", i: "eye" },
    ]},
    { sec: "CONFIG", items: [
      { k: "settings", t: "Loja", i: "shield" },
      { k: "team", t: "Equipe & permissões", i: "user" },
      { k: "integrations", t: "Integrações", i: "plus" },
    ]},
  ];

  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: SIDEBAR_W,
      background: "#050505", borderRight: "1px solid var(--hair-strong)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--hair)" }}>
        <AdminLogo />
      </div>
      {/* Quick search */}
      <div style={{ padding: 16, borderBottom: "1px solid var(--hair)" }}>
        <div style={{ position: "relative" }}>
          <Icon name="search" size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--fg3)" }} />
          <input className="bg-input" placeholder="Buscar tudo..." style={{ paddingLeft: 32, padding: "8px 12px 8px 32px", fontSize: 12 }} />
          <span style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg3)",
            border: "1px solid var(--hair-strong)", padding: "2px 5px",
          }}>⌘K</span>
        </div>
      </div>
      <nav className="no-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
        {NAV.map(s => (
          <div key={s.sec} style={{ marginBottom: 12 }}>
            <div style={{
              padding: "8px 20px 6px", fontFamily: "var(--font-mono)",
              fontSize: 9, letterSpacing: "0.18em", color: "var(--fg3)",
              textTransform: "uppercase",
            }}>// {s.sec}</div>
            {s.items.map(it => (
              <a key={it.k} href="#" style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "8px 20px", fontSize: 12,
                color: active === it.k ? "#fff" : "var(--fg2)",
                background: active === it.k ? "var(--surf-2)" : "transparent",
                borderLeft: active === it.k ? "3px solid var(--bg-accent)" : "3px solid transparent",
                fontFamily: "var(--font-display-heavy)",
                letterSpacing: "0.04em", textTransform: "uppercase",
                fontWeight: 600, marginLeft: -3,
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  {it.live && <span className="live-dot" style={{ width: 5, height: 5 }} />}
                  <Icon name={it.i} size={14} />
                </span>
                <span style={{ flex: 1 }}>{it.t}</span>
                {it.badge && (
                  <span style={{
                    fontSize: 9, fontFamily: "var(--font-mono)",
                    padding: "2px 5px", background: it.badgeColor || "var(--bg-accent)",
                    color: "#fff", letterSpacing: "0.06em",
                  }}>{it.badge}</span>
                )}
              </a>
            ))}
          </div>
        ))}
      </nav>
      {/* User block */}
      <div style={{ padding: 14, borderTop: "1px solid var(--hair-strong)", background: "#000", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          width: 32, height: 32, background: "var(--bg-accent)",
          clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display-heavy)", fontSize: 12, flexShrink: 0,
        }}>DA</span>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>Diego A.</div>
          <div style={{ fontSize: 9, color: "var(--fg2)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>OWNER · LVL ROOT</div>
        </div>
        <button style={{ background: "transparent", border: 0, color: "var(--fg2)", cursor: "pointer" }}>
          <Icon name="chevU" size={14} />
        </button>
      </div>
    </aside>
  );
}

function AdminTopbar({ title, breadcrumbs, actions }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 10,
      background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--hair-strong)",
      padding: "16px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
    }}>
      <div>
        {breadcrumbs && (
          <div style={{
            display: "flex", gap: 6, alignItems: "center",
            fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.12em",
            color: "var(--fg3)", textTransform: "uppercase", marginBottom: 6,
          }}>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                <span style={{ color: i === breadcrumbs.length - 1 ? "#fff" : "var(--fg3)" }}>{b}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 style={{
          margin: 0, fontFamily: "var(--font-display-heavy)",
          fontSize: 28, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em",
        }}>{title}</h1>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {actions}
        <button style={topBarIcon}><Icon name="bolt" size={16} /></button>
        <button style={topBarIcon}>
          <Icon name="heart" size={16} />
          <span style={{
            position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: 99,
            background: "var(--bg-accent-hot)",
          }} />
        </button>
        <button style={topBarIcon}><Icon name="instagram" size={16} /></button>
      </div>
    </div>
  );
}
const topBarIcon = {
  position: "relative", width: 36, height: 36,
  background: "var(--surf-2)", border: "1px solid var(--hair-strong)",
  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
};

const AdminShell = ({ active, title, breadcrumbs, actions, children }) => (
  <PageScroll style={{ background: "#000" }}>
    <AdminSidebar active={active} />
    <div style={{ marginLeft: SIDEBAR_W }}>
      <AdminTopbar title={title} breadcrumbs={breadcrumbs} actions={actions} />
      <div style={{ padding: 32 }}>{children}</div>
    </div>
  </PageScroll>
);

/* ─────────── LOGIN ─────────── */
function AdminLoginDesktop() {
  return (
    <PageScroll>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 540px", minHeight: "100%" }}>
        {/* Left brand panel */}
        <div style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #1a0006 0%, #000 60%)",
          padding: 56, display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div style={{
            position: "absolute", left: -80, top: 100,
            fontFamily: "var(--font-display-heavy)", fontSize: 320,
            color: "#0a0a0a", lineHeight: 0.78, letterSpacing: "-0.06em",
            textTransform: "uppercase",
          }}>ADMIN</div>
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: 80,
            background: "var(--bg-accent)",
            clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
          }} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <AdminLogo size={36} />
          </div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// CONSOLE DE OPERAÇÕES · ACESSO RESTRITO</span>
            <h1 style={{
              margin: "16px 0", fontFamily: "var(--font-display-heavy)",
              fontSize: 88, lineHeight: 0.82, textTransform: "uppercase", letterSpacing: "-0.04em",
            }}>
              CONTROLA<br />O <span style={{
                background: "var(--bg-accent)", padding: "0 12px", display: "inline-block",
                clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
              }}>SERVER.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, maxWidth: 460, lineHeight: 1.6 }}>
              Pedidos, financeiro, estoque e marketing num só lugar.
              Login com 2FA obrigatório. Toda ação fica auditada.
            </p>
          </div>
          <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              ["R$ 47K", "VENDAS HOJE"],
              ["1.247", "PEDIDOS ABERTOS"],
              ["99,2%", "UPTIME"],
            ].map(([v, l]) => (
              <div key={l} style={{ padding: 14, background: "rgba(0,0,0,0.4)", border: "1px solid var(--hair-strong)" }}>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 22, lineHeight: 1, color: "var(--bg-accent-hot)" }}>{v}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg2)", letterSpacing: "0.16em", marginTop: 6 }}>// {l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right form */}
        <div style={{ background: "#000", padding: "56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
            padding: "6px 12px", border: "1px solid var(--bg-accent)",
            alignSelf: "flex-start", clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)",
          }}>
            <Icon name="lock" size={12} color="var(--bg-accent-hot)" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>ÁREA RESTRITA · 2FA OBRIGATÓRIO</span>
          </div>

          <h2 style={{ margin: 0, fontFamily: "var(--font-display-heavy)", fontSize: 36, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 0.95 }}>
            ENTRA<br />NA OPERAÇÃO.
          </h2>
          <p style={{ color: "var(--fg2)", fontSize: 14, marginTop: 12 }}>Login da equipe BeGamers Store.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 32 }}>
            <div>
              <label style={fieldLabel}>E-MAIL CORPORATIVO</label>
              <input className="bg-input" defaultValue="diego@begamersstore.com.br" />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={fieldLabel}>SENHA</label>
                <a href="#" style={{ fontSize: 10, color: "var(--bg-accent-hot)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>RECUPERAR</a>
              </div>
              <input className="bg-input" type="password" defaultValue="••••••••••••" />
            </div>
            <div>
              <label style={fieldLabel}>CÓDIGO 2FA · APP AUTENTICADOR</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[4, 2, 7, 8, 1, 3].map((d, i) => (
                  <input key={i} className="bg-input" defaultValue={d} style={{
                    flex: 1, textAlign: "center", fontFamily: "var(--font-mono)",
                    fontSize: 22, fontWeight: 700, letterSpacing: 0, padding: "16px 0",
                  }} />
                ))}
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, fontSize: 12, color: "var(--fg2)" }}>
              <span style={{
                width: 16, height: 16, border: "1px solid var(--hair-strong)",
                background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center",
              }}><Icon name="check" size={12} stroke={2.5} /></span>
              Confiar neste dispositivo por 7 dias
            </label>
            <Btn variant="hot" size="lg" full style={{ marginTop: 8 }} icon={<Icon name="lock" size={16} />}>
              Acessar console
            </Btn>
          </div>

          <div style={{ marginTop: 32, padding: 14, background: "rgba(217,154,0,0.08)", border: "1px solid #d99a00", display: "flex", gap: 12 }}>
            <Icon name="shield" size={18} color="#ffc940" />
            <div style={{ fontSize: 11, color: "var(--fg2)", lineHeight: 1.5 }}>
              <strong style={{ color: "#ffc940" }}>Acesso monitorado.</strong> Toda ação é registrada com IP, dispositivo e timestamp. Tentativas de login falham são bloqueadas após 5 tentativas.
            </div>
          </div>

          <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--fg3)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            <span>BG ADMIN v4.12.0</span>
            <span>STATUS · OPERACIONAL ●</span>
          </div>
        </div>
      </div>
    </PageScroll>
  );
}

const fieldLabel = {
  display: "block", fontSize: 10, fontFamily: "var(--font-display-heavy)",
  letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg2)",
  marginBottom: 6,
};

/* ─────────── DASHBOARD ─────────── */
function AdminDashboard() {
  return (
    <AdminShell
      active="dashboard"
      title="DASHBOARD"
      breadcrumbs={["Visão", "Dashboard"]}
      actions={(
        <div style={{ display: "flex", gap: 8 }}>
          <select className="bg-input" style={{ padding: "8px 12px", fontSize: 12, width: 160 }}>
            <option>Últimos 7 dias</option>
            <option>Hoje</option>
            <option>30 dias</option>
            <option>Este ano</option>
          </select>
          <Btn variant="ghost" size="sm">Exportar</Btn>
          <Btn variant="hot" size="sm" icon={<Icon name="plus" size={14} />}>Novo pedido</Btn>
        </div>
      )}
    >
      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { l: "VENDAS HOJE", v: "R$ 47.284", d: "+18,4%", c: "#4cd680", sparkline: [3, 5, 4, 6, 8, 7, 9] },
          { l: "PEDIDOS", v: "184", d: "+12%", c: "#4cd680", sparkline: [4, 6, 5, 7, 6, 8, 10] },
          { l: "TICKET MÉDIO", v: "R$ 257", d: "−2,1%", c: "#ff6b6b", sparkline: [7, 8, 6, 7, 5, 6, 5] },
          { l: "CONVERSÃO", v: "3,84%", d: "+0,4pp", c: "#4cd680", sparkline: [3, 4, 4, 5, 4, 5, 6] },
        ].map(k => (
          <div key={k.l} style={{ padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)", position: "relative", overflow: "hidden" }}>
            <div className="eyebrow-mono">// {k.l}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
              <div>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 30, lineHeight: 1, letterSpacing: "-0.02em" }}>{k.v}</div>
                <div style={{ fontSize: 11, color: k.c, marginTop: 6, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>{k.d.startsWith("+") ? "▲" : "▼"} {k.d.slice(1)} vs período anterior</div>
              </div>
              <Sparkline data={k.sparkline} color={k.c} />
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        {/* Sales chart */}
        <div style={{ padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// FATURAMENTO · ÚLTIMOS 7 DIAS</div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 1 }}>R$ 287.940,12</span>
                <span style={{ fontSize: 12, color: "#4cd680", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>▲ +24,8%</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--fg2)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, background: "var(--bg-accent-hot)" }} /> ESTE PERÍODO
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, background: "var(--hair-strong)" }} /> ANTERIOR
              </span>
            </div>
          </div>
          <AreaChart />
        </div>

        {/* Live activity */}
        <div style={{ padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
            <div className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="live-dot" /> ATIVIDADE AO VIVO
            </div>
            <span style={{ fontSize: 10, color: "var(--fg3)", fontFamily: "var(--font-mono)" }}>247 USUÁRIOS ONLINE</span>
          </div>
          <div className="no-scrollbar" style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 280, overflowY: "auto" }}>
            {[
              { t: "PEDIDO #14328", d: "VIPER X9 + HYDRA HD", v: "R$ 778,90", st: "PAGO", c: "#4cd680", ago: "agora" },
              { t: "CARRINHO ABANDONADO", d: "Hoodie RANKED", v: "R$ 249,90", st: "1H", c: "#d99a00", ago: "2min" },
              { t: "PEDIDO #14327", d: "Monitor 240Hz VOID Pro", v: "R$ 2.199,00", st: "PIX", c: "#4cd680", ago: "5min" },
              { t: "CADASTRO", d: "marcos.s@gmail.com · São Paulo", v: "", st: "NOVO", c: "#fff", ago: "8min" },
              { t: "PEDIDO #14326", d: "DEMON KEY 87", v: "R$ 689,00", st: "PIX", c: "#4cd680", ago: "12min" },
              { t: "TROCA SOLICITADA", d: "#14102 · Headset", v: "R$ 329,00", st: "ABRIR", c: "var(--bg-accent-hot)", ago: "18min" },
              { t: "PEDIDO #14325", d: "Action Figure Cyber Samurai", v: "R$ 899,00", st: "BOLETO", c: "#a3a3a3", ago: "22min" },
              { t: "REVIEW 5★", d: "VIPER X9 · diego_clutch", v: "", st: "PUB.", c: "#4cd680", ago: "26min" },
            ].map((e, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, paddingBottom: 12, borderBottom: i < 7 ? "1px solid var(--hair)" : "0" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.06em" }}>{e.t}</div>
                  <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 2 }}>{e.d}</div>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  {e.v && <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12 }}>{e.v}</div>}
                  <span style={{ fontSize: 9, color: e.c, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>● {e.st} · {e.ago}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
        {/* Top products */}
        <div style={{ padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span className="eyebrow-mono">// TOP PRODUTOS · 7 DIAS</span>
            <a href="#" style={{ fontSize: 10, color: "var(--fg2)", textDecoration: "underline" }}>Ver todos →</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "VIPER X9 — Mouse 26K", u: 142, v: 63856, color: "#cc0000" },
              { n: "DEMON KEY 87 — Teclado", u: 87, v: 59943, color: "#7a1a8a" },
              { n: "HYDRA HD — Headset 7.1", u: 124, v: 40796, color: "#1a6f8a" },
              { n: "Hoodie RANKED", u: 78, v: 19472, color: "#cc0000" },
              { n: "ICEPAD XL — Mousepad", u: 198, v: 23741, color: "#222" },
            ].map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, background: `radial-gradient(at 50% 50%, ${p.color}55, #000), #111` }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.3 }}>{p.n}</div>
                  <div style={{ fontSize: 10, color: "var(--fg2)", marginTop: 2 }}>{p.u} unidades</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13 }}>{fmtBRL(p.v)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial snapshot */}
        <div style={{ padding: 20, background: "linear-gradient(135deg, #1a0006 0%, #000 60%)", border: "1px solid var(--bg-accent)", position: "relative", overflow: "hidden" }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
          <div style={{ position: "relative" }}>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// CAIXA · SALDO DISPONÍVEL</span>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 40, lineHeight: 1, marginTop: 12 }}>R$ 38.472</div>
            <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 6 }}>R$ 247.840 a receber · 23 lotes</div>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--hair)" }}>
                <span style={{ fontSize: 11, color: "var(--fg2)" }}>Recebido hoje</span>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13, color: "#4cd680" }}>+R$ 12.847,93</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--hair)" }}>
                <span style={{ fontSize: 11, color: "var(--fg2)" }}>Taxas (média 2,4%)</span>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13, color: "#ff6b6b" }}>−R$ 308,35</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                <span style={{ fontSize: 11, color: "var(--fg2)" }}>Estornos</span>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13 }}>0</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              <Btn variant="hot" size="sm" full>Antecipar</Btn>
              <Btn variant="outline" size="sm" full>Sacar</Btn>
            </div>
          </div>
        </div>

        {/* Inventory alerts */}
        <div style={{ padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span className="eyebrow-mono" style={{ color: "#d99a00" }}>// ESTOQUE · ATENÇÃO</span>
            <Tag tone="warning">12 ITENS</Tag>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { n: "VIPER X9 · Phantom Red", q: 8, low: 20, c: "#ff6b6b" },
              { n: "Hoodie RANKED · M", q: 3, low: 10, c: "#ff6b6b" },
              { n: "DEMON KEY · Linear Red", q: 12, low: 25, c: "#d99a00" },
              { n: "Cyber Samurai 1/6", q: 5, low: 10, c: "#d99a00" },
              { n: "HYDRA HD · Black", q: 18, low: 30, c: "#d99a00" },
            ].map((p, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{p.n}</span>
                  <span style={{ color: p.c, fontWeight: 700 }}>{p.q}/{p.low}</span>
                </div>
                <div style={{ height: 3, background: "var(--surf-3)" }}>
                  <div style={{ width: (p.q / p.low * 100) + "%", height: "100%", background: p.c }} />
                </div>
              </div>
            ))}
          </div>
          <Btn variant="ghost" size="sm" full style={{ marginTop: 16 }}>Reabastecer todos →</Btn>
        </div>
      </div>

      {/* Recent orders quick */}
      <div style={{ marginTop: 16, padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// ÚLTIMOS PEDIDOS</span>
          <a href="#" style={{ fontSize: 10, color: "var(--fg2)", textDecoration: "underline" }}>Ver todos · 1.247 →</a>
        </div>
        <OrderTableMini />
      </div>
    </AdminShell>
  );
}

const Sparkline = ({ data, color = "var(--bg-accent-hot)" }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 90, h = 36;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / (max - min)) * h} r={3} fill={color} />
    </svg>
  );
};

const AreaChart = () => {
  const w = 720, h = 260;
  const data = [42, 58, 51, 78, 65, 92, 110];
  const prev = [38, 42, 48, 55, 60, 68, 72];
  const max = 120;
  const buildPath = (arr, base) => {
    const pts = arr.map((v, i) => `${(i / (arr.length - 1)) * w},${h - (v / max) * (h - 30) - 10}`);
    return base ? `M 0,${h} L ${pts.join(" L ")} L ${w},${h} Z` : `M ${pts.join(" L ")}`;
  };
  const labels = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: h, display: "block" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bg-accent-hot)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--bg-accent-hot)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1={0} x2={w} y1={(h / 4) * i + 10} y2={(h / 4) * i + 10} stroke="var(--hair)" strokeDasharray="2 4" />
        ))}
        {/* previous (line) */}
        <path d={buildPath(prev, false)} fill="none" stroke="var(--hair-strong)" strokeWidth={2} strokeDasharray="4 4" />
        {/* current (area) */}
        <path d={buildPath(data, true)} fill="url(#areaGrad)" />
        <path d={buildPath(data, false)} fill="none" stroke="var(--bg-accent-hot)" strokeWidth={2.5} />
        {/* dots */}
        {data.map((v, i) => (
          <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (v / max) * (h - 30) - 10} r={4} fill="var(--bg-accent-hot)" />
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--fg3)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
};

const OrderTableMini = () => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr style={{ background: "var(--surf-2)", color: "var(--fg2)" }}>
          {["PEDIDO", "CLIENTE", "ITENS", "PAGAMENTO", "ENVIO", "VALOR", "STATUS", ""].map((h, i) => (
            <th key={i} style={{ ...thStyle, textAlign: i === 5 ? "right" : "left" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          { n: "14328", c: "Diego Andrade · SP", it: "VIPER X9 + HYDRA HD", pay: "PIX", env: "BG Express", v: 778.90, st: "PAGO", stc: "#4cd680" },
          { n: "14327", c: "Marina Costa · RJ", it: "Monitor 240Hz", pay: "CARTÃO 12x", env: "BG Padrão", v: 2199.00, st: "EMBALANDO", stc: "#d99a00" },
          { n: "14326", c: "Rafael Lima · MG", it: "DEMON KEY 87", pay: "PIX", env: "BG Express", v: 689.00, st: "EM ROTA", stc: "var(--bg-accent-hot)" },
          { n: "14325", c: "Camila Santos · SP", it: "Cyber Samurai 1/6", pay: "BOLETO", env: "BG Padrão", v: 899.00, st: "AGUARDANDO", stc: "#a3a3a3" },
          { n: "14324", c: "Bruno Tavares · DF", it: "Hoodie RANKED + 2", pay: "PIX", env: "BG Next Day", v: 549.80, st: "ENTREGUE", stc: "#4cd680" },
        ].map(o => (
          <tr key={o.n} style={{ borderTop: "1px solid var(--hair)" }}>
            <td style={tdStyle}><span style={{ fontFamily: "var(--font-mono)", color: "#fff" }}>#{o.n}</span></td>
            <td style={tdStyle}>{o.c}</td>
            <td style={{ ...tdStyle, color: "var(--fg2)" }}>{o.it}</td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 11 }}>{o.pay}</td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 11 }}>{o.env}</td>
            <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-display-heavy)" }}>{fmtBRL(o.v)}</td>
            <td style={tdStyle}><span style={{ fontSize: 10, color: o.stc, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>● {o.st}</span></td>
            <td style={tdStyle}><Icon name="chevR" size={14} color="var(--fg3)" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const thStyle = { padding: "10px 12px", fontFamily: "var(--font-display-heavy)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "left" };
const tdStyle = { padding: "12px", verticalAlign: "middle" };

/* ─────────── ORDERS ─────────── */
function AdminOrders() {
  return (
    <AdminShell
      active="orders"
      title="PEDIDOS"
      breadcrumbs={["Vendas", "Pedidos"]}
      actions={(
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="ghost" size="sm" icon={<Icon name="filter" size={14} />}>Filtros · 3</Btn>
          <Btn variant="ghost" size="sm">Exportar CSV</Btn>
          <Btn variant="hot" size="sm" icon={<Icon name="plus" size={14} />}>Novo pedido</Btn>
        </div>
      )}
    >
      {/* Status counts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 24 }}>
        {[
          { t: "TODOS", n: "1.247", c: "#fff", sel: true },
          { t: "AGUARDANDO", n: "38", c: "#a3a3a3" },
          { t: "EM SEPARAÇÃO", n: "24", c: "#d99a00" },
          { t: "ENVIADOS", n: "112", c: "var(--bg-accent-hot)" },
          { t: "ENTREGUES", n: "1.058", c: "#4cd680" },
          { t: "PROBLEMAS", n: "15", c: "#ff6b6b" },
        ].map(s => (
          <button key={s.t} style={{
            padding: "14px 16px", textAlign: "left", cursor: "pointer",
            background: s.sel ? "var(--surf-2)" : "var(--surf-1)",
            border: s.sel ? "1px solid var(--bg-accent)" : "1px solid var(--hair)",
            borderLeft: s.sel ? "3px solid var(--bg-accent)" : "3px solid " + s.c,
            color: "#fff",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", color: "var(--fg2)" }}>{s.t}</div>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 24, marginTop: 4, lineHeight: 1, color: s.c }}>{s.n}</div>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{
        padding: 14, background: "var(--surf-1)", border: "1px solid var(--hair)",
        display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap",
      }}>
        <span className="eyebrow-mono">// FILTROS</span>
        {[
          "Período: 20/05 – 22/05",
          "Pagamento: PIX, Cartão",
          "Envio: Express",
        ].map(f => (
          <span key={f} style={{
            padding: "5px 10px", background: "var(--bg-accent)", color: "#fff",
            fontSize: 11, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.06em",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>{f} <Icon name="x" size={10} /></span>
        ))}
        <a href="#" style={{ fontSize: 11, color: "var(--fg2)", textDecoration: "underline", marginLeft: 8 }}>Limpar</a>
        <div style={{ flex: 1 }} />
        <select className="bg-input" style={{ padding: "6px 10px", fontSize: 11, width: 180 }}>
          <option>Mais recentes</option>
          <option>Maior valor</option>
          <option>Mais antigos</option>
        </select>
      </div>

      {/* Big table */}
      <div style={{ background: "var(--surf-1)", border: "1px solid var(--hair)", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hair)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "var(--fg2)" }}>
            <span style={{
              width: 16, height: 16, border: "1px solid var(--hair-strong)",
              background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center",
            }}><Icon name="check" size={11} stroke={2.5} /></span>
            <span><strong style={{ color: "#fff" }}>3</strong> pedidos selecionados</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn variant="ghost" size="sm">Marcar enviado</Btn>
            <Btn variant="ghost" size="sm">Imprimir etiquetas</Btn>
            <Btn variant="ghost" size="sm">Reembolsar</Btn>
          </div>
        </div>
        <OrdersFullTable />
        {/* Pagination */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--hair)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--fg2)" }}>Mostrando 1–10 de 1.247 pedidos</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button style={pageBtn}>‹</button>
            {[1, 2, 3, 4, "...", 125].map((n, i) => (
              <button key={i} style={n === 1 ? { ...pageBtn, background: "var(--bg-accent)" } : pageBtn}>{n}</button>
            ))}
            <button style={pageBtn}>›</button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
const pageBtn = { width: 30, height: 30, background: "transparent", border: "1px solid var(--hair-strong)", color: "#fff", fontFamily: "var(--font-display-heavy)", fontSize: 12, cursor: "pointer" };

const OrdersFullTable = () => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr style={{ background: "var(--surf-2)", color: "var(--fg2)" }}>
          <th style={{ ...thStyle, width: 30 }}></th>
          {["PEDIDO", "DATA", "CLIENTE", "ITENS", "PAGAMENTO", "ENVIO", "VALOR", "STATUS", "RASTREIO", ""].map((h, i) => (
            <th key={i} style={{ ...thStyle, textAlign: h === "VALOR" ? "right" : "left" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          { n: "14328", date: "22/05 09:14", c: "Diego Andrade", e: "diego@begamersstore.com.br", it: 2, pay: "PIX", env: "BG Express", v: 778.90, st: "PAGO", stc: "#4cd680", track: "BG-RT-87Q2", sel: true },
          { n: "14327", date: "22/05 08:47", c: "Marina Costa", e: "marina.c@gmail.com", it: 1, pay: "CARTÃO 12x", env: "BG Padrão", v: 2199.00, st: "EMBALANDO", stc: "#d99a00", track: "—", sel: true },
          { n: "14326", date: "22/05 08:12", c: "Rafael Lima", e: "rafa.lima@outlook.com", it: 1, pay: "PIX", env: "BG Express", v: 689.00, st: "EM ROTA", stc: "var(--bg-accent-hot)", track: "BG-RT-91P8" },
          { n: "14325", date: "22/05 07:58", c: "Camila Santos", e: "camila.s@gmail.com", it: 1, pay: "BOLETO", env: "BG Padrão", v: 899.00, st: "AGUARDANDO", stc: "#a3a3a3", track: "—" },
          { n: "14324", date: "21/05 22:34", c: "Bruno Tavares", e: "bruno.t@hotmail.com", it: 4, pay: "PIX", env: "BG Next Day", v: 549.80, st: "ENTREGUE", stc: "#4cd680", track: "BG-RT-74N3" },
          { n: "14323", date: "21/05 21:12", c: "Letícia Mendes", e: "letm@gmail.com", it: 2, pay: "CARTÃO 6x", env: "BG Express", v: 1239.50, st: "ENTREGUE", stc: "#4cd680", track: "BG-RT-72X1", sel: true },
          { n: "14322", date: "21/05 19:48", c: "Pedro Henrique", e: "ph.silva@gmail.com", it: 3, pay: "PIX", env: "BG Padrão", v: 487.30, st: "DEVOLVIDO", stc: "#ff6b6b", track: "BG-RT-71K4" },
          { n: "14321", date: "21/05 17:22", c: "Juliana Reis", e: "juli.r@yahoo.com", it: 1, pay: "PIX", env: "BG Eco", v: 89.90, st: "ENTREGUE", stc: "#4cd680", track: "BG-RT-69M2" },
          { n: "14320", date: "21/05 16:01", c: "Marcos Vieira", e: "m.vieira@gmail.com", it: 5, pay: "CARTÃO 10x", env: "BG Express", v: 2847.20, st: "ENTREGUE", stc: "#4cd680", track: "BG-RT-68V7" },
          { n: "14319", date: "21/05 14:18", c: "Carolina Dias", e: "carold@gmail.com", it: 2, pay: "PIX", env: "Retira loja", v: 348.80, st: "RETIRADO", stc: "#4cd680", track: "—" },
        ].map(o => (
          <tr key={o.n} style={{ borderTop: "1px solid var(--hair)", background: o.sel ? "rgba(255,31,61,0.04)" : "transparent" }}>
            <td style={tdStyle}>
              <span style={{
                width: 14, height: 14, border: "1px solid var(--hair-strong)",
                background: o.sel ? "var(--bg-accent)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{o.sel && <Icon name="check" size={10} stroke={2.5} />}</span>
            </td>
            <td style={tdStyle}><span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>#{o.n}</span></td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg2)" }}>{o.date}</td>
            <td style={tdStyle}>
              <div style={{ fontSize: 11 }}>{o.c}</div>
              <div style={{ fontSize: 10, color: "var(--fg3)" }}>{o.e}</div>
            </td>
            <td style={{ ...tdStyle, color: "var(--fg2)" }}>{o.it} {o.it === 1 ? "item" : "itens"}</td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 10 }}>{o.pay}</td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 10 }}>{o.env}</td>
            <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-display-heavy)" }}>{fmtBRL(o.v)}</td>
            <td style={tdStyle}><span style={{ fontSize: 9, color: o.stc, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>● {o.st}</span></td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg3)" }}>{o.track}</td>
            <td style={tdStyle}><Icon name="chevR" size={14} color="var(--fg3)" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─────────── FINANCIAL ─────────── */
function AdminFinancial() {
  return (
    <AdminShell
      active="financial"
      title="FINANCEIRO"
      breadcrumbs={["Financeiro", "Visão Geral"]}
      actions={(
        <div style={{ display: "flex", gap: 8 }}>
          <select className="bg-input" style={{ padding: "8px 12px", fontSize: 12, width: 160 }}>
            <option>Maio 2026</option>
            <option>Abril 2026</option>
          </select>
          <Btn variant="ghost" size="sm">Extrato PDF</Btn>
          <Btn variant="ghost" size="sm">Conciliar</Btn>
          <Btn variant="hot" size="sm" icon={<Icon name="bolt" size={14} />}>Antecipar recebíveis</Btn>
        </div>
      )}
    >
      {/* Balance card */}
      <div style={{
        position: "relative", overflow: "hidden", marginBottom: 24,
        background: "linear-gradient(135deg, #cc0000 0%, #1a0006 60%, #000 100%)",
        border: "1px solid var(--bg-accent)", padding: 32,
      }}>
        <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32, alignItems: "center" }}>
          <div>
            <span className="eyebrow-mono">// SALDO TOTAL · BG WALLET</span>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 56, lineHeight: 1, marginTop: 12, letterSpacing: "-0.03em" }}>R$ 286.312<span style={{ fontSize: 28, opacity: 0.7 }}>,47</span></div>
            <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
              <span style={{ color: "#4cd680" }}>▲ +R$ 47.284 hoje</span>
              <span style={{ color: "var(--fg2)" }}>· 23 lotes pendentes</span>
            </div>
          </div>
          {[
            { l: "DISPONÍVEL HOJE", v: "R$ 38.472", c: "#4cd680" },
            { l: "A RECEBER (D+1...D+30)", v: "R$ 247.840", c: "#fff" },
            { l: "ANTECIPÁVEL", v: "R$ 198.227", c: "var(--bg-accent-hot)" },
          ].map(b => (
            <div key={b.l}>
              <div className="eyebrow-mono">// {b.l}</div>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 1, color: b.c, marginTop: 8 }}>{b.v}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "relative", display: "flex", gap: 10, marginTop: 28 }}>
          <Btn variant="dark" size="md" icon={<Icon name="bolt" size={14} />}>Antecipar tudo · R$ 198.227</Btn>
          <Btn variant="outline" size="md">Sacar para Itaú ••••3271</Btn>
          <Btn variant="ghost" size="md">Histórico de saques</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--hair-strong)", marginBottom: 24, gap: 0 }}>
        {["EXTRATO", "RECEBÍVEIS", "TAXAS & TARIFAS", "SAQUES", "ANTECIPAÇÕES", "CHARGEBACKS", "RELATÓRIOS"].map((t, i) => (
          <button key={t} style={{
            background: "transparent", border: 0, padding: "14px 22px",
            color: i === 0 ? "#fff" : "var(--fg2)",
            borderBottom: i === 0 ? "3px solid var(--bg-accent)" : "3px solid transparent",
            fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: "pointer", marginBottom: -1,
          }}>{t}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>
        {/* Cashflow chart */}
        <div style={{ padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// FLUXO DE CAIXA · 14 DIAS</span>
              <div style={{ marginTop: 8, display: "flex", gap: 24 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 1, color: "#4cd680" }}>+R$ 487K</div>
                  <div style={{ fontSize: 10, color: "var(--fg2)", letterSpacing: "0.1em", marginTop: 4 }}>ENTRADAS</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 1, color: "#ff6b6b" }}>−R$ 89K</div>
                  <div style={{ fontSize: 10, color: "var(--fg2)", letterSpacing: "0.1em", marginTop: 4 }}>SAÍDAS · TAXAS + ESTORNOS</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 1 }}>R$ 398K</div>
                  <div style={{ fontSize: 10, color: "var(--fg2)", letterSpacing: "0.1em", marginTop: 4 }}>RESULTADO</div>
                </div>
              </div>
            </div>
          </div>
          <CashflowChart />
        </div>

        {/* Payment mix */}
        <div style={{ padding: 20, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// MIX DE PAGAMENTOS · 30 DIAS</span>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { n: "PIX", p: 58, v: "R$ 167.420", c: "#4cd680", taxa: "0,99% · D+0" },
              { n: "CARTÃO CRÉDITO", p: 32, v: "R$ 92.358", c: "var(--bg-accent-hot)", taxa: "2,49% à vista · 3,49% parcelado" },
              { n: "BOLETO", p: 7, v: "R$ 20.211", c: "#a3a3a3", taxa: "R$ 3,49/boleto" },
              { n: "BG WALLET (cashback)", p: 3, v: "R$ 8.654", c: "#7a1a8a", taxa: "0% · liquidação instantânea" },
            ].map(m => (
              <div key={m.n}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.06em" }}>{m.n}</span>
                  <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12 }}>{m.p}%</span>
                </div>
                <div style={{ height: 6, background: "var(--surf-3)", marginBottom: 6 }}>
                  <div style={{ height: "100%", width: m.p + "%", background: m.c }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--fg2)", fontFamily: "var(--font-mono)" }}>
                  <span>{m.v}</span>
                  <span>{m.taxa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recebíveis table */}
      <div style={{ marginTop: 16, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--hair)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// EXTRATO · ÚLTIMAS MOVIMENTAÇÕES</span>
            <div style={{ marginTop: 6, fontFamily: "var(--font-display-heavy)", fontSize: 18, textTransform: "uppercase" }}>247 lançamentos hoje</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="bg-input" style={{ padding: "6px 10px", fontSize: 11, width: 140 }}>
              <option>Todos os tipos</option>
              <option>Recebimentos</option>
              <option>Taxas</option>
              <option>Estornos</option>
              <option>Saques</option>
            </select>
          </div>
        </div>
        <ExtratoTable />
      </div>
    </AdminShell>
  );
}

const CashflowChart = () => {
  const w = 720, h = 260;
  const days = 14;
  const ins = [28, 32, 41, 38, 52, 65, 72, 58, 48, 38, 42, 51, 62, 78];
  const outs = [4, 5, 6, 5, 8, 9, 11, 8, 6, 5, 6, 7, 9, 12];
  const max = 90;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: h, display: "block" }}>
        {/* grid */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1={0} x2={w} y1={(h / 4) * i + 10} y2={(h / 4) * i + 10} stroke="var(--hair)" strokeDasharray="2 4" />
        ))}
        {/* bars */}
        {ins.map((v, i) => {
          const x = (i / days) * w + 6;
          const bw = w / days - 12;
          const inH = (v / max) * (h - 20);
          const outH = (outs[i] / max) * (h - 20);
          return (
            <g key={i}>
              <rect x={x} y={h - 10 - inH} width={bw} height={inH} fill="#4cd680" />
              <rect x={x} y={h - 10 - inH - outH} width={bw} height={outH} fill="var(--bg-accent-hot)" opacity="0.7" />
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--fg3)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
        <span>09/05</span><span>12/05</span><span>15/05</span><span>18/05</span><span>22/05</span>
      </div>
    </div>
  );
};

const ExtratoTable = () => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr style={{ background: "var(--surf-2)", color: "var(--fg2)" }}>
          {["DATA · HORA", "TIPO", "REFERÊNCIA", "DESCRIÇÃO", "BRUTO", "TAXA", "LÍQUIDO", "STATUS", "LIQUIDAÇÃO"].map((h, i) => (
            <th key={h} style={{ ...thStyle, textAlign: i >= 4 && i <= 6 ? "right" : "left" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          { d: "22/05 10:14", t: "RECEBIMENTO", tc: "#4cd680", ref: "#14328 · PIX", desc: "VIPER X9 + HYDRA HD", b: 778.90, taxa: -7.71, l: 771.19, st: "LIQUIDADO", stc: "#4cd680", liq: "Hoje" },
          { d: "22/05 09:58", t: "RECEBIMENTO", tc: "#4cd680", ref: "#14327 · CARTÃO 12x", desc: "Monitor 240Hz VOID Pro", b: 2199.00, taxa: -76.75, l: 2122.25, st: "AGENDADO", stc: "#d99a00", liq: "01/06" },
          { d: "22/05 09:12", t: "RECEBIMENTO", tc: "#4cd680", ref: "#14326 · PIX", desc: "DEMON KEY 87", b: 689.00, taxa: -6.82, l: 682.18, st: "LIQUIDADO", stc: "#4cd680", liq: "Hoje" },
          { d: "22/05 08:42", t: "ANTECIPAÇÃO", tc: "var(--bg-accent-hot)", ref: "ANT-2024-2847", desc: "Antecipação de 12 recebíveis", b: 24847.50, taxa: -397.56, l: 24449.94, st: "LIQUIDADO", stc: "#4cd680", liq: "Hoje" },
          { d: "22/05 08:30", t: "TAXA", tc: "#ff6b6b", ref: "MENSALIDADE BG", desc: "Mensalidade plano Pro", b: 0, taxa: -49.90, l: -49.90, st: "DEBITADO", stc: "#ff6b6b", liq: "22/05" },
          { d: "21/05 22:48", t: "RECEBIMENTO", tc: "#4cd680", ref: "#14323 · CARTÃO 6x", desc: "RTX 5070 + Mouse + 1", b: 1239.50, taxa: -43.30, l: 1196.20, st: "AGENDADO", stc: "#d99a00", liq: "01/06" },
          { d: "21/05 19:22", t: "ESTORNO", tc: "#ff6b6b", ref: "#14302 · CHARGEBACK", desc: "Solicitação cliente · análise", b: -348.80, taxa: 0, l: -348.80, st: "BLOQUEADO", stc: "#ff6b6b", liq: "—" },
          { d: "21/05 17:08", t: "SAQUE", tc: "#a3a3a3", ref: "TED · Itaú ••••3271", desc: "Saque solicitado", b: -45000.00, taxa: -8.50, l: -45008.50, st: "EFETIVADO", stc: "#4cd680", liq: "21/05" },
        ].map((r, i) => (
          <tr key={i} style={{ borderTop: "1px solid var(--hair)" }}>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg2)" }}>{r.d}</td>
            <td style={tdStyle}><span style={{ fontSize: 10, color: r.tc, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.1em" }}>● {r.t}</span></td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 10 }}>{r.ref}</td>
            <td style={{ ...tdStyle, color: "var(--fg2)" }}>{r.desc}</td>
            <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-mono)" }}>{r.b !== 0 ? (r.b > 0 ? fmtBRL(r.b) : "−" + fmtBRL(Math.abs(r.b))) : "—"}</td>
            <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-mono)", color: r.taxa < 0 ? "#ff6b6b" : "var(--fg2)" }}>{r.taxa !== 0 ? "−" + fmtBRL(Math.abs(r.taxa)) : "—"}</td>
            <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-display-heavy)", color: r.l >= 0 ? "#fff" : "#ff6b6b" }}>{r.l >= 0 ? fmtBRL(r.l) : "−" + fmtBRL(Math.abs(r.l))}</td>
            <td style={tdStyle}><span style={{ fontSize: 9, color: r.stc, fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>● {r.st}</span></td>
            <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg2)" }}>{r.liq}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─────────── PRODUCTS ─────────── */
function AdminProducts() {
  const { PRODUCTS } = BG;
  return (
    <AdminShell
      active="products"
      title="PRODUTOS"
      breadcrumbs={["Catálogo", "Produtos"]}
      actions={(
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="ghost" size="sm" icon={<Icon name="filter" size={14} />}>Filtros</Btn>
          <Btn variant="ghost" size="sm">Importar CSV</Btn>
          <Btn variant="hot" size="sm" icon={<Icon name="plus" size={14} />}>Novo produto</Btn>
        </div>
      )}
    >
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { l: "TOTAL", v: "2.847", c: "#fff" },
          { l: "ATIVOS", v: "2.541", c: "#4cd680" },
          { l: "RASCUNHO", v: "187", c: "#a3a3a3" },
          { l: "FORA DE ESTOQUE", v: "84", c: "#d99a00" },
          { l: "ARQUIVADOS", v: "35", c: "var(--fg3)" },
        ].map(s => (
          <div key={s.l} style={{ padding: 16, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
            <div className="eyebrow-mono">// {s.l}</div>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 26, color: s.c, marginTop: 6, lineHeight: 1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 16, alignItems: "center",
        padding: 12, background: "var(--surf-1)", border: "1px solid var(--hair)",
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Icon name="search" size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--fg3)" }} />
          <input className="bg-input" placeholder="Buscar por nome, SKU, marca..." style={{ paddingLeft: 36, padding: "8px 12px 8px 36px" }} />
        </div>
        <select className="bg-input" style={{ padding: "8px 12px", fontSize: 12, width: 160 }}>
          <option>Todas categorias</option>
          <option>Periféricos</option>
          <option>Streetwear</option>
        </select>
        <select className="bg-input" style={{ padding: "8px 12px", fontSize: 12, width: 140 }}>
          <option>Todas marcas</option>
        </select>
        <Btn variant="ghost" size="sm">Mais filtros</Btn>
      </div>

      <div style={{ background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--hair)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--fg2)" }}>Mostrando 1–8 de 2.847 produtos</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button style={{ ...viewToggle, background: "var(--bg-accent)" }}><Icon name="rows" size={12} /></button>
            <button style={viewToggle}><Icon name="grid" size={12} /></button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--surf-2)", color: "var(--fg2)" }}>
                <th style={{ ...thStyle, width: 30 }}></th>
                {["", "PRODUTO", "SKU", "CATEGORIA", "PREÇO", "ESTOQUE", "VENDIDOS 30D", "STATUS", ""].map((h, i) => (
                  <th key={i} style={{ ...thStyle, textAlign: h === "PREÇO" || h === "ESTOQUE" || h === "VENDIDOS 30D" ? "right" : "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.slice(0, 8).map(p => (
                <tr key={p.id} style={{ borderTop: "1px solid var(--hair)" }}>
                  <td style={tdStyle}>
                    <span style={{ width: 14, height: 14, border: "1px solid var(--hair-strong)", display: "block" }} />
                  </td>
                  <td style={tdStyle}>
                    <div style={{ width: 44, height: 44, background: `radial-gradient(at 50% 50%, ${p.color}55, #000), #111` }} />
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: 12, fontWeight: 600, maxWidth: 280 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: "var(--fg3)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{p.brand}</div>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 10 }}>BG-{1000 + p.id}-{p.cat.slice(0, 3).toUpperCase()}</td>
                  <td style={{ ...tdStyle, color: "var(--fg2)", fontSize: 11 }}>{p.cat}</td>
                  <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-display-heavy)" }}>{fmtBRL(p.price)}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <span style={{ color: p.id % 4 === 0 ? "#d99a00" : (p.id % 7 === 0 ? "#ff6b6b" : "#fff"), fontFamily: "var(--font-mono)" }}>
                      {p.id % 7 === 0 ? "0" : (p.id % 4 === 0 ? "8" : (50 + p.id * 7))}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right", fontFamily: "var(--font-mono)", color: "var(--fg2)" }}>{p.count > 1000 ? Math.round(p.count / 5) : p.count}</td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: 9, color: p.id % 7 === 0 ? "#d99a00" : "#4cd680", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>
                      ● {p.id % 7 === 0 ? "SEM ESTOQUE" : "ATIVO"}
                    </span>
                  </td>
                  <td style={tdStyle}><Icon name="chevR" size={14} color="var(--fg3)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
const viewToggle = {
  width: 28, height: 28, background: "transparent", border: "1px solid var(--hair-strong)",
  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};

Object.assign(window, { AdminLoginDesktop, AdminDashboard, AdminOrders, AdminFinancial, AdminProducts, AdminSidebar, AdminTopbar, AdminShell, AdminLogo });

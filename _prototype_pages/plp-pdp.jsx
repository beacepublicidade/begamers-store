/* global React, BG */
const { useState } = React;
const { StoreHeader, MobileHeader, MobileBottomNav, StoreFooter, ProductCard, PRODUCTS, Btn, Tag, Icon, Stars, Price, SectionHead, PageScroll } = BG;

/* ─────────── PLP — Listagem de categoria ─────────── */
function PLPDesktop() {
  return (
    <PageScroll>
      <StoreHeader active="PERIFÉRICOS" />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px 64px" }}>
        {/* breadcrumbs */}
        <nav style={{
          display: "flex", gap: 8, alignItems: "center",
          fontSize: 11, fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--fg3)", marginBottom: 24,
        }}>
          <a href="#" style={{ color: "var(--fg2)" }}>HOME</a>
          <span>/</span>
          <a href="#" style={{ color: "var(--fg2)" }}>LOJA</a>
          <span>/</span>
          <span style={{ color: "#fff" }}>PERIFÉRICOS</span>
        </nav>

        {/* hero */}
        <div style={{
          position: "relative", overflow: "hidden", marginBottom: 32,
          background: "linear-gradient(135deg, #1a0006 0%, #000 50%)",
          padding: "40px 48px",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// CATEGORIA</span>
              <h1 style={{
                margin: "10px 0", fontFamily: "var(--font-display-heavy)",
                fontSize: 80, lineHeight: 0.9, textTransform: "uppercase", letterSpacing: "-0.03em",
              }}>PERIFÉRICOS.</h1>
              <p style={{ margin: 0, color: "var(--fg2)", maxWidth: 540 }}>
                Mouses, teclados, headsets, mousepads. Tudo o que separa o casual do clutch.
              </p>
            </div>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 56, lineHeight: 1 }}>248</div>
              <div className="eyebrow-mono">// PRODUTOS DISPONÍVEIS</div>
            </div>
          </div>
        </div>

        {/* Sub-categories pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {["Todos", "Mouse", "Teclado", "Headset", "Mousepad", "Webcam", "Microfone", "Cadeira"].map((c, i) => (
            <span key={c} style={{
              padding: "10px 18px",
              background: i === 0 ? "var(--bg-accent)" : "transparent",
              border: i === 0 ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
              color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "var(--font-display-heavy)", cursor: "pointer",
            }}>{c}</span>
          ))}
        </div>

        {/* Filters + products */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32 }}>
          {/* filters */}
          <aside>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase" }}>FILTROS</span>
              <a href="#" style={{ fontSize: 11, color: "var(--fg2)", textDecoration: "underline" }}>Limpar</a>
            </div>

            {[
              { t: "PREÇO", c: <PriceFilter /> },
              { t: "MARCA", c: <FilterCheckList items={[["BeGamers Lab", 84], ["Logitech", 42], ["Razer", 38], ["HyperX", 31], ["Corsair", 28], ["SteelSeries", 24]]} /> },
              { t: "AVALIAÇÃO", c: <FilterStars /> },
              { t: "TIPO DE MOUSE", c: <FilterCheckList items={[["Sem fio", 56], ["Com fio", 89], ["Ultraleve", 24], ["Ambidestro", 41]]} /> },
              { t: "COR", c: <FilterColors /> },
              { t: "FRETE", c: <FilterCheckList items={[["Frete grátis", 124], ["Chega amanhã", 67]]} /> },
            ].map(f => (
              <div key={f.t} style={{ borderBottom: "1px solid var(--hair)", padding: "16px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>{f.t}</span>
                  <Icon name="minus" size={14} color="var(--fg2)" />
                </div>
                {f.c}
              </div>
            ))}
          </aside>

          {/* products */}
          <div>
            {/* sort bar */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 16px", border: "1px solid var(--hair)", marginBottom: 16,
              background: "var(--surf-1)",
            }}>
              <div style={{ fontSize: 12, color: "var(--fg2)" }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>248 produtos</span> · página 1 de 13
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <button style={{ ...viewBtn, background: "var(--bg-accent)" }}><Icon name="grid" size={14} /></button>
                  <button style={viewBtn}><Icon name="rows" size={14} /></button>
                </div>
                <select className="bg-input" style={{ padding: "8px 12px", width: 220, fontSize: 12 }}>
                  <option>Ordenar: Mais relevantes</option>
                  <option>Menor preço</option>
                  <option>Maior preço</option>
                  <option>Mais vendidos</option>
                  <option>Mais avaliados</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[...PRODUCTS, ...PRODUCTS].slice(0, 9).map((p, i) => <ProductCard key={i} p={p} />)}
            </div>

            {/* pagination */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40, gap: 6 }}>
              <button style={pageBtn}>‹</button>
              {[1, 2, 3, 4, 5, "...", 13].map((n, i) => (
                <button key={i} style={n === 1 ? { ...pageBtn, background: "var(--bg-accent)", borderColor: "var(--bg-accent)" } : pageBtn}>{n}</button>
              ))}
              <button style={pageBtn}>›</button>
            </div>
          </div>
        </div>
      </main>
      <StoreFooter />
    </PageScroll>
  );
}

const viewBtn = {
  width: 32, height: 32, background: "transparent",
  border: "1px solid var(--hair-strong)", color: "#fff",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};
const pageBtn = {
  width: 36, height: 36, background: "transparent",
  border: "1px solid var(--hair-strong)", color: "#fff",
  fontFamily: "var(--font-display-heavy)", fontSize: 13, cursor: "pointer",
};

const PriceFilter = () => (
  <div>
    <div style={{ display: "flex", gap: 6 }}>
      <input className="bg-input" placeholder="Min" defaultValue="0" style={{ padding: "8px 10px", fontSize: 12 }} />
      <input className="bg-input" placeholder="Max" defaultValue="2000" style={{ padding: "8px 10px", fontSize: 12 }} />
    </div>
    <div style={{ height: 4, background: "var(--surf-3)", marginTop: 14, position: "relative" }}>
      <div style={{ position: "absolute", left: "10%", right: "30%", top: 0, bottom: 0, background: "var(--bg-accent)" }} />
      <span style={{ position: "absolute", left: "10%", top: -5, transform: "translateX(-50%)", width: 14, height: 14, background: "#fff", borderRadius: 99 }} />
      <span style={{ position: "absolute", left: "70%", top: -5, transform: "translateX(-50%)", width: 14, height: 14, background: "#fff", borderRadius: 99 }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--fg3)", marginTop: 8 }}>
      <span>R$ 200</span>
      <span>R$ 1.400</span>
    </div>
  </div>
);

const FilterCheckList = ({ items }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {items.map(([label, n], i) => (
      <label key={label} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <span style={{
          width: 16, height: 16, border: "1px solid var(--hair-strong)",
          background: i === 0 ? "var(--bg-accent)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{i === 0 && <Icon name="check" size={12} stroke={2.5} />}</span>
        <span style={{ flex: 1, fontSize: 12, color: i === 0 ? "#fff" : "var(--fg2)" }}>{label}</span>
        <span style={{ fontSize: 10, color: "var(--fg3)" }}>{n}</span>
      </label>
    ))}
  </div>
);

const FilterStars = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {[5, 4, 3].map(s => (
      <label key={s} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <span style={{ width: 16, height: 16, border: "1px solid var(--hair-strong)" }} />
        <Stars value={s} showNumber={false} size={11} />
        <span style={{ fontSize: 11, color: "var(--fg2)" }}>+ acima</span>
      </label>
    ))}
  </div>
);

const FilterColors = () => (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {["#000", "#fff", "#cc0000", "#1a4a8a", "#7a1a8a", "#0e4a1f", "#ff6f00", "#888"].map((c, i) => (
      <span key={c} style={{
        width: 28, height: 28, background: c,
        border: i === 2 ? "2px solid #fff" : "1px solid var(--hair-strong)",
        cursor: "pointer", position: "relative",
      }}>{i === 2 && <Icon name="check" size={12} color={c === "#fff" ? "#000" : "#fff"} style={{ position: "absolute", top: 7, left: 7 }} stroke={2.5} />}</span>
    ))}
  </div>
);

function PLPMobile() {
  return (
    <React.Fragment>
      <PageScroll style={{ bottom: 124 }}>
        <MobileHeader title="PERIFÉRICOS" subtitle="248 produtos" showBack />
        {/* Hero compact */}
        <div style={{
          padding: "20px 16px", position: "relative",
          background: "linear-gradient(135deg, #1a0006, #000)",
        }}>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// CATEGORIA</span>
          <h1 style={{ margin: "8px 0 4px", fontFamily: "var(--font-display-heavy)", fontSize: 40, lineHeight: 0.9, textTransform: "uppercase" }}>PERIFÉRICOS.</h1>
          <p style={{ margin: 0, fontSize: 12, color: "var(--fg2)" }}>Mouse, teclado, headset, mousepad.</p>
        </div>

        {/* Sub-pills */}
        <div className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "12px 16px", borderBottom: "1px solid var(--hair)" }}>
          {["Todos", "Mouse", "Teclado", "Headset", "Mousepad", "Cadeira"].map((c, i) => (
            <span key={c} style={{
              flexShrink: 0, padding: "6px 12px",
              background: i === 0 ? "var(--bg-accent)" : "transparent",
              border: i === 0 ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
              color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "var(--font-display-heavy)",
            }}>{c}</span>
          ))}
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 16px", borderBottom: "1px solid var(--hair)",
          fontSize: 11, color: "var(--fg2)",
        }}>
          <span>248 produtos</span>
          <span>Mais relevantes ↓</span>
        </div>

        {/* Grid */}
        <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[...PRODUCTS, ...PRODUCTS].slice(0, 10).map((p, i) => <ProductCard key={i} p={p} size="sm" />)}
        </div>

        <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
          <Btn variant="ghost" size="md">Carregar mais 248 →</Btn>
        </div>
      </PageScroll>
      {/* Floating filter bar */}
      <div style={{
        position: "absolute", bottom: 64, left: 0, right: 0,
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(14px)",
        borderTop: "1px solid var(--hair-strong)", padding: 12,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, zIndex: 5,
      }}>
        <button style={filterBarBtn}><Icon name="filter" size={14} /> FILTROS · 2</button>
        <button style={filterBarBtn}><Icon name="rows" size={14} /> ORDENAR</button>
      </div>
      <MobileBottomNav active="home" />
    </React.Fragment>
  );
}
const filterBarBtn = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  padding: "10px 14px", background: "var(--surf-2)", border: "1px solid var(--hair-strong)", color: "#fff",
  fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
  cursor: "pointer",
};

/* ─────────── PDP — Página de produto ─────────── */
function PDPDesktop() {
  const p = PRODUCTS[0];
  return (
    <PageScroll>
      <StoreHeader />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px 64px" }}>
        <nav style={{
          display: "flex", gap: 8, alignItems: "center",
          fontSize: 11, fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--fg3)", marginBottom: 24,
        }}>
          <a href="#" style={{ color: "var(--fg2)" }}>HOME</a>
          <span>/</span>
          <a href="#" style={{ color: "var(--fg2)" }}>PERIFÉRICOS</a>
          <span>/</span>
          <a href="#" style={{ color: "var(--fg2)" }}>MOUSE</a>
          <span>/</span>
          <span style={{ color: "#fff" }}>VIPER X9</span>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48, marginBottom: 64 }}>
          {/* Gallery */}
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="placeholder-grad" style={{
                  width: 80, height: 80, border: i === 0 ? "2px solid var(--bg-accent)" : "1px solid var(--hair)",
                  background: `radial-gradient(at 50% 50%, ${p.color}55, #000), #111`,
                }} />
              ))}
            </div>
            <div className="placeholder-grad" style={{
              position: "relative", aspectRatio: "1 / 1",
              background: `radial-gradient(at 50% 50%, ${p.color}66, transparent 60%), linear-gradient(135deg, #181818, #050505)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--hair)",
            }}>
              <div style={{
                width: "65%", height: "65%",
                background: `linear-gradient(180deg, ${p.color}, #000)`,
                clipPath: "polygon(20% 5%, 80% 0, 95% 30%, 90% 75%, 75% 100%, 25% 100%, 10% 75%, 5% 30%)",
                boxShadow: "0 0 100px rgba(255,31,61,0.4)",
              }} />
              <Tag tone="hot" style={{ position: "absolute", top: 16, left: 16 }}>−25% OFF</Tag>
              <Tag tone="red" style={{ position: "absolute", top: 16, left: 80 }}>NOVO</Tag>
              <button style={{
                position: "absolute", top: 16, right: 16,
                width: 40, height: 40, background: "rgba(0,0,0,0.7)",
                border: "1px solid var(--hair-strong)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}><Icon name="heart" size={18} /></button>
              <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 6 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <span key={i} style={{ width: i === 0 ? 24 : 6, height: 4, background: i === 0 ? "var(--bg-accent)" : "rgba(255,255,255,0.3)" }} />
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// {p.brand}</span>
              <span style={{ color: "var(--fg3)", fontSize: 11 }}>SKU 0001-VPRX9</span>
            </div>
            <h1 style={{
              margin: 0, fontFamily: "var(--font-display-heavy)",
              fontSize: 44, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em",
            }}>{p.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
              <Stars value={p.rating} count={p.count} size={14} />
              <span style={{ color: "var(--fg3)", fontSize: 12 }}>|</span>
              <a href="#" style={{ fontSize: 12, color: "var(--fg2)", textDecoration: "underline" }}>{p.count} avaliações</a>
              <span style={{ color: "var(--fg3)", fontSize: 12 }}>|</span>
              <span style={{ fontSize: 12, color: "var(--c-success, #4cd680)" }}>● Em estoque</span>
            </div>

            {/* Price block */}
            <div style={{
              marginTop: 24, padding: 24,
              background: "var(--surf-1)", border: "1px solid var(--hair)",
            }}>
              <Price value={p.price} old={p.old} size="lg" />
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Tag tone="success">10% OFF NO PIX</Tag>
                <Tag tone="outline">FRETE GRÁTIS</Tag>
                <Tag tone="neutral">CHEGA EM 2 DIAS</Tag>
              </div>
            </div>

            {/* Variants */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>COR <span style={{ color: "var(--fg2)" }}>· Phantom Red</span></span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ c: "#cc0000", n: "Phantom Red", sel: true }, { c: "#0a0a0a", n: "Stealth" }, { c: "#fff", n: "Ghost" }].map(v => (
                  <button key={v.n} style={{
                    width: 56, height: 56, background: v.c, cursor: "pointer",
                    border: v.sel ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
                    boxShadow: v.sel ? "var(--neon-glow)" : "none",
                  }} />
                ))}
              </div>
            </div>

            {/* CEP */}
            <div style={{ marginTop: 24, padding: 16, border: "1px solid var(--hair)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>CALCULAR FRETE</span>
                <Icon name="truck" size={16} color="var(--fg2)" />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input className="bg-input" placeholder="00000-000" defaultValue="01310-100" style={{ flex: 1 }} />
                <Btn variant="ghost" size="md">OK</Btn>
              </div>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { t: "SEDEX · Chega 23/05", p: "Grátis" },
                  { t: "PAC · Chega 27/05", p: "R$ 12,90" },
                  { t: "Retira na loja · SP", p: "Grátis" },
                ].map(o => (
                  <div key={o.t} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "var(--fg2)" }}>{o.t}</span>
                    <span style={{ color: o.p === "Grátis" ? "#4cd680" : "#fff", fontWeight: 700 }}>{o.p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + Buy */}
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--hair-strong)" }}>
                <button style={{ width: 40, height: 48, background: "transparent", border: 0, color: "#fff", cursor: "pointer" }}>−</button>
                <span style={{ width: 40, textAlign: "center", fontFamily: "var(--font-display-heavy)", fontSize: 16 }}>1</span>
                <button style={{ width: 40, height: 48, background: "transparent", border: 0, color: "#fff", cursor: "pointer" }}>+</button>
              </div>
              <Btn variant="hot" size="lg" full icon={<Icon name="cart" size={18} />}>Adicionar ao carrinho</Btn>
            </div>
            <Btn variant="outline" size="lg" full style={{ marginTop: 8 }}>Comprar agora</Btn>

            {/* Trust */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { i: "shield", t: "GARANTIA 12 MESES" },
                { i: "pkg", t: "TROCA EM 30 DIAS" },
                { i: "bolt", t: "POSTAGEM EM 24H" },
                { i: "lock", t: "PAGAMENTO SEGURO" },
              ].map(t => (
                <div key={t.t} style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
                  <Icon name={t.i} size={20} color="var(--bg-accent-hot)" />
                  <span style={{ fontSize: 11, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.08em" }}>{t.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderTop: "1px solid var(--hair-strong)", paddingTop: 48 }}>
          <div style={{ display: "flex", gap: 32, borderBottom: "1px solid var(--hair)", marginBottom: 32 }}>
            {["Descrição", "Especificações", `Avaliações (${p.count})`, "Perguntas", "Vídeo"].map((t, i) => (
              <button key={t} style={{
                background: "transparent", border: 0, color: i === 0 ? "#fff" : "var(--fg2)",
                padding: "12px 0", borderBottom: i === 0 ? "3px solid var(--bg-accent)" : "3px solid transparent",
                fontFamily: "var(--font-display-heavy)", fontSize: 13,
                letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              }}>{t}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48 }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, textTransform: "uppercase", margin: "0 0 16px", letterSpacing: "-0.01em" }}>FEITO PARA O CLUTCH.</h3>
              <p style={{ color: "var(--fg2)", lineHeight: 1.7 }}>
                O VIPER X9 é o nosso melhor mouse até hoje. Sensor óptico de 26.000 DPI, switches ópticos com 90 milhões de cliques, 90 horas de bateria e apenas 58g. Em qualquer ranqueada, em qualquer torneio, em qualquer hora — você não fica esperando.
              </p>
              <p style={{ color: "var(--fg2)", lineHeight: 1.7 }}>
                Conectividade tri-modal: 2.4GHz sem fio, Bluetooth 5.3, USB-C. Compatível com Windows, macOS, Linux e PS5. Software BeGamers Sync inclui macros, perfis e RGB.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
                {[
                  { n: "26K", l: "DPI máximo" },
                  { n: "90h", l: "Bateria contínua" },
                  { n: "58g", l: "Peso ultraleve" },
                  { n: "8K", l: "Polling rate Hz" },
                ].map(s => (
                  <div key={s.l} style={{ padding: 16, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
                    <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 1 }}>{s.n}</div>
                    <div style={{ fontSize: 11, color: "var(--fg2)", marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "var(--surf-1)", border: "1px solid var(--hair)", padding: 24 }}>
              <span className="eyebrow-mono">// ESPECIFICAÇÕES TÉCNICAS</span>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column" }}>
                {[
                  ["Sensor", "BG Optical 26K"], ["DPI", "100 — 26.000"], ["Polling rate", "8000 Hz"],
                  ["Switches", "Ópticos · 90M cliques"], ["Botões", "8 programáveis"],
                  ["Bateria", "90h (RGB off)"], ["Conexão", "2.4GHz / BT / USB-C"],
                  ["Peso", "58g (sem cabo)"], ["Cabo", "USB-C paracord 1.8m"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--hair)", fontSize: 13 }}>
                    <span style={{ color: "var(--fg2)" }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <div style={{ marginTop: 64 }}>
          <SectionHead eyebrow="JOGUE COM" title="Combina com." link="Setup completo" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {PRODUCTS.slice(1, 5).map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </main>
      <StoreFooter />
    </PageScroll>
  );
}

function PDPMobile() {
  const p = PRODUCTS[0];
  return (
    <React.Fragment>
      <PageScroll style={{ bottom: 84 }}>
        <MobileHeader showSearch={false} showBack />
        {/* gallery */}
        <div className="placeholder-grad" style={{
          position: "relative", aspectRatio: "1 / 1",
          background: `radial-gradient(at 50% 50%, ${p.color}66, transparent 60%), linear-gradient(135deg, #181818, #050505)`,
        }}>
          <div style={{
            position: "absolute", left: "20%", top: "20%", width: "60%", height: "60%",
            background: `linear-gradient(180deg, ${p.color}, #000)`,
            clipPath: "polygon(20% 5%, 80% 0, 95% 30%, 90% 75%, 75% 100%, 25% 100%, 10% 75%, 5% 30%)",
          }} />
          <Tag tone="hot" style={{ position: "absolute", top: 12, left: 12 }}>−25%</Tag>
          <button style={{
            position: "absolute", top: 12, right: 12,
            width: 36, height: 36, background: "rgba(0,0,0,0.7)",
            border: "1px solid var(--hair-strong)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="heart" size={16} /></button>
          <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <span key={i} style={{ width: i === 0 ? 16 : 5, height: 3, background: i === 0 ? "#fff" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        </div>
        {/* Thumbnails */}
        <div className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "12px 16px" }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 56, height: 56, flexShrink: 0,
              background: `radial-gradient(at 50% 50%, ${p.color}44, #000)`,
              border: i === 0 ? "2px solid var(--bg-accent)" : "1px solid var(--hair)",
            }} />
          ))}
        </div>
        {/* Info */}
        <div style={{ padding: "0 16px 16px" }}>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// {p.brand}</span>
          <h1 style={{
            margin: "8px 0", fontFamily: "var(--font-display-heavy)",
            fontSize: 22, lineHeight: 1.05, textTransform: "uppercase", letterSpacing: "-0.01em",
          }}>{p.name}</h1>
          <Stars value={p.rating} count={p.count} size={12} />
          <div style={{ marginTop: 16, padding: 14, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
            <Price value={p.price} old={p.old} size="md" />
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              <Tag tone="success">10% PIX</Tag>
              <Tag tone="outline">FRETE GRÁTIS</Tag>
            </div>
          </div>
          {/* color */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>COR · Phantom Red</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ c: "#cc0000", s: true }, { c: "#0a0a0a" }, { c: "#fff" }].map((v, i) => (
                <button key={i} style={{
                  width: 44, height: 44, background: v.c,
                  border: v.s ? "2px solid var(--bg-accent-hot)" : "1px solid var(--hair-strong)",
                  boxShadow: v.s ? "var(--neon-glow)" : "none",
                }} />
              ))}
            </div>
          </div>
          {/* CEP */}
          <div style={{ marginTop: 16, padding: 12, border: "1px solid var(--hair)" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input className="bg-input" placeholder="CEP" defaultValue="01310-100" style={{ flex: 1, padding: "8px 10px", fontSize: 12 }} />
              <Btn variant="ghost" size="sm">OK</Btn>
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "var(--fg2)" }}>SEDEX · 23/05</span>
              <span style={{ color: "#4cd680", fontWeight: 700 }}>Grátis</span>
            </div>
          </div>
          {/* Description */}
          <div style={{ marginTop: 24, borderTop: "1px solid var(--hair)", paddingTop: 20 }}>
            <h3 style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, textTransform: "uppercase", margin: "0 0 10px" }}>FEITO PARA O CLUTCH.</h3>
            <p style={{ color: "var(--fg2)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Sensor 26K DPI, switches ópticos com 90M cliques, 90h de bateria e apenas 58g. Tri-modal, RGB e software BeGamers Sync.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
              {[["26K", "DPI"], ["90h", "Bateria"], ["58g", "Peso"], ["8K", "Hz Polling"]].map(([n, l]) => (
                <div key={l} style={{ padding: 12, background: "var(--surf-1)", border: "1px solid var(--hair)" }}>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 24, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 10, color: "var(--fg2)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Related */}
          <div style={{ marginTop: 24 }}>
            <SectionHead mobile eyebrow="JOGUE COM" title="Combina com." />
            <div className="no-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", marginLeft: -16, marginRight: -16, padding: "0 16px" }}>
              {PRODUCTS.slice(1, 5).map(p => (
                <div key={p.id} style={{ width: 180, flexShrink: 0 }}><ProductCard p={p} size="sm" /></div>
              ))}
            </div>
          </div>
        </div>
      </PageScroll>
      {/* Sticky buy bar */}
      <div style={{
        position: "absolute", bottom: 64, left: 0, right: 0,
        background: "rgba(0,0,0,0.95)", backdropFilter: "blur(14px)",
        borderTop: "1px solid var(--hair-strong)", padding: 12,
        display: "flex", gap: 10, alignItems: "center", zIndex: 5,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, lineHeight: 1 }}>R$ 449,90</div>
          <div style={{ fontSize: 10, color: "#4cd680", fontWeight: 700 }}>R$ 404,91 no PIX</div>
        </div>
        <Btn variant="hot" size="md" icon={<Icon name="cart" size={16} />}>Adicionar</Btn>
      </div>
      <MobileBottomNav active="home" />
    </React.Fragment>
  );
}

Object.assign(window, { PLPDesktop, PLPMobile, PDPDesktop, PDPMobile });

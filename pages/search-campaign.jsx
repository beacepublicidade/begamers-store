/* global React, BG */
const { StoreHeader, MobileHeader, MobileBottomNav, StoreFooter, ProductCard, PRODUCTS, Btn, Tag, Icon, Stars, Price, SectionHead, StoreLogo, PageScroll } = BG;

/* ─────────── SEARCH ─────────── */
function SearchDesktop() {
  return (
    <PageScroll>
      <StoreHeader />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Mega search */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)", flexShrink: 0 }}>// VOCÊ BUSCOU POR</span>
          <span style={{ flex: 1, height: 1, background: "var(--hair)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16, gap: 24 }}>
          <h1 style={{
            margin: 0, fontFamily: "var(--font-display-heavy)",
            fontSize: 64, lineHeight: 0.9, textTransform: "uppercase", letterSpacing: "-0.03em",
          }}>"mouse <span style={{ color: "var(--bg-accent-hot)" }}>gamer</span>"</h1>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--fg2)", letterSpacing: "0.06em" }}>
            <span style={{ color: "#fff", fontWeight: 700 }}>87 resultados</span> em 0,14s
          </div>
        </div>

        {/* Did you mean / refine */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--fg3)", marginRight: 6 }}>Refinar:</span>
          {["Sem fio", "Ultraleve", "RGB", "8000Hz", "Até R$ 500", "BeGamers Lab", "Logitech"].map((c, i) => (
            <span key={c} style={{
              padding: "6px 12px",
              background: i < 2 ? "var(--bg-accent)" : "transparent",
              border: i < 2 ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "var(--font-display-heavy)", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>{c} {i < 2 && <Icon name="x" size={10} />}</span>
          ))}
          <a href="#" style={{ fontSize: 11, color: "var(--fg2)", textDecoration: "underline", marginLeft: 8 }}>Limpar filtros</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
          {/* Results */}
          <div>
            {/* Top product highlight */}
            <div style={{ marginBottom: 24 }}>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// MAIS RELEVANTE</span>
              <div style={{
                marginTop: 12,
                display: "grid", gridTemplateColumns: "280px 1fr auto", gap: 24,
                padding: 20, background: "linear-gradient(135deg, #1a0006, #000)",
                border: "1px solid var(--bg-accent)", alignItems: "center",
              }}>
                <div style={{
                  width: 280, height: 200,
                  background: `radial-gradient(at 50% 50%, ${PRODUCTS[0].color}66, transparent 60%), #111`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: "60%", height: "70%",
                    background: `linear-gradient(180deg, ${PRODUCTS[0].color}, #000)`,
                    clipPath: "polygon(20% 5%, 80% 0, 95% 30%, 90% 75%, 75% 100%, 25% 100%, 10% 75%, 5% 30%)",
                  }} />
                </div>
                <div>
                  <Tag tone="hot">⚡ MELHOR RESULTADO</Tag>
                  <h3 style={{ margin: "12px 0 8px", fontFamily: "var(--font-display-heavy)", fontSize: 28, textTransform: "uppercase", letterSpacing: "-0.01em" }}>{PRODUCTS[0].name}</h3>
                  <Stars value={PRODUCTS[0].rating} count={PRODUCTS[0].count} size={13} />
                  <p style={{ color: "var(--fg2)", fontSize: 13, marginTop: 12 }}>
                    Sensor 26K DPI · 90h bateria · 58g ultraleve · Tri-modal. Top-rated em mouse gamer 2026.
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Price value={PRODUCTS[0].price} old={PRODUCTS[0].old} size="lg" />
                  <Btn variant="hot" size="md" style={{ marginTop: 14 }}>Comprar →</Btn>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[...PRODUCTS, ...PRODUCTS].slice(0, 9).map((p, i) => <ProductCard key={i} p={p} />)}
            </div>
          </div>

          {/* Side rail — also searched */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ padding: 20, border: "1px solid var(--hair)", background: "var(--surf-1)" }}>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// QUEM BUSCOU "MOUSE GAMER"</span>
              <h4 style={{ margin: "10px 0 16px", fontFamily: "var(--font-display-heavy)", fontSize: 16, textTransform: "uppercase" }}>Também buscou</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Mouse sem fio", "Mouse 8000Hz", "Mousepad XL", "Teclado mecânico", "Headset gamer 7.1"].map((t, i) => (
                  <a key={t} href="#" style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--fg2)", padding: "6px 0", borderBottom: "1px solid var(--hair)" }}>
                    <span>{t}</span>
                    <span style={{ color: "var(--fg3)", fontSize: 11 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ padding: 20, background: "linear-gradient(135deg, #cc0000, #4a0006)", position: "relative", overflow: "hidden" }}>
              <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
              <div style={{ position: "relative" }}>
                <span className="eyebrow-mono">// AJUDA DO TIME</span>
                <h4 style={{ margin: "10px 0", fontFamily: "var(--font-display-heavy)", fontSize: 22, lineHeight: 0.95, textTransform: "uppercase" }}>FALA COM A GENTE NO DISCORD.</h4>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: "0 0 14px" }}>Recomendação ao vivo de mouse pro teu setup.</p>
                <Btn variant="dark" size="sm">Abrir Discord →</Btn>
              </div>
            </div>

            <div style={{ padding: 20, border: "1px solid var(--hair)" }}>
              <span className="eyebrow-mono">// BUSCAS RECENTES</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {["teclado tkl", "rtx 5070", "hoodie ranked", "cadeira", "controle ps5"].map(t => (
                  <a key={t} href="#" style={{
                    padding: "5px 10px", border: "1px solid var(--hair-strong)", fontSize: 11,
                    color: "var(--fg2)", textTransform: "lowercase",
                  }}>{t} ×</a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <StoreFooter />
    </PageScroll>
  );
}

function SearchMobile() {
  return (
    <PageScroll>
      {/* Search-focused header */}
      <div style={{ background: "#000", padding: "44px 12px 12px", borderBottom: "1px solid var(--hair)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={{ background: "transparent", border: 0, color: "#fff", padding: 6 }}><Icon name="chevL" size={22} /></button>
          <div style={{ flex: 1, position: "relative" }}>
            <Icon name="search" size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--fg3)" }} />
            <input className="bg-input" defaultValue="mouse gamer" autoFocus style={{ paddingLeft: 38, paddingRight: 38, padding: "10px 38px", fontSize: 14 }} />
            <button style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: 0, color: "var(--fg2)" }}>
              <Icon name="x" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero summary */}
      <div style={{ padding: "20px 16px 12px" }}>
        <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// 87 RESULTADOS · 0,14S</span>
        <h1 style={{ margin: "6px 0 0", fontFamily: "var(--font-display-heavy)", fontSize: 30, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
          "MOUSE <span style={{ color: "var(--bg-accent-hot)" }}>GAMER</span>"
        </h1>
      </div>

      {/* Refine pills */}
      <div className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 16px", borderBottom: "1px solid var(--hair)" }}>
        {["Sem fio", "Ultraleve", "RGB", "8000Hz", "Até R$ 500"].map((c, i) => (
          <span key={c} style={{
            flexShrink: 0, padding: "5px 10px",
            background: i < 2 ? "var(--bg-accent)" : "transparent",
            border: i < 2 ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
            fontFamily: "var(--font-display-heavy)", display: "inline-flex", gap: 4, alignItems: "center",
          }}>{c} {i < 2 && <Icon name="x" size={10} />}</span>
        ))}
      </div>

      {/* Top result hero */}
      <div style={{ padding: 16 }}>
        <Tag tone="hot" style={{ marginBottom: 8 }}>⚡ MELHOR RESULTADO</Tag>
        <div style={{ background: "linear-gradient(135deg, #1a0006, #000)", border: "1px solid var(--bg-accent)" }}>
          <div style={{
            aspectRatio: "1.6 / 1",
            background: `radial-gradient(at 50% 50%, ${PRODUCTS[0].color}66, transparent 60%), #111`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: "50%", height: "70%",
              background: `linear-gradient(180deg, ${PRODUCTS[0].color}, #000)`,
              clipPath: "polygon(20% 5%, 80% 0, 95% 30%, 90% 75%, 75% 100%, 25% 100%, 10% 75%, 5% 30%)",
            }} />
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 16, textTransform: "uppercase" }}>{PRODUCTS[0].name}</div>
            <Stars value={PRODUCTS[0].rating} count={PRODUCTS[0].count} size={12} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
              <Price value={PRODUCTS[0].price} old={PRODUCTS[0].old} size="sm" />
              <Btn variant="hot" size="sm">Comprar →</Btn>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 16px", borderTop: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)",
        fontSize: 11, color: "var(--fg2)",
      }}>
        <span>OUTROS RESULTADOS</span>
        <span>Mais relevantes ↓</span>
      </div>

      {/* Results grid */}
      <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[...PRODUCTS, ...PRODUCTS].slice(0, 10).map((p, i) => <ProductCard key={i} p={p} size="sm" />)}
      </div>
    </PageScroll>
  );
}

/* ─────────── BLACK FRIDAY / CAMPANHA ─────────── */
function CampaignDesktop() {
  return (
    <PageScroll style={{ background: "#000" }}>
      <StoreHeader active="OFERTAS" />

      {/* HERO — full bleed campaign */}
      <section style={{
        position: "relative", height: 760, overflow: "hidden",
        background: "linear-gradient(180deg, #000 0%, #1a0006 50%, #000 100%)",
      }}>
        {/* huge text */}
        <div style={{
          position: "absolute", left: -60, top: 80,
          fontFamily: "var(--font-display-heavy)", fontSize: 360,
          color: "#0a0a0a", lineHeight: 0.78, letterSpacing: "-0.05em",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>BLACK<br />GAMER</div>
        {/* red slash */}
        <div style={{
          position: "absolute", top: "30%", right: 0, width: "60%", height: 200,
          background: "var(--bg-accent)",
          clipPath: "polygon(0 30%, 100% 0, 100% 70%, 0 100%)",
          opacity: 0.95,
        }} />
        {/* grain */}
        <div className="grain" style={{ position: "absolute", inset: 0 }} />

        <div style={{ position: "relative", zIndex: 3, maxWidth: 1280, margin: "0 auto", padding: "80px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{
              padding: "8px 14px", background: "#fff", color: "#000",
              fontFamily: "var(--font-display-heavy)", fontSize: 13, letterSpacing: "0.14em",
              clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)",
            }}>● AO VIVO</span>
            <span className="eyebrow-mono" style={{ color: "#fff" }}>// 25/11 — 29/11/2026 · 5 DIAS</span>
          </div>
          <h1 style={{
            margin: 0, fontFamily: "var(--font-display-heavy)",
            fontSize: 168, lineHeight: 0.82, textTransform: "uppercase", letterSpacing: "-0.05em",
          }}>
            BLACK<br />
            GAMER<br />
            <span style={{ color: "var(--bg-accent-hot)", textShadow: "0 0 40px rgba(255,31,61,0.6)" }}>WEEK.</span>
          </h1>

          {/* Countdown */}
          <div style={{ marginTop: 48, display: "flex", gap: 16, alignItems: "flex-end" }}>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// ACABA EM</span>
            {[["02", "DIAS"], ["14", "HRS"], ["38", "MIN"], ["52", "SEG"]].map(([n, l], i) => (
              <React.Fragment key={l}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{
                    fontFamily: "var(--font-display-heavy)", fontSize: 80, lineHeight: 0.9,
                    background: "rgba(0,0,0,0.6)", border: "1px solid var(--hair-strong)",
                    padding: "8px 16px", minWidth: 100, textAlign: "center",
                    color: l === "SEG" ? "var(--bg-accent-hot)" : "#fff",
                  }}>{n}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg2)", letterSpacing: "0.16em", textAlign: "center" }}>{l}</div>
                </div>
                {i < 3 && <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 60, color: "var(--bg-accent-hot)", marginBottom: 22 }}>:</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Headline stats */}
      <section style={{ background: "var(--bg-accent)", color: "#fff", padding: "32px 0", overflow: "hidden", position: "relative", borderTop: "2px solid #000", borderBottom: "2px solid #000" }}>
        <div style={{
          display: "flex", gap: 80, whiteSpace: "nowrap",
          animation: "tickerScroll 25s linear infinite",
          fontFamily: "var(--font-display-heavy)", fontSize: 56,
          letterSpacing: "-0.02em", textTransform: "uppercase",
          alignItems: "center",
        }}>
          {Array(3).fill(0).map((_, n) => (
            <React.Fragment key={n}>
              <span>ATÉ 70% OFF</span><span>///</span>
              <span>FRETE GRÁTIS BR</span><span>///</span>
              <span>+10% NO PIX</span><span>///</span>
              <span>12X SEM JUROS</span><span>///</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Deal categories */}
      <section style={{ padding: "64px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead eyebrow="OFERTAS POR CATEGORIA" title="ESCOLHE SEU LADO." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { t: "PERIFÉRICOS", n: "ATÉ −60%", c: "#cc0000", count: 78 },
            { t: "HARDWARE", n: "ATÉ −40%", c: "#1a4a8a", count: 42 },
            { t: "STREETWEAR", n: "ATÉ −50%", c: "#7a1a4a", count: 31 },
            { t: "CONSOLE", n: "ATÉ −35%", c: "#7a1a8a", count: 24 },
          ].map(c => (
            <a key={c.t} href="#" style={{
              padding: 24, minHeight: 220, position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, ${c.c}aa, #050505)`,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              border: "1px solid var(--hair-strong)",
            }}>
              <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
              <div style={{ position: "relative" }}>
                <span className="eyebrow-mono">// {c.count} OFERTAS</span>
                <h3 style={{ margin: "8px 0 0", fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 1, textTransform: "uppercase" }}>{c.t}</h3>
              </div>
              <div style={{ position: "relative", fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 1 }}>
                {c.n} <Icon name="chevR" size={20} style={{ display: "inline" }} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Daily deals */}
      <section style={{ background: "linear-gradient(180deg, #000, #1a0006 50%, #000)", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// DEAL DO DIA · ACABA EM 6H 42M</span>
              <h2 style={{ margin: "12px 0 0", fontFamily: "var(--font-display-heavy)", fontSize: 56, textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: 0.95 }}>OS MAIS QUENTES.</h2>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--fg2)" }}>
              <span>🔥 84 vendidos hoje</span>
              <span>👀 12.4K pessoas vendo</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {PRODUCTS.slice(0, 4).map(p => (
              <div key={p.id} style={{ position: "relative" }}>
                <ProductCard p={{ ...p, tags: [...(p.tags || []), "−60%"] }} />
                {/* extra "stock left" bar */}
                <div style={{
                  position: "absolute", bottom: 80, left: 18, right: 18, zIndex: 2,
                  display: "flex", flexDirection: "column", gap: 4,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--fg2)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    <span>RESTAM 18</span><span>de 100</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.1)" }}>
                    <div style={{ height: "100%", width: "18%", background: "var(--bg-accent-hot)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mega list */}
      <section style={{ padding: "64px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead eyebrow="TODOS OS DEALS" title="DEU CABEÇA. DEU BLACK." link="Ver 247 ofertas" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[...PRODUCTS, ...PRODUCTS].slice(4, 12).map((p, i) => <ProductCard key={i} p={{ ...p, tags: ["−" + (35 + (i * 5) % 35) + "%"] }} />)}
        </div>
      </section>

      <StoreFooter />
    </PageScroll>
  );
}

function CampaignMobile() {
  return (
    <React.Fragment>
      <PageScroll style={{ bottom: 64 }}>
        <MobileHeader showSearch={false} />
        {/* HERO */}
        <section style={{
          position: "relative", minHeight: 540, overflow: "hidden",
          background: "linear-gradient(180deg, #000 0%, #1a0006 50%, #000 100%)",
          padding: "32px 20px",
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.2,
            fontFamily: "var(--font-display-heavy)", fontSize: 160,
            color: "#0a0a0a", lineHeight: 0.78, textTransform: "uppercase",
            whiteSpace: "nowrap", letterSpacing: "-0.05em",
          }}>BLACKBLACK</div>
          <div style={{
            position: "absolute", top: "40%", right: -30, width: "80%", height: 100,
            background: "var(--bg-accent)",
            clipPath: "polygon(0 30%, 100% 0, 100% 70%, 0 100%)",
          }} />
          <div className="grain" style={{ position: "absolute", inset: 0 }} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14 }}>
              <span style={{
                padding: "5px 10px", background: "#fff", color: "#000",
                fontFamily: "var(--font-display-heavy)", fontSize: 10, letterSpacing: "0.14em",
                clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
              }}>● AO VIVO</span>
              <span className="eyebrow-mono" style={{ fontSize: 9 }}>// 25-29/11</span>
            </div>
            <h1 style={{
              margin: 0, fontFamily: "var(--font-display-heavy)",
              fontSize: 80, lineHeight: 0.82, textTransform: "uppercase", letterSpacing: "-0.04em",
            }}>BLACK<br />GAMER<br /><span style={{ color: "var(--bg-accent-hot)", textShadow: "0 0 30px rgba(255,31,61,0.5)" }}>WEEK.</span></h1>

            {/* Countdown */}
            <div style={{ marginTop: 32, display: "flex", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
              {[["02", "DIAS"], ["14", "HRS"], ["38", "MIN"], ["52", "SEG"]].map(([n, l]) => (
                <div key={l} style={{ flex: 1, textAlign: "center", padding: 8, background: "rgba(0,0,0,0.6)", border: "1px solid var(--hair-strong)" }}>
                  <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 24, lineHeight: 1, color: l === "SEG" ? "var(--bg-accent-hot)" : "#fff" }}>{n}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--fg2)", letterSpacing: "0.14em", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee stat */}
        <div style={{ background: "var(--bg-accent)", padding: "12px 0", overflow: "hidden", borderTop: "2px solid #000", borderBottom: "2px solid #000" }}>
          <div style={{
            display: "flex", gap: 32, whiteSpace: "nowrap",
            animation: "tickerScroll 18s linear infinite",
            fontFamily: "var(--font-display-heavy)", fontSize: 22, letterSpacing: "-0.01em",
          }}>
            {Array(4).fill(0).map((_, n) => (
              <React.Fragment key={n}>
                <span>70% OFF</span><span>///</span>
                <span>FRETE GRÁTIS</span><span>///</span>
                <span>+10% PIX</span><span>///</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Categories */}
        <section style={{ padding: "24px 16px" }}>
          <SectionHead mobile eyebrow="OFERTAS POR CATEGORIA" title="Escolhe seu lado." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { t: "PERIFÉRICOS", n: "−60%", c: "#cc0000" },
              { t: "HARDWARE", n: "−40%", c: "#1a4a8a" },
              { t: "STREETWEAR", n: "−50%", c: "#7a1a4a" },
              { t: "CONSOLE", n: "−35%", c: "#7a1a8a" },
            ].map(c => (
              <a key={c.t} href="#" style={{
                padding: 14, minHeight: 120, position: "relative", overflow: "hidden",
                background: `linear-gradient(135deg, ${c.c}aa, #050505)`,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, textTransform: "uppercase", lineHeight: 1 }}>{c.t}</div>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 24, lineHeight: 1 }}>{c.n} OFF →</div>
              </a>
            ))}
          </div>
        </section>

        {/* Daily deal */}
        <section style={{ padding: "8px 16px 24px" }}>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// DEAL DO DIA · 6H 42M</span>
          <h2 style={{ margin: "8px 0 16px", fontFamily: "var(--font-display-heavy)", fontSize: 28, textTransform: "uppercase", letterSpacing: "-0.02em" }}>OS MAIS QUENTES.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={{ ...p, tags: ["−60%"] }} size="sm" />)}
          </div>
        </section>

        {/* All deals */}
        <section style={{ padding: "8px 16px 32px" }}>
          <SectionHead mobile eyebrow="TODOS OS DEALS" title="247 ofertas." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[...PRODUCTS, ...PRODUCTS].slice(4, 10).map((p, i) => <ProductCard key={i} p={{ ...p, tags: ["−" + (35 + i * 5) + "%"] }} size="sm" />)}
          </div>
        </section>
      </PageScroll>
      <MobileBottomNav active="home" />
    </React.Fragment>
  );
}

Object.assign(window, { SearchDesktop, SearchMobile, CampaignDesktop, CampaignMobile });

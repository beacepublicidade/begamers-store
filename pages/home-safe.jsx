/* global React, BG */
const { StoreHeader, MobileHeader, MobileBottomNav, StoreFooter, ProductCard, PRODUCTS, Btn, Tag, Icon, Stars, Price, SectionHead, StoreLogo, VMark, PageScroll } = BG;

/* ============================================================
   HOME — SAFE variation
   Familiar Tray/Nuvemshop pattern: hero + categories + featured
   + bestsellers + brand strip — refined with BeGamers DS.
   ============================================================ */
function HomeSafeDesktop() {
  return (
    <PageScroll>
      <StoreHeader active="Home" />

      {/* HERO carousel */}
      <section style={{ position: "relative", height: 540, overflow: "hidden", background: "#0a0a0a" }}>
        <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(at 75% 50%, rgba(204,0,0,0.35), transparent 55%)",
        }} />
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 32px",
          height: "100%", display: "grid", gridTemplateColumns: "1fr 1fr",
          alignItems: "center", gap: 48, position: "relative", zIndex: 2,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span className="red-rule" style={{ width: 48 }} />
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// LANÇAMENTO · ED. LIMITADA</span>
            </div>
            <h1 style={{
              margin: 0, fontFamily: "var(--font-display-heavy)",
              fontSize: 96, lineHeight: 0.88, letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}>
              VIPER X9.<br />
              <span style={{ color: "var(--bg-accent-hot)" }}>O CLUTCH</span><br />
              MORA AQUI.
            </h1>
            <p style={{ color: "var(--fg2)", fontSize: 16, maxWidth: 460, marginTop: 24, lineHeight: 1.6 }}>
              Mouse sem fio com sensor 26K DPI, switches ópticos e 90h de bateria. Pré-venda com 25% off + frete grátis.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <Btn variant="hot" size="xl" icon={<Icon name="bolt" size={18} />}>Comprar agora</Btn>
              <Btn variant="outline" size="xl">Ver detalhes</Btn>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 32, color: "var(--fg2)", fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span>★ 4.8 · 1.2K reviews</span>
              <span>● Em estoque</span>
              <span>↗ Entrega em 2 dias</span>
            </div>
          </div>
          {/* product visual */}
          <div style={{ position: "relative", height: "80%" }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(circle at 50% 50%, rgba(255,31,61,0.4), transparent 60%)",
            }} />
            <div style={{
              position: "absolute", inset: "10% 10%",
              background: "linear-gradient(135deg, #cc0000, #1a0006)",
              clipPath: "polygon(50% 0, 100% 30%, 90% 80%, 50% 100%, 10% 80%, 0 30%)",
              opacity: 0.7,
            }} />
            <div style={{
              position: "absolute", bottom: 24, right: 24,
              background: "rgba(0,0,0,0.8)", border: "1px solid var(--hair-strong)",
              padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4,
            }}>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// A PARTIR DE</span>
              <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 32, lineHeight: 1 }}>R$ 449,90</span>
              <span style={{ fontSize: 11, color: "var(--fg2)" }}>ou 12x R$ 37,49 sem juros</span>
            </div>
          </div>
        </div>
        {/* slide dots */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
          {[0, 1, 2, 3].map(i => (
            <span key={i} style={{ width: i === 0 ? 24 : 8, height: 4, background: i === 0 ? "var(--bg-accent-hot)" : "var(--hair-strong)" }} />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ background: "#0a0a0a", borderTop: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { i: "truck", t: "Frete grátis BR", s: "Acima de R$ 299" },
            { i: "bolt", t: "10% off no PIX", s: "Ou 12x sem juros" },
            { i: "shield", t: "Compra segura", s: "Antifraude + SSL" },
            { i: "pkg", t: "Trocas 30 dias", s: "Sem perguntas" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ color: "var(--bg-accent-hot)" }}><Icon name={f.i} size={28} /></span>
              <div>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>{f.t}</div>
                <div style={{ fontSize: 11, color: "var(--fg2)" }}>{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "72px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead eyebrow="CATEGORIAS" title="Compre por tipo." link="Ver tudo" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          {[
            { t: "Periféricos", c: "#cc0000", count: 248 },
            { t: "Streetwear", c: "#1a1a1a", count: 84 },
            { t: "Hardware", c: "#1a4a8a", count: 412 },
            { t: "Console", c: "#7a1a8a", count: 156 },
            { t: "Colecionáveis", c: "#cc4400", count: 73 },
            { t: "Gift Cards", c: "#0e4a1f", count: 28 },
          ].map(c => (
            <a key={c.t} href="#" style={{
              aspectRatio: "1 / 1.1", position: "relative", overflow: "hidden",
              background: `radial-gradient(at 30% 30%, ${c.c}55, transparent 60%), linear-gradient(135deg, #131313, #050505)`,
              border: "1px solid var(--hair)",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              padding: 18,
            }}>
              <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 18, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1 }}>{c.t}</span>
              <span style={{ fontSize: 11, color: "var(--fg3)", marginTop: 6 }}>{c.count} itens →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured grid */}
      <section style={{ padding: "0 32px 72px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead eyebrow="DROP DA SEMANA" title="Mais vendidos." link="Ver todos" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Promo banner */}
      <section style={{ padding: "0 32px 72px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, height: 280 }}>
          <a href="#" style={{
            position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, #cc0000 0%, #4a0006 100%)",
            display: "flex", alignItems: "center", padding: 40,
          }}>
            <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="eyebrow-mono">// COLEÇÃO</span>
              <h3 style={{ margin: "8px 0", fontFamily: "var(--font-display-heavy)", fontSize: 48, lineHeight: 0.9, textTransform: "uppercase" }}>RANKED<br />DROP</h3>
              <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Hoodies, camisetas e bonés oficiais. Drop limitado.</p>
              <Btn variant="dark">Comprar coleção</Btn>
            </div>
          </a>
          <a href="#" style={{
            position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a3a 100%)",
            display: "flex", alignItems: "center", padding: 40,
            border: "1px solid var(--hair-strong)",
          }}>
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 6, background: "var(--bg-accent-hot)" }} />
            <div>
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// HARDWARE</span>
              <h3 style={{ margin: "8px 0", fontFamily: "var(--font-display-heavy)", fontSize: 48, lineHeight: 0.9, textTransform: "uppercase" }}>SETUP<br />COMPLETO</h3>
              <p style={{ margin: "0 0 16px", color: "var(--fg2)", fontSize: 13 }}>Monte seu PC dos sonhos com até 18x sem juros.</p>
              <Btn variant="outline">Montar setup</Btn>
            </div>
          </a>
        </div>
      </section>

      {/* More products */}
      <section style={{ padding: "0 32px 96px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead eyebrow="STREETWEAR + COLECIONÁVEIS" title="Veste o time." link="Loja completa" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PRODUCTS.slice(4, 8).map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <StoreFooter />
    </PageScroll>
  );
}

function HomeSafeMobile() {
  return (
    <React.Fragment>
      <PageScroll style={{ bottom: 64 }}>
        <MobileHeader />
        {/* Categories pills */}
        <div className="no-scrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 16px", borderBottom: "1px solid var(--hair)" }}>
          {["Tudo", "Periféricos", "Streetwear", "Hardware", "Console", "Colecionáveis", "Gift Cards", "Ofertas"].map((c, i) => (
            <span key={c} style={{
              flexShrink: 0, padding: "6px 12px",
              background: i === 0 ? "var(--bg-accent)" : "transparent",
              border: i === 0 ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
              color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "var(--font-display-heavy)",
            }}>{c}</span>
          ))}
        </div>

        {/* Hero */}
        <section style={{
          position: "relative", height: 480, overflow: "hidden",
          background: "linear-gradient(165deg, #1a0006, #000)",
        }}>
          <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
          <div style={{ padding: "32px 20px", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span className="red-rule" style={{ width: 24, height: 3 }} />
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)", fontSize: 10 }}>// LANÇAMENTO</span>
            </div>
            <h1 style={{
              margin: 0, fontFamily: "var(--font-display-heavy)",
              fontSize: 52, lineHeight: 0.88, letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}>
              VIPER X9.<br />
              <span style={{ color: "var(--bg-accent-hot)" }}>O CLUTCH</span><br />
              MORA AQUI.
            </h1>
            <p style={{ color: "var(--fg2)", fontSize: 13, marginTop: 14, lineHeight: 1.5 }}>
              Sensor 26K DPI, 90h de bateria. 25% off + frete grátis.
            </p>
          </div>
          <div style={{
            position: "absolute", bottom: 64, right: -20, width: 220, height: 220,
            background: "radial-gradient(circle, rgba(255,31,61,0.5), transparent 70%)",
          }} />
          <div style={{ position: "absolute", bottom: 16, left: 20, right: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <Btn variant="hot" size="lg" full icon={<Icon name="bolt" size={16} />}>Comprar — R$ 449,90</Btn>
            <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {[0, 1, 2, 3].map(i => (
                <span key={i} style={{ width: i === 0 ? 20 : 6, height: 3, background: i === 0 ? "var(--bg-accent-hot)" : "var(--hair-strong)" }} />
              ))}
            </div>
          </div>
        </section>

        {/* Banner row */}
        <section style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { i: "bolt", t: "10% OFF NO PIX", s: "Em todos os produtos", c: "var(--bg-accent-hot)" },
            { i: "truck", t: "FRETE GRÁTIS", s: "Acima de R$ 299", c: "#fff" },
          ].map(b => (
            <div key={b.t} style={{
              display: "flex", alignItems: "center", gap: 12, padding: 14,
              background: "var(--surf-2)", border: "1px solid var(--hair)",
            }}>
              <span style={{ color: b.c }}><Icon name={b.i} size={20} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.1em" }}>{b.t}</div>
                <div style={{ fontSize: 11, color: "var(--fg2)" }}>{b.s}</div>
              </div>
              <Icon name="chevR" size={16} color="var(--fg3)" />
            </div>
          ))}
        </section>

        {/* Categories */}
        <section style={{ padding: "16px 16px 24px" }}>
          <SectionHead mobile eyebrow="CATEGORIAS" title="Compre por tipo." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { t: "Periféricos", c: "#cc0000" }, { t: "Streetwear", c: "#1a1a1a" },
              { t: "Hardware", c: "#1a4a8a" }, { t: "Console", c: "#7a1a8a" },
              { t: "Colecionáveis", c: "#cc4400" }, { t: "Gift Cards", c: "#0e4a1f" },
            ].map(c => (
              <a key={c.t} href="#" style={{
                aspectRatio: "1.4 / 1", position: "relative", overflow: "hidden",
                background: `radial-gradient(at 30% 30%, ${c.c}66, transparent 60%), #111`,
                border: "1px solid var(--hair)",
                display: "flex", alignItems: "flex-end", padding: 14,
              }}>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, textTransform: "uppercase", lineHeight: 1 }}>{c.t}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Bestsellers horizontal */}
        <section style={{ paddingTop: 8, paddingBottom: 24 }}>
          <div style={{ padding: "0 16px" }}>
            <SectionHead mobile eyebrow="DROP DA SEMANA" title="Mais vendidos." />
          </div>
          <div className="no-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px 8px" }}>
            {PRODUCTS.slice(0, 5).map(p => (
              <div key={p.id} style={{ width: 220, flexShrink: 0 }}>
                <ProductCard p={p} size="sm" />
              </div>
            ))}
          </div>
        </section>

        {/* Promo */}
        <section style={{ padding: "8px 16px 24px" }}>
          <a href="#" style={{
            display: "block", position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, #cc0000, #4a0006)",
            padding: 24, minHeight: 160,
          }}>
            <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
            <div style={{ position: "relative" }}>
              <span className="eyebrow-mono">// COLEÇÃO</span>
              <h3 style={{ margin: "8px 0 4px", fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 0.9, textTransform: "uppercase" }}>RANKED DROP</h3>
              <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.85)", fontSize: 12 }}>Limitado. Quando acabar, acabou.</p>
              <Btn variant="dark" size="sm">Comprar →</Btn>
            </div>
          </a>
        </section>

        {/* More */}
        <section style={{ padding: "0 16px 32px" }}>
          <SectionHead mobile eyebrow="STREETWEAR" title="Veste o time." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {PRODUCTS.slice(4, 8).map(p => <ProductCard key={p.id} p={p} size="sm" />)}
          </div>
        </section>

        {/* Footer compact */}
        <footer style={{ padding: "32px 20px", background: "#050505", borderTop: "1px solid var(--hair-strong)" }}>
          <StoreLogo height={28} />
          <p style={{ color: "var(--fg2)", fontSize: 12, marginTop: 12 }}>
            A loja oficial da comunidade BEGAMERS.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {["instagram", "twitch", "youtube", "discord"].map(s => (
              <a key={s} href="#" style={{
                width: 36, height: 36, border: "1px solid var(--hair-strong)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              }}><Icon name={s} size={16} /></a>
            ))}
          </div>
          <div style={{ marginTop: 24, fontSize: 10, color: "var(--fg3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            © 2026 BEGAMERS STORE · CNPJ 00.000.000/0001-00
          </div>
        </footer>
      </PageScroll>
      <MobileBottomNav active="home" />
    </React.Fragment>
  );
}

Object.assign(window, { HomeSafeDesktop, HomeSafeMobile });

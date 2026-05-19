/* global React, BG */
const { StoreHeader, MobileHeader, MobileBottomNav, StoreFooter, ProductCard, PRODUCTS, Btn, Tag, Icon, Stars, Price, SectionHead, StoreLogo, VMark, PageScroll } = BG;

/* ============================================================
   HOME — OUSADA variation
   Editorial-magazine meets esports. Massive type, asymmetric
   grid, ticker, full-bleed campaign, diagonal slashes everywhere.
   ============================================================ */
function HomeBoldDesktop() {
  return (
    <PageScroll>
      <StoreHeader active="Home" />

      {/* TICKER */}
      <div style={{
        background: "var(--bg-accent-hot)", color: "#fff",
        overflow: "hidden", borderBottom: "2px solid #000",
        position: "relative", height: 44,
      }}>
        <div style={{
          display: "flex", gap: 48, whiteSpace: "nowrap",
          animation: "tickerScroll 30s linear infinite",
          fontFamily: "var(--font-display-heavy)", fontSize: 14,
          letterSpacing: "0.12em", textTransform: "uppercase",
          alignItems: "center", height: "100%",
        }}>
          {Array(2).fill(0).map((_, n) => (
            <React.Fragment key={n}>
              <span>🔴 LIVE DROP — COLEÇÃO RANKED</span>
              <span>///</span>
              <span>VIPER X9 EM PRÉ-VENDA</span>
              <span>///</span>
              <span>10% OFF NO PIX</span>
              <span>///</span>
              <span>FRETE GRÁTIS ACIMA DE R$ 299</span>
              <span>///</span>
              <span>BLACK GAMER WEEK — ATÉ 70% OFF</span>
              <span>///</span>
            </React.Fragment>
          ))}
        </div>
        <style>{`@keyframes tickerScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* HERO — full-bleed editorial */}
      <section style={{
        position: "relative", minHeight: 720, overflow: "hidden",
        background: "#000",
      }}>
        {/* giant background number */}
        <div style={{
          position: "absolute", left: -40, top: 80, zIndex: 1,
          fontFamily: "var(--font-display-heavy)", fontSize: 720,
          color: "#0e0e0e", lineHeight: 0.78, letterSpacing: "-0.08em",
        }}>26K</div>
        {/* diagonal red slash */}
        <div style={{
          position: "absolute", top: 0, right: "12%", bottom: 0, width: 80,
          background: "var(--bg-accent)",
          clipPath: "polygon(60% 0, 100% 0, 40% 100%, 0 100%)",
          opacity: 0.95,
        }} />
        {/* product photo placeholder */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "52%",
          background: `
            radial-gradient(circle at 40% 60%, rgba(255,31,61,0.4), transparent 60%),
            linear-gradient(135deg, #0a0a0a 0%, #1a0006 50%, #000 100%)
          `,
          clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)",
        }}>
          <div className="grain" style={{ position: "absolute", inset: 0 }} />
          {/* mouse silhouette */}
          <div style={{
            position: "absolute", left: "30%", top: "20%", width: "55%", height: "60%",
            background: "linear-gradient(180deg, #cc0000 0%, #1a0006 100%)",
            clipPath: "polygon(20% 5%, 80% 0, 95% 30%, 90% 75%, 75% 100%, 25% 100%, 10% 75%, 5% 30%)",
            boxShadow: "0 0 80px rgba(255,31,61,0.4)",
          }} />
        </div>

        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: 1280, margin: "0 auto", padding: "80px 32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <span style={{
              padding: "6px 12px", background: "var(--bg-accent-hot)", color: "#fff",
              fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.16em",
              textTransform: "uppercase", clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
            }}>● LIVE — PRÉ-VENDA</span>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// EP.01 / DROP 2026</span>
          </div>
          <h1 style={{
            margin: 0, fontFamily: "var(--font-display-heavy)",
            fontSize: 168, lineHeight: 0.82, letterSpacing: "-0.05em",
            textTransform: "uppercase", maxWidth: 1000,
          }}>
            ENTRA<br />
            NO <span style={{
              background: "var(--bg-accent)", color: "#fff", padding: "0 16px",
              clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
            }}>SERVER.</span>
          </h1>
          <div style={{ display: "flex", gap: 80, marginTop: 48, maxWidth: 720 }}>
            <div>
              <div className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// PRODUTO EM DESTAQUE</div>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, marginTop: 6, textTransform: "uppercase" }}>VIPER X9</div>
              <div style={{ fontSize: 13, color: "var(--fg2)", marginTop: 4 }}>Mouse sem fio · 26K DPI · 90h</div>
            </div>
            <div>
              <div className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// PREÇO</div>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 32, marginTop: 6, color: "var(--bg-accent-hot)" }}>R$ 449,90</div>
              <div style={{ fontSize: 13, color: "var(--fg2)", marginTop: 4, textDecoration: "line-through" }}>de R$ 599,90</div>
            </div>
            <div>
              <div className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// ESTOQUE</div>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, marginTop: 6 }}>378 un.</div>
              <div style={{ fontSize: 13, color: "var(--fg2)", marginTop: 4 }}>Limitado a 1 por CPF</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            <Btn variant="hot" size="xl" icon={<Icon name="bolt" size={20} />}>RESERVA O TEU</Btn>
            <Btn variant="ghost" size="xl">Ver specs completas →</Btn>
          </div>
        </div>
      </section>

      {/* COLEÇÃO + DESTAQUE asymmetric */}
      <section style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, height: 560 }}>
          {/* Big banner */}
          <a href="#" style={{
            position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, #1a0006 0%, #000 60%)",
            display: "flex", alignItems: "flex-end", padding: 48,
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: "60%", height: "100%",
              background: "linear-gradient(135deg, #cc0000, #4a0006)",
              clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)",
              opacity: 0.9,
            }} />
            <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="eyebrow-mono">// EDIÇÃO LIMITADA · OUT/2026</span>
              <h2 style={{
                margin: "12px 0", fontFamily: "var(--font-display-heavy)",
                fontSize: 96, lineHeight: 0.85, textTransform: "uppercase", letterSpacing: "-0.04em",
              }}>RANKED<br />DROP III</h2>
              <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.85)", fontSize: 15, maxWidth: 460 }}>
                Hoodies, camisetas e bonés. Drop de 500 unidades. Quando acabou, acabou.
              </p>
              <Btn variant="dark" size="lg">VESTE O TIME →</Btn>
            </div>
          </a>
          {/* Stacked right */}
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
            <a href="#" style={{
              position: "relative", overflow: "hidden", padding: 32,
              background: "linear-gradient(135deg, #1a1a3a 0%, #050530 100%)",
              border: "1px solid var(--hair-strong)",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 6, background: "var(--bg-accent-hot)" }} />
              <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// SETUP COMPLETO</span>
              <div>
                <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 0.9, textTransform: "uppercase" }}>HARDWARE<br />SEM JUROS</h3>
                <p style={{ margin: 0, fontSize: 12, color: "var(--fg2)" }}>até 18x · placa, monitor, gabinete</p>
              </div>
            </a>
            <a href="#" style={{
              position: "relative", overflow: "hidden", padding: 32,
              background: "linear-gradient(135deg, #2a1a4a 0%, #000 100%)",
              border: "1px solid var(--hair-strong)",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 6, background: "var(--bg-accent)" }} />
              <span className="eyebrow-mono" style={{ color: "#a3a3a3" }}>// PRÉ-VENDA</span>
              <div>
                <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-display-heavy)", fontSize: 36, lineHeight: 0.9, textTransform: "uppercase" }}>CYBER<br />SAMURAI 1/6</h3>
                <p style={{ margin: 0, fontSize: 12, color: "var(--fg2)" }}>Action figure colecionável · R$ 899</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* TROPHY ROW — featured numbers */}
      <section style={{
        background: "linear-gradient(180deg, #050505, #000)",
        borderTop: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)",
        padding: "64px 32px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            { n: "2.8K+", l: "PRODUTOS NA LOJA" },
            { n: "47K", l: "GAMERS NA COMUNIDADE" },
            { n: "4.9★", l: "AVALIAÇÃO MÉDIA" },
            { n: "24H", l: "POSTAGEM ÚTIL" },
          ].map(s => (
            <div key={s.l}>
              <span className="red-rule" />
              <div style={{
                fontFamily: "var(--font-display-heavy)", fontSize: 80,
                lineHeight: 0.9, marginTop: 14, letterSpacing: "-0.03em",
              }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg2)", letterSpacing: "0.16em", marginTop: 8 }}>// {s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Best sellers — magazine layout */}
      <section style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead eyebrow="DROP DA SEMANA" title="OS MAIS COBIÇADOS." link="Ver todos" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Categories slashed */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead eyebrow="EXPLORE" title="POR CATEGORIA." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { t: "PERIFÉRICOS", n: "248", c: "#cc0000" },
            { t: "STREETWEAR", n: "84", c: "#1a1a1a" },
            { t: "HARDWARE", n: "412", c: "#1a4a8a" },
            { t: "CONSOLE", n: "156", c: "#7a1a8a" },
            { t: "COLECIONÁVEIS", n: "73", c: "#cc4400" },
            { t: "GIFT CARDS", n: "28", c: "#0e4a1f" },
          ].map(c => (
            <a key={c.t} href="#" style={{
              position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, ${c.c}aa 0%, #050505 100%)`,
              minHeight: 200, padding: 32,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              border: "1px solid var(--hair)",
            }}>
              <div style={{
                position: "absolute", top: 0, right: 0, padding: "12px 16px",
                background: "rgba(0,0,0,0.4)",
                fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em",
              }}>{c.n} ITENS</div>
              <span className="eyebrow-mono">// CATEGORIA</span>
              <h3 style={{
                margin: 0, fontFamily: "var(--font-display-heavy)",
                fontSize: 36, lineHeight: 0.9, textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}>{c.t}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>EXPLORAR</span>
                <Icon name="chevR" size={20} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Streetwear strip */}
      <section style={{
        background: "#0a0a0a", padding: "80px 32px",
        borderTop: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)",
        position: "relative", overflow: "hidden",
      }}>
        <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <SectionHead eyebrow="WEAR — DROP III" title="VESTE O TIME." link="Coleção completa" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {PRODUCTS.slice(4, 8).map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      <StoreFooter />
    </PageScroll>
  );
}

function HomeBoldMobile() {
  return (
    <React.Fragment>
      <PageScroll style={{ bottom: 64 }}>
        <MobileHeader />

        {/* Ticker */}
        <div style={{
          background: "var(--bg-accent-hot)", color: "#fff",
          overflow: "hidden", height: 28, position: "relative",
        }}>
          <div style={{
            display: "flex", gap: 24, whiteSpace: "nowrap",
            animation: "tickerScroll 20s linear infinite",
            fontFamily: "var(--font-display-heavy)", fontSize: 11,
            letterSpacing: "0.12em", textTransform: "uppercase",
            alignItems: "center", height: "100%",
          }}>
            {Array(3).fill(0).map((_, n) => (
              <React.Fragment key={n}>
                <span>🔴 RANKED DROP</span><span>///</span>
                <span>10% PIX</span><span>///</span>
                <span>FRETE GRÁTIS R$ 299</span><span>///</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* HERO */}
        <section style={{ position: "relative", height: 600, overflow: "hidden", background: "#000" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: `
              radial-gradient(circle at 50% 70%, rgba(255,31,61,0.45), transparent 60%),
              linear-gradient(180deg, #000 0%, #1a0006 70%, #000 100%)
            `,
          }} />
          <div style={{
            position: "absolute", right: -40, bottom: 100, width: 280, height: 280,
            background: "linear-gradient(180deg, #cc0000 0%, #1a0006 100%)",
            clipPath: "polygon(20% 5%, 80% 0, 95% 30%, 90% 75%, 75% 100%, 25% 100%, 10% 75%, 5% 30%)",
            opacity: 0.5,
          }} />
          <div className="grain" style={{ position: "absolute", inset: 0 }} />
          <div style={{ position: "relative", padding: "28px 20px", zIndex: 2 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 10px", background: "var(--bg-accent-hot)",
              fontFamily: "var(--font-display-heavy)", fontSize: 10, letterSpacing: "0.16em",
              clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
            }}>● LIVE — PRÉ-VENDA</div>
            <h1 style={{
              margin: "20px 0 0", fontFamily: "var(--font-display-heavy)",
              fontSize: 84, lineHeight: 0.82, letterSpacing: "-0.04em",
              textTransform: "uppercase",
            }}>
              ENTRA<br />NO<br />
              <span style={{
                background: "var(--bg-accent)", padding: "0 10px",
                clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
                display: "inline-block",
              }}>SERVER.</span>
            </h1>
          </div>
          <div style={{
            position: "absolute", bottom: 20, left: 20, right: 20,
            background: "rgba(0,0,0,0.85)", border: "1px solid var(--hair-strong)",
            padding: 16, backdropFilter: "blur(10px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
              <div>
                <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// VIPER X9</span>
                <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 22, lineHeight: 1, marginTop: 4 }}>R$ 449,90</div>
                <div style={{ fontSize: 10, color: "var(--fg3)", textDecoration: "line-through" }}>R$ 599,90</div>
              </div>
              <Tag tone="hot">−25%</Tag>
            </div>
            <Btn variant="hot" size="md" full>Reserva o teu →</Btn>
          </div>
        </section>

        {/* Stats row */}
        <section style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          background: "#0a0a0a", borderBottom: "1px solid var(--hair)",
        }}>
          {[
            { n: "2.8K+", l: "PRODUTOS" }, { n: "47K", l: "GAMERS" }, { n: "4.9★", l: "AVAL." },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "20px 12px", textAlign: "center",
              borderRight: i < 2 ? "1px solid var(--hair)" : "none",
            }}>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg2)", letterSpacing: "0.14em", marginTop: 6 }}>// {s.l}</div>
            </div>
          ))}
        </section>

        {/* Big banner */}
        <section style={{ padding: "20px 16px" }}>
          <a href="#" style={{
            display: "block", position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg, #1a0006, #000)", padding: 24, minHeight: 240,
          }}>
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: 80,
              background: "var(--bg-accent)",
              clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
            }} />
            <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />
            <span className="eyebrow-mono" style={{ position: "relative" }}>// EDIÇÃO LIMITADA</span>
            <h2 style={{
              position: "relative",
              margin: "8px 0", fontFamily: "var(--font-display-heavy)",
              fontSize: 56, lineHeight: 0.85, textTransform: "uppercase", letterSpacing: "-0.04em",
            }}>RANKED<br />DROP III</h2>
            <p style={{ position: "relative", margin: "0 0 16px", color: "rgba(255,255,255,0.85)", fontSize: 13 }}>500 unidades. Quando acabou, acabou.</p>
            <Btn variant="dark" size="sm">Veste o time →</Btn>
          </a>
        </section>

        {/* Categories slashed */}
        <section style={{ padding: "0 16px 24px" }}>
          <SectionHead mobile eyebrow="EXPLORE" title="POR CATEGORIA." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { t: "PERIFÉRICOS", n: "248", c: "#cc0000" },
              { t: "STREETWEAR", n: "84", c: "#1a1a1a" },
              { t: "HARDWARE", n: "412", c: "#1a4a8a" },
              { t: "CONSOLE", n: "156", c: "#7a1a8a" },
              { t: "COLECIONÁVEIS", n: "73", c: "#cc4400" },
              { t: "GIFT CARDS", n: "28", c: "#0e4a1f" },
            ].map(c => (
              <a key={c.t} href="#" style={{
                position: "relative", overflow: "hidden",
                background: `linear-gradient(135deg, ${c.c}aa, #050505)`,
                minHeight: 110, padding: 14,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <span style={{
                  position: "absolute", top: 6, right: 8,
                  fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.5)",
                }}>{c.n}</span>
                <span style={{
                  fontFamily: "var(--font-display-heavy)", fontSize: 16, lineHeight: 0.95,
                  textTransform: "uppercase", letterSpacing: "-0.01em",
                }}>{c.t}</span>
                <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>EXPLORAR →</span>
              </a>
            ))}
          </div>
        </section>

        {/* Bestsellers */}
        <section style={{ paddingBottom: 24 }}>
          <div style={{ padding: "0 16px" }}>
            <SectionHead mobile eyebrow="DROP DA SEMANA" title="MAIS COBIÇADOS." />
          </div>
          <div className="no-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px 8px" }}>
            {PRODUCTS.slice(0, 6).map(p => (
              <div key={p.id} style={{ width: 220, flexShrink: 0 }}>
                <ProductCard p={p} size="sm" />
              </div>
            ))}
          </div>
        </section>

        {/* Streetwear */}
        <section style={{ padding: "8px 16px 32px", background: "#0a0a0a" }}>
          <SectionHead mobile eyebrow="WEAR — DROP III" title="VESTE O TIME." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {PRODUCTS.slice(4, 8).map(p => <ProductCard key={p.id} p={p} size="sm" />)}
          </div>
        </section>

        <footer style={{ padding: "32px 20px", background: "#050505", borderTop: "1px solid var(--hair-strong)" }}>
          <StoreLogo height={28} />
          <p style={{ color: "var(--fg2)", fontSize: 12, marginTop: 12 }}>A loja oficial da comunidade BEGAMERS.</p>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {["instagram", "twitch", "youtube", "discord"].map(s => (
              <a key={s} href="#" style={{
                width: 36, height: 36, border: "1px solid var(--hair-strong)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
              }}><Icon name={s} size={16} /></a>
            ))}
          </div>
          <div style={{ marginTop: 24, fontSize: 10, color: "var(--fg3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>© 2026 BEGAMERS STORE</div>
        </footer>
      </PageScroll>
      <MobileBottomNav active="home" />
    </React.Fragment>
  );
}

Object.assign(window, { HomeBoldDesktop, HomeBoldMobile });

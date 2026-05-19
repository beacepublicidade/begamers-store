/* global React, BG, AdminSidebar */
/* Admin · Aparência (Theme Editor)
   Editor de layout com preview ao vivo, banners, seções drag-and-drop,
   cores, tipografia e configurações globais. Estilo Shopify Theme
   Editor + Nuvemshop, mas com identidade BeGamers.
*/
const { useState } = React;
const { StoreLogo, VMark, Btn, Tag, Icon, PageScroll, ProductCard, PRODUCTS } = BG;

const SIDEBAR_W_AP = 240;
const PANEL_W = 380;

function AdminAppearance() {
  const [tab, setTab] = useState("sections");
  const [device, setDevice] = useState("desktop");
  const [selectedSection, setSelectedSection] = useState("hero");

  return (
    <PageScroll style={{ background: "#000" }}>
      {/* Reuse existing AdminSidebar */}
      <AdminSidebar active="theme" />

      <div style={{ marginLeft: SIDEBAR_W_AP, display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Top toolbar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--hair-strong)",
          padding: "12px 24px",
          display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "flex", gap: 6, alignItems: "center",
              fontSize: 10, fontFamily: "var(--font-mono)", letterSpacing: "0.12em",
              color: "var(--fg3)", textTransform: "uppercase", marginBottom: 4,
            }}>
              <span>Marketing</span><span>/</span><span style={{ color: "#fff" }}>Aparência</span>
            </div>
            <h1 style={{
              margin: 0, fontFamily: "var(--font-display-heavy)",
              fontSize: 22, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em",
            }}>EDITOR DE TEMA · HOME</h1>
          </div>

          {/* Device switcher */}
          <div style={{ display: "flex", gap: 0, border: "1px solid var(--hair-strong)" }}>
            {[
              { k: "desktop", t: "DESKTOP", i: "monitor" },
              { k: "tablet", t: "TABLET", i: "monitor" },
              { k: "mobile", t: "MOBILE", i: "search" },
            ].map(d => (
              <button key={d.k} onClick={() => setDevice(d.k)} style={{
                padding: "8px 14px", background: device === d.k ? "var(--bg-accent)" : "transparent",
                border: 0, color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-display-heavy)", fontSize: 10, letterSpacing: "0.1em",
              }}>
                <Icon name={d.i} size={12} /> {d.t}
              </button>
            ))}
          </div>

          {/* Save bar */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "#d99a00", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, background: "#d99a00", borderRadius: 99 }} />
              3 ALTERAÇÕES NÃO PUBLICADAS
            </span>
            <Btn variant="ghost" size="sm">Visualizar</Btn>
            <Btn variant="ghost" size="sm">Salvar rascunho</Btn>
            <Btn variant="hot" size="sm" icon={<Icon name="bolt" size={14} />}>Publicar</Btn>
          </div>
        </div>

        {/* Editor split */}
        <div style={{ display: "grid", gridTemplateColumns: `${PANEL_W}px 1fr`, flex: 1, minHeight: 0 }}>
          {/* Left panel */}
          <div style={{ background: "var(--surf-1)", borderRight: "1px solid var(--hair)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--hair-strong)" }}>
              {[
                { k: "sections", t: "SEÇÕES", i: "rows" },
                { k: "banners", t: "BANNERS", i: "fire" },
                { k: "global", t: "GLOBAL", i: "shield" },
              ].map(x => (
                <button key={x.k} onClick={() => setTab(x.k)} style={{
                  flex: 1, padding: "12px 8px", background: "transparent", border: 0,
                  color: tab === x.k ? "#fff" : "var(--fg2)",
                  borderBottom: tab === x.k ? "2px solid var(--bg-accent)" : "2px solid transparent",
                  cursor: "pointer", fontFamily: "var(--font-display-heavy)", fontSize: 10,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                  marginBottom: -1,
                }}>
                  <Icon name={x.i} size={12} /> {x.t}
                </button>
              ))}
            </div>

            <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
              {tab === "sections" && <SectionsPanel selected={selectedSection} onSelect={setSelectedSection} />}
              {tab === "banners" && <BannersPanel />}
              {tab === "global" && <GlobalPanel />}
            </div>
          </div>

          {/* Live preview */}
          <div style={{
            background: "#0a0a0a",
            display: "flex", flexDirection: "column", overflow: "hidden",
            position: "relative",
          }}>
            <div style={{
              padding: "10px 20px", background: "#000", borderBottom: "1px solid var(--hair)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg2)", letterSpacing: "0.08em" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span className="live-dot" style={{ width: 5, height: 5 }} /> PREVIEW · /home
                </span>
                <span style={{ color: "var(--fg3)" }}>·</span>
                <span>{device.toUpperCase()} · {device === "desktop" ? "1440×900" : device === "tablet" ? "768×1024" : "390×844"}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={previewBtn}><Icon name="chevL" size={12} /></button>
                <button style={previewBtn}><Icon name="chevR" size={12} /></button>
                <button style={previewBtn}><Icon name="bolt" size={12} /></button>
              </div>
            </div>

            <div style={{ flex: 1, padding: 24, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
              <LivePreview device={device} selectedSection={selectedSection} />
            </div>
          </div>
        </div>
      </div>
    </PageScroll>
  );
}

const previewBtn = {
  width: 26, height: 26, background: "var(--surf-2)",
  border: "1px solid var(--hair-strong)", color: "#fff", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};

/* ─────────── Sections panel ─────────── */
const SectionsPanel = ({ selected, onSelect }) => {
  const SECTIONS = [
    { id: "header", t: "Cabeçalho", i: "menu", locked: true },
    { id: "announce", t: "Barra de anúncio", i: "bolt", visible: true },
    { id: "hero", t: "Hero · Carrossel 4 slides", i: "fire", visible: true },
    { id: "trust", t: "Selos de confiança", i: "shield", visible: true },
    { id: "categories", t: "Grade de categorias", i: "grid", visible: true },
    { id: "best", t: "Mais vendidos", i: "star", visible: true },
    { id: "banner-promo", t: "Banner promocional 2-col", i: "fire", visible: true },
    { id: "drop", t: "Streetwear · Drop III", i: "heart", visible: true },
    { id: "stats", t: "Stats da loja", i: "bolt", visible: false },
    { id: "testimonials", t: "Depoimentos", i: "user", visible: false },
    { id: "newsletter", t: "Newsletter", i: "instagram", visible: true },
    { id: "footer", t: "Rodapé", i: "shield", locked: true },
  ];
  return (
    <div>
      {/* Page selector */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hair)" }}>
        <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.14em", color: "var(--fg3)", marginBottom: 6 }}>// EDITANDO PÁGINA</div>
        <select className="bg-input" style={{ padding: "8px 10px", fontSize: 12 }}>
          <option>Home (página inicial)</option>
          <option>Listagem de categoria</option>
          <option>Página de produto</option>
          <option>Carrinho</option>
          <option>Campanha · Black Gamer Week</option>
        </select>
      </div>

      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>SEÇÕES · {SECTIONS.length}</span>
        <Btn variant="ghost" size="sm" icon={<Icon name="plus" size={11} />}>Adicionar</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", padding: "0 8px 16px" }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => !s.locked && onSelect(s.id)} style={{
            display: "grid", gridTemplateColumns: "14px 24px 1fr auto auto", gap: 10,
            padding: "10px 12px", textAlign: "left", cursor: s.locked ? "default" : "pointer",
            background: selected === s.id ? "rgba(255,31,61,0.08)" : "transparent",
            border: selected === s.id ? "1px solid var(--bg-accent-hot)" : "1px solid transparent",
            color: "#fff", alignItems: "center",
            marginBottom: 2, opacity: s.locked ? 0.55 : 1,
          }}>
            <span style={{ color: "var(--fg3)", fontSize: 11, cursor: s.locked ? "default" : "grab" }}>⋮⋮</span>
            <Icon name={s.i} size={14} color={selected === s.id ? "var(--bg-accent-hot)" : "var(--fg2)"} />
            <span style={{ fontSize: 12, fontWeight: selected === s.id ? 700 : 500 }}>{s.t}</span>
            {s.locked && <Icon name="lock" size={11} color="var(--fg3)" />}
            {!s.locked && (
              <span style={{
                width: 14, height: 14, display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: s.visible ? "var(--bg-accent-hot)" : "var(--fg3)",
              }}>
                <Icon name="eye" size={12} />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected section settings */}
      {selected === "hero" && (
        <div style={{ borderTop: "1px solid var(--hair-strong)" }}>
          <div style={{ padding: "16px 16px 8px" }}>
            <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// EDITANDO · HERO</span>
            <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 16, marginTop: 6, textTransform: "uppercase" }}>Carrossel principal</div>
            <p style={{ fontSize: 11, color: "var(--fg2)", margin: "4px 0 0" }}>4 slides · alternância automática a cada 6s</p>
          </div>

          <FieldBlock label="LAYOUT">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {[
                { v: "split", t: "Split 50/50", sel: true },
                { v: "full", t: "Full bleed" },
                { v: "stacked", t: "Empilhado" },
              ].map(o => (
                <button key={o.v} style={{
                  padding: "10px 8px", textAlign: "center", cursor: "pointer",
                  background: o.sel ? "var(--bg-accent)" : "var(--surf-2)",
                  border: o.sel ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
                  color: "#fff", fontFamily: "var(--font-display-heavy)", fontSize: 9,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  <div style={{
                    width: "100%", height: 32, marginBottom: 6,
                    background: o.v === "split"
                      ? "linear-gradient(90deg, var(--surf-3) 50%, var(--bg-accent-hot) 50%)"
                      : o.v === "full" ? "var(--bg-accent-hot)" : "linear-gradient(180deg, var(--surf-3) 50%, var(--bg-accent-hot) 50%)",
                    opacity: o.sel ? 1 : 0.5,
                  }} />
                  {o.t}
                </button>
              ))}
            </div>
          </FieldBlock>

          <FieldBlock label="ALTURA">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="range" min={400} max={900} defaultValue={540} style={{ flex: 1, accentColor: "var(--bg-accent-hot)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, width: 60, textAlign: "right" }}>540 px</span>
            </div>
          </FieldBlock>

          <FieldBlock label="SLIDES" controls={<Btn variant="ghost" size="sm" icon={<Icon name="plus" size={11} />}>Novo</Btn>}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { t: "VIPER X9 — O CLUTCH MORA AQUI", c: "#cc0000", active: true },
                { t: "RANKED DROP III · STREETWEAR", c: "#7a1a4a" },
                { t: "SETUP COMPLETO · 18X SEM JUROS", c: "#1a4a8a" },
                { t: "BLACK GAMER WEEK · ATÉ 70% OFF", c: "#000" },
              ].map((s, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "auto 32px 1fr auto auto", gap: 8,
                  padding: 8, background: "var(--surf-2)",
                  border: s.active ? "1px solid var(--bg-accent-hot)" : "1px solid var(--hair)",
                  alignItems: "center",
                }}>
                  <span style={{ color: "var(--fg3)", fontSize: 10, cursor: "grab" }}>⋮⋮</span>
                  <div style={{ width: 32, height: 28, background: `linear-gradient(135deg, ${s.c}, #050505)` }} />
                  <span style={{ fontSize: 10, fontWeight: 600, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.t}</span>
                  <Icon name="eye" size={11} color="var(--bg-accent-hot)" />
                  <button style={{ background: "transparent", border: 0, color: "var(--fg3)", padding: 0, cursor: "pointer" }}><Icon name="chevR" size={11} /></button>
                </div>
              ))}
            </div>
          </FieldBlock>

          <FieldBlock label="AUTO-PLAY">
            <Toggle on={true} label="Avançar automaticamente" />
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, color: "var(--fg2)", marginBottom: 4 }}>Intervalo entre slides</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[4, 6, 8, 12].map(n => (
                  <button key={n} style={{
                    flex: 1, padding: "6px 0", textAlign: "center",
                    background: n === 6 ? "var(--bg-accent)" : "var(--surf-2)",
                    border: n === 6 ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
                    color: "#fff", fontFamily: "var(--font-mono)", fontSize: 11, cursor: "pointer",
                  }}>{n}s</button>
                ))}
              </div>
            </div>
          </FieldBlock>

          <FieldBlock label="OVERLAY">
            <Toggle on={true} label="Gradient protection" />
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, color: "var(--fg2)", marginBottom: 4 }}>Opacidade</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="range" min={0} max={100} defaultValue={45} style={{ flex: 1, accentColor: "var(--bg-accent-hot)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, width: 36 }}>45%</span>
              </div>
            </div>
          </FieldBlock>

          <div style={{ padding: 16, borderTop: "1px solid var(--hair)" }}>
            <Btn variant="ghost" size="sm" full icon={<Icon name="trash" size={12} />}>Restaurar padrão</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

const FieldBlock = ({ label, controls, children }) => (
  <div style={{ padding: "16px", borderTop: "1px solid var(--hair)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 10, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg2)" }}>{label}</span>
      {controls}
    </div>
    {children}
  </div>
);

const Toggle = ({ on, label }) => (
  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 0" }}>
    <span style={{ fontSize: 12, color: "var(--fg1)" }}>{label}</span>
    <span style={{
      width: 32, height: 18, borderRadius: 99, position: "relative",
      background: on ? "var(--bg-accent)" : "var(--surf-3)",
      transition: "background 180ms",
    }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 16 : 2,
        width: 14, height: 14, borderRadius: 99, background: "#fff",
        transition: "left 180ms",
      }} />
    </span>
  </label>
);

/* ─────────── Banners panel ─────────── */
const BannersPanel = () => (
  <div>
    <div style={{ padding: 16 }}>
      <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// BANNERS · BIBLIOTECA</span>
      <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 16, marginTop: 6, textTransform: "uppercase" }}>Imagens & Vídeos</div>
      <p style={{ fontSize: 11, color: "var(--fg2)", margin: "4px 0 0" }}>4.7 GB de 10 GB · 247 mídias</p>
    </div>

    {/* Drop zone */}
    <div style={{ padding: "0 16px 12px" }}>
      <div style={{
        border: "2px dashed var(--hair-strong)", padding: 24,
        background: "rgba(255,31,61,0.04)",
        textAlign: "center", cursor: "pointer",
      }}>
        <Icon name="plus" size={20} color="var(--bg-accent-hot)" style={{ margin: "0 auto" }} />
        <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, marginTop: 8, letterSpacing: "0.08em" }}>ARRASTE OU CLIQUE</div>
        <div style={{ fontSize: 10, color: "var(--fg2)", marginTop: 4 }}>JPG, PNG, WEBP, MP4 · até 50MB</div>
      </div>
    </div>

    {/* Tabs */}
    <div style={{ display: "flex", gap: 6, padding: "0 16px 12px" }}>
      {["Todos", "Hero", "Promo", "Newsletter", "Drop"].map((t, i) => (
        <span key={t} style={{
          padding: "5px 10px",
          background: i === 0 ? "var(--bg-accent)" : "transparent",
          border: i === 0 ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
          color: "#fff", fontSize: 10, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.08em",
        }}>{t}</span>
      ))}
    </div>

    {/* Grid */}
    <div style={{ padding: "0 16px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      {[
        { c: "#cc0000", l: "VIPER X9", t: "HERO · ATIVO", live: true },
        { c: "#7a1a4a", l: "RANKED DROP", t: "HERO · ATIVO", live: true },
        { c: "#1a4a8a", l: "SETUP COMPL.", t: "HERO · ATIVO", live: true },
        { c: "#000", l: "BLACK GAMER", t: "CAMPANHA · 25/11", scheduled: true },
        { c: "#cc4400", l: "DROP CYBER", t: "BANNER 2-COL" },
        { c: "#0e4a1f", l: "GIFT CARDS", t: "BANNER 2-COL" },
        { c: "#7a1a8a", l: "PS5 DEALS", t: "ARQUIVADO" },
        { c: "#1a0006", l: "VOLTA ÀS AULAS", t: "RASCUNHO" },
      ].map((b, i) => (
        <div key={i} style={{ position: "relative" }}>
          <div style={{
            aspectRatio: "1.6 / 1", overflow: "hidden", position: "relative",
            background: `linear-gradient(135deg, ${b.c} 0%, #050505 100%)`,
            border: "1px solid var(--hair)",
            display: "flex", alignItems: "flex-end", padding: 8,
          }}>
            <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 9, letterSpacing: "0.05em", textTransform: "uppercase", color: "#fff" }}>{b.l}</span>
            {b.live && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                padding: "2px 5px", background: "var(--bg-accent-hot)",
                fontSize: 7, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.1em",
              }}>● LIVE</span>
            )}
            {b.scheduled && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                padding: "2px 5px", background: "#d99a00",
                fontSize: 7, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.1em",
              }}>AGENDADO</span>
            )}
          </div>
          <div style={{ fontSize: 8, color: "var(--fg3)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", marginTop: 3 }}>{b.t}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────── Global panel ─────────── */
const GlobalPanel = () => (
  <div>
    <div style={{ padding: "16px 16px 8px" }}>
      <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// AJUSTES GLOBAIS</span>
      <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 16, marginTop: 6, textTransform: "uppercase" }}>Identidade da loja</div>
    </div>

    <FieldBlock label="LOGO">
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "center" }}>
        <div style={{ width: 80, height: 60, background: "var(--surf-2)", border: "1px solid var(--hair-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <StoreLogo height={22} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Btn variant="ghost" size="sm">Trocar logo</Btn>
          <span style={{ fontSize: 9, color: "var(--fg3)", fontFamily: "var(--font-mono)" }}>SVG, PNG · 200×60 mín.</span>
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <input type="range" min={20} max={60} defaultValue={42} style={{ flex: 1, accentColor: "var(--bg-accent-hot)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, width: 50, textAlign: "right" }}>42 px</span>
      </div>
    </FieldBlock>

    <FieldBlock label="PALETA DE CORES">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { l: "Acento primário", v: "#CC0000", picker: true },
          { l: "Neon highlight", v: "#FF1F3D", picker: true },
          { l: "Fundo canvas", v: "#000000", picker: true },
          { l: "Superfície", v: "#131313", picker: true },
          { l: "Texto primário", v: "#FFFFFF", picker: true },
        ].map(c => (
          <div key={c.l} style={{ display: "grid", gridTemplateColumns: "32px 1fr auto", gap: 10, alignItems: "center" }}>
            <span style={{ width: 32, height: 32, background: c.v, border: "1px solid var(--hair-strong)", cursor: "pointer" }} />
            <span style={{ fontSize: 12 }}>{c.l}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg2)", letterSpacing: "0.04em" }}>{c.v}</span>
          </div>
        ))}
      </div>
      <Btn variant="ghost" size="sm" full style={{ marginTop: 12 }}>Importar paleta</Btn>
    </FieldBlock>

    <FieldBlock label="TIPOGRAFIA">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: "var(--fg2)", marginBottom: 4 }}>HEADLINE</div>
          <select className="bg-input" style={{ padding: "8px 10px", fontSize: 12 }}>
            <option>Commuters Sans Heavy 900 (atual)</option>
            <option>Anton</option>
            <option>Bebas Neue</option>
            <option>Druk</option>
            <option>Custom upload</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "var(--fg2)", marginBottom: 4 }}>BODY</div>
          <select className="bg-input" style={{ padding: "8px 10px", fontSize: 12 }}>
            <option>DM Sans (atual)</option>
            <option>Inter</option>
            <option>Manrope</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "var(--fg2)", marginBottom: 4 }}>ESCALA</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["Compacta", "Padrão", "Generosa"].map((s, i) => (
              <button key={s} style={{
                flex: 1, padding: "6px 0",
                background: i === 1 ? "var(--bg-accent)" : "var(--surf-2)",
                border: i === 1 ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
                color: "#fff", fontFamily: "var(--font-display-heavy)", fontSize: 10, cursor: "pointer",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </FieldBlock>

    <FieldBlock label="HEADER">
      <Toggle on={true} label="Sticky no scroll" />
      <div style={{ marginTop: 8 }}><Toggle on={true} label="Backdrop blur" /></div>
      <div style={{ marginTop: 8 }}><Toggle on={false} label="Header transparente no topo" /></div>
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 10, color: "var(--fg2)", marginBottom: 4 }}>Anúncio do topo</div>
        <input className="bg-input" defaultValue="FRETE GRÁTIS ACIMA DE R$ 299 · 10% OFF NO PIX" style={{ padding: "8px 10px", fontSize: 12 }} />
      </div>
    </FieldBlock>

    <FieldBlock label="BOTÕES">
      <div style={{ fontSize: 10, color: "var(--fg2)", marginBottom: 6 }}>Estilo</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {[
          { t: "ANGULAR", sel: true, clip: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)" },
          { t: "RETO", clip: "none" },
          { t: "PILL", clip: "none", radius: 99 },
        ].map(b => (
          <button key={b.t} style={{
            padding: "12px 0", cursor: "pointer",
            background: b.sel ? "var(--bg-accent)" : "var(--surf-2)",
            border: b.sel ? "1px solid var(--bg-accent)" : "1px solid var(--hair-strong)",
            color: "#fff", fontFamily: "var(--font-display-heavy)", fontSize: 9, letterSpacing: "0.1em",
            clipPath: b.clip !== "none" ? b.clip : "none",
            borderRadius: b.radius || 0,
          }}>{b.t}</button>
        ))}
      </div>
    </FieldBlock>

    <FieldBlock label="EFEITOS">
      <Toggle on={true} label="Grain overlay" />
      <div style={{ marginTop: 8 }}><Toggle on={true} label="Chevron pattern" /></div>
      <div style={{ marginTop: 8 }}><Toggle on={false} label="Glitch ocasional" /></div>
      <div style={{ marginTop: 8 }}><Toggle on={true} label="Neon glow no acento" /></div>
    </FieldBlock>

    <FieldBlock label="CHECKOUT">
      <Toggle on={true} label="Mostrar contador de PIX" />
      <div style={{ marginTop: 8 }}><Toggle on={true} label="Sugerir produtos no carrinho" /></div>
      <div style={{ marginTop: 8 }}><Toggle on={false} label="Compra rápida em 1 clique" /></div>
    </FieldBlock>
  </div>
);

/* ─────────── Live Preview ─────────── */
const LivePreview = ({ device, selectedSection }) => {
  const w = device === "desktop" ? 1280 : device === "tablet" ? 760 : 360;
  const scale = device === "desktop" ? 0.62 : device === "tablet" ? 0.85 : 1.1;
  return (
    <div style={{
      transform: `scale(${scale})`, transformOrigin: "top center",
      width: w, transition: "all 220ms var(--ease-out)",
    }}>
      <div style={{ background: "#000", border: "1px solid var(--hair-strong)", overflow: "hidden" }}>
        {/* Mini header */}
        <PreviewSection id="header" name="CABEÇALHO" locked>
          <div style={{ padding: "12px 24px", background: "#000", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--hair)" }}>
            <StoreLogo height={28} />
            <div style={{ flex: 1, maxWidth: 520, margin: "0 24px", position: "relative" }}>
              <input className="bg-input" placeholder="Buscar..." style={{ padding: "8px 12px 8px 32px", fontSize: 11 }} />
              <Icon name="search" size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--fg3)" }} />
            </div>
            <div style={{ display: "flex", gap: 14, color: "#fff" }}>
              <Icon name="user" size={16} />
              <Icon name="heart" size={16} />
              <Icon name="cart" size={16} />
            </div>
          </div>
          <div style={{ background: "var(--bg-accent)", padding: "5px 0", textAlign: "center", fontSize: 10, fontFamily: "var(--font-display-heavy)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            FRETE GRÁTIS ACIMA DE R$ 299 · 10% OFF NO PIX
          </div>
        </PreviewSection>

        {/* Hero — highlighted */}
        <PreviewSection id="hero" name="HERO · CARROSSEL" selected={selectedSection === "hero"}>
          <section style={{
            position: "relative", height: 360, overflow: "hidden",
            background: "linear-gradient(180deg, #000 0%, #1a0006 50%, #000 100%)",
          }}>
            <div className="chevron-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
            <div style={{
              position: "absolute", left: -20, top: 40,
              fontFamily: "var(--font-display-heavy)", fontSize: 320,
              color: "#0e0e0e", lineHeight: 0.78, letterSpacing: "-0.06em",
            }}>26K</div>
            <div style={{
              position: "absolute", top: 0, right: "15%", bottom: 0, width: 50,
              background: "var(--bg-accent)",
              clipPath: "polygon(60% 0, 100% 0, 40% 100%, 0 100%)",
            }} />
            <div style={{
              position: "absolute", right: 60, top: 60, width: 240, height: 240,
              background: "linear-gradient(180deg, #cc0000 0%, #1a0006 100%)",
              clipPath: "polygon(20% 5%, 80% 0, 95% 30%, 90% 75%, 75% 100%, 25% 100%, 10% 75%, 5% 30%)",
              boxShadow: "0 0 80px rgba(255,31,61,0.4)",
            }} />
            <div style={{ position: "relative", zIndex: 2, padding: "60px 32px" }}>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, color: "var(--bg-accent-hot)", letterSpacing: "0.16em", marginBottom: 14 }}>// EP.01 · DROP 2026</div>
              <h1 style={{
                margin: 0, fontFamily: "var(--font-display-heavy)",
                fontSize: 100, lineHeight: 0.82, letterSpacing: "-0.04em", textTransform: "uppercase",
              }}>ENTRA NO<br /><span style={{
                background: "var(--bg-accent)", padding: "0 14px", display: "inline-block",
                clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
              }}>SERVER.</span></h1>
              <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
                <Btn variant="hot" size="md">RESERVA O TEU</Btn>
                <Btn variant="ghost" size="md">Ver specs</Btn>
              </div>
            </div>
          </section>
        </PreviewSection>

        {/* Trust strip */}
        <PreviewSection id="trust" name="SELOS DE CONFIANÇA" selected={selectedSection === "trust"}>
          <section style={{ background: "#0a0a0a", padding: "16px 32px", borderTop: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { i: "truck", t: "FRETE GRÁTIS BR" },
              { i: "bolt", t: "10% OFF NO PIX" },
              { i: "shield", t: "COMPRA SEGURA" },
              { i: "pkg", t: "TROCA 30 DIAS" },
            ].map(f => (
              <div key={f.t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name={f.i} size={18} color="var(--bg-accent-hot)" />
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 10, letterSpacing: "0.08em" }}>{f.t}</span>
              </div>
            ))}
          </section>
        </PreviewSection>

        {/* Categories */}
        <PreviewSection id="categories" name="CATEGORIAS" selected={selectedSection === "categories"}>
          <section style={{ padding: "32px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
            {[
              { t: "Periféricos", c: "#cc0000" },
              { t: "Streetwear", c: "#1a1a1a" },
              { t: "Hardware", c: "#1a4a8a" },
              { t: "Console", c: "#7a1a8a" },
              { t: "Colecionáveis", c: "#cc4400" },
              { t: "Gift Cards", c: "#0e4a1f" },
            ].map(c => (
              <div key={c.t} style={{
                aspectRatio: "1 / 1.1", padding: 12,
                background: `radial-gradient(at 30% 30%, ${c.c}55, transparent 60%), #111`,
                border: "1px solid var(--hair)",
                display: "flex", alignItems: "flex-end",
              }}>
                <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, textTransform: "uppercase", lineHeight: 1 }}>{c.t}</span>
              </div>
            ))}
          </section>
        </PreviewSection>

        {/* Bestsellers */}
        <PreviewSection id="best" name="MAIS VENDIDOS" selected={selectedSection === "best"}>
          <section style={{ padding: "16px 32px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display-heavy)", fontSize: 28, textTransform: "uppercase", letterSpacing: "-0.02em" }}>MAIS VENDIDOS.</h3>
              <a href="#" style={{ fontSize: 11, color: "var(--bg-accent-hot)" }}>Ver todos →</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} size="sm" />)}
            </div>
          </section>
        </PreviewSection>

        {/* Promo banner */}
        <PreviewSection id="banner-promo" name="BANNER PROMOCIONAL" selected={selectedSection === "banner-promo"}>
          <section style={{ padding: "0 32px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, height: 180 }}>
            <a href="#" style={{
              position: "relative", overflow: "hidden",
              background: "linear-gradient(135deg, #cc0000 0%, #4a0006 100%)",
              padding: 24, display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 0.9, textTransform: "uppercase" }}>RANKED<br />DROP</div>
              <p style={{ margin: "8px 0 0", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Hoodies & camisetas oficiais</p>
            </a>
            <a href="#" style={{
              position: "relative", overflow: "hidden",
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a3a 100%)",
              padding: 24, border: "1px solid var(--hair-strong)",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 4, background: "var(--bg-accent-hot)" }} />
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 28, lineHeight: 0.9, textTransform: "uppercase" }}>SETUP<br />COMPLETO</div>
              <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--fg2)" }}>18x sem juros</p>
            </a>
          </section>
        </PreviewSection>

        {/* Footer trim */}
        <PreviewSection id="footer" name="RODAPÉ" locked>
          <section style={{ padding: 24, background: "#050505", borderTop: "1px solid var(--hair-strong)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <StoreLogo height={22} />
            <span style={{ fontSize: 10, color: "var(--fg3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>© 2026 BeGamers Store</span>
          </section>
        </PreviewSection>
      </div>
    </div>
  );
};

const PreviewSection = ({ id, name, selected, locked, children }) => (
  <div style={{
    position: "relative",
    outline: selected ? "2px dashed var(--bg-accent-hot)" : "none",
    outlineOffset: -2,
  }}>
    {children}
    {(selected || true) && (
      <div style={{
        position: "absolute", top: 6, left: 6, zIndex: 5,
        padding: "3px 8px",
        background: selected ? "var(--bg-accent-hot)" : "rgba(0,0,0,0.7)",
        color: "#fff", fontFamily: "var(--font-display-heavy)", fontSize: 9,
        letterSpacing: "0.12em", textTransform: "uppercase",
        display: "inline-flex", alignItems: "center", gap: 6,
        opacity: selected ? 1 : 0.6,
        boxShadow: selected ? "var(--neon-glow)" : "none",
      }}>
        {selected && <span style={{ width: 5, height: 5, background: "#fff", borderRadius: 99 }} />}
        {locked && <Icon name="lock" size={9} />}
        {name}
      </div>
    )}
  </div>
);

window.AdminAppearance = AdminAppearance;

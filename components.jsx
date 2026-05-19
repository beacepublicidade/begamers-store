/* global React */
/* BeGamers Store — Shared primitives & layout */
const { useState, useEffect, useRef } = React;

/* ─────────── Frames ─────────── */
const DesktopFrame = ({ children, height = 2200, label = "Desktop · 1440" }) => (
  <div style={{
    width: 1440, minWidth: 1440, height, background: "#000",
    border: "1px solid var(--hair-strong)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    overflow: "hidden", position: "relative",
    display: "flex", flexDirection: "column",
  }}>
    <div style={{
      height: 28, background: "#0a0a0a", borderBottom: "1px solid var(--hair)",
      display: "flex", alignItems: "center", gap: 6, padding: "0 12px",
      flexShrink: 0,
    }}>
      <span style={{ width: 10, height: 10, borderRadius: 99, background: "#3a3a3a" }} />
      <span style={{ width: 10, height: 10, borderRadius: 99, background: "#3a3a3a" }} />
      <span style={{ width: 10, height: 10, borderRadius: 99, background: "#3a3a3a" }} />
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 11, color: "#6b6b6b",
        marginLeft: 14, letterSpacing: ".1em",
      }}>begamersstore.com.br {label ? "· " + label : ""}</span>
    </div>
    <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#000" }}>
      {children}
    </div>
  </div>
);

const MobileFrame = ({ children, height = 2200, label = "iPhone 15 · 390" }) => (
  <div style={{
    width: 390, minWidth: 390, height,
    background: "#000",
    border: "8px solid #1a1a1a",
    borderRadius: 44,
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    overflow: "hidden", position: "relative",
    display: "flex", flexDirection: "column",
  }}>
    {/* status bar */}
    <div style={{
      height: 44, flexShrink: 0,
      background: "#000", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", fontSize: 13, fontWeight: 700, color: "#fff",
      fontFamily: "system-ui",
      position: "relative",
    }}>
      <span>9:41</span>
      {/* dynamic island */}
      <span style={{
        position: "absolute", left: "50%", top: 10, transform: "translateX(-50%)",
        width: 110, height: 30, background: "#000", borderRadius: 99,
      }} />
      <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <span style={{ width: 18, height: 10, border: "1px solid #fff", borderRadius: 2, position: "relative" }}>
          <span style={{ position: "absolute", inset: 1, background: "#fff", borderRadius: 1 }} />
        </span>
      </span>
    </div>
    <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#000" }}>
      {children}
    </div>
  </div>
);

/* ─────────── Logo & Brand ─────────── */
const StoreLogo = ({ height = 40, dark = true }) => (
  <img
    src={dark ? "assets/begamers-store-logo-dark.png" : "assets/begamers-store-logo.png"}
    alt="BeGamers Store"
    style={{ height, display: "block" }}
  />
);

const VMark = ({ size = 22, color = "#fff", accent = "var(--bg-accent-hot)" }) => (
  <svg viewBox="0 0 60 50" width={size} height={size * 50 / 60} aria-hidden style={{ display: "block" }}>
    <polygon points="0,0 60,0 30,50" fill={color} />
    <polygon points="18,6 42,6 30,28" fill={accent} />
  </svg>
);

/* ─────────── Buttons ─────────── */
const Btn = ({ variant = "primary", size = "md", children, full, icon, style = {}, onClick }) => {
  const sizes = {
    sm: { padding: "8px 14px", fontSize: 11 },
    md: { padding: "12px 20px", fontSize: 13 },
    lg: { padding: "16px 28px", fontSize: 14 },
    xl: { padding: "20px 36px", fontSize: 16 },
  };
  const variants = {
    primary: { background: "var(--bg-accent)", color: "#fff", border: "0" },
    hot:     { background: "var(--bg-accent-hot)", color: "#fff", border: "0", boxShadow: "var(--neon-glow)" },
    outline: { background: "transparent", color: "#fff", border: "2px solid #fff" },
    ghost:   { background: "transparent", color: "#fff", border: "1px solid var(--hair-strong)" },
    dark:    { background: "#fff", color: "#000", border: "0" },
  };
  return (
    <button onClick={onClick} style={{
      fontFamily: "var(--font-display-heavy)", fontWeight: 900,
      letterSpacing: "0.06em", textTransform: "uppercase",
      cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      width: full ? "100%" : "auto",
      clipPath: variant !== "ghost" && variant !== "outline" ? "polygon(0 0, 100% 0, 96% 100%, 4% 100%)" : "none",
      transition: "all 180ms var(--ease-out)",
      ...sizes[size], ...variants[variant], ...style,
    }}>
      {icon}<span>{children}</span>
    </button>
  );
};

/* ─────────── Tag / Badge ─────────── */
const Tag = ({ children, tone = "neutral", style = {} }) => {
  const tones = {
    neutral: { background: "#1a1a1a", color: "#fff", border: "1px solid var(--hair-strong)" },
    red:     { background: "var(--bg-accent)", color: "#fff" },
    hot:     { background: "var(--bg-accent-hot)", color: "#fff", boxShadow: "var(--neon-glow)" },
    outline: { background: "transparent", color: "#fff", border: "1px solid #fff" },
    success: { background: "#0e3a1f", color: "#4cd680", border: "1px solid #1f9d55" },
    warning: { background: "#3a2a00", color: "#ffc940", border: "1px solid #d99a00" },
    dark:    { background: "#000", color: "#fff", border: "1px solid var(--hair-strong)" },
  };
  return (
    <span style={{
      fontFamily: "var(--font-display-heavy)", fontWeight: 900,
      fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
      padding: "5px 8px", display: "inline-flex", alignItems: "center", gap: 5,
      lineHeight: 1, ...tones[tone], ...style,
    }}>{children}</span>
  );
};

/* ─────────── Icon (SVG inline so we don't need lucide) ─────────── */
const Icon = ({ name, size = 20, color = "currentColor", stroke = 1.7, style = {} }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    cart:   <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.3a2 2 0 0 0 2 1.7h8a2 2 0 0 0 2-1.7L22 7H6" /></>,
    user:   <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    heart:  <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />,
    menu:   <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
    chevR:  <path d="m9 6 6 6-6 6" />,
    chevD:  <path d="m6 9 6 6 6-6" />,
    chevU:  <path d="m6 15 6-6 6 6" />,
    chevL:  <path d="m15 6-6 6 6 6" />,
    x:      <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    plus:   <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    minus:  <path d="M5 12h14" />,
    star:   <path d="m12 2 3 7 7.5.6-5.7 5 1.7 7.3L12 18l-6.5 3.9 1.7-7.3-5.7-5L9 9z" />,
    trash:  <><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></>,
    truck:  <><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7" /><circle cx="6" cy="19" r="2" /><circle cx="19" cy="19" r="2" /></>,
    shield: <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" />,
    bolt:   <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    pkg:    <><path d="m21 8-9-6-9 6 9 6 9-6z" /><path d="M3 8v8l9 6 9-6V8" /><path d="m12 14 0 8" /></>,
    pix:    <path d="M2 12 12 2l10 10-10 10z M7 12l5-5 5 5-5 5z" />,
    filter: <path d="M3 5h18l-7 9v6l-4-2v-4z" />,
    grid:   <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    rows:   <><rect x="3" y="4" width="18" height="4" /><rect x="3" y="10" width="18" height="4" /><rect x="3" y="16" width="18" height="4" /></>,
    eye:    <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
    fire:   <path d="M8 14a4 4 0 1 0 8 0c0-3-4-5-3-10C8 6 5 9 5 14a7 7 0 0 0 14 0c0-2-2-4-4-5" />,
    check:  <path d="m5 12 5 5L20 7" />,
    lock:   <><rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V8a4 4 0 1 1 8 0v3" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill={color} /></>,
    twitch: <><path d="M4 4h16v10l-4 4h-4l-3 3v-3H4z" /><path d="M11 8v5" /><path d="M15 8v5" /></>,
    youtube: <><rect x="2" y="6" width="20" height="12" rx="3" /><path d="m10 9 5 3-5 3z" fill={color} stroke="none" /></>,
    discord: <><path d="M8 9c4-1 4-1 8 0" /><path d="M7 19c-2-1-3-4-3-9 1-2 3-3 5-3l1 2c2-1 4-1 6 0l1-2c2 0 4 1 5 3 0 5-1 8-3 9l-1-2c-3 1-7 1-10 0z" /></>,
    twitter: <path d="M22 4c-1 .5-2 1-3 1 1-1 1.5-2 2-3-1 .5-2 1-3 1.5C16.5 2 13 3 12 6c0 .5 0 1 .5 1.5C9 7 6 5 4 3c-.5 1-1 2-1 3 0 1.5 1 3 2.5 3.5-1 0-2 0-2.5-.5 0 2 1.5 3.5 3.5 4-1 0-2 0-2.5 0 .5 2 2 3 4 3-1.5 1.5-4 2.5-6.5 2C3 19.5 5.5 20.5 8 20.5 16 20.5 20 14 20 8c0 0 0-.5 0-.5 1-.5 2-1 2-2z" />,
    headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="5" height="7" rx="1" /><rect x="16" y="14" width="5" height="7" rx="1" /></>,
    monitor: <><rect x="2" y="3" width="20" height="13" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      fill="none" stroke={color} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...style }}>
      {paths[name] || null}
    </svg>
  );
};

/* ─────────── Stars ─────────── */
const Stars = ({ value = 4.6, size = 12, showNumber = true, count }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <Icon key={i} name="star" size={size}
          color={i < Math.round(value) ? "#ffb800" : "#3a3a3a"}
          stroke={1.2}
          style={{ fill: i < Math.round(value) ? "#ffb800" : "transparent" }}
        />
      ))}
    </span>
    {showNumber && <span style={{ fontSize: 11, color: "var(--fg2)" }}>{value.toString().replace(".", ",")}{count ? ` (${count})` : ""}</span>}
  </span>
);

/* ─────────── Price ─────────── */
const Price = ({ value, old, size = "md", parcelas = 12, pix = true }) => {
  const sizes = {
    sm: { current: 16, old: 11, sub: 10 },
    md: { current: 22, old: 12, sub: 11 },
    lg: { current: 32, old: 14, sub: 12 },
    xl: { current: 48, old: 18, sub: 13 },
  };
  const s = sizes[size];
  const fmt = v => "R$ " + v.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/\.(?=\d{2}$)/, ",");
  const fmtFix = v => "R$ " + v.toFixed(2).replace(".", ",");
  const pixValue = pix ? value * 0.9 : value;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {old && <span style={{ fontSize: s.old, color: "var(--fg3)", textDecoration: "line-through" }}>{fmtFix(old)}</span>}
      <span style={{
        fontFamily: "var(--font-display-heavy)", fontWeight: 900,
        fontSize: s.current, lineHeight: 1, color: "#fff",
        letterSpacing: "-0.01em",
      }}>{fmtFix(value)}</span>
      {pix && <span style={{ fontSize: s.sub, color: "#4cd680", fontWeight: 700, letterSpacing: 0.4 }}>
        {fmtFix(pixValue)} no PIX
      </span>}
      <span style={{ fontSize: s.sub, color: "var(--fg2)" }}>
        ou {parcelas}x de {fmtFix(value / parcelas)} sem juros
      </span>
    </div>
  );
};

/* ─────────── Product Card ─────────── */
const PRODUCTS = [
  { id: 1, name: "VIPER X9 — Mouse Gamer Sem Fio 26K DPI", price: 449.90, old: 599.90, brand: "BEGAMERS LAB", cat: "Periféricos", rating: 4.8, count: 1243, tags: ["NOVO"], color: "#cc0000" },
  { id: 2, name: "DEMON KEY 87 — Teclado Mecânico TKL Hot-Swap", price: 689.00, old: 899.00, brand: "BEGAMERS LAB", cat: "Periféricos", rating: 4.9, count: 842, tags: ["-23%"], color: "#7a1a8a" },
  { id: 3, name: "HYDRA HD — Headset 7.1 Surround", price: 329.00, brand: "BEGAMERS LAB", cat: "Periféricos", rating: 4.6, count: 567, tags: ["MAIS VENDIDO"], color: "#1a6f8a" },
  { id: 4, name: "ICEPAD XL — Mousepad Speed 90x40", price: 119.90, old: 159.90, brand: "BEGAMERS LAB", cat: "Periféricos", rating: 4.7, count: 2104, tags: ["-25%"], color: "#222" },
  { id: 5, name: "Hoodie RANKED — Edição Limitada", price: 249.90, brand: "BEGAMERS WEAR", cat: "Streetwear", rating: 4.9, count: 312, tags: ["DROP"], color: "#cc0000" },
  { id: 6, name: "Camiseta GG EZ — Oversized", price: 129.90, brand: "BEGAMERS WEAR", cat: "Streetwear", rating: 4.7, count: 198, tags: [], color: "#111" },
  { id: 7, name: "Action Figure — CYBER SAMURAI 1/6", price: 899.00, brand: "ARTWORKS", cat: "Colecionáveis", rating: 4.8, count: 64, tags: ["PRÉ-VENDA"], color: "#4a1a8a" },
  { id: 8, name: "Pôster Premium — VALORANT Maps Pack", price: 89.90, brand: "ARTWORKS", cat: "Colecionáveis", rating: 4.5, count: 421, tags: [], color: "#cc4400" },
  { id: 9, name: "Gift Card Steam R$ 100", price: 100.00, brand: "STEAM", cat: "Gift Cards", rating: 5.0, count: 5841, tags: ["DIGITAL"], color: "#1a3a6f" },
  { id: 10, name: "Controle DUALSENSE — PS5 Midnight Black", price: 499.00, old: 549.00, brand: "SONY", cat: "Console", rating: 4.7, count: 1102, tags: [], color: "#0a0a0a" },
  { id: 11, name: "Placa de Vídeo RTX 5070 12GB", price: 4299.00, old: 4799.00, brand: "NVIDIA", cat: "Hardware", rating: 4.9, count: 287, tags: ["BLACK DEAL"], color: "#0a4a1a" },
  { id: 12, name: "Monitor 27\" 240Hz IPS — VOID Pro", price: 2199.00, brand: "BEGAMERS LAB", cat: "Hardware", rating: 4.8, count: 156, tags: ["NOVO"], color: "#1a1a4a" },
];

const ProductCard = ({ p, layout = "grid", size = "md" }) => {
  const isList = layout === "list";
  return (
    <article style={{
      background: "var(--surf-2)",
      border: "1px solid var(--hair)",
      borderRadius: 2,
      display: "flex", flexDirection: isList ? "row" : "column",
      position: "relative", overflow: "hidden",
      transition: "all 220ms var(--ease-out)",
      cursor: "pointer",
    }}>
      {/* image */}
      <div className="placeholder-grad" style={{
        position: "relative",
        width: isList ? 200 : "100%",
        aspectRatio: isList ? undefined : "1 / 1",
        height: isList ? 200 : undefined,
        background: `radial-gradient(at 50% 50%, ${p.color}33, transparent 65%), linear-gradient(135deg, #181818, #0a0a0a)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {/* product silhouette placeholder */}
        <div style={{
          width: "55%", height: "55%",
          background: `linear-gradient(135deg, ${p.color}, #000)`,
          clipPath: "polygon(20% 0, 100% 0, 80% 100%, 0 100%)",
          opacity: 0.7,
        }} />
        {/* badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 5 }}>
          {p.tags.map(t => (
            <Tag key={t} tone={t.startsWith("-") ? "hot" : t === "NOVO" ? "red" : t === "DROP" ? "outline" : "dark"}>
              {t}
            </Tag>
          ))}
        </div>
        <button style={{
          position: "absolute", top: 10, right: 10,
          width: 32, height: 32, background: "rgba(0,0,0,0.7)",
          border: "1px solid var(--hair-strong)", borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", cursor: "pointer",
        }}><Icon name="heart" size={16} /></button>
      </div>
      {/* body */}
      <div style={{
        padding: size === "sm" ? 14 : 18,
        display: "flex", flexDirection: "column", gap: 8, flex: 1,
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: "0.16em", color: "var(--fg3)", textTransform: "uppercase",
          }}>{p.brand}</span>
          <h3 style={{
            margin: 0, color: "#fff", fontWeight: 600,
            fontSize: size === "sm" ? 13 : 14, lineHeight: 1.3,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{p.name}</h3>
          <Stars value={p.rating} count={p.count} size={11} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Price value={p.price} old={p.old} size={size === "sm" ? "sm" : "md"} />
          <Btn variant="primary" size={size === "sm" ? "sm" : "md"} full>Comprar</Btn>
        </div>
      </div>
      {/* hover bar */}
      <span style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "var(--bg-accent)", transform: "scaleX(0)",
        transformOrigin: "left", transition: "transform 220ms var(--ease-out)",
      }} />
    </article>
  );
};

/* ─────────── Header (desktop) ─────────── */
const StoreHeader = ({ active = "Home", compact = false }) => {
  const categorias = ["PERIFÉRICOS", "STREETWEAR", "HARDWARE", "CONSOLE", "COLECIONÁVEIS", "GIFT CARDS", "OFERTAS"];
  return (
    <header style={{ background: "#000", borderBottom: "1px solid var(--hair)" }}>
      {/* announcement */}
      <div style={{
        background: "var(--bg-accent)", color: "#fff",
        textAlign: "center", padding: "8px 0",
        fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="bolt" size={14} /> FRETE GRÁTIS ACIMA DE R$ 299
        </span>
        <span style={{ opacity: 0.5 }}>///</span>
        <span>10% OFF NO PIX</span>
        <span style={{ opacity: 0.5 }}>///</span>
        <span>BEGAMERS DROP — COLEÇÃO RANKED DISPONÍVEL</span>
      </div>
      {/* main bar */}
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "20px 32px",
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "center",
      }}>
        <a href="#"><StoreLogo height={42} /></a>
        {/* search */}
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto", width: "100%" }}>
          <Icon name="search" size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fg3)" }} />
          <input className="bg-input" placeholder="Buscar produtos, marcas, jogos..." style={{ paddingLeft: 44, paddingRight: 100 }} />
          <button style={{
            position: "absolute", right: 4, top: 4, bottom: 4,
            background: "var(--bg-accent)", color: "#fff", border: 0, padding: "0 20px",
            fontFamily: "var(--font-display-heavy)", fontWeight: 900, fontSize: 12, letterSpacing: "0.06em",
            textTransform: "uppercase", cursor: "pointer",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%)",
          }}>Buscar</button>
        </div>
        {/* actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button style={iconBtnStyle}>
            <Icon name="user" size={20} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Entrar</span>
          </button>
          <button style={iconBtnStyle}>
            <Icon name="heart" size={20} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Lista</span>
            <span style={miniBadge}>3</span>
          </button>
          <button style={{ ...iconBtnStyle, background: "var(--bg-accent)", padding: "10px 16px", clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)" }}>
            <Icon name="cart" size={20} />
            <span style={{ fontSize: 11, fontWeight: 700 }}>R$ 829,80</span>
            <span style={{ ...miniBadge, background: "#fff", color: "var(--bg-accent)" }}>4</span>
          </button>
        </div>
      </div>
      {/* category nav */}
      <nav style={{
        borderTop: "1px solid var(--hair)",
        background: "#0a0a0a",
      }}>
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 32px",
          display: "flex", alignItems: "center", gap: 28, height: 48,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-display-heavy)", fontSize: 12,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff",
            paddingRight: 24, borderRight: "1px solid var(--hair-strong)",
            height: "100%",
          }}>
            <Icon name="menu" size={16} /> TODAS CATEGORIAS
          </span>
          {categorias.map(c => (
            <a key={c} href="#" style={{
              fontFamily: "var(--font-display-heavy)", fontSize: 12,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: c === "OFERTAS" ? "var(--bg-accent-hot)" : (active === c ? "#fff" : "var(--fg2)"),
              borderBottom: active === c ? "2px solid var(--bg-accent)" : "2px solid transparent",
              padding: "16px 0",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              {c === "OFERTAS" && <span className="live-dot" />}
              {c}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

const iconBtnStyle = {
  display: "inline-flex", alignItems: "center", gap: 6,
  background: "transparent", border: 0, color: "#fff",
  cursor: "pointer", padding: "10px 4px", position: "relative",
};
const miniBadge = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  minWidth: 18, height: 18, padding: "0 5px",
  background: "var(--bg-accent-hot)", color: "#fff",
  fontSize: 10, fontWeight: 900, borderRadius: 99,
  fontFamily: "var(--font-display-heavy)",
};

/* ─────────── Mobile Header ─────────── */
const MobileHeader = ({ subtitle, showBack, showSearch = true, title }) => (
  <div style={{ position: "relative", background: "#000", borderBottom: "1px solid var(--hair)" }}>
    <div style={{ background: "var(--bg-accent)", color: "#fff", textAlign: "center", padding: "5px 0", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700 }}>
      FRETE GRÁTIS ACIMA DE R$ 299 ⚡ 10% OFF NO PIX
    </div>
    <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      {showBack ? (
        <button style={{ background: "transparent", border: 0, color: "#fff", padding: 6 }}><Icon name="chevL" size={22} /></button>
      ) : (
        <button style={{ background: "transparent", border: 0, color: "#fff", padding: 6 }}><Icon name="menu" size={22} /></button>
      )}
      {title ? (
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: "var(--font-display-heavy)", fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</span>
          {subtitle && <div style={{ fontSize: 10, color: "var(--fg2)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2 }}>{subtitle}</div>}
        </div>
      ) : (
        <a href="#" style={{ flex: 1 }}><StoreLogo height={26} /></a>
      )}
      <button style={{ background: "transparent", border: 0, color: "#fff", padding: 6 }}><Icon name="search" size={20} /></button>
      <button style={{ background: "transparent", border: 0, color: "#fff", padding: 6, position: "relative" }}>
        <Icon name="cart" size={20} />
        <span style={{ ...miniBadge, position: "absolute", top: 0, right: 0, minWidth: 14, height: 14, fontSize: 9 }}>4</span>
      </button>
    </div>
    {showSearch && (
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ position: "relative" }}>
          <Icon name="search" size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--fg3)" }} />
          <input className="bg-input" placeholder="Buscar..." style={{ paddingLeft: 38, fontSize: 13, padding: "10px 12px 10px 38px" }} />
        </div>
      </div>
    )}
  </div>
);

/* ─────────── Mobile Bottom Nav ─────────── */
const MobileBottomNav = ({ active = "home" }) => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: "rgba(0,0,0,0.95)", backdropFilter: "blur(14px)",
    borderTop: "1px solid var(--hair-strong)",
    display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
    height: 64, paddingBottom: 6,
    zIndex: 10,
  }}>
    {[
      { k: "home", label: "Home", icon: "grid" },
      { k: "search", label: "Buscar", icon: "search" },
      { k: "fav", label: "Lista", icon: "heart" },
      { k: "cart", label: "Carrinho", icon: "cart", badge: 4 },
      { k: "me", label: "Conta", icon: "user" },
    ].map(t => (
      <button key={t.k} style={{
        background: "transparent", border: 0, color: active === t.k ? "var(--bg-accent-hot)" : "var(--fg2)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
        position: "relative",
      }}>
        <Icon name={t.icon} size={20} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t.label}</span>
        {t.badge && (
          <span style={{ ...miniBadge, position: "absolute", top: 4, right: "30%", minWidth: 14, height: 14, fontSize: 9 }}>{t.badge}</span>
        )}
        {active === t.k && (
          <span style={{ position: "absolute", top: 0, left: "30%", right: "30%", height: 2, background: "var(--bg-accent-hot)" }} />
        )}
      </button>
    ))}
  </div>
);

/* ─────────── Footer (desktop) ─────────── */
const StoreFooter = () => (
  <footer style={{ background: "#050505", borderTop: "1px solid var(--hair-strong)", marginTop: 64 }}>
    {/* CTA Newsletter */}
    <div style={{
      background: "linear-gradient(135deg, #1a0006, #000)",
      borderBottom: "1px solid var(--hair)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 32px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// NEWSLETTER</span>
          <h2 style={{
            margin: "12px 0 8px", fontFamily: "var(--font-display-heavy)", fontSize: 40,
            textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1,
          }}>ENTRA NO SERVER.</h2>
          <p style={{ color: "var(--fg2)", margin: 0, fontSize: 14, maxWidth: 460 }}>
            Drops antes de todo mundo, cupons exclusivos e os melhores deals da semana. Sem spam — só boss fight.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="bg-input" placeholder="seu@email.com" style={{ flex: 1 }} />
          <Btn variant="hot" size="lg">Cadastrar</Btn>
        </div>
      </div>
    </div>
    {/* Links */}
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 32px 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 32 }}>
      <div>
        <StoreLogo height={36} />
        <p style={{ color: "var(--fg2)", fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
          A loja oficial da comunidade BEGAMERS. Periféricos, streetwear, colecionáveis e o que mais o gamer precisa.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {["instagram", "twitch", "youtube", "discord", "twitter"].map(s => (
            <a key={s} href="#" style={{
              width: 36, height: 36, border: "1px solid var(--hair-strong)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}><Icon name={s} size={16} /></a>
          ))}
        </div>
      </div>
      {[
        { t: "LOJA", links: ["Todas Categorias", "Lançamentos", "Mais Vendidos", "Ofertas do Dia", "Coleção Ranked", "Outlet"] },
        { t: "AJUDA", links: ["Central de Ajuda", "Como Comprar", "Trocas e Devoluções", "Garantia", "Status do Pedido"] },
        { t: "INSTITUCIONAL", links: ["Sobre Nós", "Trabalhe Conosco", "Imprensa", "Parcerias", "Embaixadores"] },
        { t: "MINHA CONTA", links: ["Entrar / Cadastrar", "Meus Pedidos", "Lista de Desejos", "Endereços", "Cupons"] },
      ].map(c => (
        <div key={c.t}>
          <h4 style={{
            margin: "0 0 16px", fontFamily: "var(--font-display-heavy)", fontSize: 13,
            letterSpacing: "0.14em", textTransform: "uppercase",
            paddingBottom: 8, borderBottom: "2px solid var(--bg-accent)", display: "inline-block",
          }}>{c.t}</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {c.links.map(l => (
              <li key={l}><a href="#" style={{ color: "var(--fg2)", fontSize: 13 }}>{l}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    {/* Trust */}
    <div style={{
      borderTop: "1px solid var(--hair)", borderBottom: "1px solid var(--hair)",
      background: "#000",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {[
          { i: "truck", t: "FRETE GRÁTIS", s: "Acima de R$ 299" },
          { i: "shield", t: "SITE SEGURO", s: "Certificado SSL + AntiFraude" },
          { i: "pkg", t: "DEVOLUÇÃO", s: "Até 30 dias garantidos" },
          { i: "bolt", t: "ENVIO RÁPIDO", s: "Postagem em 24h úteis" },
        ].map(f => (
          <div key={f.t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: "var(--bg-accent-hot)" }}><Icon name={f.i} size={28} stroke={1.6} /></span>
            <div>
              <div style={{ fontFamily: "var(--font-display-heavy)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>{f.t}</div>
              <div style={{ fontSize: 11, color: "var(--fg2)" }}>{f.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Bottom */}
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
      <div style={{ fontSize: 11, color: "var(--fg3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        © 2026 BEGAMERS STORE LTDA · CNPJ 00.000.000/0001-00 · Av. Paulista, 1000 — São Paulo / SP
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {["VISA", "MASTER", "AMEX", "ELO", "PIX", "BOLETO"].map(p => (
          <span key={p} style={{
            padding: "5px 9px", border: "1px solid var(--hair-strong)",
            fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em",
            color: "var(--fg2)",
          }}>{p}</span>
        ))}
      </div>
    </div>
  </footer>
);

/* ─────────── Section heading ─────────── */
const SectionHead = ({ eyebrow, title, link, mobile }) => (
  <div style={{
    display: "flex", alignItems: mobile ? "flex-start" : "flex-end", justifyContent: "space-between",
    marginBottom: mobile ? 16 : 28, gap: 16,
    flexDirection: mobile ? "column" : "row",
  }}>
    <div>
      {eyebrow && <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span className="red-rule" style={{ width: 32, height: 4 }} />
        <span className="eyebrow-mono" style={{ color: "var(--bg-accent-hot)" }}>// {eyebrow}</span>
      </div>}
      <h2 style={{
        margin: 0, fontFamily: "var(--font-display-heavy)",
        fontSize: mobile ? 26 : 40, lineHeight: 1, letterSpacing: "-0.02em",
        textTransform: "uppercase",
      }}>{title}</h2>
    </div>
    {link && <a href="#" style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      fontFamily: "var(--font-display-heavy)", fontSize: 12,
      letterSpacing: "0.1em", textTransform: "uppercase",
      borderBottom: "2px solid var(--bg-accent)",
      paddingBottom: 4,
    }}>{link} <Icon name="chevR" size={14} /></a>}
  </div>
);

/* Scrollable page wrapper that scrolls inside frame */
const PageScroll = ({ children, style = {} }) => (
  <div className="no-scrollbar" style={{
    position: "absolute", inset: 0, overflow: "auto",
    background: "#000", ...style,
  }}>
    {children}
  </div>
);

window.BG = {
  DesktopFrame, MobileFrame,
  StoreLogo, VMark,
  Btn, Tag, Icon, Stars, Price, ProductCard, PRODUCTS,
  StoreHeader, MobileHeader, MobileBottomNav, StoreFooter,
  SectionHead, PageScroll,
};

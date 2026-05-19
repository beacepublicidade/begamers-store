/* global React, ReactDOM, BG */
const { DesktopFrame, MobileFrame } = BG;

function ArtboardPair({ desktop, mobile, height = 2400 }) {
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <DesktopFrame height={height}>{desktop}</DesktopFrame>
      <MobileFrame height={height}>{mobile}</MobileFrame>
    </div>
  );
}

/* Tweak defaults (host can rewrite) */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#cc0000",
  "accentHot": "#ff1f3d",
  "grain": 0.08,
  "showAnnouncement": true,
  "density": "regular"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply tweaks to CSS vars
  React.useEffect(() => {
    document.documentElement.style.setProperty("--bg-accent", t.accent);
    document.documentElement.style.setProperty("--bg-accent-hot", t.accentHot);
    document.documentElement.style.setProperty("--bg-grain", String(t.grain));
  }, [t.accent, t.accentHot, t.grain]);

  // artboard dimensions (account for chrome)
  const W = 1440 + 32 + 390 + 16; // ~1878
  const heights = {
    homeSafe: 4200,
    homeBold: 4400,
    plp: 2400,
    pdp: 3400,
    cart: 2200,
    checkout: 1600,
    auth: 900,
    account: 2200,
    search: 2600,
    campaign: 3800,
    frete: 1500,
    cartao: 1800,
    tracking: 2400,
    adminLogin: 900,
    adminDash: 2600,
    adminOrders: 1900,
    adminFin: 2400,
    adminProducts: 1700,
    adminTheme: 1800,
  };

  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="home" title="01 · Home" subtitle="2 direções: Safe (familiar Tray/Nuvemshop) e Ousada (editorial-esports).">
          <DCArtboard id="home-safe" label="HOME · SAFE" width={W} height={heights.homeSafe}>
            <ArtboardPair desktop={<HomeSafeDesktop />} mobile={<HomeSafeMobile />} height={heights.homeSafe - 80} />
          </DCArtboard>
          <DCArtboard id="home-bold" label="HOME · OUSADA" width={W} height={heights.homeBold}>
            <ArtboardPair desktop={<HomeBoldDesktop />} mobile={<HomeBoldMobile />} height={heights.homeBold - 80} />
          </DCArtboard>
        </DCSection>

        <DCSection id="discovery" title="02 · Descoberta" subtitle="Listagem, busca e campanha — onde o gamer encontra o produto.">
          <DCArtboard id="plp" label="PLP · CATEGORIA COM FILTROS" width={W} height={heights.plp}>
            <ArtboardPair desktop={<PLPDesktop />} mobile={<PLPMobile />} height={heights.plp - 80} />
          </DCArtboard>
          <DCArtboard id="search" label="BUSCA · RESULTADOS" width={W} height={heights.search}>
            <ArtboardPair desktop={<SearchDesktop />} mobile={<SearchMobile />} height={heights.search - 80} />
          </DCArtboard>
          <DCArtboard id="campaign" label="CAMPANHA · BLACK GAMER WEEK" width={W} height={heights.campaign}>
            <ArtboardPair desktop={<CampaignDesktop />} mobile={<CampaignMobile />} height={heights.campaign - 80} />
          </DCArtboard>
        </DCSection>

        <DCSection id="product" title="03 · Produto" subtitle="Página de produto — onde o clique acontece.">
          <DCArtboard id="pdp" label="PDP · VIPER X9" width={W} height={heights.pdp}>
            <ArtboardPair desktop={<PDPDesktop />} mobile={<PDPMobile />} height={heights.pdp - 80} />
          </DCArtboard>
        </DCSection>

        <DCSection id="checkout" title="04 · Compra" subtitle="Carrinho e checkout — 5 passos, PIX em destaque com 10% off.">
          <DCArtboard id="cart" label="CARRINHO · LOOTBAG" width={W} height={heights.cart}>
            <ArtboardPair desktop={<CartDesktop />} mobile={<CartMobile />} height={heights.cart - 80} />
          </DCArtboard>
          <DCArtboard id="checkout-step" label="CHECKOUT · PAGAMENTO" width={W} height={heights.checkout}>
            <ArtboardPair desktop={<CheckoutDesktop />} mobile={<CheckoutMobile />} height={heights.checkout - 80} />
          </DCArtboard>
        </DCSection>

        <DCSection id="account" title="05 · Conta" subtitle="Login e área do membro com pedidos, BG Coins e cupons.">
          <DCArtboard id="auth" label="LOGIN / CADASTRO" width={W} height={heights.auth}>
            <ArtboardPair desktop={<AuthDesktop />} mobile={<AuthMobile />} height={heights.auth - 80} />
          </DCArtboard>
          <DCArtboard id="account-orders" label="MINHA CONTA · PEDIDOS" width={W} height={heights.account}>
            <ArtboardPair desktop={<AccountDesktop />} mobile={<AccountMobile />} height={heights.account - 80} />
          </DCArtboard>
        </DCSection>

        <DCSection id="integrations" title="06 · Integrações white-label" subtitle="Cálculo de frete (Melhor Envio), checkout com cartão (InfinitePay) e rastreamento detalhado — tudo sob a marca BeGamers.">
          <DCArtboard id="frete" label="FRETE · CÁLCULO MULTI-TRANSPORTADORA" width={W} height={heights.frete}>
            <ArtboardPair desktop={<FreteDesktop />} mobile={<FreteMobile />} height={heights.frete - 80} />
          </DCArtboard>
          <DCArtboard id="cartao" label="CHECKOUT · CARTÃO 12X SEM JUROS" width={W} height={heights.cartao}>
            <ArtboardPair desktop={<CartaoDesktop />} mobile={<CartaoMobile />} height={heights.cartao - 80} />
          </DCArtboard>
          <DCArtboard id="tracking" label="RASTREAMENTO · TIMELINE COMPLETA" width={W} height={heights.tracking}>
            <ArtboardPair desktop={<TrackingDesktop />} mobile={<TrackingMobile />} height={heights.tracking - 80} />
          </DCArtboard>
        </DCSection>

        <DCSection id="admin" title="07 · Console Admin" subtitle="Back-office BeGamers — login com 2FA, dashboard, pedidos, financeiro (com recebíveis e antecipação) e catálogo. Desktop-first.">
          <DCArtboard id="admin-login" label="ADMIN · LOGIN 2FA" width={1860} height={heights.adminLogin}>
            <DesktopFrame height={heights.adminLogin - 80} label="Admin · 1860"><AdminLoginDesktop /></DesktopFrame>
          </DCArtboard>
          <DCArtboard id="admin-dashboard" label="ADMIN · DASHBOARD" width={1860} height={heights.adminDash}>
            <DesktopFrame height={heights.adminDash - 80} label="Admin · 1860"><AdminDashboard /></DesktopFrame>
          </DCArtboard>
          <DCArtboard id="admin-orders" label="ADMIN · PEDIDOS" width={1860} height={heights.adminOrders}>
            <DesktopFrame height={heights.adminOrders - 80} label="Admin · 1860"><AdminOrders /></DesktopFrame>
          </DCArtboard>
          <DCArtboard id="admin-financial" label="ADMIN · FINANCEIRO" width={1860} height={heights.adminFin}>
            <DesktopFrame height={heights.adminFin - 80} label="Admin · 1860"><AdminFinancial /></DesktopFrame>
          </DCArtboard>
          <DCArtboard id="admin-products" label="ADMIN · PRODUTOS" width={1860} height={heights.adminProducts}>
            <DesktopFrame height={heights.adminProducts - 80} label="Admin · 1860"><AdminProducts /></DesktopFrame>
          </DCArtboard>
          <DCArtboard id="admin-theme" label="ADMIN · APARÊNCIA (THEME EDITOR)" width={1860} height={heights.adminTheme}>
            <DesktopFrame height={heights.adminTheme - 80} label="Admin · 1860"><AdminAppearance /></DesktopFrame>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks · BeGamers">
        <TweakSection label="Acento" />
        <TweakColor label="Cor primária"
          value={t.accent}
          options={["#cc0000", "#ff1f3d", "#e8b400", "#1f9d55", "#7a1a8a"]}
          onChange={v => setTweak("accent", v)} />
        <TweakColor label="Neon (highlight)"
          value={t.accentHot}
          options={["#ff1f3d", "#ff6f00", "#00d4ff", "#b800ff", "#fff200"]}
          onChange={v => setTweak("accentHot", v)} />
        <TweakSection label="Atmosfera" />
        <TweakSlider label="Grain" value={t.grain * 100} min={0} max={30} step={1} unit="%"
          onChange={v => setTweak("grain", v / 100)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

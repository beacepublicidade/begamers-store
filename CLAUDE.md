# BeGamers Store — Project Instructions

Você está trabalhando no tema e-commerce da BeGamers Store, uma loja gamer brasileira.

## Arquitetura

- **Pure static** — HTML + CSS + JSX (Babel in-browser). Sem build step.
- **React 18.3.1** via UMD CDN. Sem TypeScript.
- **Sem Tailwind** — usamos CSS custom properties do design system em `ds/colors_and_type.css` e `theme.css`.
- Cada `<script type="text/babel">` tem escopo isolado: para compartilhar componentes entre arquivos, exporte em `window` no final do arquivo (`Object.assign(window, { Foo, Bar })`) e declare `/* global Foo, Bar */` no topo do arquivo consumidor.

## Convenções

- **Cores** — só use as tokens (`var(--bg-accent)`, `var(--fg2)`, `var(--surf-1)` etc). Não invente hex.
- **Tipografia** — `var(--font-display-heavy)` em manchetes (caixa-alta, letterSpacing negativo), `var(--font-body)` no texto.
- **Componentes próprios** — `BG.Btn`, `BG.Tag`, `BG.Icon`, `BG.ProductCard`, `BG.Stars`, `BG.Price`, `BG.StoreHeader`, `BG.MobileHeader`, `BG.MobileBottomNav`, `BG.StoreFooter`, `BG.PageScroll`, `BG.DesktopFrame`, `BG.MobileFrame`. Todos em `components.jsx`.
- **Voice** — português BR, gamer mas profissional. Headlines em CAIXA-ALTA. Veja `ds/colors_and_type.css` ou guia do DS para o tom completo.

## Estrutura de páginas

- Cada página tem variante **Desktop** (1440px) e **Mobile** (390px).
- Wrap o conteúdo scrollável em `<BG.PageScroll>` (já posiciona absoluto e esconde scrollbar).
- Mobile precisa de `<BG.MobileHeader />` no topo + `<BG.MobileBottomNav />` ao final.

## Adicionar uma página nova

1. Cria `pages/<nome>.jsx`.
2. Define `function FooDesktop()` e `function FooMobile()`.
3. Exporta: `Object.assign(window, { FooDesktop, FooMobile })` no fim.
4. Adiciona `<script type="text/babel" src="pages/<nome>.jsx"></script>` em `BeGamers Store.html`.
5. Adiciona o artboard em `app.jsx`:
   ```jsx
   <DCSection id="..." title="...">
     <DCArtboard id="foo" label="..." width={W} height={2000}>
       <ArtboardPair desktop={<FooDesktop />} mobile={<FooMobile />} height={1920} />
     </DCArtboard>
   </DCSection>
   ```

## Boas práticas

- ✅ Mantenha cada `pages/*.jsx` abaixo de 1000 linhas. Se for grow demais, divida.
- ✅ Use o mesmo padrão de motifs: red rule, chevron bg, eyebrow mono com `//`, slashes angulares via clip-path.
- ❌ Não use emoji decorativo. Só 🔴 ⚡ 🏆 quando semântico (live, urgência, vitória).
- ❌ Não importe libs novas via CDN sem motivo forte — manteve-se enxuto de propósito.

## Integrações futuras

- **InfinitePay** (checkout) — `pages/integrations.jsx` tem o esqueleto do formulário de cartão. SDK: `https://js.infinitepay.io/v1/checkout.js`
- **Melhor Envio** — `pages/integrations.jsx` tem o cálculo de frete + rastreamento. API REST com OAuth2; faça no backend.

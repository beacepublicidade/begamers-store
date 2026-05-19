# BeGamers Store — Tema E-commerce

Tema completo de e-commerce gamer para BeGamers Store: 19 telas em 7 seções (Home com 2 variações, Loja, Produto, Checkout, Conta, Integrações white-label, Console Admin com Theme Editor) — desktop + mobile lado a lado.

Construído em **React + JSX in-browser via Babel Standalone** sobre o design system Beace/BeGamers (preto + vermelho `#CC0000` + neon `#FF1F3D`, Commuters Sans Heavy + DM Sans).

---

## 🗂 Estrutura

```
.
├── BeGamers Store.html          ← Entry point. Abre direto no navegador.
├── theme.css                    ← Tokens extras de e-commerce (neon, surfaces, motifs)
├── app.jsx                      ← Composição do design canvas com todos os artboards
├── components.jsx               ← Primitivos: StoreHeader, ProductCard, Btn, Tag, Icon, Price, Frames
│
├── design-canvas.jsx            ← Starter: canvas pan/zoom com artboards
├── tweaks-panel.jsx             ← Starter: painel de tweaks flutuante
│
├── pages/
│   ├── home-safe.jsx            ← Home variação familiar (Tray/Nuvemshop-like)
│   ├── home-bold.jsx            ← Home variação editorial-esports
│   ├── plp-pdp.jsx              ← Listagem de categoria + Página de produto
│   ├── cart-checkout.jsx        ← Carrinho LootBag + Checkout 5-step com PIX
│   ├── auth-account.jsx         ← Login social + Minha Conta com pedidos
│   ├── search-campaign.jsx      ← Busca + Black Gamer Week
│   ├── integrations.jsx         ← Frete multi-transportadora + Cartão 12x + Rastreamento
│   ├── admin.jsx                ← Console Admin: Login 2FA, Dashboard, Pedidos, Financeiro, Produtos
│   └── admin-theme.jsx          ← Editor de tema com live preview, banners, seções, cores
│
├── ds/
│   ├── colors_and_type.css      ← Design system Beace/BeGamers (tokens base)
│   └── fonts/                   ← Commuters Sans Heavy, Network, Lightcase
│
└── assets/
    ├── begamers-store-logo.png      ← Logo original (fundo claro)
    └── begamers-store-logo-dark.png ← Versão invertida (fundo escuro)
```

---

## 🚀 Deploy no Vercel (recomendado)

Como o projeto é HTML + CSS + JSX estático (sem build step), é **deploy direto**:

### Opção 1 — Vercel CLI
```bash
npm i -g vercel
cd <pasta-do-projeto>
vercel
```
Aceite os defaults. O `vercel.json` incluído já configura tudo.

### Opção 2 — Git + Vercel Dashboard
```bash
git init
git add .
git commit -m "feat: BeGamers Store theme"
gh repo create begamers-store --public --source=. --push   # ou push manual para um remote
```
Em [vercel.com](https://vercel.com) → **Add New Project** → escolha o repo → **Deploy**. Sem framework, sem build command.

### Opção 3 — Drag & Drop
1. Compacte a pasta toda em `.zip`
2. Em [vercel.com/new](https://vercel.com/new) → **Upload Directory**

### ⚙️ Sobre o build
O projeto usa `@babel/standalone` para transpilar JSX no navegador. **Funciona em produção**, mas:
- ✅ Bom para protótipo, demos, design review
- ⚠️ Carrega ~600KB de Babel + ~150KB de React no primeiro hit
- ❌ Não ideal para tráfego real de e-commerce

Para virar produção real, ver **Próximos passos** no fim.

---

## 🤖 Usar com Claude Code

Cada arquivo é independente e bem nomeado. Workflow sugerido:

```bash
git clone <seu-repo>
cd begamers-store
claude
```

Pra trabalhar numa tela específica, peça ao Claude:
> "Lê `pages/home-bold.jsx` e adiciona um carrossel de testimonials antes do footer"

Pra ajustar tokens globais:
> "Em `theme.css`, troca o neon-red por roxo neon e atualiza onde precisar"

**Dica:** o arquivo `BeGamers Store.html` lista a ordem de carregamento dos scripts. Se adicionar um novo `pages/X.jsx`, registre lá também.

---

## 🎨 Design system em uso

- **Cores** — preto/branco/cinza-tinta + vermelho `#CC0000` + neon `#FF1F3D` (exposto como CSS custom property `--bg-accent-hot`, sobrescrevível via tweaks)
- **Tipografia** — Commuters Sans Heavy (display) + DM Sans (body) + JetBrains Mono (técnico)
- **Motifs assinatura** — régua vermelha 4px, slashes angulares via `clip-path`, chevron-bg, mono captions com `//`, neon glow em focus
- **Componentes próprios** — botões angulares, badges, frames de device, product card, headers desktop/mobile, footer

Todos os tokens vivem em `ds/colors_and_type.css` (DS base) + `theme.css` (extensões). Veja documentação do DS Beace em projeto separado.

---

## 🛠 Integrações modeladas (white-label)

Toda a UX está pronta, com a lógica mocada onde caberia uma API real:

| Provedor real | Tela no design | Onde mexer |
|---|---|---|
| **Melhor Envio** | Frete + Rastreamento (artboard 06.1, 06.3) | `pages/integrations.jsx` — `SHIPPING_OPTIONS` e `TRACK_EVENTS` |
| **InfinitePay Checkout** | Cartão 12x sem juros (artboard 06.2) | `pages/integrations.jsx` — `CartaoDesktop`, mock de bandeira, parcelas, 3DS |
| **Antifraude / Recebíveis** | Admin Financeiro (artboard 07.4) | `pages/admin.jsx` — extrato, fluxo de caixa, mix de pagamentos |

Quando for plugar de verdade, troque os arrays/mocks pelas chamadas dos SDKs (cliente JS InfinitePay no checkout, API REST Melhor Envio no backend) sem mexer no visual.

---

## ⌨️ Atalhos do canvas

| Ação | Atalho |
|---|---|
| Pan | Hold space + drag, ou middle mouse |
| Zoom | Cmd/Ctrl + scroll |
| Focar um artboard fullscreen | Clique no botão de fullscreen no card |
| Navegar entre artboards (em foco) | ← / → / Esc |
| Reordenar artboards | Drag pela handle |

---

## 🔜 Próximos passos sugeridos

**Para virar produção real (não-prototype):**
1. **Converter para Next.js / Vite** — pre-compilar JSX, remover Babel-in-browser
   ```bash
   npx create-next-app begamers-store-prod --typescript --tailwind
   ```
   Cada `pages/X.jsx` vira um component em `app/`. As CSS vars do `theme.css` viram tokens Tailwind ou CSS vars no `globals.css`.
2. **Backend** — Tray/Nuvemshop como headless API, ou Medusa.js / Saleor / Shopify Storefront API.
3. **Pagamento de verdade** — InfinitePay Checkout SDK no front + webhook no back para escrever no DB.
4. **Frete de verdade** — Melhor Envio API (`/api/v2/me/shipment/calculate` precisa de token OAuth — fazer no backend).
5. **Admin de verdade** — Auth com Clerk/Auth.js + Drizzle/Prisma + Postgres no Vercel.

**Para iterar no design (sem virar produção ainda):**
- Use Tweaks (toggle no toolbar) para experimentar cor de acento, neon e grain ao vivo.
- Adicione novos artboards copiando padrão no `app.jsx`.
- Para variações de uma única tela, faça `home-safe-v2.jsx` e adicione no canvas.

---

## 📝 Licença

Código proprietário BeGamers Store. Fontes (Commuters Sans Heavy, Network, Lightcase) e logo são propriedade da marca.

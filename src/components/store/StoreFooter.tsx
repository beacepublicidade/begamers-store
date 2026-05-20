import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import Btn from '@/components/ui/Btn'

const LINKS = [
  { t: 'LOJA', items: ['Todas Categorias', 'Lançamentos', 'Mais Vendidos', 'Ofertas do Dia', 'Outlet'] },
  { t: 'AJUDA', items: ['Central de Ajuda', 'Como Comprar', 'Trocas e Devoluções', 'Garantia', 'Status do Pedido'] },
  { t: 'INSTITUCIONAL', items: ['Sobre Nós', 'Trabalhe Conosco', 'Parcerias', 'Embaixadores'] },
  { t: 'MINHA CONTA', items: ['Entrar / Cadastrar', 'Meus Pedidos', 'Lista de Desejos', 'Cupons'] },
]

export default function StoreFooter() {
  return (
    <footer style={{ background: '#050505', borderTop: '1px solid var(--hair-strong)', marginTop: 64 }}>
      {/* Newsletter */}
      <div style={{ background: 'linear-gradient(135deg, #1a0006, #000)', borderBottom: '1px solid var(--hair)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <span className="eyebrow-mono" style={{ color: 'var(--bg-accent-hot)', display: 'block', marginBottom: 8 }}>// NEWSLETTER</span>
            <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display-heavy)', fontSize: 40, textTransform: 'uppercase', lineHeight: 1 }}>
              ENTRA NO SERVER.
            </h2>
            <p style={{ color: 'var(--fg2)', margin: 0, fontSize: 14, maxWidth: 460 }}>
              Drops antes de todo mundo, cupons exclusivos e os melhores deals. Sem spam.
            </p>
          </div>
          <form action="/api/newsletter" method="POST" style={{ display: 'flex', gap: 8 }}>
            <input className="bg-input" name="email" type="email" placeholder="seu@email.com" style={{ flex: 1 }} />
            <Btn variant="hot" size="lg" type="submit">Cadastrar</Btn>
          </form>
        </div>
      </div>

      {/* Links */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 32px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 32 }}>
        <div>
          <div style={{ marginBottom: 16 }}>
            <Image src="/images/logo.png" alt="BeGamers Store" width={160} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: 'var(--fg2)', fontSize: 13, marginTop: 0, lineHeight: 1.6 }}>
            A loja oficial da comunidade BEGAMERS. Periféricos, streetwear, colecionáveis.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {['instagram', 'twitch', 'youtube', 'discord', 'twitter'].map(s => (
              <a key={s} href="#" style={{ width: 36, height: 36, border: '1px solid var(--hair-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Icon name={s} size={16} />
              </a>
            ))}
          </div>
        </div>
        {LINKS.map(c => (
          <div key={c.t}>
            <h4 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', paddingBottom: 8, borderBottom: '2px solid var(--bg-accent)', display: 'inline-block' }}>
              {c.t}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.items.map(l => (
                <li key={l}><a href="#" style={{ color: 'var(--fg2)', fontSize: 13, textDecoration: 'none' }}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div style={{ borderTop: '1px solid var(--hair)', borderBottom: '1px solid var(--hair)', background: '#000' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { i: 'truck', t: 'FRETE GRÁTIS', s: 'Acima de R$ 299' },
            { i: 'shield', t: 'SITE SEGURO', s: 'SSL + AntiFraude' },
            { i: 'pkg', t: 'DEVOLUÇÃO', s: 'Até 30 dias' },
            { i: 'bolt', t: 'ENVIO RÁPIDO', s: 'Postagem em 24h úteis' },
          ].map(f => (
            <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: 'var(--bg-accent-hot)' }}><Icon name={f.i} size={28} stroke={1.6} /></span>
              <div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.t}</div>
                <div style={{ fontSize: 11, color: 'var(--fg2)' }}>{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 11, color: 'var(--fg3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          © 2026 BEGAMERS STORE LTDA
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['VISA', 'MASTER', 'ELO', 'PIX', 'BOLETO'].map(p => (
            <span key={p} style={{ padding: '5px 9px', border: '1px solid var(--hair-strong)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: 'var(--fg2)' }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

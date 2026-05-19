import Link from 'next/link'
import Icon from '@/components/ui/Icon'

interface PageProps {
  searchParams: {
    order_nsu?: string
    capture_method?: string
    receipt_url?: string
    slug?: string
    transaction_nsu?: string
  }
}

const METHOD_LABELS: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
}

export default function CheckoutSucessoPage({ searchParams }: PageProps) {
  const method = searchParams.capture_method ?? ''

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: '#0e3a1f', border: '2px solid #1f9d55',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 28px',
      }}>
        <Icon name="check" size={40} style={{ color: '#4cd680' }} />
      </div>

      <h1 style={{ margin: '0 0 12px', fontFamily: 'var(--font-display-heavy)', fontSize: 32, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
        Pagamento Confirmado!
      </h1>

      <p style={{ color: 'var(--fg2)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
        Seu pedido foi processado com sucesso via{' '}
        <strong style={{ color: '#fff' }}>{METHOD_LABELS[method] ?? 'pagamento online'}</strong>.
        {searchParams.order_nsu && (
          <> Pedido <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--bg-accent-hot)' }}>#{searchParams.order_nsu.slice(0, 8).toUpperCase()}</span> registrado.</>
        )}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 40 }}>
        {searchParams.receipt_url && (
          <a
            href={searchParams.receipt_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--surf-2)', border: '1px solid var(--hair)',
              color: '#fff', padding: '12px 24px',
              fontFamily: 'var(--font-display-heavy)', fontSize: 12,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              textDecoration: 'none', borderRadius: 2,
            }}
          >
            <Icon name="eye" size={16} /> Ver Comprovante
          </a>
        )}
      </div>

      <Link href="/produtos" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--bg-accent)', color: '#fff', padding: '14px 32px',
        fontFamily: 'var(--font-display-heavy)', fontSize: 13,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        textDecoration: 'none',
        clipPath: 'polygon(0 0, 100% 0, 96% 100%, 4% 100%)',
      }}>
        Continuar Comprando
      </Link>

      <p style={{ marginTop: 24, fontSize: 12, color: 'var(--fg3)' }}>
        Você receberá um e-mail com os detalhes do pedido em breve.
      </p>
    </div>
  )
}

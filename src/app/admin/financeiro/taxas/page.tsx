'use client'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

const RATES = [
  { method: 'Pix', rate: '0,99%', fixed: '—', max: 'R$ 4,90', active: true },
  { method: 'Crédito 1×', rate: '2,69%', fixed: '—', max: '—', active: true },
  { method: 'Crédito 2–6×', rate: '3,49%', fixed: '—', max: '—', active: true },
  { method: 'Crédito 7–12×', rate: '4,49%', fixed: '—', max: '—', active: true },
  { method: 'Débito', rate: '1,59%', fixed: '—', max: '—', active: true },
  { method: 'Boleto', rate: '1,99%', fixed: 'R$ 3,49', max: '—', active: true },
  { method: 'Link de pagamento', rate: '3,49%', fixed: '—', max: '—', active: true },
]

const LIMITS = [
  { label: 'Limite diário de transações', value: 'R$ 50.000,00' },
  { label: 'Transação máxima', value: 'R$ 15.000,00' },
  { label: 'Prazo de liquidação (Pix)', value: '1 dia útil' },
  { label: 'Prazo de liquidação (Crédito)', value: '30 dias' },
  { label: 'Antecipação disponível', value: 'Sim — taxa de 2,99% a.m.' },
]

export default function TaxasPage() {
  return (
    <div>
      <AdminTopbar section="FINANCEIRO" page="TAXAS & LIMITES" />
      <div style={{ padding: 32 }}>
        <h1 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Taxas & Limites</h1>
        <p style={{ margin: '0 0 24px', color: 'var(--fg3)', fontSize: 13 }}>Taxas do processador InfinitePay aplicadas ao seu plano atual.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// TAXAS POR MÉTODO</span>
            <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                    {['Método', 'Taxa %', 'Taxa fixa', 'Máximo', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RATES.map(r => (
                    <tr key={r.method} style={{ borderBottom: '1px solid var(--hair)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13 }}>{r.method}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 14, color: 'var(--bg-accent-hot)' }}>{r.rate}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)' }}>{r.fixed}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)' }}>{r.max}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4cd680', background: 'rgba(31,157,85,0.12)' }}>Ativo</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// LIMITES DA CONTA</span>
            <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {LIMITS.map(l => (
                <div key={l.label} style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 16, borderBottom: '1px solid var(--hair)' }}>
                  <span style={{ fontSize: 11, color: 'var(--fg3)' }}>{l.label}</span>
                  <span style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 15 }}>{l.value}</span>
                </div>
              ))}
              <div style={{ background: 'var(--surf-3)', border: '1px solid var(--hair-strong)', padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <Icon name="bolt" size={14} color="var(--fg3)" />
                <span style={{ fontSize: 11, color: 'var(--fg3)' }}>Para alterar limites, contate o suporte InfinitePay.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

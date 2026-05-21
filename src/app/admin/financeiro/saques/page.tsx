'use client'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

const MOCK = [
  { id: 'w1', date: '20/05', value: 2400.00, method: 'Pix — chave CPF', status: 'Processando', eta: 'Hoje' },
  { id: 'w2', date: '15/05', value: 1800.00, method: 'Pix — chave CPF', status: 'Concluído', eta: '—' },
  { id: 'w3', date: '10/05', value: 3200.00, method: 'Pix — chave CPF', status: 'Concluído', eta: '—' },
  { id: 'w4', date: '01/05', value: 950.00, method: 'Pix — chave CPF', status: 'Concluído', eta: '—' },
]

const STATUS_C: Record<string, { c: string; bg: string }> = {
  'Processando': { c: '#ffc940', bg: 'rgba(217,154,0,0.12)' },
  'Concluído':   { c: '#4cd680', bg: 'rgba(31,157,85,0.12)' },
  'Falhou':      { c: '#f87171', bg: 'rgba(248,113,113,0.12)' },
}

function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') }

export default function SaquesPage() {
  return (
    <div>
      <AdminTopbar section="FINANCEIRO" page="SAQUES" />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Saques</h1>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: 'var(--bg-accent)', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <Icon name="plus" size={14} /> Novo saque
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, marginBottom: 24 }}>
          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--bg-accent)', padding: 24 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>// SALDO DISPONÍVEL PARA SAQUE</span>
            <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 40, lineHeight: 1, marginTop: 12, color: '#4cd680' }}>R$ 3.847,20</div>
            <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--fg3)', marginBottom: 2 }}>A receber (30d)</div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 16 }}>R$ 1.289,40</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--fg3)', marginBottom: 2 }}>Total sacado (mês)</div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 16 }}>R$ 8.350,00</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: 20 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// CONTA DE DESTINO</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--fg3)' }}>Método</span>
                <span>Pix</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--fg3)' }}>Chave</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>CPF cadastrado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--fg3)' }}>Prazo</span>
                <span>Mesmo dia útil</span>
              </div>
            </div>
          </div>
        </div>

        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg3)', display: 'block', marginBottom: 16 }}>// HISTÓRICO DE SAQUES</span>

        <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                {['Data', 'Valor', 'Destino', 'Status', 'Previsão'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK.map(w => {
                const s = STATUS_C[w.status] ?? { c: '#fff', bg: 'transparent' }
                return (
                  <tr key={w.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)' }}>{w.date}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 16 }}>{fmt(w.value)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg2)' }}>{w.method}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg }}>{w.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>{w.eta}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

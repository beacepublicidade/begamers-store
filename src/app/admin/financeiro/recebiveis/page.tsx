'use client'
import AdminTopbar from '@/components/admin/AdminTopbar'
import Icon from '@/components/ui/Icon'

const MOCK = [
  { id: 'r1', ref: '#14328', date: '22/05', net: 189.90, gross: 199.90, fee: 10.00, status: 'A receber', eta: '26/05' },
  { id: 'r2', ref: '#14327', date: '22/05', net: 449.10, gross: 479.90, fee: 30.80, status: 'A receber', eta: '26/05' },
  { id: 'r3', ref: '#14326', date: '21/05', net: 299.50, gross: 319.90, fee: 20.40, status: 'A receber', eta: '25/05' },
  { id: 'r4', ref: '#14325', date: '20/05', net: 189.10, gross: 199.90, fee: 10.80, status: 'Disponível', eta: '—' },
  { id: 'r5', ref: '#14322', date: '19/05', net: 629.10, gross: 669.90, fee: 40.80, status: 'Disponível', eta: '—' },
  { id: 'r6', ref: '#14320', date: '18/05', net: 89.10, gross: 99.90, fee: 10.80, status: 'Liquidado', eta: '—' },
  { id: 'r7', ref: '#14318', date: '17/05', net: 1349.10, gross: 1399.90, fee: 50.80, status: 'Liquidado', eta: '—' },
]

const STATUS_C: Record<string, { c: string; bg: string }> = {
  'A receber': { c: '#ffc940', bg: 'rgba(217,154,0,0.12)' },
  'Disponível': { c: '#4cd680', bg: 'rgba(31,157,85,0.12)' },
  'Liquidado':  { c: 'var(--fg3)', bg: 'var(--surf-3)' },
}

function fmt(v: number) { return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') }

export default function RecebiveisPage() {
  const aReceber = MOCK.filter(r => r.status === 'A receber').reduce((a, r) => a + r.net, 0)
  const disponivel = MOCK.filter(r => r.status === 'Disponível').reduce((a, r) => a + r.net, 0)

  return (
    <div>
      <AdminTopbar section="FINANCEIRO" page="RECEBÍVEIS" />
      <div style={{ padding: 32 }}>
        <h1 style={{ margin: '0 0 24px', fontFamily: 'var(--font-display-heavy)', fontSize: 28, textTransform: 'uppercase' }}>Recebíveis</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { l: 'A RECEBER', v: fmt(aReceber), icon: 'clock', c: '#ffc940' },
            { l: 'DISPONÍVEL', v: fmt(disponivel), icon: 'check', c: '#4cd680' },
            { l: 'TOTAL TAXAS', v: fmt(MOCK.reduce((a, r) => a + r.fee, 0)), icon: 'chart', c: 'var(--fg3)' },
          ].map(k => (
            <div key={k.l} style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon name={k.icon} size={13} color={k.c} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>// {k.l}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 24, lineHeight: 1, color: k.c }}>{k.v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['Todos', 'A receber', 'Disponível', 'Liquidado'].map(f => (
            <button key={f} style={{ padding: '6px 14px', fontSize: 10, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.06em', textTransform: 'uppercase', background: f === 'Todos' ? 'var(--bg-accent)' : 'var(--surf-2)', border: `1px solid ${f === 'Todos' ? 'var(--bg-accent)' : 'var(--hair-strong)'}`, color: '#fff', cursor: 'pointer' }}>{f}</button>
          ))}
        </div>

        <div style={{ background: 'var(--surf-2)', border: '1px solid var(--hair)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hair)' }}>
                {['Pedido', 'Data', 'Bruto', 'Taxa', 'Líquido', 'Status', 'Previsão'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontFamily: 'var(--font-display-heavy)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg3)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK.map(r => {
                const s = STATUS_C[r.status] ?? { c: '#fff', bg: 'transparent' }
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--hair)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--bg-accent-hot)' }}>{r.ref}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)' }}>{r.date}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13 }}>{fmt(r.gross)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#f87171' }}>−{fmt(r.fee)}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display-heavy)', fontSize: 13 }}>{fmt(r.net)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', fontSize: 9, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.c, background: s.bg }}>{r.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--fg3)', fontFamily: 'var(--font-mono)' }}>{r.eta}</td>
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

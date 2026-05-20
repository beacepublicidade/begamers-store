export default function AdminTopbar({ section, page }: { section: string; page: string }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: '#000', borderBottom: '1px solid var(--hair)',
      padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span className="eyebrow-mono" style={{ color: 'var(--fg3)' }}>// {section}</span>
      <span style={{ color: 'var(--hair-strong)', fontSize: 10 }}>·</span>
      <span className="eyebrow-mono">{page}</span>
    </div>
  )
}

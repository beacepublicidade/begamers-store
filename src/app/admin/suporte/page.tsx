'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminTopbar from '@/components/admin/AdminTopbar'

interface ZohoMessage {
  messageId: string
  subject: string
  fromAddress: string
  sender: string
  receivedTime: string
  summary: string
  isUnread: boolean
  hasAttachment: boolean
}

interface MessageContent {
  subject: string
  fromAddress: string
  toAddress: string
  receivedTime: string
  content: string
}

function fmtDate(ts: string) {
  const d = new Date(Number(ts))
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (diff < 7 * 86400000) return d.toLocaleDateString('pt-BR', { weekday: 'short' })
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function senderName(from: string) {
  const match = from.match(/^(.+?)\s*</)
  return match ? match[1].trim().replace(/"/g, '') : from.split('@')[0]
}

export default function SuportePage() {
  const searchParams = useSearchParams()
  const [connected, setConnected] = useState<boolean | null>(null)
  const [accountId, setAccountId] = useState<string | null>(null)
  const [accountAddress, setAccountAddress] = useState('')
  const [messages, setMessages] = useState<ZohoMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ZohoMessage | null>(null)
  const [msgContent, setMsgContent] = useState<MessageContent | null>(null)
  const [loadingMsg, setLoadingMsg] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [replySent, setReplySent] = useState(false)

  const loadInbox = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/email/inbox')
      if (res.status === 401) { setConnected(false); setLoading(false); return }
      const data = await res.json()
      if (data.error === 'ZOHO_NOT_CONNECTED') { setConnected(false); setLoading(false); return }
      setConnected(true)
      if (data.accountId) { setAccountId(data.accountId); setAccountAddress(data.accountAddress ?? '') }
      setMessages(Array.isArray(data.data) ? data.data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadInbox() }, [loadInbox])

  async function openMessage(msg: ZohoMessage) {
    setSelected(msg)
    setMsgContent(null)
    setReplyText('')
    setReplySent(false)
    if (!accountId) return
    setLoadingMsg(true)
    const res = await fetch(`/api/admin/email/message?accountId=${accountId}&messageId=${msg.messageId}`)
    const data = await res.json()
    setMsgContent(data.data ?? null)
    setLoadingMsg(false)
  }

  async function sendReply() {
    if (!accountId || !selected || !replyText.trim()) return
    setSending(true)
    const res = await fetch('/api/admin/email/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId,
        toAddress: selected.fromAddress,
        subject: `Re: ${selected.subject}`,
        content: `<p>${replyText.replace(/\n/g, '<br>')}</p>`,
        inReplyTo: selected.messageId,
      }),
    })
    setSending(false)
    if (res.ok) { setReplyText(''); setReplySent(true) }
  }

  const justConnected = searchParams.get('connected') === '1'
  const connectError = searchParams.get('error')

  if (connected === false) {
    return (
      <div>
        <AdminTopbar section="OPERAÇÃO" page="INBOX SUPORTE" />
        <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 24 }}>
          {connectError && (
            <div style={{ background: '#1a0808', border: '1px solid #5c1010', padding: '12px 20px', color: '#f87171', fontSize: 13 }}>
              Erro ao conectar: {connectError}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--fg3)', marginBottom: 12 }}>// INBOX NÃO CONECTADO</div>
            <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display-heavy)', fontSize: 24, textTransform: 'uppercase' }}>Conectar Zoho Mail</h2>
            <p style={{ color: 'var(--fg2)', fontSize: 14, margin: '0 0 32px', maxWidth: 420, lineHeight: 1.6 }}>
              Autorize o acesso ao inbox <strong>suporte@begamerstore.com.br</strong> para gerenciar e-mails diretamente aqui no console.
            </p>
            <a href="/api/admin/email/auth" style={{
              display: 'inline-block', background: 'var(--bg-accent)', color: '#fff', textDecoration: 'none',
              padding: '14px 32px', fontFamily: 'var(--font-display-heavy)', fontSize: 13,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              CONECTAR ZOHO MAIL →
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AdminTopbar section="OPERAÇÃO" page="INBOX SUPORTE" />

      {justConnected && (
        <div style={{ background: '#0e2e1a', borderBottom: '1px solid #1f6b3a', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#4cd680', fontSize: 13, fontWeight: 600 }}>✓ Zoho Mail conectado com sucesso!</span>
          <span style={{ color: 'var(--fg3)', fontSize: 12 }}>Inbox: {accountAddress}</span>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Message List */}
        <div style={{
          width: 340, borderRight: '1px solid var(--hair-strong)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hair)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', color: 'var(--fg3)', textTransform: 'uppercase' }}>// INBOX</span>
              {accountAddress && <div style={{ fontSize: 10, color: 'var(--fg3)', marginTop: 2 }}>{accountAddress}</div>}
            </div>
            <button onClick={loadInbox} style={{ background: 'none', border: 'none', color: 'var(--fg3)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-display-heavy)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ↻ Atualizar
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }} className="no-scrollbar">
            {loading ? (
              <div style={{ padding: 24, color: 'var(--fg3)', fontSize: 13, textAlign: 'center' }}>Carregando...</div>
            ) : messages.length === 0 ? (
              <div style={{ padding: 24, color: 'var(--fg3)', fontSize: 13, textAlign: 'center' }}>Nenhuma mensagem</div>
            ) : (
              messages.map(msg => {
                const isActive = selected?.messageId === msg.messageId
                return (
                  <button
                    key={msg.messageId}
                    onClick={() => openMessage(msg)}
                    style={{
                      width: '100%', textAlign: 'left', background: isActive ? 'var(--surf-2)' : 'transparent',
                      border: 'none', borderBottom: '1px solid var(--hair)', borderLeft: `3px solid ${isActive ? 'var(--bg-accent)' : 'transparent'}`,
                      padding: '12px 14px 12px 11px', cursor: 'pointer', color: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                      <span style={{ fontWeight: msg.isUnread ? 700 : 400, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {senderName(msg.fromAddress || msg.sender || 'Desconhecido')}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--fg3)', flexShrink: 0 }}>{msg.receivedTime ? fmtDate(msg.receivedTime) : ''}</span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: msg.isUnread ? 600 : 400, color: msg.isUnread ? '#fff' : 'var(--fg2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>
                      {msg.subject || '(sem assunto)'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.summary}
                    </div>
                    {msg.isUnread && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bg-accent)', float: 'right', marginTop: -14 }} />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Message Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg3)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✉</div>
                <div style={{ fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Selecione uma mensagem</div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ borderBottom: '1px solid var(--hair-strong)', padding: '16px 24px' }}>
                <h2 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display-heavy)', fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {selected.subject || '(sem assunto)'}
                </h2>
                <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'var(--fg2)' }}>
                  <span><strong style={{ color: 'var(--fg3)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>De: </strong>{selected.fromAddress}</span>
                  {selected.receivedTime && <span><strong style={{ color: 'var(--fg3)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Em: </strong>{new Date(Number(selected.receivedTime)).toLocaleString('pt-BR')}</span>}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }} className="no-scrollbar">
                {loadingMsg ? (
                  <div style={{ color: 'var(--fg3)', fontSize: 13 }}>Carregando mensagem...</div>
                ) : msgContent ? (
                  <div
                    style={{ fontSize: 13, lineHeight: 1.7, color: '#d4d4d4', maxWidth: 720 }}
                    dangerouslySetInnerHTML={{ __html: msgContent.content ?? '' }}
                  />
                ) : (
                  <div style={{ color: 'var(--fg3)', fontSize: 13 }}>Não foi possível carregar o conteúdo.</div>
                )}
              </div>

              {/* Reply Box */}
              <div style={{ borderTop: '1px solid var(--hair-strong)', padding: '16px 24px' }}>
                {replySent ? (
                  <div style={{ color: '#4cd680', fontSize: 13, fontWeight: 600, padding: '10px 0' }}>
                    ✓ Resposta enviada para {selected.fromAddress}
                  </div>
                ) : (
                  <>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--fg3)', textTransform: 'uppercase', marginBottom: 8 }}>
                      // RESPONDER PARA: {selected.fromAddress}
                    </div>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Digite sua resposta..."
                      rows={4}
                      style={{
                        width: '100%', background: 'var(--surf-1)', border: '1px solid var(--hair-strong)',
                        color: '#fff', padding: '10px 14px', fontSize: 13, resize: 'vertical',
                        fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button
                        onClick={sendReply}
                        disabled={!replyText.trim() || sending}
                        style={{
                          padding: '10px 24px', background: !replyText.trim() || sending ? 'var(--surf-3)' : 'var(--bg-accent)',
                          border: 'none', color: '#fff', cursor: !replyText.trim() || sending ? 'default' : 'pointer',
                          fontFamily: 'var(--font-display-heavy)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}
                      >
                        {sending ? 'ENVIANDO...' : 'ENVIAR RESPOSTA →'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

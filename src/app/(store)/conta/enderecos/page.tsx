import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ContaSidebar from '@/components/conta/ContaSidebar'
import EnderecosClient from '@/components/conta/EnderecosClient'

export default async function EnderecosPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/conta/login')

  const name = user.user_metadata?.name ?? user.email?.split('@')[0] ?? ''

  const admin = createAdminClient()
  const { data: addresses } = await admin
    .from('addresses')
    .select('*')
    .eq('customer_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <ContaSidebar name={name} email={user.email ?? ''} activePath="/conta/enderecos" />
        <main style={{ flex: 1, minWidth: 0 }}>
          <EnderecosClient initial={(addresses ?? []) as any} />
        </main>
      </div>
    </div>
  )
}

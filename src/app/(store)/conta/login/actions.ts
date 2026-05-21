'use server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function signInAction(email: string, password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { success: true }
}

export async function signUpAction(email: string, password: string, name: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
  if (error) return { error: error.message }
  if (data.user) {
    const admin = createAdminClient()
    await admin.from('customers').upsert({ id: data.user.id, full_name: name } as never, { onConflict: 'id' })
  }
  return { success: true }
}

export async function signOutAction() {
  const supabase = createClient()
  await supabase.auth.signOut()
}

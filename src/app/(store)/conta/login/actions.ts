'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
    await supabase.from('customers').upsert({ email, name } as never, { onConflict: 'email' })
  }
  return { success: true }
}

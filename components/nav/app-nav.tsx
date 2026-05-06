import { createClient } from '@/lib/supabase/server'
import { NavContent } from './nav-content'

export async function AppNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const isAdmin = user.email === process.env.ADMIN_EMAIL
  return <NavContent isAdmin={isAdmin} />
}

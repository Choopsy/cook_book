'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/')
}

export async function inviteUser(formData: FormData) {
  await assertAdmin()
  const email = formData.get('email') as string
  const full_name = formData.get('full_name') as string
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name },
  })
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`)
  redirect(`/admin?message=${encodeURIComponent(`Invitation envoyée à ${email}`)}`)
}

export async function deleteUser(userId: string) {
  await assertAdmin()
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`)
  redirect('/admin')
}

export async function toggleContribute(userId: string, current: boolean) {
  await assertAdmin()
  const supabase = await createClient()
  await supabase.from('profiles').update({ can_contribute: !current }).eq('id', userId)
  redirect('/admin')
}

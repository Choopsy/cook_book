'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

async function getDb() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === process.env.ADMIN_EMAIL
  return { supabase: isAdmin ? createAdminClient() : supabase, user }
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'Le nom est obligatoire.' }

  // Garantir que le profil existe (sécurité si le trigger n'a pas fonctionné)
  await supabase.from('profiles').upsert(
    { id: user.id, full_name: user.user_metadata?.full_name ?? null },
    { onConflict: 'id', ignoreDuplicates: true },
  )

  const isPublic = formData.get('is_public') === 'true'
  const coverUrl = (formData.get('cover_image_url') as string)?.trim() || null

  const { data, error } = await supabase
    .from('categories')
    .insert({ author_id: user.id, name, is_public: isPublic, cover_image_url: coverUrl })
    .select('id')
    .single()

  if (error || !data) return { error: error?.message ?? 'Erreur lors de la création.' }
  redirect(`/categories/${data.id}`)
}

export async function updateCategory(id: string, formData: FormData) {
  const { supabase, user } = await getDb()
  if (!user) redirect('/login')

  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'Le nom est obligatoire.' }

  const isPublic = formData.get('is_public') === 'true'
  const coverUrl = (formData.get('cover_image_url') as string)?.trim() || null

  const { error } = await supabase
    .from('categories')
    .update({ name, is_public: isPublic, cover_image_url: coverUrl })
    .eq('id', id)

  if (error) return { error: error.message }
  redirect(`/categories/${id}`)
}

export async function deleteCategory(id: string) {
  const { supabase, user } = await getDb()
  if (!user) redirect('/login')
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  redirect('/')
}

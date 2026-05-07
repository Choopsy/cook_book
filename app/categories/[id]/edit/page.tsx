import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { CategoryForm } from '@/components/categories/category-form'
import { CategoryMemberManager } from '@/components/categories/category-member-manager'
import type { Category } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.email === process.env.ADMIN_EMAIL
  const db = isAdmin ? createAdminClient() : supabase

  const { data } = await db
    .from('categories')
    .select('id, author_id, name, visibility, cover_image_url, created_at')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const category = data as Category

  // Pour les catégories partagées, charger membres + amis
  let members: { id: string; full_name: string | null; avatar_url: string | null }[] = []
  let friends: { id: string; full_name: string | null; avatar_url: string | null }[] = []

  if (category.visibility === 'shared' && user) {
    const [{ data: rawMembers }, { data: rawFriendships }] = await Promise.all([
      supabase
        .from('category_members')
        .select('user_id, profiles!user_id(id, full_name, avatar_url)')
        .eq('category_id', id),
      supabase
        .from('friendships')
        .select(`
          id, requester_id, addressee_id,
          requester:profiles!requester_id(id, full_name, avatar_url),
          addressee:profiles!addressee_id(id, full_name, avatar_url)
        `)
        .eq('status', 'accepted'),
    ])

    members = (rawMembers ?? []).map((m: any) => m.profiles).filter(Boolean)
    const memberIds = new Set(members.map((m) => m.id))

    const allFriendships = (rawFriendships ?? []) as any[]
    friends = allFriendships
      .map((f) => f.requester_id === user.id ? f.addressee : f.requester)
      .filter(Boolean)
      .filter((f: any) => !memberIds.has(f.id))
  }

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 md:top-14 z-10 bg-background/80 backdrop-blur-sm border-b px-2 py-2 flex items-center gap-2">
        <Link href={`/categories/${id}`}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-semibold">Modifier la catégorie</h1>
      </header>
      <main className="px-4 py-6 max-w-lg mx-auto space-y-8">
        <CategoryForm initialData={category} />

        {category.visibility === 'shared' && (
          <CategoryMemberManager
            categoryId={id}
            members={members}
            availableFriends={friends}
          />
        )}
      </main>
    </div>
  )
}

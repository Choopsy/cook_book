import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { RecipeForm } from '@/components/recipes/recipe-form'
import type { Tag, Category } from '@/lib/types'

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function NewRecipePage({ searchParams }: Props) {
  const { category } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: tags }, { data: profile }, { data: ownCats }, { data: publicCats }] = await Promise.all([
    supabase.from('tags').select('id, name, color').order('name'),
    supabase.from('profiles').select('can_contribute').eq('id', user?.id ?? '').maybeSingle(),
    supabase.from('categories').select('id, author_id, name, is_public, cover_image_url, created_at')
      .eq('author_id', user?.id ?? '').order('name'),
    supabase.from('categories').select('id, author_id, name, is_public, cover_image_url, created_at')
      .eq('is_public', true).order('name'),
  ])

  const canContribute = profile?.can_contribute ?? false
  const seenIds = new Set((ownCats ?? []).map((c) => c.id))
  const categories = [
    ...(ownCats ?? []),
    ...(canContribute ? (publicCats ?? []).filter((c) => !seenIds.has(c.id)) : []),
  ]

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 md:top-14 z-10 bg-background/80 backdrop-blur-sm border-b px-2 py-2 flex items-center gap-2">
        <Link href={category ? `/categories/${category}` : '/'}>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-semibold">Nouvelle recette</h1>
      </header>
      <main className="px-4 py-6 max-w-2xl mx-auto">
        <RecipeForm
          tags={(tags as Tag[]) ?? []}
          categories={(categories as Category[]) ?? []}
          defaultCategoryId={category ?? null}
        />
      </main>
    </div>
  )
}

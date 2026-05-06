import Link from 'next/link'
import { Plus, ChefHat, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { CategoryGrid } from '@/components/categories/category-grid'
import type { Category } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Trois requêtes séparées pour éviter la dépendance circulaire RLS (categories ↔ recipes)
  const [{ data: rawCats }, { data: rawRecipes }, { data: rawSaves }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, author_id, name, is_public, cover_image_url, created_at')
      .order('name'),
    supabase
      .from('recipes')
      .select('id, category_id, cover_image_url'),
    supabase
      .from('category_saves')
      .select('category_id, recipe_id'),
  ])

  const categories = (rawCats ?? []) as Category[]

  // Recettes natives par catégorie (recipe.category_id)
  const nativeIds = new Map<string, Set<string>>()   // category_id → Set<recipe_id>
  const previewByCat = new Map<string, string>()

  for (const r of rawRecipes ?? []) {
    if (!r.category_id) continue
    if (!nativeIds.has(r.category_id)) nativeIds.set(r.category_id, new Set())
    nativeIds.get(r.category_id)!.add(r.id)
    if (!previewByCat.has(r.category_id) && r.cover_image_url) {
      previewByCat.set(r.category_id, r.cover_image_url)
    }
  }

  // Recettes sauvegardées par catégorie (category_saves)
  const savedIds = new Map<string, Set<string>>()    // category_id → Set<recipe_id>
  for (const s of rawSaves ?? []) {
    if (!savedIds.has(s.category_id)) savedIds.set(s.category_id, new Set())
    savedIds.get(s.category_id)!.add(s.recipe_id)
  }

  const withStats = categories.map((cat) => {
    // Union des IDs natifs + sauvegardés (dédupliqués)
    const allIds = new Set([
      ...(nativeIds.get(cat.id) ?? []),
      ...(savedIds.get(cat.id) ?? []),
    ])
    return {
      ...cat,
      recipe_count: allIds.size,
      preview_url: cat.cover_image_url ?? previewByCat.get(cat.id) ?? null,
    }
  })

  const publicCategories = withStats.filter((c) => c.is_public)
  const privateCategories = withStats.filter((c) => !c.is_public && c.author_id === user?.id)

  return (
    <div className="min-h-svh pb-24">
      <header className="md:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          <span className="font-bold">Carnet de famille</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Recettes aimées">
              <Heart className="h-4 w-4" />
            </Button>
          </Link>
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground text-xs">
              Déconnexion
            </Button>
          </form>
        </div>
      </header>

      <main className="px-4 py-4 max-w-2xl mx-auto">
        <CategoryGrid
          publicCategories={publicCategories}
          privateCategories={privateCategories}
        />
      </main>

      {/* FAB — nouvelle catégorie */}
      <Link href="/categories/new" className="fixed bottom-20 md:bottom-6 right-4">
        <Button className="h-14 w-14 rounded-full shadow-lg" size="icon" aria-label="Nouvelle catégorie">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}

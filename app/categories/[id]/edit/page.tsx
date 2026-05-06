import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { CategoryForm } from '@/components/categories/category-form'
import type { Category } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('id, author_id, name, is_public, cover_image_url, created_at')
    .eq('id', id)
    .single()

  if (!data) notFound()

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
      <main className="px-4 py-6 max-w-lg mx-auto">
        <CategoryForm initialData={data as Category} />
      </main>
    </div>
  )
}

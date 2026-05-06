import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryForm } from '@/components/categories/category-form'

export default function NewCategoryPage() {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 md:top-14 z-10 bg-background/80 backdrop-blur-sm border-b px-2 py-2 flex items-center gap-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-semibold">Nouvelle catégorie</h1>
      </header>
      <main className="px-4 py-6 max-w-lg mx-auto">
        <CategoryForm />
      </main>
    </div>
  )
}

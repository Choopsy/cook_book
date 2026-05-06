'use client'

import { useState, useTransition } from 'react'
import { Globe, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImagePicker } from '@/components/recipes/image-picker'
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories'
import type { Category } from '@/lib/types'

interface Props {
  initialData?: Category
}

export function CategoryForm({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(initialData?.name ?? '')
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? false)
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_image_url ?? '')

  const handleSubmit = () => {
    if (!name.trim()) return setError('Le nom est obligatoire.')
    setError(null)
    const fd = new FormData()
    fd.set('name', name.trim())
    fd.set('is_public', String(isPublic))
    fd.set('cover_image_url', coverUrl)

    startTransition(async () => {
      const result = initialData
        ? await updateCategory(initialData.id, fd)
        : await createCategory(fd)
      if (result?.error) setError(result.error)
    })
  }

  const handleDelete = () => {
    if (!initialData) return
    startTransition(async () => {
      await deleteCategory(initialData.id)
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Desserts de Grand-mère"
        />
      </div>

      {/* Visibilité */}
      <div className="space-y-2">
        <Label>Visibilité</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsPublic(false)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
              !isPublic ? 'border-foreground bg-muted' : 'border-border'
            }`}
          >
            <Lock className="h-5 w-5" />
            <div className="text-center">
              <p className="text-sm font-semibold">Privée</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                Visible uniquement par toi
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setIsPublic(true)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
              isPublic ? 'border-foreground bg-muted' : 'border-border'
            }`}
          >
            <Globe className="h-5 w-5" />
            <div className="text-center">
              <p className="text-sm font-semibold">Publique</p>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                Visible par tous les membres
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label>Image de couverture</Label>
        <ImagePicker value={coverUrl} onChange={setCoverUrl} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {initialData && (
          <Button
            type="button"
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/5"
            onClick={handleDelete}
            disabled={isPending}
          >
            Supprimer
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1"
        >
          {initialData ? 'Enregistrer' : 'Créer la catégorie'}
        </Button>
      </div>
    </div>
  )
}

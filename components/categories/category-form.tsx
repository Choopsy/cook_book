'use client'

import { useState, useTransition } from 'react'
import { Globe, Lock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImagePicker } from '@/components/recipes/image-picker'
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories'
import type { Category, CategoryVisibility } from '@/lib/types'

interface Props {
  initialData?: Category
}

const VISIBILITY_OPTIONS: { value: CategoryVisibility; icon: React.ElementType; label: string; description: string }[] = [
  { value: 'private',  icon: Lock,  label: 'Privée',    description: 'Visible uniquement par toi' },
  { value: 'shared',   icon: Users, label: 'Partagée',  description: 'Visible par les amis invités' },
  { value: 'public',   icon: Globe, label: 'Publique',  description: 'Visible par tous les membres' },
]

export function CategoryForm({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(initialData?.name ?? '')
  const [visibility, setVisibility] = useState<CategoryVisibility>(initialData?.visibility ?? 'private')
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_image_url ?? '')

  const handleSubmit = () => {
    if (!name.trim()) return setError('Le nom est obligatoire.')
    setError(null)
    const fd = new FormData()
    fd.set('name', name.trim())
    fd.set('visibility', visibility)
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
    startTransition(async () => { await deleteCategory(initialData.id) })
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

      <div className="space-y-2">
        <Label>Visibilité</Label>
        <div className="grid grid-cols-3 gap-2">
          {VISIBILITY_OPTIONS.map(({ value, icon: Icon, label, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => setVisibility(value)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors ${
                visibility === value ? 'border-foreground bg-muted' : 'border-border'
              }`}
            >
              <Icon className="h-5 w-5" />
              <div className="text-center">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground leading-snug mt-0.5">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image de couverture</Label>
        <ImagePicker value={coverUrl} onChange={setCoverUrl} />
      </div>

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
        <Button type="button" onClick={handleSubmit} disabled={isPending} className="flex-1">
          {initialData ? 'Enregistrer' : 'Créer la catégorie'}
        </Button>
      </div>
    </div>
  )
}

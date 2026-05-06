'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
  disabled?: boolean
}

export function SubmitButton({ children, disabled }: Props) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending || disabled}>
      {pending ? 'Chargement...' : children}
    </Button>
  )
}

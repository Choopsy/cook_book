'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, PlusCircle, Settings, ChefHat } from 'lucide-react'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'

interface Props {
  isAdmin: boolean
}

const BASE_ITEMS = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/favorites', icon: Heart, label: 'Favoris' },
  { href: '/recipes/new', icon: PlusCircle, label: 'Nouveau' },
]

export function NavContent({ isAdmin }: Props) {
  const pathname = usePathname()

  const items = [
    ...BASE_ITEMS,
    ...(isAdmin ? [{ href: '/admin', icon: Settings, label: 'Admin' }] : []),
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* ── Desktop : barre du haut ── */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-14 bg-background/90 backdrop-blur-sm border-b items-center px-6 gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold shrink-0 mr-2">
          <ChefHat className="h-5 w-5 text-primary" />
          Carnet de famille
        </Link>

        <div className="flex items-center gap-1 flex-1">
          {items.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <Button
                variant={isActive(href) ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-1.5"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </div>

        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground text-xs shrink-0">
            Déconnexion
          </Button>
        </form>
      </nav>

      {/* ── Mobile : barre du bas ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/90 backdrop-blur-sm border-t flex items-center justify-around safe-area-inset-bottom">
        {items.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          const isNew = href === '/recipes/new'
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 flex-1 py-2"
            >
              {isNew ? (
                <span className={`flex items-center justify-center h-9 w-9 rounded-full transition-colors ${active ? 'bg-primary' : 'bg-primary/90'}`}>
                  <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
                </span>
              ) : (
                <Icon
                  className={`h-5 w-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              )}
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

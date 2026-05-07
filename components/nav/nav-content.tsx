'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, PlusCircle, Settings, ChefHat, BookOpen, FolderPlus, User, Users } from 'lucide-react'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { NewItemSheet } from './new-item-sheet'

interface Props {
  isAdmin: boolean
  avatarUrl: string | null
  fullName: string | null
}

const BASE_ITEMS = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/favorites', icon: Heart, label: 'Favoris' },
  { href: '/friends', icon: Users, label: 'Amis' },
]

export function NavContent({ isAdmin, avatarUrl, fullName }: Props) {
  const pathname = usePathname()

  const items = [...BASE_ITEMS]

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
              <Button variant={isActive(href) ? 'secondary' : 'ghost'} size="sm" className="gap-1.5">
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
          <Link href="/recipes/new">
            <Button variant={isActive('/recipes/new') ? 'secondary' : 'ghost'} size="sm" className="gap-1.5">
              <BookOpen className="h-4 w-4" />
              Nouvelle recette
            </Button>
          </Link>
          <Link href="/categories/new">
            <Button variant={isActive('/categories/new') ? 'secondary' : 'ghost'} size="sm" className="gap-1.5">
              <FolderPlus className="h-4 w-4" />
              Nouvelle catégorie
            </Button>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <Button variant={isActive('/admin') ? 'secondary' : 'ghost'} size="sm" className="gap-1.5">
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
        </div>

        <Link href="/profile">
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName ?? ''} className="h-8 w-8 rounded-full object-cover border border-border" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </Link>
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
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 flex-1 py-2"
            >
              <Icon
                className={`h-5 w-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          )
        })}
        <NewItemSheet />
        <Link href="/profile" className="flex flex-col items-center gap-0.5 flex-1 py-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <User className={`h-5 w-5 transition-colors ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={isActive('/profile') ? 2.5 : 1.5} />
          )}
          <span className={`text-[10px] font-medium transition-colors ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}>Profil</span>
        </Link>
        {isAdmin && (
          <Link href="/admin" className="flex flex-col items-center gap-0.5 flex-1 py-2">
            <Settings
              className={`h-5 w-5 transition-colors ${isActive('/admin') ? 'text-primary' : 'text-muted-foreground'}`}
              strokeWidth={isActive('/admin') ? 2.5 : 1.5}
            />
            <span className={`text-[10px] font-medium transition-colors ${isActive('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>
              Admin
            </span>
          </Link>
        )}
      </nav>
    </>
  )
}

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { InviteForm } from '@/components/admin/invite-form'
import { DeleteUserButton } from '@/components/admin/delete-user-button'
import { ContributeToggle } from '@/components/admin/contribute-toggle'

interface Props {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function AdminPage({ searchParams }: Props) {
  const { error, message } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) notFound()

  const admin = createAdminClient()
  const [{ data: { users } }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers(),
    supabase.from('profiles').select('id, can_contribute'),
  ])

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]))

  const sorted = [...users].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  return (
    <div className="min-h-svh pb-8">
      <header className="sticky top-0 md:top-14 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
        <h1 className="font-semibold">Administration</h1>
      </header>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-5">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        <InviteForm />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
            Membres ({sorted.length})
          </p>
          <ul className="space-y-2">
            {sorted.map((u) => {
              const isAdmin = u.email === process.env.ADMIN_EMAIL
              const name = (u.user_metadata?.full_name as string | undefined) ?? '—'
              return (
                <li
                  key={u.id}
                  className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{name}</p>
                    <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isAdmin ? (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        admin
                      </span>
                    ) : (
                      <>
                        <ContributeToggle
                          userId={u.id}
                          canContribute={profileMap.get(u.id)?.can_contribute ?? false}
                        />
                        <DeleteUserButton userId={u.id} name={name} />
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

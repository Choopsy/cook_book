import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return Response.json([])

  const supabase = await createClient()

  // Priorité : commence par la requête, puis contient la requête
  const [{ data: starts }, { data: contains }] = await Promise.all([
    supabase
      .from('canonical_ingredients')
      .select('name_fr')
      .ilike('name_fr', `${q}%`)
      .order('name_fr')
      .limit(5),
    supabase
      .from('canonical_ingredients')
      .select('name_fr')
      .ilike('name_fr', `%${q}%`)
      .not('name_fr', 'ilike', `${q}%`)
      .order('name_fr')
      .limit(4),
  ])

  const results = [
    ...(starts ?? []).map((r) => r.name_fr),
    ...(contains ?? []).map((r) => r.name_fr),
  ].slice(0, 7)

  return Response.json(results)
}

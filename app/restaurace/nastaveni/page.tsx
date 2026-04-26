import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRestauraceByUserId } from '@/lib/db'
import NastaveniClient from './NastaveniClient'

export default async function NastaveniPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/restaurace/login')

  const rest = await getRestauraceByUserId(user.id)
  if (!rest) redirect('/restaurace/login')

  return <NastaveniClient restaurace={rest} />
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { getRestauraceByUserId } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Nabidka } from '@/lib/data'

export async function createNabidka(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/restaurace/login')

  const restaurace = await getRestauraceByUserId(user.id)
  if (!restaurace) return { error: 'Restaurace nenalezena' }

  const celkemKusu = parseInt(formData.get('celkemKusu') as string)

  const { error } = await supabase.from('nabidky').insert({
    restaurace_id: restaurace.id,
    nazev: formData.get('nazev') as string,
    popis: formData.get('popis') as string,
    originalni_cena: parseInt(formData.get('originalniCena') as string),
    zvyhodnena_cena: parseInt(formData.get('zvyhodnenaCena') as string),
    zbyvajici_kusu: celkemKusu,
    celkem_kusu: celkemKusu,
    vyzvednout_od: formData.get('vyzvednoutOd') as string,
    vyzvednout_do: formData.get('vyzvednoutDo') as string,
    kategorie: formData.get('kategorie') as Nabidka['kategorie'],
    poznamka: formData.get('poznamka') as string,
    aktivni: true,
  })

  if (error) return { error: error.message }

  revalidatePath('/restaurace/dashboard')
  revalidatePath('/')
  redirect('/restaurace/dashboard')
}

export async function deactivateNabidka(nabidkaId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('nabidky').update({ aktivni: false }).eq('id', nabidkaId)
  revalidatePath('/restaurace/dashboard')
  revalidatePath('/')
}

export async function updateStavRezervace(rezervaceId: string, stav: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('rezervace').update({ stav }).eq('id', rezervaceId)
  revalidatePath('/restaurace/dashboard')
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getNabidkaById, getRestauraceById } from '@/lib/db'

export async function createRezervace(nabidkaId: string, formData: FormData) {
  const supabase = await createClient()

  const nabidka = await getNabidkaById(nabidkaId)
  if (!nabidka) return { error: 'Nabídka nenalezena' }

  const restaurace = await getRestauraceById(nabidka.restauraceId)
  if (!restaurace) return { error: 'Restaurace nenalezena' }

  const pocetPorci = parseInt(formData.get('pocetPorci') as string)

  const { error } = await supabase.from('rezervace').insert({
    nabidka_id: nabidkaId,
    jmeno: formData.get('jmeno') as string,
    telefon: formData.get('kontakt') as string,
    pocet_porci: pocetPorci,
    poznamka: formData.get('poznamka') as string,
  })

  if (error) return { error: error.message }

  const params = new URLSearchParams({
    jmeno: formData.get('jmeno') as string,
    pocet: String(pocetPorci),
    nabidka: nabidka.nazev,
    restaurace: restaurace.nazev,
    adresa: `${restaurace.adresa}, ${restaurace.mesto}`,
    cas: `${nabidka.vyzvednoutOd}–${nabidka.vyzvednoutDo}`,
    celkem: String(pocetPorci * nabidka.zvyhodnenaCena),
  })

  redirect(`/rezervace/${nabidkaId}/potvrzeni?${params.toString()}`)
}

export async function updateRestauraceProfil(restauraceId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('restaurace')
    .update({
      nazev: formData.get('nazev') as string,
      adresa: formData.get('adresa') as string,
      mesto: formData.get('mesto') as string,
      telefon: formData.get('telefon') as string,
      popis: formData.get('popis') as string,
      kategorie: formData.get('kategorie') as string,
    })
    .eq('id', restauraceId)

  if (error) return { error: error.message }
  redirect('/restaurace/dashboard')
}

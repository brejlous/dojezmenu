import { createClient } from '@/lib/supabase/server'
import type { Nabidka, Restaurace, Rezervace } from '@/lib/data'

// ── DB row types (snake_case from Supabase) ──────────────────────────────────

type NabidkaRow = {
  id: string
  restaurace_id: string
  nazev: string
  popis: string
  originalni_cena: number
  zvyhodnena_cena: number
  zbyvajici_kusu: number
  celkem_kusu: number
  vyzvednout_od: string
  vyzvednout_do: string
  kategorie: Nabidka['kategorie']
  foto: string
  aktivni: boolean
}

type RestauraceRow = {
  id: string
  user_id: string | null
  nazev: string
  adresa: string
  mesto: string
  psc: string
  telefon: string
  email: string
  logo: string
  popis: string
  kategorie: Nabidka['kategorie']
}

type RezervaceRow = {
  id: string
  nabidka_id: string
  jmeno: string
  telefon: string
  email: string
  pocet_porci: number
  poznamka: string
  cas_vytvoreni: string
  stav: Rezervace['stav']
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapNabidka(row: NabidkaRow): Nabidka {
  return {
    id: row.id,
    restauraceId: row.restaurace_id,
    nazev: row.nazev,
    popis: row.popis,
    originalniCena: row.originalni_cena,
    zvyhodnenaCena: row.zvyhodnena_cena,
    zbyvajiciKusu: row.zbyvajici_kusu,
    celkemKusu: row.celkem_kusu,
    vyzvednoutOd: row.vyzvednout_od,
    vyzvednoutDo: row.vyzvednout_do,
    kategorie: row.kategorie,
    foto: row.foto,
    aktivni: row.aktivni,
  }
}

function mapRestaurace(row: RestauraceRow): Restaurace {
  return {
    id: row.id,
    nazev: row.nazev,
    adresa: row.adresa,
    mesto: row.mesto,
    psc: row.psc,
    telefon: row.telefon,
    email: row.email,
    logo: row.logo,
    popis: row.popis,
    kategorie: row.kategorie,
  }
}

function mapRezervace(row: RezervaceRow): Rezervace {
  return {
    id: row.id,
    nabidkaId: row.nabidka_id,
    jmeno: row.jmeno,
    telefon: row.telefon,
    email: row.email,
    pocetPorci: row.pocet_porci,
    poznamka: row.poznamka,
    casVytvoreni: row.cas_vytvoreni,
    stav: row.stav,
  }
}

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getAktivniNabidky(): Promise<Nabidka[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nabidky')
    .select('*')
    .eq('aktivni', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as NabidkaRow[]).map(mapNabidka)
}

export async function getNabidkaById(id: string): Promise<Nabidka | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nabidky')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return mapNabidka(data as NabidkaRow)
}

export async function getAllRestaurace(): Promise<Restaurace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('restaurace').select('*')
  if (error) throw error
  return (data as RestauraceRow[]).map(mapRestaurace)
}

export async function getRestauraceById(id: string): Promise<Restaurace | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurace')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return mapRestaurace(data as RestauraceRow)
}

export async function getRestauraceByUserId(userId: string): Promise<Restaurace | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurace')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error) return null
  return mapRestaurace(data as RestauraceRow)
}

export async function getNabidkyByRestauraceId(restauraceId: string): Promise<Nabidka[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nabidky')
    .select('*')
    .eq('restaurace_id', restauraceId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as NabidkaRow[]).map(mapNabidka)
}

export async function getRezervaceByNabidkaId(nabidkaId: string): Promise<Rezervace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rezervace')
    .select('*')
    .eq('nabidka_id', nabidkaId)
    .order('cas_vytvoreni', { ascending: false })
  if (error) throw error
  return (data as RezervaceRow[]).map(mapRezervace)
}

export async function getRestauraceMap(nabidky: Nabidka[]): Promise<Record<string, Restaurace>> {
  const ids = [...new Set(nabidky.map((n) => n.restauraceId))]
  if (ids.length === 0) return {}
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('restaurace')
    .select('*')
    .in('id', ids)
  if (error) throw error
  return Object.fromEntries((data as RestauraceRow[]).map((r) => [r.id, mapRestaurace(r)]))
}

// ── Admin queries (all data, no RLS filter) ──────────────────────────────────

export async function adminGetAllNabidky(): Promise<Nabidka[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('nabidky')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as NabidkaRow[]).map(mapNabidka)
}

export async function adminGetAllRezervace(): Promise<Rezervace[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rezervace')
    .select('*')
    .order('cas_vytvoreni', { ascending: false })
  if (error) throw error
  return (data as RezervaceRow[]).map(mapRezervace)
}

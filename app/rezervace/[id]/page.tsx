import { getNabidkaById, getRestauraceById } from '@/lib/db'
import RezervaceClient from './RezervaceClient'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const nabidka = await getNabidkaById(id)
  const restaurace = nabidka ? await getRestauraceById(nabidka.restauraceId) : null
  return <RezervaceClient id={id} nabidka={nabidka ?? null} restaurace={restaurace ?? null} />
}

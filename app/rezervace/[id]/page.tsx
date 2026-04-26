import { nabidky } from '@/lib/data'
import RezervaceClient from './RezervaceClient'

export function generateStaticParams() {
  return nabidky.map((n) => ({ id: n.id }))
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RezervaceClient id={id} />
}

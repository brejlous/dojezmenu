import { nabidky } from '@/lib/data'
import PotvrzeniClient from './PotvrzeniClient'

export function generateStaticParams() {
  return nabidky.map((n) => ({ id: n.id }))
}

export default function Page() {
  return <PotvrzeniClient />
}

import Link from 'next/link'
import NabidkyList from '@/components/NabidkyList'
import { getAktivniNabidky, getRestauraceMap } from '@/lib/db'

export default async function HomePage() {
  const nabidky = await getAktivniNabidky()
  const restauraceMap = await getRestauraceMap(nabidky)

  return (
    <div>
      {/* Hero */}
      <div className="bg-brand text-white -mx-4 -mt-6 px-4 pt-8 pb-10">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight">LastBite</h1>
          <span className="text-xs text-brand-light/70 font-medium mt-1">by piano</span>
        </div>
        <p className="text-brand-light/90 text-sm">Zbylé porce za lepší cenu. Rezervuj, vyzvedni, zachraň jídlo.</p>
      </div>

      {/* Search bar */}
      <div className="-mx-4 px-4 -mt-5 mb-6">
        <div className="bg-white rounded-xl shadow-md p-3 flex items-center gap-2 border border-gray-100">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Hledat restauraci nebo jídlo…"
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <NabidkyList nabidky={nabidky} restauraceMap={restauraceMap} />

      <div className="mt-10 bg-brand-light rounded-2xl p-5 text-center border border-brand-muted">
        <p className="text-2xl mb-2">🍽️</p>
        <h2 className="font-semibold text-gray-900 mb-1">Vlastníte restauraci?</h2>
        <p className="text-sm text-gray-600 mb-3">
          Nabídněte zbylé porce a snižte plýtvání jídlem.
        </p>
        <Link
          href="/restaurace/dashboard"
          className="inline-block bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-hover transition-colors"
        >
          Spravovat nabídky
        </Link>
      </div>
    </div>
  )
}

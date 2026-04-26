import NabidkyList from '@/components/NabidkyList'
import { nabidky, restaurace } from '@/lib/data'

export default function HomePage() {
  const aktivniNabidky = nabidky.filter((n) => n.aktivni)

  const restauraceMap = Object.fromEntries(restaurace.map((r) => [r.id, r]))

  return (
    <div>
      {/* Green hero */}
      <div className="bg-green-600 text-white -mx-4 -mt-6 px-4 pt-8 pb-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🥡</span>
          <h1 className="text-2xl font-bold tracking-tight">DojezMenu</h1>
        </div>
        <p className="text-green-100 text-sm">Zbylé porce za lepší cenu. Rezervuj, vyzvedni, zachraň jídlo.</p>
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

      <NabidkyList nabidky={aktivniNabidky} restauraceMap={restauraceMap} />

      <div className="mt-10 bg-green-50 rounded-2xl p-5 text-center border border-green-100">
        <p className="text-2xl mb-2">🥡</p>
        <h2 className="font-semibold text-gray-900 mb-1">Vlastníte restauraci?</h2>
        <p className="text-sm text-gray-600 mb-3">
          Nabídněte zbylé porce a snižte plýtvání jídlem.
        </p>
        <a
          href="/restaurace/dashboard"
          className="inline-block bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-green-700 transition-colors"
        >
          Spravovat nabídky
        </a>
      </div>
    </div>
  )
}

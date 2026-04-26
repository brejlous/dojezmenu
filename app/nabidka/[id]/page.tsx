import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getNabidkaById, getRestauraceById } from '@/lib/db'
import { formatCena, getSlevaPercent } from '@/lib/data'

const categoryGradient: Record<string, string> = {
  ceska: 'from-amber-100 to-orange-100',
  italska: 'from-red-50 to-rose-100',
  asijska: 'from-amber-50 to-yellow-100',
  bistro: 'from-blue-50 to-sky-100',
  vegetarianska: 'from-green-50 to-emerald-100',
}

const categoryEmoji: Record<string, string> = {
  ceska: '🥩',
  italska: '🍕',
  asijska: '🍜',
  bistro: '☕',
  vegetarianska: '🥗',
}

export default async function NabidkaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const nabidka = await getNabidkaById(id)
  if (!nabidka) notFound()

  const restaurace = await getRestauraceById(nabidka.restauraceId)
  if (!restaurace) notFound()

  const sleva = getSlevaPercent(nabidka.originalniCena, nabidka.zvyhodnenaCena)
  const jePosledni = nabidka.zbyvajiciKusu <= 2
  const gradient = categoryGradient[nabidka.kategorie] ?? 'from-gray-50 to-gray-100'
  const emoji = categoryEmoji[nabidka.kategorie] ?? '🍽️'

  return (
    <div>
      {/* Top bar */}
      <div className="bg-white -mx-4 px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-14 z-10">
        <Link href="/" className="text-gray-500 hover:text-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-sm font-medium text-gray-700">Detail nabídky</span>
      </div>

      {/* Hero */}
      <div className={`bg-gradient-to-r ${gradient} -mx-4 h-52 flex items-center justify-center relative`}>
        <span className="text-7xl">{emoji}</span>
        <span className="absolute top-3 right-3 bg-brand text-white text-sm font-bold px-3 py-1 rounded-full">
          -{sleva}%
        </span>
        {jePosledni && (
          <span className="absolute top-3 left-3 bg-orange-400 text-white text-sm font-bold px-3 py-1 rounded-full">
            Poslední!
          </span>
        )}
      </div>

      <div className="mt-4">
        <h1 className="text-xl font-bold text-gray-900">{nabidka.nazev}</h1>
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
          </svg>
          <span className="text-sm text-gray-500">{restaurace.nazev} · {restaurace.adresa}, {restaurace.mesto}</span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-brand-light rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Zvýhodněná cena</div>
            <div className="text-xl font-bold text-brand">{formatCena(nabidka.zvyhodnenaCena)}</div>
            <div className="text-xs text-gray-400 line-through">původně {formatCena(nabidka.originalniCena)}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Zbývá porcí</div>
            <div className={`text-xl font-bold ${jePosledni ? 'text-orange-500' : 'text-gray-800'}`}>
              {nabidka.zbyvajiciKusu}
            </div>
            <div className="text-xs text-gray-400">z původních {nabidka.celkemKusu}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Vyzvednutí</div>
            <div className="text-sm font-bold text-gray-800">{nabidka.vyzvednoutOd}–{nabidka.vyzvednoutDo}</div>
            <div className="text-xs text-gray-400">dnes</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Platba</div>
            <div className="text-sm font-bold text-gray-800">Na místě</div>
            <div className="text-xs text-gray-400">hotovost / karta</div>
          </div>
        </div>

        {nabidka.popis && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">O jídle</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{nabidka.popis}</p>
          </div>
        )}

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <div className="flex gap-2">
            <span className="text-amber-500">💬</span>
            <div>
              <div className="text-xs font-semibold text-amber-700">Poznámka restaurace</div>
              <div className="text-xs text-amber-600 mt-0.5">
                Platba probíhá na místě při vyzvednutí. Přijímáme hotovost i kartu.
              </div>
            </div>
          </div>
        </div>

        <Link
          href={`/rezervace/${nabidka.id}`}
          className="block w-full mt-5 bg-brand hover:bg-brand-hover text-white font-semibold py-3.5 rounded-2xl text-base transition-colors text-center"
        >
          Rezervovat porci
        </Link>
      </div>
    </div>
  )
}

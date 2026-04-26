import Link from 'next/link'
import { Nabidka, Restaurace, formatCena, getSlevaPercent } from '@/lib/data'

type Props = {
  nabidka: Nabidka
  restaurace: Restaurace
}

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

export default function NabidkaCard({ nabidka, restaurace }: Props) {
  const sleva = getSlevaPercent(nabidka.originalniCena, nabidka.zvyhodnenaCena)
  const jePosledni = nabidka.zbyvajiciKusu <= 2
  const gradient = categoryGradient[nabidka.kategorie] ?? 'from-gray-50 to-gray-100'
  const emoji = categoryEmoji[nabidka.kategorie] ?? '🍽️'

  return (
    <Link href={`/nabidka/${nabidka.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className={`bg-gradient-to-r ${gradient} h-32 flex items-center justify-center relative`}>
          <span className="text-5xl">{emoji}</span>
          <span className="absolute top-2 right-2 bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{sleva}%
          </span>
          {jePosledni && (
            <span className="absolute top-2 left-2 bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Poslední!
            </span>
          )}
          <span className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm text-xs px-2 py-0.5 rounded-full text-gray-600 font-medium">
            ⏱ {nabidka.vyzvednoutOd}–{nabidka.vyzvednoutDo}
          </span>
        </div>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">{nabidka.nazev}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{restaurace.nazev} · {restaurace.mesto}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-brand font-bold text-base">{formatCena(nabidka.zvyhodnenaCena)}</div>
              <div className="text-gray-400 text-xs line-through">{formatCena(nabidka.originalniCena)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${jePosledni ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
              🍽 <span className="font-medium">{nabidka.zbyvajiciKusu}</span>{' '}
              {nabidka.zbyvajiciKusu === 1 ? 'porce zbývá' : nabidka.zbyvajiciKusu < 5 ? 'porce zbývají' : 'porcí zbývá'}
            </span>
            <span className="text-xs bg-brand text-white px-3 py-1 rounded-full font-medium">
              Rezervovat
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

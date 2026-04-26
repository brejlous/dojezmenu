'use client'

import { useState } from 'react'
import NabidkaCard from './NabidkaCard'
import { Nabidka, Restaurace } from '@/lib/data'

type Props = {
  nabidky: Nabidka[]
  restauraceMap: Record<string, Restaurace>
}

const filters = [
  { key: 'vse', label: 'Vše' },
  { key: 'ceska', label: '🥩 Česká' },
  { key: 'italska', label: '🍕 Italská' },
  { key: 'asijska', label: '🍜 Asijská' },
  { key: 'bistro', label: '☕ Bistro' },
  { key: 'vegetarianska', label: '🥗 Veggie' },
]

export default function NabidkyList({ nabidky, restauraceMap }: Props) {
  const [aktivniFiltr, setAktivniFiltr] = useState('vse')

  const filtrovane = aktivniFiltr === 'vse'
    ? nabidky
    : nabidky.filter((n) => n.kategorie === aktivniFiltr)

  return (
    <div>
      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setAktivniFiltr(f.key)}
            className={`shrink-0 text-xs px-3 py-2.5 rounded-full border font-medium transition-all whitespace-nowrap ${
              aktivniFiltr === f.key
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-muted'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Section heading */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800">Dostupné dnes</h2>
        <span className="text-xs text-brand font-medium bg-brand-light px-2 py-0.5 rounded-full">
          {filtrovane.length} {filtrovane.length === 1 ? 'nabídka' : filtrovane.length < 5 ? 'nabídky' : 'nabídek'}
        </span>
      </div>

      {filtrovane.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">Žádné nabídky v této kategorii.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrovane.map((nabidka) => {
            const rest = restauraceMap[nabidka.restauraceId]
            if (!rest) return null
            return <NabidkaCard key={nabidka.id} nabidka={nabidka} restaurace={rest} />
          })}
        </div>
      )}
    </div>
  )
}

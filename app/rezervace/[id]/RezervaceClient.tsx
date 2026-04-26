'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { getNabidkaById, getRestauraceById, formatCena } from '@/lib/data'

const categoryEmoji: Record<string, string> = {
  ceska: '🥩',
  italska: '🍕',
  asijska: '🍜',
  bistro: '☕',
  vegetarianska: '🥗',
}

export default function RezervaceClient({ id }: { id: string }) {
  const nabidka = getNabidkaById(id)
  const restaurace = nabidka ? getRestauraceById(nabidka.restauraceId) : null
  const router = useRouter()

  const [form, setForm] = useState({ jmeno: '', kontakt: '', poznamka: '' })
  const [pocetPorci, setPocetPorci] = useState(1)
  const [odesila, setOdesila] = useState(false)

  if (!nabidka || !restaurace) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Nabídka nenalezena.</p>
        <Link href="/" className="text-green-600 mt-2 inline-block">← Zpět</Link>
      </div>
    )
  }

  const maxPorci = nabidka.zbyvajiciKusu
  const celkem = pocetPorci * nabidka.zvyhodnenaCena
  const emoji = categoryEmoji[nabidka.kategorie] ?? '🍽️'

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOdesila(true)
    await new Promise((r) => setTimeout(r, 800))
    const urlParams = new URLSearchParams({
      jmeno: form.jmeno,
      pocet: String(pocetPorci),
      nabidka: nabidka!.nazev,
      restaurace: restaurace!.nazev,
      adresa: `${restaurace!.adresa}, ${restaurace!.mesto}`,
      cas: `${nabidka!.vyzvednoutOd}–${nabidka!.vyzvednoutDo}`,
      celkem: String(celkem),
    })
    router.push(`/rezervace/${id}/potvrzeni?${urlParams.toString()}`)
  }

  return (
    <div>
      {/* Top bar */}
      <div className="bg-white -mx-4 px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-14 z-10">
        <Link href={`/nabidka/${id}`} className="text-gray-500 hover:text-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-sm font-medium text-gray-700">Rezervace</span>
      </div>

      <div className="mt-5">
        {/* Summary strip */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <span className="text-3xl">{emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 text-sm">{nabidka.nazev}</div>
            <div className="text-xs text-gray-500">{restaurace.nazev} · dnes {nabidka.vyzvednoutOd}–{nabidka.vyzvednoutDo}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-green-600">{formatCena(nabidka.zvyhodnenaCena)}</div>
            <div className="text-xs text-gray-400">/ porce</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Jméno a příjmení <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jmeno"
              value={form.jmeno}
              onChange={handleChange}
              required
              placeholder="Jan Novák"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Telefon nebo e-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="kontakt"
              value={form.kontakt}
              onChange={handleChange}
              required
              placeholder="+420 777 123 456 nebo jan@email.cz"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Počet porcí <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPocetPorci((p) => Math.max(1, p - 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <div className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-center font-semibold text-gray-900">
                {pocetPorci}
              </div>
              <button
                type="button"
                onClick={() => setPocetPorci((p) => Math.min(maxPorci, p + 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 text-lg font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">Max. {maxPorci} {maxPorci === 1 ? 'porce' : maxPorci < 5 ? 'porce' : 'porcí'}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{pocetPorci}× {nabidka.nazev}</span>
              <span>{formatCena(celkem)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-800">
              <span>Celkem k zaplacení</span>
              <span className="text-green-600">{formatCena(celkem)}</span>
            </div>
            <div className="text-xs text-gray-400 text-center">Platba probíhá na místě v restauraci</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Poznámka (nepovinné)</label>
            <textarea
              name="poznamka"
              value={form.poznamka}
              onChange={handleChange}
              rows={2}
              placeholder="Např. alergie, speciální požadavky…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={odesila}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3.5 rounded-2xl text-base transition-colors"
          >
            {odesila ? 'Odesílám…' : 'Potvrdit rezervaci'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Rezervací souhlasíte, že si jídlo vyzvednete v uvedeném čase.
          </p>
        </form>
      </div>
    </div>
  )
}

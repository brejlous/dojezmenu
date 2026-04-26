'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { kategorieLabels } from '@/lib/data'
import { createNabidka } from '@/app/actions/nabidky'

export default function NovaNabidkaPage() {
  const [celkemKusu, setCelkemKusu] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [prices, setPrices] = useState({ originalni: '', zvyhodnena: '' })
  const originalniCena = parseFloat(prices.originalni) || 0
  const zvyhodnenaCena = parseFloat(prices.zvyhodnena) || 0
  const sleva = originalniCena > 0 && zvyhodnenaCena > 0
    ? Math.round(((originalniCena - zvyhodnenaCena) / originalniCena) * 100) : 0
  const usporite = originalniCena > 0 && zvyhodnenaCena > 0 ? originalniCena - zvyhodnenaCena : 0

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('celkemKusu', String(celkemKusu))
    setError(null)
    startTransition(async () => {
      const result = await createNabidka(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div>
      {/* Top bar */}
      <div className="bg-white -mx-4 px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-14 z-10">
        <Link href="/restaurace/dashboard" className="text-gray-500 hover:text-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-sm font-medium text-gray-700">Nová nabídka</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-6">

        {/* O jídle */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">O jídle</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Název jídla <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nazev"
                required
                placeholder="např. Kuřecí kari s rýží"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Popis</label>
              <textarea
                name="popis"
                rows={3}
                placeholder="Krátký popis jídla, alergenů nebo velikosti porce…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategorie</label>
              <select
                name="kategorie"
                defaultValue="ceska"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all bg-white"
              >
                {Object.entries(kategorieLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cena */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cena</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Původní cena <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="originalniCena"
                  value={prices.originalni}
                  onChange={(e) => setPrices((p) => ({ ...p, originalni: e.target.value }))}
                  required
                  min="1"
                  placeholder="169"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Kč</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nová cena <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="zvyhodnenaCena"
                  value={prices.zvyhodnena}
                  onChange={(e) => setPrices((p) => ({ ...p, zvyhodnena: e.target.value }))}
                  required
                  min="1"
                  placeholder="109"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">Kč</span>
              </div>
            </div>
          </div>

          {sleva > 0 && (
            <div className="mt-2 bg-brand-light border border-brand-muted rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-gray-600">Zákazník ušetří</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand">{usporite} Kč</span>
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">-{sleva}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Dostupnost */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dostupnost</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Počet porcí <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCelkemKusu((n) => Math.max(1, n - 1))}
                className="w-11 h-11 rounded-xl border border-gray-200 text-gray-600 text-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={celkemKusu}
                onChange={(e) => setCelkemKusu(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="50"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base text-center font-semibold outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted"
              />
              <button
                type="button"
                onClick={() => setCelkemKusu((n) => Math.min(50, n + 1))}
                className="w-11 h-11 rounded-xl border border-gray-200 text-gray-600 text-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Čas vyzvednutí */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Čas vyzvednutí</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Od <span className="text-red-500">*</span></label>
              <input
                type="time"
                name="vyzvednoutOd"
                defaultValue="13:00"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Do <span className="text-red-500">*</span></label>
              <input
                type="time"
                name="vyzvednoutDo"
                defaultValue="15:30"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
          </div>
        </div>

        {/* Poznámka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Poznámka pro zákazníky</label>
          <textarea
            name="poznamka"
            rows={2}
            placeholder="Volitelná poznámka (alergie, způsob platby, instrukce k vyzvednutí…)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand hover:bg-brand-hover disabled:bg-brand-muted text-white font-semibold py-3.5 rounded-2xl text-base transition-colors"
        >
          {isPending ? 'Ukládám…' : 'Zveřejnit nabídku'}
        </button>

        <Link
          href="/restaurace/dashboard"
          className="block w-full text-center text-gray-400 text-sm py-2 hover:text-gray-600"
        >
          Zrušit
        </Link>
      </form>
    </div>
  )
}

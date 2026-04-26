'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { kategorieLabels } from '@/lib/data'

export default function NovaNabidkaPage() {
  const router = useRouter()
  const [odesila, setOdesila] = useState(false)
  const [uspesne, setUspesne] = useState(false)
  const [celkemKusu, setCelkemKusu] = useState(5)

  const [form, setForm] = useState({
    nazev: '',
    popis: '',
    originalniCena: '',
    zvyhodnenaCena: '',
    vyzvednoutOd: '13:00',
    vyzvednoutDo: '15:30',
    kategorie: 'ceska' as keyof typeof kategorieLabels,
    poznamka: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const originalniCena = parseFloat(form.originalniCena) || 0
  const zvyhodnenaCena = parseFloat(form.zvyhodnenaCena) || 0
  const sleva = originalniCena > 0 && zvyhodnenaCena > 0
    ? Math.round(((originalniCena - zvyhodnenaCena) / originalniCena) * 100)
    : 0
  const usporite = originalniCena > 0 && zvyhodnenaCena > 0
    ? originalniCena - zvyhodnenaCena
    : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOdesila(true)
    await new Promise((r) => setTimeout(r, 900))
    setUspesne(true)
    await new Promise((r) => setTimeout(r, 1500))
    router.push('/restaurace/dashboard')
  }

  if (uspesne) {
    return (
      <div className="flex flex-col items-center text-center py-16">
        <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Nabídka zveřejněna!</h2>
        <p className="text-gray-500 text-sm">Přesměrování na dashboard…</p>
      </div>
    )
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
                value={form.nazev}
                onChange={handleChange}
                required
                placeholder="např. Kuřecí kari s rýží"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Popis</label>
              <textarea
                name="popis"
                value={form.popis}
                onChange={handleChange}
                rows={3}
                placeholder="Krátký popis jídla, alergenů nebo velikosti porce…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all resize-none text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategorie</label>
              <select
                name="kategorie"
                value={form.kategorie}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all bg-white text-base"
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
                  value={form.originalniCena}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="169"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all pr-10 text-base"
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
                  value={form.zvyhodnenaCena}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="109"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all pr-10 text-base"
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
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-center font-semibold outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Od <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="vyzvednoutOd"
                value={form.vyzvednoutOd}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Do <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="vyzvednoutDo"
                value={form.vyzvednoutDo}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
          </div>
        </div>

        {/* Poznámka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Poznámka pro zákazníky</label>
          <textarea
            name="poznamka"
            value={form.poznamka}
            onChange={handleChange}
            rows={2}
            placeholder="Volitelná poznámka (alergie, způsob platby, instrukce k vyzvednutí…)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all resize-none text-base"
          />
        </div>

        <button
          type="submit"
          disabled={odesila}
          className="w-full bg-brand hover:bg-brand-hover disabled:bg-brand-muted text-white font-semibold py-3.5 rounded-2xl text-base transition-colors"
        >
          {odesila ? 'Ukládám…' : 'Zveřejnit nabídku'}
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

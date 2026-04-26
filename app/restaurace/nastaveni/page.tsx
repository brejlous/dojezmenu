'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { restaurace, kategorieLabels } from '@/lib/data'

const DEMO_RESTAURACE_ID = 'r1'

export default function NastaveniPage() {
  const rest = restaurace.find((r) => r.id === DEMO_RESTAURACE_ID)!
  const router = useRouter()
  const [uklada, setUklada] = useState(false)
  const [uspesne, setUspesne] = useState(false)

  const [form, setForm] = useState({
    nazev: rest.nazev,
    adresa: rest.adresa,
    mesto: rest.mesto,
    telefon: rest.telefon,
    popis: rest.popis,
    kategorie: rest.kategorie as keyof typeof kategorieLabels,
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUklada(true)
    await new Promise((r) => setTimeout(r, 800))
    setUspesne(true)
    await new Promise((r) => setTimeout(r, 1500))
    router.push('/restaurace/dashboard')
  }

  if (uspesne) {
    return (
      <div className="flex flex-col items-center text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Profil uložen!</h2>
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
        <span className="text-sm font-medium text-gray-700">Nastavení profilu</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-6">

        {/* Základní informace */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Základní informace</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Typ kuchyně</label>
              <select
                name="kategorie"
                value={form.kategorie}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white text-base"
              >
                {Object.entries(kategorieLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Název restaurace <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nazev"
                value={form.nazev}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Popis</label>
              <textarea
                name="popis"
                value={form.popis}
                onChange={handleChange}
                rows={3}
                placeholder="Krátký popis vaší restaurace…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none text-base"
              />
            </div>
          </div>
        </div>

        {/* Kontakt a adresa */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kontakt a adresa</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Telefon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telefon"
                value={form.telefon}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ulice a číslo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="adresa"
                value={form.adresa}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Město <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mesto"
                value={form.mesto}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-base"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={uklada}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-3.5 rounded-2xl text-base transition-colors"
        >
          {uklada ? 'Ukládám…' : 'Uložit profil'}
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

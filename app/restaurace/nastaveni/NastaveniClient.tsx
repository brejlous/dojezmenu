'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { kategorieLabels, type Restaurace } from '@/lib/data'
import { updateRestauraceProfil } from '@/app/actions/rezervace'

export default function NastaveniClient({ restaurace }: { restaurace: Restaurace }) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await updateRestauraceProfil(restaurace.id, formData)
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
                defaultValue={restaurace.kategorie}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all bg-white"
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
                defaultValue={restaurace.nazev}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Popis</label>
              <textarea
                name="popis"
                defaultValue={restaurace.popis}
                rows={3}
                placeholder="Krátký popis vaší restaurace…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all resize-none"
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
                defaultValue={restaurace.telefon}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ulice a číslo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="adresa"
                defaultValue={restaurace.adresa}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Město <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mesto"
                defaultValue={restaurace.mesto}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand hover:bg-brand-hover disabled:bg-brand-muted text-white font-semibold py-3.5 rounded-2xl text-base transition-colors"
        >
          {isPending ? 'Ukládám…' : 'Uložit profil'}
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

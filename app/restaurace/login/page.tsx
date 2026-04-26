'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Last<span className="text-brand">Bite</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Přihlášení pro restaurace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="restaurace@email.cz"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Heslo</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand-muted transition-all"
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
            {isPending ? 'Přihlašuji…' : 'Přihlásit se'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Zákazník? <Link href="/" className="text-brand hover:underline">Zpět na nabídky</Link>
        </p>
      </div>
    </div>
  )
}

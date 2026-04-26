'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PotvrzeniContent() {
  const sp = useSearchParams()

  return (
    <div>
      <div className="bg-white -mx-4 px-4 py-3 border-b border-gray-100 sticky top-14 z-10">
        <span className="text-sm font-medium text-gray-700">Potvrzení rezervace</span>
      </div>

      <div className="mt-8 text-center">
        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Rezervace potvrzena!</h1>
        <p className="text-sm text-gray-500 mt-2">Restaurace na vás čeká. Dorazte prosím v uvedeném čase.</p>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {sp.get('nabidka') && sp.get('restaurace') && (
            <div className="bg-brand-light px-4 py-4 flex items-center gap-3 border-b border-brand-muted">
              <span className="text-3xl">🍽️</span>
              <div>
                <div className="font-semibold text-gray-800">{sp.get('nabidka')}</div>
                <div className="text-xs text-gray-500">{sp.get('restaurace')}</div>
              </div>
            </div>
          )}

          <div className="p-4 space-y-3">
            {sp.get('adresa') && (
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">Adresa</div>
                  <div className="text-sm font-medium text-gray-800">{sp.get('adresa')}</div>
                </div>
              </div>
            )}
            {sp.get('cas') && (
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">Čas vyzvednutí</div>
                  <div className="text-sm font-medium text-gray-800">Dnes {sp.get('cas')}</div>
                </div>
              </div>
            )}
            {(sp.get('jmeno') || sp.get('pocet')) && (
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">Rezervace</div>
                  <div className="text-sm font-medium text-gray-800">
                    {sp.get('pocet')} {Number(sp.get('pocet')) === 1 ? 'porce' : Number(sp.get('pocet')) < 5 ? 'porce' : 'porcí'}
                    {sp.get('jmeno') && ` · ${sp.get('jmeno')}`}
                  </div>
                </div>
              </div>
            )}
            {sp.get('celkem') && (
              <div className="border-t border-gray-100 pt-3 flex items-start gap-3">
                <svg className="w-4 h-4 text-brand mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2m2 4h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z" />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">Platba</div>
                  <div className="text-sm font-medium text-gray-800">{sp.get('celkem')} Kč na místě v hotovosti / kartou</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
          <span className="text-blue-500 text-base">ℹ️</span>
          <p className="text-xs text-blue-700">Tuto stránku si uložte nebo vyfoťte. Při vyzvednutí řekněte své jméno.</p>
        </div>

        <Link
          href="/"
          className="block w-full mt-5 bg-brand hover:bg-brand-hover text-white font-semibold py-3.5 rounded-2xl text-base transition-colors text-center"
        >
          Zpět na nabídky
        </Link>
      </div>
    </div>
  )
}

export default function PotvrzeniClient() {
  return (
    <Suspense>
      <PotvrzeniContent />
    </Suspense>
  )
}

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRestauraceByUserId, getNabidkyByRestauraceId, getRezervaceByNabidkaId } from '@/lib/db'
import { formatCena, getSlevaPercent } from '@/lib/data'
import StatusBadge from '@/components/StatusBadge'
import { deactivateNabidka, updateStavRezervace } from '@/app/actions/nabidky'
import { logout } from '@/app/actions/auth'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/restaurace/login')

  const rest = await getRestauraceByUserId(user.id)
  if (!rest) redirect('/restaurace/login')

  const nabidky = await getNabidkyByRestauraceId(rest.id)

  const vsechnyRezervace = (
    await Promise.all(
      nabidky.map(async (n) => {
        const rez = await getRezervaceByNabidkaId(n.id)
        return rez.map((r) => ({ ...r, nabidkaNazev: n.nazev }))
      })
    )
  ).flat()

  const celkemTrzby = vsechnyRezervace.reduce((sum, r) => {
    const nabidka = nabidky.find((n) => n.id === r.nabidkaId)
    return sum + (nabidka ? r.pocetPorci * nabidka.zvyhodnenaCena : 0)
  }, 0)

  const aktivniNabidky = nabidky.filter((n) => n.aktivni)

  return (
    <div>
      {/* Brand header */}
      <div className="bg-brand text-white -mx-4 -mt-6 px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-xs text-brand-light/70">Přihlášen jako</div>
            <h1 className="font-bold text-lg">{rest.nazev}</h1>
            <p className="text-xs text-brand-light/70 mt-0.5">{rest.adresa}, {rest.mesto}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/restaurace/nastaveni" className="text-brand-light/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <form action={logout}>
              <button type="submit" className="text-brand-light/70 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </form>
            <Link href="/" className="text-brand-light/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <div className="text-xl font-bold">{aktivniNabidky.length}</div>
            <div className="text-xs text-brand-light/70">nabídek</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <div className="text-xl font-bold">{vsechnyRezervace.length}</div>
            <div className="text-xs text-brand-light/70">rezervací</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center">
            <div className="text-lg font-bold">{formatCena(celkemTrzby)}</div>
            <div className="text-xs text-brand-light/70">tržby dnes</div>
          </div>
        </div>
      </div>

      <div className="-mt-4">
        <Link
          href="/restaurace/nova-nabidka"
          className="w-full bg-white border-2 border-brand text-brand font-semibold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-brand-light transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Vytvořit novou nabídku
        </Link>

        <h2 className="font-semibold text-gray-800 mt-5 mb-3">Aktivní nabídky</h2>

        {aktivniNabidky.length === 0 && (
          <p className="text-gray-400 text-sm mb-6">Žádné aktivní nabídky.</p>
        )}

        <div className="flex flex-col gap-3 mb-6">
          {aktivniNabidky.map((nabidka) => {
            const rezervace = vsechnyRezervace.filter((r) => r.nabidkaId === nabidka.id)
            const sleva = getSlevaPercent(nabidka.originalniCena, nabidka.zvyhodnenaCena)
            const obsazenost = nabidka.celkemKusu - nabidka.zbyvajiciKusu

            return (
              <div key={nabidka.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 text-sm truncate">{nabidka.nazev}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0">Aktivní</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formatCena(nabidka.zvyhodnenaCena)} · −{sleva} % · {nabidka.vyzvednoutOd}–{nabidka.vyzvednoutDo}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="text-lg font-bold text-gray-800">{nabidka.zbyvajiciKusu}</div>
                      <div className="text-xs text-gray-400">porcí</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-brand h-1.5 rounded-full transition-all"
                        style={{ width: `${(obsazenost / nabidka.celkemKusu) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{obsazenost}/{nabidka.celkemKusu}</span>
                  </div>

                  {rezervace.length > 0 && (
                    <div className="mt-3 bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Rezervace ({rezervace.length})</span>
                        <span className="text-xs text-gray-400">z {nabidka.celkemKusu} porcí prodáno {obsazenost}</span>
                      </div>
                      {rezervace.map((rez) => (
                        <div key={rez.id} className="flex items-center justify-between py-1.5 border-t border-gray-100">
                          <div>
                            <div className="text-xs font-medium text-gray-700">{rez.jmeno}</div>
                            <div className="text-xs text-gray-400">{rez.telefon} · {rez.pocetPorci} porce</div>
                          </div>
                          <StatusBadge stav={rez.stav} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 text-xs border border-gray-200 text-gray-500 py-2 rounded-xl hover:bg-gray-50 transition-colors">Upravit</button>
                    <form action={deactivateNabidka.bind(null, nabidka.id)} className="flex-1">
                      <button type="submit" className="w-full text-xs border border-red-200 text-red-500 py-2 rounded-xl hover:bg-red-50 transition-colors">Ukončit</button>
                    </form>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <h2 className="font-semibold text-gray-800 mb-3">Všechny rezervace dnes</h2>
        {vsechnyRezervace.length === 0 ? (
          <p className="text-gray-400 text-sm">Zatím žádné rezervace.</p>
        ) : (
          <div className="flex flex-col gap-2 mb-6">
            {vsechnyRezervace.map((rez) => (
              <div key={rez.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{rez.jmeno}</p>
                  <p className="text-xs text-gray-500 truncate">{rez.nabidkaNazev}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{rez.pocetPorci} porce · {rez.telefon}</p>
                  {rez.poznamka && <p className="text-xs text-gray-400 mt-1 italic">„{rez.poznamka}"</p>}
                </div>
                <StatusBadge stav={rez.stav} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

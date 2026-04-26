import { createClient } from '@/lib/supabase/server'
import { adminGetAllNabidky, adminGetAllRezervace, getAllRestaurace } from '@/lib/db'
import { formatCena } from '@/lib/data'

export default async function AdminPage() {
  const [restaurace, nabidky, rezervace] = await Promise.all([
    getAllRestaurace(),
    adminGetAllNabidky(),
    adminGetAllRezervace(),
  ])

  const aktivniNabidky = nabidky.filter((n) => n.aktivni)
  const dnesniRezervace = rezervace.filter((r) =>
    r.casVytvoreni.startsWith(new Date().toISOString().slice(0, 10))
  )
  const celkemTrzby = rezervace.reduce((sum, r) => {
    const nabidka = nabidky.find((n) => n.id === r.nabidkaId)
    return sum + (nabidka ? r.pocetPorci * nabidka.zvyhodnenaCena : 0)
  }, 0)

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Přehled platformy</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
        {[
          { label: 'Restaurací', value: restaurace.length },
          { label: 'Aktivních nabídek', value: aktivniNabidky.length },
          { label: 'Rezervací dnes', value: dnesniRezervace.length },
          { label: 'Tržby celkem', value: formatCena(celkemTrzby) },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Restaurants table */}
      <h2 className="font-semibold text-gray-800 mb-3">Restaurace</h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Název</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Město</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Kuchyně</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Nabídky</th>
            </tr>
          </thead>
          <tbody>
            {restaurace.map((r) => {
              const pocetNabidek = nabidky.filter((n) => n.restauraceId === r.id && n.aktivni).length
              return (
                <tr key={r.id} className="border-t border-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.nazev}</td>
                  <td className="px-4 py-3 text-gray-500">{r.mesto}</td>
                  <td className="px-4 py-3 text-gray-500">{r.kategorie}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{pocetNabidek}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Recent reservations */}
      <h2 className="font-semibold text-gray-800 mb-3">Poslední rezervace</h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Jméno</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nabídka</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Porcí</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Stav</th>
            </tr>
          </thead>
          <tbody>
            {rezervace.slice(0, 20).map((r) => {
              const nabidka = nabidky.find((n) => n.id === r.nabidkaId)
              return (
                <tr key={r.id} className="border-t border-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.jmeno}</td>
                  <td className="px-4 py-3 text-gray-500">{nabidka?.nazev ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{r.pocetPorci}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.stav === 'potvrzena' ? 'bg-green-100 text-green-700' :
                      r.stav === 'vyzvednuta' ? 'bg-gray-100 text-gray-600' :
                      r.stav === 'zrusena' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {r.stav}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

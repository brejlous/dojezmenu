import { Rezervace } from '@/lib/data'

const stavLabels: Record<Rezervace['stav'], string> = {
  cekajici: 'Čeká na potvrzení',
  potvrzena: 'Potvrzena',
  vyzvednuta: 'Vyzvednuta',
  zrusena: 'Zrušena',
}

const stavColors: Record<Rezervace['stav'], string> = {
  cekajici: 'bg-yellow-100 text-yellow-700',
  potvrzena: 'bg-green-100 text-green-700',
  vyzvednuta: 'bg-gray-100 text-gray-600',
  zrusena: 'bg-red-100 text-red-600',
}

export default function StatusBadge({ stav }: { stav: Rezervace['stav'] }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${stavColors[stav]}`}>
      {stavLabels[stav]}
    </span>
  )
}

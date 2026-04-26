export type Nabidka = {
  id: string
  restauraceId: string
  nazev: string
  popis: string
  originalniCena: number
  zvyhodnenaCena: number
  zbyvajiciKusu: number
  celkemKusu: number
  vyzvednoutOd: string
  vyzvednoutDo: string
  kategorie: 'ceska' | 'italska' | 'asijska' | 'bistro' | 'vegetarianska'
  foto: string
  aktivni: boolean
}

export type Restaurace = {
  id: string
  nazev: string
  adresa: string
  mesto: string
  psc: string
  telefon: string
  email: string
  logo: string
  popis: string
  kategorie: Nabidka['kategorie']
}

export type Rezervace = {
  id: string
  nabidkaId: string
  jmeno: string
  telefon: string
  email: string
  pocetPorci: number
  poznamka: string
  casVytvoreni: string
  stav: 'cekajici' | 'potvrzena' | 'vyzvednuta' | 'zrusena'
}

export const restaurace: Restaurace[] = [
  {
    id: 'r1',
    nazev: 'U Zlatého jelena',
    adresa: 'Náměstí Míru 12',
    mesto: 'Praha 2',
    psc: '120 00',
    telefon: '+420 222 333 444',
    email: 'info@zlatyjelen.cz',
    logo: '',
    popis: 'Tradiční česká kuchyně v srdci Prahy. Vaříme z lokálních surovin každý den.',
    kategorie: 'ceska',
  },
  {
    id: 'r2',
    nazev: 'Pizzeria Da Marco',
    adresa: 'Korunní 45',
    mesto: 'Praha 2',
    psc: '120 00',
    telefon: '+420 224 567 890',
    email: 'marco@damarco.cz',
    logo: '',
    popis: 'Autentická neapolská pizza připravovaná v peci na dřevo.',
    kategorie: 'italska',
  },
  {
    id: 'r3',
    nazev: 'Zen Asia Bistro',
    adresa: 'Wenceslas Square 18',
    mesto: 'Praha 1',
    psc: '110 00',
    telefon: '+420 221 123 456',
    email: 'hello@zenasia.cz',
    logo: '',
    popis: 'Moderní asijská kuchyně – thajská, vietnamská a japonská.',
    kategorie: 'asijska',
  },
  {
    id: 'r4',
    nazev: 'Café Žitná',
    adresa: 'Žitná 22',
    mesto: 'Praha 2',
    psc: '120 00',
    telefon: '+420 296 000 111',
    email: 'cafe@zitna.cz',
    logo: '',
    popis: 'Denní bistro s domácím pečivem, polévkami a lehkými obědy.',
    kategorie: 'vegetarianska',
  },
]

export const nabidky: Nabidka[] = [
  {
    id: 'n1',
    restauraceId: 'r1',
    nazev: 'Svíčková na smetaně',
    popis: 'Klasická česká svíčková z hovězí roštěné, domácí knedlíky, brusinky a šlehačka.',
    originalniCena: 189,
    zvyhodnenaCena: 89,
    zbyvajiciKusu: 3,
    celkemKusu: 8,
    vyzvednoutOd: '14:30',
    vyzvednoutDo: '16:00',
    kategorie: 'ceska',
    foto: '',
    aktivni: true,
  },
  {
    id: 'n2',
    restauraceId: 'r1',
    nazev: 'Gulášová polévka + chléb',
    popis: 'Hustá hovězí gulášová polévka s paprikou, kmínem a čerstvým chlebem.',
    originalniCena: 95,
    zvyhodnenaCena: 45,
    zbyvajiciKusu: 5,
    celkemKusu: 10,
    vyzvednoutOd: '13:00',
    vyzvednoutDo: '14:30',
    kategorie: 'ceska',
    foto: '',
    aktivni: true,
  },
  {
    id: 'n3',
    restauraceId: 'r2',
    nazev: 'Pizza Margherita (32 cm)',
    popis: 'Klasická pizza s rajčatovou omáčkou, mozzarellou a čerstvou bazalkou.',
    originalniCena: 195,
    zvyhodnenaCena: 99,
    zbyvajiciKusu: 2,
    celkemKusu: 4,
    vyzvednoutOd: '20:00',
    vyzvednoutDo: '21:30',
    kategorie: 'italska',
    foto: '',
    aktivni: true,
  },
  {
    id: 'n4',
    restauraceId: 'r2',
    nazev: 'Pasta Carbonara',
    popis: 'Domácí tagliatelle s pancettou, vejcem, parmazánem a čerstvým pepřem.',
    originalniCena: 175,
    zvyhodnenaCena: 85,
    zbyvajiciKusu: 4,
    celkemKusu: 6,
    vyzvednoutOd: '20:30',
    vyzvednoutDo: '21:30',
    kategorie: 'italska',
    foto: '',
    aktivni: true,
  },
  {
    id: 'n5',
    restauraceId: 'r3',
    nazev: 'Pad Thai s tofu',
    popis: 'Rýžové nudle s tofu, tamarindem, vejcem, burskými oříšky a limetkou.',
    originalniCena: 210,
    zvyhodnenaCena: 110,
    zbyvajiciKusu: 3,
    celkemKusu: 5,
    vyzvednoutOd: '20:00',
    vyzvednoutDo: '22:00',
    kategorie: 'asijska',
    foto: '',
    aktivni: true,
  },
  {
    id: 'n6',
    restauraceId: 'r3',
    nazev: 'Pho Bo – hovězí vývar',
    popis: 'Vietnamský hovězí vývar s rýžovými nudlemi, bylinkami a pálivou pastou.',
    originalniCena: 185,
    zvyhodnenaCena: 95,
    zbyvajiciKusu: 1,
    celkemKusu: 3,
    vyzvednoutOd: '20:00',
    vyzvednoutDo: '21:00',
    kategorie: 'asijska',
    foto: '',
    aktivni: true,
  },
  {
    id: 'n7',
    restauraceId: 'r4',
    nazev: 'Polévka dne + bageta',
    popis: 'Dnešní domácí polévka (dýňová se zázvorem) a čerstvá celozrnná bageta s máslem.',
    originalniCena: 120,
    zvyhodnenaCena: 55,
    zbyvajiciKusu: 6,
    celkemKusu: 12,
    vyzvednoutOd: '14:00',
    vyzvednoutDo: '15:30',
    kategorie: 'vegetarianska',
    foto: '',
    aktivni: true,
  },
  {
    id: 'n8',
    restauraceId: 'r4',
    nazev: 'Buddha bowl s quinoa',
    popis: 'Quinoa, pečená zelenina, cizrna, tahini dressing, semínka a čerstvé bylinky.',
    originalniCena: 175,
    zvyhodnenaCena: 85,
    zbyvajiciKusu: 2,
    celkemKusu: 4,
    vyzvednoutOd: '14:30',
    vyzvednoutDo: '16:00',
    kategorie: 'vegetarianska',
    foto: '',
    aktivni: true,
  },
]

export const rezervace: Rezervace[] = [
  {
    id: 'rez1',
    nabidkaId: 'n1',
    jmeno: 'Jana Nováková',
    telefon: '+420 601 234 567',
    email: 'jana@email.cz',
    pocetPorci: 2,
    poznamka: 'Přijdu přesně ve 14:30.',
    casVytvoreni: '2026-04-25T10:15:00',
    stav: 'potvrzena',
  },
  {
    id: 'rez2',
    nabidkaId: 'n2',
    jmeno: 'Martin Kovář',
    telefon: '+420 602 345 678',
    email: 'martin@email.cz',
    pocetPorci: 1,
    poznamka: '',
    casVytvoreni: '2026-04-25T11:00:00',
    stav: 'cekajici',
  },
  {
    id: 'rez3',
    nabidkaId: 'n1',
    jmeno: 'Petra Horáčková',
    telefon: '+420 603 456 789',
    email: 'petra@email.cz',
    pocetPorci: 1,
    poznamka: 'Bezlepková varianta možná?',
    casVytvoreni: '2026-04-25T11:30:00',
    stav: 'potvrzena',
  },
]

export function getNabidkaById(id: string): Nabidka | undefined {
  return nabidky.find((n) => n.id === id)
}

export function getRestauraceById(id: string): Restaurace | undefined {
  return restaurace.find((r) => r.id === id)
}

export function getNabidkyByRestauraceId(restauraceId: string): Nabidka[] {
  return nabidky.filter((n) => n.restauraceId === restauraceId)
}

export function getRezervaceByNabidkaId(nabidkaId: string): Rezervace[] {
  return rezervace.filter((r) => r.nabidkaId === nabidkaId)
}

export function getRezervaceByRestauraceId(restauraceId: string): Rezervace[] {
  const nabidkaIds = getNabidkyByRestauraceId(restauraceId).map((n) => n.id)
  return rezervace.filter((r) => nabidkaIds.includes(r.nabidkaId))
}

export function formatCena(cena: number): string {
  return `${cena} Kč`
}

export function getSlevaPercent(originalniCena: number, zvyhodnenaCena: number): number {
  return Math.round(((originalniCena - zvyhodnenaCena) / originalniCena) * 100)
}

export const kategorieLabels: Record<Nabidka['kategorie'], string> = {
  ceska: 'Česká kuchyně',
  italska: 'Italská kuchyně',
  asijska: 'Asijská kuchyně',
  bistro: 'Bistro',
  vegetarianska: 'Vegetariánská',
}

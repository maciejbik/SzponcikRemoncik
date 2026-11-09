export type RoomType = "salon" | "sypialnia" | "kuchnia" | "lazienka";
export type StyleId = "nowoczesny" | "skandynawski" | "industrialny" | "klasyczny";

export interface Palette {
  wall: string;
  wallAccent: string;
  floor: string;
  floorLine: string;
  furniture: string;
  furnitureDark: string;
  accent: string;
  metal: string;
  plant: boolean;
  brick?: boolean;
}

export interface InteriorStyle {
  id: StyleId;
  name: string;
  description: string;
  priceFactor: number;
  palette: Palette;
}

export const ROOMS: { id: RoomType; name: string }[] = [
  { id: "salon", name: "Salon" },
  { id: "sypialnia", name: "Sypialnia" },
  { id: "kuchnia", name: "Kuchnia" },
  { id: "lazienka", name: "Łazienka" },
];

export const STYLES: InteriorStyle[] = [
  {
    id: "nowoczesny",
    name: "Nowoczesny",
    description: "Grafit, ciepłe drewno i pomarańczowy akcent.",
    priceFactor: 1,
    palette: {
      wall: "#e6e2dc", wallAccent: "#2f2f31", floor: "#b48a5f", floorLine: "#9c7550",
      furniture: "#d9d3c9", furnitureDark: "#a9a195", accent: "#f26b1d", metal: "#1d1d1f", plant: true,
    },
  },
  {
    id: "skandynawski",
    name: "Skandynawski",
    description: "Jasne drewno, biel i szałwiowa zieleń.",
    priceFactor: 0.9,
    palette: {
      wall: "#f4f1ea", wallAccent: "#dfe6e1", floor: "#dcc6a4", floorLine: "#c9b08a",
      furniture: "#c3cec8", furnitureDark: "#9fb0a8", accent: "#6f9a87", metal: "#d9c2a0", plant: true,
    },
  },
  {
    id: "industrialny",
    name: "Industrialny",
    description: "Cegła, beton, skóra i czarna stal.",
    priceFactor: 1.1,
    palette: {
      wall: "#a35f45", wallAccent: "#6b6763", floor: "#5a5552", floorLine: "#4a4643",
      furniture: "#8b5a3c", furnitureDark: "#5e3b27", accent: "#e0a24a", metal: "#151515", plant: true, brick: true,
    },
  },
  {
    id: "klasyczny",
    name: "Klasyczny",
    description: "Beż, butelkowa zieleń i złote detale.",
    priceFactor: 1.3,
    palette: {
      wall: "#e9dcc6", wallAccent: "#c9b38f", floor: "#8a5b3c", floorLine: "#744a30",
      furniture: "#2f5547", furnitureDark: "#1f3a30", accent: "#c9a45c", metal: "#b8913f", plant: false,
    },
  },
];

export const BEFORE_PALETTE: Palette = {
  wall: "#9c978f", wallAccent: "#8a857d", floor: "#6f665c", floorLine: "#5f574e",
  furniture: "#7b7268", furnitureDark: "#5f574f", accent: "#8f8a80", metal: "#55504a", plant: false,
};

export interface EstimateItem {
  id: string;
  name: string;
  kind: "material" | "labour";
  unit: string;
  qty: number;
  unitPrice: number;
}

export function roomGeometry(area: number) {
  const perimeter = 4 * Math.sqrt(area);
  return { floor: area, walls: Math.round(perimeter * 2.6), perimeter: Math.round(perimeter) };
}

export function buildEstimate(room: RoomType, area: number, style: InteriorStyle): EstimateItem[] {
  const g = roomGeometry(area);
  const f = style.priceFactor;
  const wet = room === "kuchnia" || room === "lazienka";
  const items: EstimateItem[] = [
    { id: "demontaz", name: "Demontaż starych okładzin i wywóz gruzu", kind: "labour", unit: "m²", qty: g.floor, unitPrice: 25 },
    { id: "gladz", name: "Gładź gipsowa i grunt", kind: "material", unit: "m²", qty: g.walls, unitPrice: 9 },
    { id: "gladz-rob", name: "Szpachlowanie i szlifowanie ścian", kind: "labour", unit: "m²", qty: g.walls, unitPrice: 32 },
    { id: "farba", name: `Farba ścienna – paleta „${style.name}”`, kind: "material", unit: "m²", qty: g.walls, unitPrice: Math.round(7 * f) },
    { id: "malowanie", name: "Malowanie dwukrotne", kind: "labour", unit: "m²", qty: g.walls, unitPrice: 22 },
    wet
      ? { id: "podloga", name: "Płytki gresowe + klej i fuga", kind: "material", unit: "m²", qty: Math.ceil(g.floor * 1.1), unitPrice: Math.round(115 * f) }
      : { id: "podloga", name: "Panele / deska podłogowa + podkład", kind: "material", unit: "m²", qty: Math.ceil(g.floor * 1.08), unitPrice: Math.round(95 * f) },
    wet
      ? { id: "podloga-rob", name: "Układanie płytek", kind: "labour", unit: "m²", qty: g.floor, unitPrice: 130 }
      : { id: "podloga-rob", name: "Montaż podłogi i listew", kind: "labour", unit: "m²", qty: g.floor, unitPrice: 45 },
    { id: "listwy", name: "Listwy przypodłogowe", kind: "material", unit: "mb", qty: g.perimeter, unitPrice: Math.round(28 * f) },
    { id: "oswietlenie", name: "Oświetlenie (lampy, ściemniacze)", kind: "material", unit: "kpl", qty: 1, unitPrice: Math.round(900 * f) },
    { id: "elektryka", name: "Przeróbki elektryczne", kind: "labour", unit: "kpl", qty: 1, unitPrice: 1400 },
  ];
  if (room === "kuchnia") {
    items.push(
      { id: "zabudowa", name: "Zabudowa kuchenna z blatem", kind: "material", unit: "mb", qty: 4, unitPrice: Math.round(2600 * f) },
      { id: "zabudowa-rob", name: "Montaż zabudowy i AGD", kind: "labour", unit: "kpl", qty: 1, unitPrice: 2200 },
    );
  }
  if (room === "lazienka") {
    items.push(
      { id: "plytki-sciana", name: "Płytki ścienne", kind: "material", unit: "m²", qty: Math.round(g.walls * 0.7), unitPrice: Math.round(105 * f) },
      { id: "bialy", name: "Biały montaż (wanna, umywalka, WC, bateria)", kind: "material", unit: "kpl", qty: 1, unitPrice: Math.round(5200 * f) },
      { id: "hydraulika", name: "Hydraulika i montaż białego montażu", kind: "labour", unit: "kpl", qty: 1, unitPrice: 3400 },
    );
  }
  if (room === "sypialnia") {
    items.push({ id: "szafa", name: "Szafa wnękowa na wymiar", kind: "material", unit: "kpl", qty: 1, unitPrice: Math.round(4200 * f) });
  }
  if (room === "salon") {
    items.push({ id: "sciana-tv", name: "Ściana dekoracyjna / lamele", kind: "material", unit: "kpl", qty: 1, unitPrice: Math.round(2400 * f) });
  }
  return items;
}

export interface Contractor {
  id: string;
  name: string;
  owner: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  jobs: number;
  priceFactor: number;
  firstFreeInDays: number;
  specialties: RoomType[];
  verified: boolean;
  pro: boolean;
  quote: string;
}

export const CONTRACTORS: Contractor[] = [
  {
    id: "orli-team", name: "Orli Team Remonty", owner: "Tomasz Orłowski", city: "Kraków – Podgórze", distanceKm: 3.2,
    rating: 4.9, reviews: 214, jobs: 380, priceFactor: 1.08, firstFreeInDays: 6, specialties: ["lazienka", "kuchnia", "salon"],
    verified: true, pro: true, quote: "Terminowo, czysto i dokładnie według wizualizacji.",
  },
  {
    id: "mlotek", name: "Złoty Młotek", owner: "Paweł Nowak", city: "Kraków – Bronowice", distanceKm: 5.8,
    rating: 4.8, reviews: 156, jobs: 241, priceFactor: 0.97, firstFreeInDays: 11, specialties: ["salon", "sypialnia"],
    verified: true, pro: true, quote: "Świetny kontakt, kosztorys zgadzał się co do złotówki.",
  },
  {
    id: "fuga", name: "Fuga & Spółka", owner: "Anna Wiśniewska", city: "Wieliczka", distanceKm: 12.4,
    rating: 4.9, reviews: 98, jobs: 133, priceFactor: 1.15, firstFreeInDays: 18, specialties: ["lazienka", "kuchnia"],
    verified: true, pro: false, quote: "Najpiękniej położone płytki, jakie widziałam.",
  },
  {
    id: "budmax", name: "BudMax Ekspres", owner: "Krzysztof Zieliński", city: "Kraków – Nowa Huta", distanceKm: 9.1,
    rating: 4.5, reviews: 312, jobs: 560, priceFactor: 0.88, firstFreeInDays: 3, specialties: ["salon", "sypialnia", "kuchnia", "lazienka"],
    verified: true, pro: false, quote: "Szybko i tanio, drobne poprawki zrobione od ręki.",
  },
  {
    id: "wnetrze", name: "Wnętrze od A do Z", owner: "Marta Kowalczyk", city: "Kraków – Krowodrza", distanceKm: 4.4,
    rating: 4.7, reviews: 77, jobs: 102, priceFactor: 1.02, firstFreeInDays: 8, specialties: ["sypialnia", "salon", "kuchnia"],
    verified: true, pro: true, quote: "Pomogli dobrać materiały, efekt jak z wizualizacji.",
  },
  {
    id: "szybka", name: "Szybka Ekipa 24", owner: "Michał Lewandowski", city: "Skawina", distanceKm: 15.7,
    rating: 4.3, reviews: 64, jobs: 91, priceFactor: 0.84, firstFreeInDays: 2, specialties: ["salon", "sypialnia", "lazienka"],
    verified: false, pro: false, quote: "Dobra cena, trzeba było pilnować terminów.",
  },
];

export function busyDays(contractorId: string): Set<number> {
  let seed = [...contractorId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const busy = new Set<number>();
  for (let d = 0; d < 42; d++) {
    seed = (seed * 9301 + 49297) % 233280;
    if (seed / 233280 < 0.35) busy.add(d);
  }
  return busy;
}

export const pln = (v: number) =>
  new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(v);

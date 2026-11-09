import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, Clock, ImagePlus, MapPin, Printer, RefreshCw, Sparkles, Star, Trash2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import BeforeAfter from "../components/BeforeAfter";
import RoomIllustration from "../components/RoomIllustration";
import { Button, Chips, Eyebrow } from "../components/ui";
import {
  BEFORE_PALETTE, CONTRACTORS, ROOMS, STYLES, buildEstimate, busyDays, pln, roomGeometry,
  type Contractor, type RoomType, type StyleId,
} from "../data";

const STEP_NAMES = ["Zdjęcie", "Wizualizacja", "Kosztorys", "Ekipa", "Rezerwacja"];

type Booking = { date: Date; slot: string; name: string; phone: string; email: string; notes: string };

export default function Prototype() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [room, setRoom] = useState<RoomType>("salon");
  const [styleId, setStyleId] = useState<StyleId>("nowoczesny");
  const [area, setArea] = useState(18);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [contractorId, setContractorId] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const style = STYLES.find((s) => s.id === styleId)!;
  const items = useMemo(() => buildEstimate(room, area, style), [room, area, style]);
  const active = items.filter((i) => !excluded.has(i.id));
  const materials = active.filter((i) => i.kind === "material").reduce((a, i) => a + i.qty * i.unitPrice, 0);
  const labour = active.filter((i) => i.kind === "labour").reduce((a, i) => a + i.qty * i.unitPrice, 0);
  const contractor = CONTRACTORS.find((c) => c.id === contractorId) ?? null;

  useEffect(() => {
    setExcluded(new Set());
  }, [room]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, booking]);

  const canNext = step !== 3 || contractor !== null;

  const reset = () => {
    setStep(0);
    setPhoto(null);
    setContractorId(null);
    setBooking(null);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pt-28 pb-24 sm:px-8">
        {booking && contractor ? (
          <Done booking={booking} contractor={contractor} total={materials + labour * contractor.priceFactor} room={room} styleName={style.name} onReset={reset} />
        ) : (
          <>
            <Stepper step={step} onGo={(s) => s < step && setStep(s)} />

            <div className="mt-10">
              {step === 0 && (
                <StepPhoto
                  photo={photo} setPhoto={setPhoto} room={room} setRoom={setRoom}
                  styleId={styleId} setStyleId={setStyleId} area={area} setArea={setArea}
                />
              )}
              {step === 1 && <StepVisual photo={photo} room={room} styleId={styleId} setStyleId={setStyleId} />}
              {step === 2 && (
                <StepEstimate
                  items={items} excluded={excluded} setExcluded={setExcluded}
                  materials={materials} labour={labour} area={area} room={room} styleName={style.name}
                />
              )}
              {step === 3 && <StepTeams room={room} labour={labour} materials={materials} selected={contractorId} onSelect={setContractorId} />}
              {step === 4 && contractor && (
                <StepBooking
                  contractor={contractor} total={materials + labour * contractor.priceFactor}
                  room={room} styleName={style.name} onBack={() => setStep(3)} onConfirm={setBooking}
                />
              )}
            </div>

            {step < 4 && (
              <div className="mt-12 flex items-center justify-between border-t border-line pt-8">
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="size-4" /> Wstecz
                  </Button>
                ) : (
                  <Button variant="ghost" to="/">
                    <ArrowLeft className="size-4" /> Strona główna
                  </Button>
                )}
                <Button onClick={() => setStep(step + 1)} disabled={!canNext}>
                  {step === 3 && !contractor ? "Wybierz ekipę" : `Dalej: ${STEP_NAMES[step + 1]}`} <ArrowRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

function Stepper({ step, onGo }: { step: number; onGo: (s: number) => void }) {
  return (
    <ol className="grid grid-cols-5 gap-2 sm:gap-4">
      {STEP_NAMES.map((name, i) => {
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li key={name}>
            <button onClick={() => onGo(i)} className={`w-full text-left ${state === "done" ? "cursor-pointer" : "cursor-default"}`}>
              <div className={`h-1.5 rounded-full transition-colors ${state === "todo" ? "bg-line" : "bg-orange"}`} />
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-black ${
                    state === "todo" ? "bg-card2 text-muted" : "bg-orange text-bg"
                  }`}
                >
                  {state === "done" ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className={`hidden text-xs font-extrabold tracking-wider uppercase sm:block ${state === "todo" ? "text-muted" : "text-cream"}`}>
                  {name}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StepTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mb-8">
      <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
      <h1 className="heading text-3xl sm:text-5xl">{title}</h1>
      {text && <p className="mt-4 max-w-2xl text-lg">{text}</p>}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-xs font-extrabold tracking-[0.18em] text-muted uppercase">{children}</p>;
}

/* ---------- Krok 1: zdjęcie ---------- */

function StepPhoto(props: {
  photo: string | null; setPhoto: (p: string | null) => void;
  room: RoomType; setRoom: (r: RoomType) => void;
  styleId: StyleId; setStyleId: (s: StyleId) => void;
  area: number; setArea: (a: number) => void;
}) {
  const { photo, setPhoto, room, setRoom, styleId, setStyleId, area, setArea } = props;
  const [drag, setDrag] = useState(false);

  const load = (file?: File) => {
    if (file && file.type.startsWith("image/")) setPhoto(URL.createObjectURL(file));
  };

  return (
    <div>
      <StepTitle eyebrow="Krok 1" title="Pokaż nam swoje wnętrze" text="Wgraj zdjęcie pokoju, wybierz styl i podaj metraż. Resztą zajmie się AI." />
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {photo ? (
            <div className="relative overflow-hidden rounded-2xl border border-line">
              <img src={photo} alt="Twoje zdjęcie" className="aspect-[8/5] w-full object-cover" />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-bg/85 px-4 py-2 text-xs font-bold text-cream uppercase backdrop-blur hover:text-orange"
              >
                <Trash2 className="size-4" /> Usuń
              </button>
            </div>
          ) : (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                load(e.dataTransfer.files[0]);
              }}
              className={`flex aspect-[8/5] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition ${
                drag ? "border-orange bg-orange-dark/40" : "border-line bg-card hover:border-orange"
              }`}
            >
              <span className="grid size-16 place-items-center rounded-2xl bg-orange-dark text-orange">
                <ImagePlus className="size-7" />
              </span>
              <span className="text-lg font-black text-cream uppercase">Przeciągnij zdjęcie lub kliknij</span>
              <span className="text-sm text-muted">JPG lub PNG · bez zdjęcia użyjemy przykładowego wnętrza</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => load(e.target.files?.[0])} />
            </label>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <Label>Pomieszczenie</Label>
            <Chips options={ROOMS} value={room} onChange={setRoom} />
          </div>
          <div>
            <Label>Styl wnętrza</Label>
            <div className="grid grid-cols-2 gap-3">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyleId(s.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    styleId === s.id ? "border-orange bg-orange-dark/50" : "border-line bg-card hover:border-orange/60"
                  }`}
                >
                  <div className="flex gap-1.5">
                    {[s.palette.wall, s.palette.floor, s.palette.furniture, s.palette.accent].map((c, i) => (
                      <span key={i} className="size-5 rounded-full border border-black/30" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="mt-3 font-black text-cream uppercase">{s.name}</p>
                  <p className="mt-1 text-xs text-muted">{s.description}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-end justify-between">
              <Label>Powierzchnia podłogi</Label>
              <p className="mb-3 text-2xl font-black text-cream">{area} m²</p>
            </div>
            <input
              type="range" min={4} max={60} value={area} onChange={(e) => setArea(Number(e.target.value))}
              className="w-full accent-orange"
            />
            <p className="mt-2 text-xs text-muted">Ściany ok. {roomGeometry(area).walls} m² · obwód ok. {roomGeometry(area).perimeter} m</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Krok 2: wizualizacja ---------- */

const GEN_MESSAGES = ["Analiza zdjęcia…", "Rozpoznawanie przestrzeni 3D…", "Dobór materiałów i kolorów…", "Renderowanie wizualizacji…"];

function StepVisual({ photo, room, styleId, setStyleId }: { photo: string | null; room: RoomType; styleId: StyleId; setStyleId: (s: StyleId) => void }) {
  const [progress, setProgress] = useState(0);
  const [seed, setSeed] = useState(0);
  const style = STYLES.find((s) => s.id === styleId)!;

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / 2200) * 100);
      setProgress(p);
      if (p >= 100) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [styleId, seed]);

  const generating = progress < 100;
  const before = photo ? (
    <img src={photo} alt="Przed" className="h-full w-full object-cover" />
  ) : (
    <RoomIllustration room={room} palette={BEFORE_PALETTE} before />
  );

  return (
    <div>
      <StepTitle eyebrow="Krok 2" title="Twoja wizualizacja AI" text="Przesuń suwak, aby porównać stan obecny z projektem. Zmień styl, a AI wygeneruje nową wersję." />
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative">
          {generating ? (
            <div className="relative flex aspect-[8/5] flex-col items-center justify-center overflow-hidden rounded-2xl border border-line bg-card">
              <div className="absolute inset-0 opacity-25 blur-md">{before}</div>
              <div className="relative flex flex-col items-center px-6 text-center">
                <Sparkles className="size-10 animate-pulse text-orange" />
                <p className="mt-5 text-xl font-black text-cream uppercase">{GEN_MESSAGES[Math.min(3, Math.floor(progress / 25))]}</p>
                <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-orange transition-[width]" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-3 text-sm text-muted">{Math.round(progress)}%</p>
              </div>
            </div>
          ) : (
            <BeforeAfter className="aspect-[8/5] w-full" before={before} after={<RoomIllustration room={room} palette={style.palette} />} />
          )}
        </div>

        <div className="card p-7">
          <Label>Styl</Label>
          <Chips options={STYLES} value={styleId} onChange={setStyleId} />
          <div className="mt-8">
            <Label>Paleta projektu</Label>
            <div className="grid grid-cols-4 gap-3">
              {[
                ["Ściany", style.palette.wall],
                ["Podłoga", style.palette.floor],
                ["Meble", style.palette.furniture],
                ["Akcent", style.palette.accent],
              ].map(([n, c]) => (
                <div key={n}>
                  <div className="aspect-square rounded-xl border border-black/30" style={{ background: c }} />
                  <p className="mt-2 text-[11px] font-bold tracking-wider text-muted uppercase">{n}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-8 text-sm leading-relaxed">{style.description} Wizualizacja uwzględnia układ pomieszczenia i światło z okna.</p>
          <Button variant="ghost" className="mt-6 w-full" onClick={() => setSeed((s) => s + 1)} disabled={generating}>
            <RefreshCw className="size-4" /> Wygeneruj ponownie
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Krok 3: kosztorys ---------- */

function StepEstimate(props: {
  items: ReturnType<typeof buildEstimate>; excluded: Set<string>; setExcluded: (s: Set<string>) => void;
  materials: number; labour: number; area: number; room: RoomType; styleName: string;
}) {
  const { items, excluded, setExcluded, materials, labour, area, room, styleName } = props;
  const total = materials + labour;
  const days = Math.max(3, Math.ceil(labour / 1600));
  const toggle = (id: string) => {
    const next = new Set(excluded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExcluded(next);
  };

  const groups: { kind: "material" | "labour"; title: string }[] = [
    { kind: "material", title: "Materiały" },
    { kind: "labour", title: "Robocizna" },
  ];

  return (
    <div>
      <StepTitle
        eyebrow="Krok 3"
        title="Kosztorys remontu"
        text={`${ROOMS.find((r) => r.id === room)!.name}, ${area} m², styl ${styleName.toLowerCase()}. Odznacz pozycje, których nie potrzebujesz.`}
      />
      <div className="grid items-start gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.kind} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <h3 className="font-black text-cream uppercase">{g.title}</h3>
                <span className="text-sm font-bold text-orange">{pln(g.kind === "material" ? materials : labour)}</span>
              </div>
              <ul>
                {items.filter((i) => i.kind === g.kind).map((i) => {
                  const off = excluded.has(i.id);
                  return (
                    <li key={i.id} className="border-b border-line/60 last:border-0">
                      <label className={`flex cursor-pointer items-center gap-4 px-6 py-4 transition hover:bg-card2 ${off ? "opacity-40" : ""}`}>
                        <input type="checkbox" checked={!off} onChange={() => toggle(i.id)} className="size-4 accent-orange" />
                        <span className="flex-1">
                          <span className="block font-semibold text-cream">{i.name}</span>
                          <span className="text-xs text-muted">
                            {i.qty} {i.unit} × {pln(i.unitPrice)}
                          </span>
                        </span>
                        <span className={`font-bold text-cream tabular-nums ${off ? "line-through" : ""}`}>{pln(i.qty * i.unitPrice)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <aside className="card sticky top-24 p-7">
          <Label>Podsumowanie</Label>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt>Materiały</dt><dd className="font-bold text-cream">{pln(materials)}</dd></div>
            <div className="flex justify-between"><dt>Robocizna (stawka średnia)</dt><dd className="font-bold text-cream">{pln(labour)}</dd></div>
          </dl>
          <div className="my-6 border-t border-line" />
          <p className="text-xs font-extrabold tracking-[0.18em] text-muted uppercase">Razem</p>
          <p className="mt-1 text-5xl font-black text-orange">{pln(total)}</p>
          <p className="mt-2 text-sm text-muted">Widełki: {pln(total * 0.92)} – {pln(total * 1.08)}</p>
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-card2 p-4 text-sm">
            <Clock className="size-5 shrink-0 text-orange" /> Szacowany czas prac: <b className="text-cream">{days} dni roboczych</b>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Ceny materiałów pochodzą z cenników hurtowni partnerskich. Koszt robocizny zależy od wybranej ekipy.
          </p>
          <Button variant="ghost" className="mt-6 w-full" onClick={() => window.print()}>
            <Printer className="size-4" /> Drukuj / zapisz PDF
          </Button>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Krok 4: ekipy ---------- */

type Sort = "polecane" | "cena" | "ocena" | "termin";
const SORTS: { id: Sort; name: string }[] = [
  { id: "polecane", name: "Polecane" },
  { id: "cena", name: "Najtańsze" },
  { id: "ocena", name: "Najlepiej oceniane" },
  { id: "termin", name: "Najszybszy termin" },
];

function dateIn(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}
const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }) => d.toLocaleDateString("pl-PL", opts);

function StepTeams({ room, labour, materials, selected, onSelect }: { room: RoomType; labour: number; materials: number; selected: string | null; onSelect: (id: string) => void }) {
  const [sort, setSort] = useState<Sort>("polecane");
  const score = (c: Contractor) =>
    c.rating * 30 - c.priceFactor * 15 - c.firstFreeInDays * 0.5 + (c.specialties.includes(room) ? 6 : 0) + (c.pro ? 3 : 0) + (c.verified ? 5 : 0);
  const list = [...CONTRACTORS].sort((a, b) => {
    if (sort === "cena") return a.priceFactor - b.priceFactor;
    if (sort === "ocena") return b.rating - a.rating || b.reviews - a.reviews;
    if (sort === "termin") return a.firstFreeInDays - b.firstFreeInDays;
    return score(b) - score(a);
  });
  const roomName = ROOMS.find((r) => r.id === room)!.name;

  return (
    <div>
      <StepTitle eyebrow="Krok 4" title="Wybierz sprawdzoną ekipę" text="Ranking lokalnych wykonawców dopasowany do Twojego remontu. Cena obejmuje robociznę wybranej ekipy i materiały." />
      <div className="mb-6">
        <Chips options={SORTS} value={sort} onChange={setSort} />
      </div>
      <div className="grid gap-4">
        {list.map((c, idx) => {
          const isSel = selected === c.id;
          const price = materials + labour * c.priceFactor;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`grid items-center gap-5 rounded-2xl border p-5 text-left transition sm:p-6 md:grid-cols-[auto_1fr_auto] ${
                isSel ? "border-orange bg-orange-dark/50" : "border-line bg-card hover:border-orange/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-center text-lg font-black text-muted">{idx + 1}</span>
                <div className="grid size-14 place-items-center rounded-full bg-card2 text-lg font-black text-orange">
                  {c.name.split(" ").filter((w) => /^\p{Lu}/u.test(w)).slice(0, 2).map((w) => w[0]).join("")}
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-cream uppercase">{c.name}</h3>
                  {c.verified && <BadgeCheck className="size-5 text-orange" aria-label="Zweryfikowana" />}
                  {c.pro && <span className="rounded-full bg-orange px-2 py-0.5 text-[10px] font-black text-bg">PRO</span>}
                  {c.specialties.includes(room) && (
                    <span className="rounded-full border border-amber/50 px-2 py-0.5 text-[10px] font-bold text-amber uppercase">Specjalista: {roomName}</span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 fill-orange text-orange" /> <b className="text-cream">{c.rating.toFixed(1)}</b> ({c.reviews} opinii)
                  </span>
                  <span className="flex items-center gap-1.5"><MapPin className="size-4 text-muted" /> {c.city} · {c.distanceKm} km</span>
                  <span className="flex items-center gap-1.5"><Clock className="size-4 text-muted" /> wolny od {fmtDate(dateIn(c.firstFreeInDays))}</span>
                </div>
                <p className="mt-2 text-sm text-muted italic">„{c.quote}”</p>
              </div>
              <div className="flex items-center justify-between gap-6 md:flex-col md:items-end">
                <div className="md:text-right">
                  <p className="text-xs tracking-wider text-muted uppercase">Całość</p>
                  <p className="text-2xl font-black text-cream">{pln(price)}</p>
                </div>
                <span
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold uppercase ${
                    isSel ? "bg-orange text-bg" : "border border-line text-cream"
                  }`}
                >
                  {isSel ? <><Check className="size-4" /> Wybrana</> : "Wybierz"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Krok 5: rezerwacja ---------- */

const WEEKDAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
const SLOTS = ["8:00", "12:00"];

function StepBooking({ contractor, total, room, styleName, onBack, onConfirm }: {
  contractor: Contractor; total: number; room: RoomType; styleName: string; onBack: () => void; onConfirm: (b: Booking) => void;
}) {
  const busy = useMemo(() => busyDays(contractor.id), [contractor.id]);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });

  const today = dateIn(0);
  const offset = (today.getDay() + 6) % 7;
  const cells = Array.from({ length: 35 }, (_, i) => i - offset);
  const valid = date && form.name.trim().length > 2 && /^[+\d\s-]{9,}$/.test(form.phone) && /\S+@\S+\.\S+/.test(form.email);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (valid) onConfirm({ date: date!, slot, ...form });
  };

  const input = "w-full rounded-xl border border-line bg-card2 px-4 py-3 text-cream placeholder:text-muted focus:border-orange focus:outline-none";

  return (
    <form onSubmit={submit}>
      <StepTitle eyebrow="Krok 5" title="Zarezerwuj termin" text={`Wybierz dzień rozpoczęcia prac z ekipą ${contractor.name}.`} />
      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <Label>Kalendarz dostępności</Label>
              <span className="mb-3 flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-card2 ring-1 ring-line" /> wolny</span>
                <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-line/40" /> zajęty</span>
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {WEEKDAYS.map((d) => (
                <span key={d} className="pb-2 text-[11px] font-extrabold tracking-wider text-muted uppercase">{d}</span>
              ))}
              {cells.map((n) => {
                const d = dateIn(n);
                const disabled = n < contractor.firstFreeInDays || busy.has(n) || d.getDay() === 0;
                const sel = date?.getTime() === d.getTime();
                return (
                  <button
                    type="button"
                    key={n}
                    disabled={disabled}
                    onClick={() => setDate(d)}
                    className={`h-12 rounded-xl text-sm leading-tight font-bold transition sm:h-14 ${
                      n < 0 ? "invisible" : sel ? "bg-orange text-bg" : disabled ? "bg-line/20 text-muted/40 line-through" : "bg-card2 text-cream ring-1 ring-line hover:ring-orange"
                    }`}
                  >
                    {d.getDate()}
                    {d.getDate() === 1 && <span className="block text-[9px] font-semibold uppercase">{fmtDate(d, { month: "short" })}</span>}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm">Godzina rozpoczęcia:</span>
              {SLOTS.map((s) => (
                <button
                  type="button" key={s} onClick={() => setSlot(s)}
                  className={`rounded-full border px-4 py-2 text-xs font-extrabold ${slot === s ? "border-orange bg-orange text-bg" : "border-line text-cream"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card grid gap-4 p-6 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label>Twoje dane</Label></div>
            <input className={input} placeholder="Imię i nazwisko" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={input} placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className={`${input} sm:col-span-2`} placeholder="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea
              className={`${input} min-h-24 sm:col-span-2`} placeholder="Uwagi dla ekipy (opcjonalnie)"
              value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <aside className="card sticky top-24 p-7">
          <Label>Rezerwacja</Label>
          <p className="text-xl font-black text-cream uppercase">{contractor.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm"><Star className="size-4 fill-orange text-orange" /> {contractor.rating.toFixed(1)} · {contractor.city}</p>
          <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
            <div className="flex justify-between"><dt>Pomieszczenie</dt><dd className="font-bold text-cream">{ROOMS.find((r) => r.id === room)!.name}</dd></div>
            <div className="flex justify-between"><dt>Styl</dt><dd className="font-bold text-cream">{styleName}</dd></div>
            <div className="flex justify-between">
              <dt>Start prac</dt>
              <dd className="font-bold text-cream">{date ? `${fmtDate(date, { weekday: "short", day: "numeric", month: "long" })}, ${slot}` : "—"}</dd>
            </div>
          </dl>
          <div className="my-6 border-t border-line" />
          <p className="text-xs font-extrabold tracking-[0.18em] text-muted uppercase">Koszt całkowity</p>
          <p className="mt-1 text-4xl font-black text-orange">{pln(total)}</p>
          <p className="mt-2 text-xs text-muted">Płatność po odbiorze prac. Zaliczka 0 zł.</p>
          <Button type="submit" className="mt-7 w-full" disabled={!valid}>
            Potwierdź rezerwację <Check className="size-4" />
          </Button>
          {!valid && <p className="mt-3 text-center text-xs text-muted">Wybierz termin i uzupełnij dane kontaktowe.</p>}
          <button type="button" onClick={onBack} className="mt-4 w-full text-center text-xs font-bold tracking-wider text-muted uppercase hover:text-orange">
            ← Zmień ekipę
          </button>
        </aside>
      </div>
    </form>
  );
}

/* ---------- Potwierdzenie ---------- */

function Done({ booking, contractor, total, room, styleName, onReset }: {
  booking: Booking; contractor: Contractor; total: number; room: RoomType; styleName: string; onReset: () => void;
}) {
  const number = useMemo(() => `SR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, []);
  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <div className="mx-auto grid size-24 place-items-center rounded-full bg-orange text-bg shadow-[0_0_80px_-10px_rgb(242_107_29/0.8)]">
        <Check className="size-12" strokeWidth={3} />
      </div>
      <Eyebrow className="mt-10 justify-center">Gotowe</Eyebrow>
      <h1 className="heading mt-4 text-4xl sm:text-6xl">Rezerwacja potwierdzona</h1>
      <p className="mt-5 text-lg">
        Dziękujemy, {booking.name.split(" ")[0]}! Ekipa <b className="text-cream">{contractor.name}</b> potwierdzi termin w ciągu 2 godzin. Szczegóły wysłaliśmy na{" "}
        <b className="text-cream">{booking.email}</b>.
      </p>
      <div className="card mt-10 p-7 text-left">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          {[
            ["Numer rezerwacji", number],
            ["Start prac", `${fmtDate(booking.date, { weekday: "long", day: "numeric", month: "long" })}, ${booking.slot}`],
            ["Pomieszczenie", `${ROOMS.find((r) => r.id === room)!.name} · ${styleName}`],
            ["Koszt całkowity", pln(total)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-extrabold tracking-[0.16em] text-muted uppercase">{k}</dt>
              <dd className="mt-1 text-lg font-black text-cream">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button onClick={onReset}>Zaplanuj kolejny remont</Button>
        <Button variant="ghost" to="/">Strona główna</Button>
      </div>
    </div>
  );
}

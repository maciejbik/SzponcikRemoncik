import { useState } from "react";
import {
  ArrowRight, BadgeCheck, Calculator, CalendarCheck, Camera, Check, Hammer, Home, Sparkles, Star, Store, Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BeforeAfter from "../components/BeforeAfter";
import RoomIllustration from "../components/RoomIllustration";
import { Button, Chips, Eyebrow, Logo, Reveal } from "../components/ui";
import { BEFORE_PALETTE, ROOMS, STYLES, type RoomType, type StyleId } from "../data";

const STEPS = [
  { icon: Camera, title: "Zrób zdjęcie", text: "Wgraj zdjęcie pokoju i wybierz styl, który Ci się podoba." },
  { icon: Sparkles, title: "Wizualizacja AI", text: "W kilka sekund widzisz fotorealistyczny efekt remontu." },
  { icon: Calculator, title: "Kosztorys", text: "Materiały i robocizna wyliczone z aktualnych cen hurtowni." },
  { icon: CalendarCheck, title: "Rezerwacja", text: "Porównaj sprawdzone ekipy i zarezerwuj termin jednym kliknięciem." },
];

const AUDIENCE = [
  {
    icon: Home, title: "Klient", lead: "Widzisz efekt, zanim wydasz złotówkę.",
    points: ["Wizualizacja Twojego wnętrza", "Kosztorys w minutę zamiast tygodni", "Oceny i opinie ekip"],
  },
  {
    icon: Hammer, title: "Fachowiec", lead: "Gotowe zlecenia z budżetem i zakresem prac.",
    points: ["Mniej czasu na wyceny", "Kalendarz zleceń w jednym miejscu", "Płacisz za realne wyniki"],
  },
  {
    icon: Store, title: "Hurtownia", lead: "Zamówienia prosto z kosztorysu AI.",
    points: ["Nowy kanał sprzedaży", "Lista materiałów gotowa do koszyka", "Promocje dla klientów platformy"],
  },
];

const PLANS = [
  { name: "Klient Free", price: "0 zł", period: "", features: ["1 wizualizacja AI", "Pełny kosztorys", "Rezerwacja ekipy"], cta: "Zacznij za darmo" },
  { name: "Klient Premium", price: "29 zł", period: "/ pakiet", features: ["10 wizualizacji AI", "Warianty aranżacji", "Lista zakupów PDF"], cta: "Wybierz Premium" },
  { name: "Fachowiec Basic", price: "99 zł", period: "/ mies.", features: ["Profil w rankingu", "Kalendarz zleceń", "Prowizja 8% od zlecenia"], cta: "Dołącz teraz" },
  { name: "Fachowiec Pro", price: "249 zł", period: "/ mies.", features: ["Wyróżnienie w rankingu", "Prowizja obniżona do 5%", "Opiekun konta"], cta: "Wybierz Pro", featured: true },
];

const TEAM = [
  { name: "Kamil Buszta", role: "Project Manager", text: "Zarządzanie projektem, model biznesowy." },
  { name: "Piotr Bosek", role: "Frontend Developer", text: "Wygląd i prezentacja aplikacji." },
  { name: "Maciej Bik", role: "Backend Developer", text: "Architektura aplikacji oraz system rezerwacji." },
  { name: "Arkadiusz Cios", role: "AI Specialist", text: "Silnik AI, modele generowania wnętrz i wyceny." },
];

const MARQUEE = ["Wizualizacja AI", "Kosztorys w 60 sekund", "Sprawdzone ekipy", "Rezerwacja online", "Ceny z hurtowni"];

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <Demo />
        <Audience />
        <Pricing />
        <Team />
        <Cta />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:min-h-screen lg:pb-0">
      <div className="pointer-events-none absolute top-1/3 right-[-10%] size-[720px] rounded-full bg-orange/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.05fr_1fr]">
        <div className="relative z-10">
          <Eyebrow className="mb-6">Remonty przyszłości</Eyebrow>
          <h1 className="heading text-[clamp(3.2rem,9vw,7.5rem)]">
            Szponcik
            <br />
            Remoncik
          </h1>
          <p className="mt-4 flex items-center gap-3 pl-1 text-lg font-black tracking-wide text-cream uppercase sm:text-2xl">
            <span className="size-2 rounded-full bg-orange" /> AI
          </p>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-txt sm:text-lg">
            Zrób zdjęcie pokoju, zobacz wizualizację nowego wnętrza, poznaj koszt remontu i zarezerwuj sprawdzoną ekipę –
            wszystko w jednej aplikacji.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button to="/app">
              Zaprojektuj swój remont <ArrowRight className="size-4" />
            </Button>
            <Button variant="ghost" onClick={() => document.getElementById("jak-to-dziala")?.scrollIntoView({ behavior: "smooth" })}>
              Jak to działa
            </Button>
          </div>
          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8">
            {[
              ["60 s", "do kosztorysu"],
              ["4.8★", "średnia ekip"],
              ["100%", "online"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-2xl font-black text-cream sm:text-3xl">{v}</dt>
                <dd className="mt-1 text-xs tracking-wider text-muted uppercase">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative lg:-mr-24">
          <Logo className="logo-glow animate-float relative mx-auto w-full max-w-[640px] lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE];
  return (
    <div className="-rotate-1 overflow-hidden border-y border-orange bg-orange py-4">
      <div className="animate-marquee flex w-max gap-10">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-lg font-black whitespace-nowrap text-bg uppercase">
            {t} <span className="size-2 rounded-full bg-bg" />
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <Reveal className="mb-14 max-w-3xl">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2 className="heading text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
      {text && <p className="mt-5 text-lg text-txt">{text}</p>}
    </Reveal>
  );
}

function HowItWorks() {
  return (
    <section id="jak-to-dziala" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28 sm:px-8">
      <SectionHead eyebrow="Jak to działa" title="Od zdjęcia do ekipy w 4 krokach" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 90}>
            <div className="card group h-full p-7 transition hover:-translate-y-1 hover:border-orange">
              <div className="flex items-start justify-between">
                <div className="grid size-14 place-items-center rounded-2xl bg-orange-dark text-orange transition group-hover:bg-orange group-hover:text-bg">
                  <s.icon className="size-6" />
                </div>
                <span className="text-5xl font-black text-line transition group-hover:text-orange/40">0{i + 1}</span>
              </div>
              <h3 className="mt-8 text-xl font-black text-cream uppercase">{s.title}</h3>
              <p className="mt-3 leading-relaxed">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Demo() {
  const [room, setRoom] = useState<RoomType>("salon");
  const [styleId, setStyleId] = useState<StyleId>("nowoczesny");
  const style = STYLES.find((s) => s.id === styleId)!;
  return (
    <section id="demo" className="scroll-mt-20 border-y border-line bg-card/40">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-28 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHead
            eyebrow="Demo wizualizacji"
            title="Przesuń i zobacz różnicę"
            text="Wybierz pomieszczenie i styl – AI pokaże, jak będzie wyglądać Twoje wnętrze po remoncie."
          />
          <p className="mb-3 text-xs font-extrabold tracking-[0.18em] text-muted uppercase">Pomieszczenie</p>
          <Chips options={ROOMS} value={room} onChange={setRoom} />
          <p className="mt-7 mb-3 text-xs font-extrabold tracking-[0.18em] text-muted uppercase">Styl</p>
          <Chips options={STYLES} value={styleId} onChange={setStyleId} />
          <p className="mt-6 text-sm text-muted">{style.description}</p>
        </div>
        <Reveal>
          <BeforeAfter
            className="aspect-[8/5] w-full"
            before={<RoomIllustration room={room} palette={BEFORE_PALETTE} before />}
            after={<RoomIllustration room={room} palette={style.palette} />}
          />
        </Reveal>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section id="dla-kogo" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28 sm:px-8">
      <SectionHead eyebrow="Dla kogo" title="Jedna platforma – trzy strony zyskują" />
      <div className="grid gap-5 lg:grid-cols-3">
        {AUDIENCE.map((a, i) => (
          <Reveal key={a.title} delay={i * 100}>
            <div className={`card h-full p-8 ${i === 1 ? "border-orange/60 bg-orange-dark/40" : ""}`}>
              <a.icon className="size-9 text-orange" />
              <h3 className="mt-6 text-2xl font-black text-cream uppercase">{a.title}</h3>
              <p className="mt-2 font-semibold text-amber">{a.lead}</p>
              <ul className="mt-6 space-y-3">
                {a.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-orange" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="cennik" className="scroll-mt-20 border-y border-line bg-card/40">
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
        <SectionHead eyebrow="Cennik" title="Prosto i uczciwie" text="Klient zaczyna za darmo. Fachowcy płacą za widoczność i realne zlecenia." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                  p.featured ? "border-orange bg-orange text-bg" : "border-line bg-card"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-cream px-3 py-1 text-[10px] font-black tracking-widest text-bg uppercase">
                    Najczęściej wybierany
                  </span>
                )}
                <p className={`text-xs font-extrabold tracking-[0.18em] uppercase ${p.featured ? "text-bg/70" : "text-orange"}`}>{p.name}</p>
                <p className={`mt-4 text-4xl font-black ${p.featured ? "text-bg" : "text-cream"}`}>
                  {p.price} <span className={`text-sm font-semibold ${p.featured ? "text-bg/70" : "text-muted"}`}>{p.period}</span>
                </p>
                <ul className="mt-6 mb-8 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check className={`size-4 shrink-0 ${p.featured ? "text-bg" : "text-orange"}`} />
                      <span className={p.featured ? "font-semibold text-bg" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  to="/app"
                  variant={p.featured ? "ghost" : "primary"}
                  className={p.featured ? "border-bg !text-bg hover:bg-bg hover:!text-orange" : ""}
                >
                  {p.cta}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="zespol" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-28 sm:px-8">
      <SectionHead eyebrow="Ludzie za projektem" title="Zespół" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((t, i) => (
          <Reveal key={t.name} delay={i * 80}>
            <div className="card h-full p-7 text-center">
              <div className="mx-auto grid size-24 place-items-center rounded-full border-2 border-orange bg-orange-dark text-2xl font-black text-orange">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-6 text-lg font-black text-cream uppercase">{t.name}</h3>
              <p className="mt-1 text-xs font-extrabold tracking-[0.16em] text-orange uppercase">{t.role}</p>
              <p className="mt-4 text-sm">{t.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-card2 p-10 sm:p-16">
          <div className="pointer-events-none absolute -right-20 -bottom-24 size-96 rounded-full bg-orange/20 blur-3xl" />
          <Logo className="logo-glow absolute -right-6 -bottom-10 hidden w-80 opacity-90 md:block" />
          <div className="relative max-w-xl">
            <Eyebrow className="mb-4">Zacznij teraz</Eyebrow>
            <h2 className="heading text-4xl sm:text-5xl">Twój remont zaczyna się od zdjęcia</h2>
            <p className="mt-5 text-lg">Bez zobowiązań. Pierwsza wizualizacja i kosztorys za darmo.</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button to="/app">
                Wypróbuj demo <ArrowRight className="size-4" />
              </Button>
              <span className="flex items-center gap-2 text-sm text-muted">
                <BadgeCheck className="size-5 text-orange" /> Zweryfikowane ekipy
                <Star className="ml-3 size-5 text-orange" /> 4.8 / 5
                <Users className="ml-3 size-5 text-orange" /> 1 200+ fachowców
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

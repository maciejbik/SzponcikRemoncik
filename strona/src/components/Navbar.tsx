import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button, Logo } from "./ui";

const LINKS = [
  { id: "jak-to-dziala", label: "Jak to działa" },
  { id: "demo", label: "Demo" },
  { id: "dla-kogo", label: "Dla kogo" },
  { id: "cennik", label: "Cennik" },
  { id: "zespol", label: "Zespół" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (pathname !== "/") {
      navigate("/");
      setTimeout(scroll, 80);
    } else scroll();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-line/70 bg-bg/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-10 w-auto" />
          <span className="text-sm leading-none font-black tracking-tight text-cream uppercase">
            Szponcik
            <br />
            Remoncik
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="text-xs font-bold tracking-[0.14em] text-txt uppercase transition hover:text-orange"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button to="/app" className="px-5 py-3 text-xs">
            Wypróbuj demo
          </Button>
        </div>

        <button className="text-cream lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 px-5 pb-6 lg:hidden">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goTo(l.id)}
              className="py-3 text-left text-sm font-bold tracking-widest text-cream uppercase"
            >
              {l.label}
            </button>
          ))}
          <Button to="/app" className="mt-3">
            Wypróbuj demo
          </Button>
        </div>
      )}
    </header>
  );
}

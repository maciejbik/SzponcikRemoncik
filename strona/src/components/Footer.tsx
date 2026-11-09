import { Logo } from "./ui";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-3">
          <Logo className="h-12 w-auto" />
          <div>
            <p className="text-sm font-black tracking-tight text-cream uppercase">Szponcik Remoncik AI</p>
            <p className="text-xs text-muted">Remonty przyszłości · projekt studencki</p>
          </div>
        </div>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Szponcik Remoncik. Prototyp – dane przykładowe.</p>
      </div>
    </footer>
  );
}

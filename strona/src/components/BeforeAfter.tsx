import { useState, type ReactNode } from "react";
import { MoveHorizontal } from "lucide-react";

export default function BeforeAfter({ before, after, className = "" }: { before: ReactNode; after: ReactNode; className?: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line select-none ${className}`}>
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-bg/80 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.18em] text-cream uppercase backdrop-blur">
        Przed
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-orange px-3 py-1.5 text-[10px] font-extrabold tracking-[0.18em] text-bg uppercase">
        Po · AI
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-cream" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream text-bg shadow-xl">
          <MoveHorizontal className="size-5" />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Porównaj przed i po"
        className="ba-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

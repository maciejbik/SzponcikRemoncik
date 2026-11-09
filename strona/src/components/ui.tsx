import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.18em] text-orange ${className}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </p>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
};

export function Button({ children, to, onClick, variant = "primary", disabled, className = "", type = "button" }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider transition duration-200 disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    variant === "primary"
      ? "bg-orange text-bg hover:bg-amber hover:-translate-y-0.5 shadow-[0_10px_30px_-10px_rgb(242_107_29/0.7)]"
      : "border border-line text-cream hover:border-orange hover:text-orange";
  const cls = `${base} ${styles} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function Chips<T extends string>({
  options, value, onChange,
}: { options: { id: T; name: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-full border px-4 py-2 text-xs font-extrabold tracking-wider uppercase transition ${
            value === o.id ? "border-orange bg-orange text-bg" : "border-line text-cream hover:border-orange"
          }`}
        >
          {o.name}
        </button>
      ))}
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return <img src="./logo.webp" alt="Szponcik Remoncik" className={className} draggable={false} />;
}

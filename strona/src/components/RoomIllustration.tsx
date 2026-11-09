import { useId } from "react";
import type { Palette, RoomType } from "../data";

type Props = {
  room: RoomType;
  palette: Palette;
  before?: boolean;
  className?: string;
};

const FLOOR_Y = 370;

export default function RoomIllustration({ room, palette: p, before = false, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const wet = room === "kuchnia" || room === "lazienka";
  const win = room === "lazienka" ? { x: 640, w: 120 } : { x: 560, w: 170 };
  const light = before ? "#bdb6a6" : "#fbfaf7";

  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`}>
      <defs>
        <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={before ? "#9aa4a6" : "#bfe3f5"} />
          <stop offset="1" stopColor={before ? "#878f90" : "#fdf1dc"} />
        </linearGradient>
        <radialGradient id={`glow${uid}`}>
          <stop offset="0" stopColor="#ffd59a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd59a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`shade${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={before ? 0.25 : 0.12} />
        </linearGradient>
      </defs>

      {/* ściana */}
      <rect width="800" height={FLOOR_Y} fill={p.wall} />
      {p.brick && !before && <Bricks color={p.wallAccent} />}
      {!before && (room === "salon" || room === "sypialnia") && !p.brick && (
        <rect x="120" width="430" height={FLOOR_Y} fill={p.wallAccent} opacity={0.9} />
      )}
      {room === "lazienka" && <Tiles x={0} y={170} w={800} h={200} fill={before ? "#8f8a80" : p.wallAccent} before={before} />}
      {room === "kuchnia" && (
        <Tiles x={60} y={200} w={470} h={68} fill={before ? "#8f8a80" : p.accent} before={before} opacity={before ? 1 : 0.45} />
      )}
      <rect width="800" height={FLOOR_Y} fill={`url(#shade${uid})`} />

      {before && <Damage />}

      {/* okno */}
      <g>
        <rect x={win.x - 8} y="62" width={win.w + 16} height="216" rx="4" fill={before ? "#d6cfbf" : p.metal} />
        <rect x={win.x} y="70" width={win.w} height="200" fill={`url(#sky${uid})`} />
        <rect x={win.x + win.w / 2 - 3} y="70" width="6" height="200" fill={before ? "#d6cfbf" : p.metal} />
        <rect x={win.x} y="165" width={win.w} height="6" fill={before ? "#d6cfbf" : p.metal} />
        {!before && <path d={`M${win.x + 14} 250 L${win.x + 60} 90`} stroke="#fff" strokeOpacity="0.45" strokeWidth="10" />}
        <rect x={win.x - 14} y="276" width={win.w + 28} height="10" fill={before ? "#c9c2b2" : p.furnitureDark} />
      </g>

      {/* lampa */}
      {before ? (
        <g>
          <line x1="300" y1="0" x2="300" y2="62" stroke="#3d3a36" strokeWidth="2" />
          <circle cx="300" cy="70" r="10" fill="#e6dfbd" />
        </g>
      ) : (
        <g>
          <circle cx="300" cy="110" r="120" fill={`url(#glow${uid})`} />
          <line x1="300" y1="0" x2="300" y2="58" stroke={p.metal} strokeWidth="3" />
          <path d="M268 92 L332 92 L316 56 L284 56 Z" fill={p.accent} />
          <ellipse cx="300" cy="92" rx="32" ry="5" fill="#ffe6bf" />
        </g>
      )}

      {/* podłoga */}
      <polygon points={`0,${FLOOR_Y} 800,${FLOOR_Y} 800,500 0,500`} fill={p.floor} />
      <Floor wet={wet} color={p.floorLine} />
      <rect y={FLOOR_Y - 8} width="800" height="10" fill={before ? "#6a645c" : p.furnitureDark} />
      {before && <path d="M90 430 l60 8 M520 470 l90 -6 M340 405 l40 4" stroke="#4f483f" strokeWidth="2" opacity="0.6" />}

      {room === "salon" && <Salon p={p} before={before} />}
      {room === "sypialnia" && <Sypialnia p={p} before={before} light={light} />}
      {room === "kuchnia" && <Kuchnia p={p} before={before} light={light} />}
      {room === "lazienka" && <Lazienka p={p} before={before} light={light} />}

      {p.plant && !before && room !== "lazienka" && <Plant x={room === "kuchnia" ? 600 : 545} p={p} />}
    </svg>
  );
}

function Bricks({ color }: { color: string }) {
  const rows = [];
  for (let r = 0; r < 19; r++) {
    const y = r * 20;
    rows.push(<line key={`h${r}`} x1="0" y1={y} x2="800" y2={y} stroke={color} strokeWidth="2.5" opacity="0.55" />);
    for (let c = 0; c < 15; c++) {
      const x = c * 60 + (r % 2 ? 30 : 0);
      rows.push(<line key={`v${r}-${c}`} x1={x} y1={y} x2={x} y2={y + 20} stroke={color} strokeWidth="2.5" opacity="0.55" />);
    }
  }
  return <g>{rows}</g>;
}

function Tiles({ x, y, w, h, fill, before, opacity = 1 }: { x: number; y: number; w: number; h: number; fill: string; before: boolean; opacity?: number }) {
  const lines = [];
  const size = 34;
  for (let i = size; i < w; i += size) lines.push(<line key={`v${i}`} x1={x + i} y1={y} x2={x + i} y2={y + h} />);
  for (let j = size; j < h; j += size) lines.push(<line key={`h${j}`} x1={x} y1={y + j} x2={x + w} y2={y + j} />);
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      <g stroke={before ? "#6f6a61" : "#ffffff"} strokeOpacity={before ? 0.8 : 0.35} strokeWidth="2">
        {lines}
      </g>
      {before && <path d={`M${x + 120} ${y + 10} l14 30 l-10 22 l18 26`} stroke="#5d584f" strokeWidth="2" fill="none" />}
    </g>
  );
}

function Floor({ wet, color }: { wet: boolean; color: string }) {
  const lines = [];
  for (let i = -6; i <= 16; i++) {
    const xt = i * 60;
    const xb = 400 + (xt - 400) * 1.7;
    lines.push(<line key={`p${i}`} x1={xt} y1={FLOOR_Y} x2={xb} y2={500} />);
  }
  const rows = wet ? [395, 425, 460] : [];
  return (
    <g stroke={color} strokeWidth="2">
      {lines}
      {rows.map((y) => (
        <line key={y} x1="0" y1={y} x2="800" y2={y} />
      ))}
      {!wet &&
        [400, 440, 480].map((y, k) =>
          [0, 1, 2, 3, 4].map((n) => {
            const x = ((n * 190 + k * 70) % 800) + 20;
            return <line key={`${y}-${n}`} x1={x} y1={y} x2={x + 26} y2={y} />;
          }),
        )}
    </g>
  );
}

function Damage() {
  return (
    <g>
      <ellipse cx="200" cy="70" rx="80" ry="34" fill="#6f6a62" opacity="0.35" />
      <ellipse cx="470" cy="40" rx="50" ry="22" fill="#6f6a62" opacity="0.3" />
      <path d="M90 0 l12 40 l-18 30 l20 44 l-8 36" stroke="#5d584f" strokeWidth="2.5" fill="none" />
      <polygon points="430,150 492,140 500,196 446,210" fill="#b9b4aa" opacity="0.8" />
      <g transform="rotate(5 210 140)">
        <rect x="150" y="100" width="110" height="78" fill="#6f6a62" stroke="#4f4a44" strokeWidth="5" />
      </g>
    </g>
  );
}

function Plant({ x, p }: { x: number; p: Palette }) {
  return (
    <g>
      <ellipse cx={x + 20} cy={FLOOR_Y - 10} rx="26" ry="5" fill="#000" opacity="0.2" />
      {[-40, -15, 10, 35, -60, 55].map((a, i) => (
        <ellipse
          key={i}
          cx={x + 20}
          cy={FLOOR_Y - 110}
          rx="13"
          ry="46"
          fill={i % 2 ? "#4f7d5c" : "#3f6a4d"}
          transform={`rotate(${a} ${x + 20} ${FLOOR_Y - 70})`}
        />
      ))}
      <path d={`M${x} ${FLOOR_Y - 70} h40 l-6 62 h-28 z`} fill={p.furnitureDark} />
    </g>
  );
}

function Salon({ p, before }: { p: Palette; before: boolean }) {
  return (
    <g>
      {!before && (
        <g>
          <rect x="150" y="100" width="120" height="84" fill={p.accent} stroke={p.metal} strokeWidth="5" />
          <circle cx="195" cy="150" r="22" fill={p.wall} opacity="0.7" />
          <rect x="300" y="120" width="70" height="64" fill={p.wall} stroke={p.metal} strokeWidth="5" />
          <ellipse cx="335" cy="420" rx="230" ry="34" fill={p.accent} opacity="0.28" />
        </g>
      )}
      <ellipse cx="335" cy="368" rx="200" ry="12" fill="#000" opacity="0.2" />
      <rect x="175" y="232" width="320" height="78" rx="20" fill={p.furniture} />
      <rect x="160" y="290" width="350" height="56" rx="14" fill={p.furniture} />
      <rect x="148" y="262" width="42" height="88" rx="14" fill={p.furnitureDark} />
      <rect x="480" y="262" width="42" height="88" rx="14" fill={p.furnitureDark} />
      <rect x="205" y="252" width="72" height="46" rx="12" fill={before ? p.furnitureDark : p.accent} />
      <rect x="392" y="252" width="72" height="46" rx="12" fill={before ? p.furnitureDark : p.wall} />
      <rect x="172" y="346" width="9" height="18" fill={p.metal} />
      <rect x="489" y="346" width="9" height="18" fill={p.metal} />
      {before ? (
        <rect x="290" y="372" width="96" height="44" fill="#5b544b" />
      ) : (
        <g>
          <rect x="333" y="392" width="4" height="34" fill={p.metal} />
          <ellipse cx="335" cy="392" rx="70" ry="11" fill={p.metal} />
          <ellipse cx="335" cy="389" rx="70" ry="11" fill={p.furnitureDark} />
        </g>
      )}
    </g>
  );
}

function Sypialnia({ p, before, light }: { p: Palette; before: boolean; light: string }) {
  return (
    <g>
      {!before && <ellipse cx="340" cy="430" rx="250" ry="34" fill={p.accent} opacity="0.25" />}
      <rect x="170" y="210" width="340" height="120" rx="18" fill={p.furnitureDark} />
      <rect x="160" y="300" width="360" height="52" rx="10" fill={light} />
      <rect x="195" y="272" width="104" height="40" rx="16" fill={light} stroke={before ? "#a39b8c" : p.wallAccent} strokeWidth="2" />
      <rect x="381" y="272" width="104" height="40" rx="16" fill={light} stroke={before ? "#a39b8c" : p.wallAccent} strokeWidth="2" />
      <rect x="160" y="318" width="360" height="48" rx="8" fill={p.furniture} />
      {!before && <rect x="420" y="318" width="70" height="48" fill={p.accent} />}
      {[100, 530].map((x) => (
        <g key={x}>
          <rect x={x} y="300" width="52" height="62" rx="4" fill={p.furnitureDark} />
          {!before && (
            <g>
              <rect x={x + 23} y="262" width="5" height="38" fill={p.metal} />
              <path d={`M${x + 8} 266 h36 l-6 -24 h-24 z`} fill={p.accent} />
            </g>
          )}
        </g>
      ))}
    </g>
  );
}

function Kuchnia({ p, before, light }: { p: Palette; before: boolean; light: string }) {
  const doors = [60, 154, 248, 342, 436];
  return (
    <g>
      <rect x="60" y="88" width="300" height="112" fill={p.furniture} />
      {[60, 160, 260].map((x) => (
        <g key={x}>
          <rect x={x + 4} y="92" width="92" height="104" fill="none" stroke={p.furnitureDark} strokeWidth="3" />
          <rect x={x + 44} y="176" width="12" height="4" fill={before ? "#9a9286" : p.metal} />
        </g>
      ))}
      <path d="M392 88 h80 v40 l26 50 h-132 l26 -50 z" fill={before ? "#8c857a" : p.metal} />
      <rect x="50" y="266" width="490" height="16" fill={before ? "#b1a996" : light} />
      <rect x="60" y="282" width="470" height="84" fill={p.furniture} />
      {doors.map((x) => (
        <g key={x}>
          <rect x={x + 4} y="286" width="86" height="76" fill="none" stroke={p.furnitureDark} strokeWidth="3" />
          <rect x={x + 34} y="294" width="26" height="4" fill={before ? "#9a9286" : p.metal} />
        </g>
      ))}
      <rect x="400" y="258" width="64" height="8" fill="#1d1d1f" />
      {!before && (
        <g>
          <circle cx="150" cy="252" r="14" fill={p.accent} />
          <rect x="190" y="230" width="22" height="36" rx="4" fill={p.wall} />
        </g>
      )}
    </g>
  );
}

function Lazienka({ p, before, light }: { p: Palette; before: boolean; light: string }) {
  return (
    <g>
      {before ? (
        <rect x="470" y="130" width="100" height="110" fill="#b8b6ae" stroke="#7d786f" strokeWidth="5" />
      ) : (
        <rect x="465" y="120" width="110" height="140" rx="55" fill="#dfe9ee" stroke={p.metal} strokeWidth="6" />
      )}
      <rect x="450" y="290" width="140" height="74" fill={p.furniture} />
      <rect x="440" y="280" width="160" height="14" rx="4" fill={light} />
      <rect x="512" y="262" width="6" height="20" fill={before ? "#9a9286" : p.metal} />
      <rect x="80" y="290" width="320" height="76" rx="22" fill={light} />
      <rect x="74" y="284" width="332" height="16" rx="8" fill={before ? "#cfc8b9" : "#ffffff"} />
      <path d="M360 284 v-50 h24" stroke={before ? "#9a9286" : p.metal} strokeWidth="6" fill="none" />
      {!before && (
        <g>
          <rect x="120" y="236" width="38" height="48" rx="6" fill={p.accent} />
          <rect x="166" y="250" width="24" height="34" rx="6" fill={p.wall} />
        </g>
      )}
    </g>
  );
}

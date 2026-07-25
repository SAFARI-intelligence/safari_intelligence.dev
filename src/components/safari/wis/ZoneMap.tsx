import { useState } from "react";
import { Info } from "lucide-react";
import type { WisZone } from "./mock";

interface Props {
  zones: WisZone[];
}

const activityFill: Record<WisZone["activity"], string> = {
  high: "rgba(139,26,26,0.45)",
  medium: "rgba(201,168,76,0.45)",
  low: "rgba(45,90,39,0.4)",
};
const activityStroke: Record<WisZone["activity"], string> = {
  high: "#8B1A1A",
  medium: "#C9A84C",
  low: "#2D5A27",
};

export function ZoneMap({ zones }: Props) {
  const [hover, setHover] = useState<WisZone | null>(null);

  return (
    <section className="space-y-4">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#C9A84C]">
            Zone tracking · Ramani
          </div>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#F5F0E8]">
            Wildlife intelligence map
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[#F5F0E8]/50">
          Zone-level · 2-hour reporting delay
        </span>
      </header>

      <div
        className="relative overflow-hidden rounded-2xl border border-white/10
                   bg-gradient-to-br from-[#1A2A16] via-[#141E10] to-[#0E1509]
                   backdrop-blur-xl p-4"
      >
        <svg
          viewBox="0 0 420 340"
          className="w-full h-auto"
          role="img"
          aria-label="Zone-based wildlife intelligence map"
        >
          <defs>
            <pattern id="wis-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" stroke="#C9A84C" strokeOpacity="0.08" />
            </pattern>
          </defs>
          <rect width="420" height="340" fill="url(#wis-grid)" />

          {/* rivers, decorative */}
          <path
            d="M20,200 Q120,150 220,220 T400,240"
            stroke="#2D5A27"
            strokeOpacity="0.35"
            strokeWidth="2"
            fill="none"
          />

          {zones.map((z) => (
            <g key={z.id}>
              <polygon
                points={z.points}
                fill={activityFill[z.activity]}
                stroke={activityStroke[z.activity]}
                strokeWidth={hover?.id === z.id ? 2 : 1}
                onMouseEnter={() => setHover(z)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "all 0.2s" }}
              />
            </g>
          ))}

          {zones.map((z) => {
            // centroid approx: average of point pairs
            const coords = z.points
              .split(" ")
              .map((p) => p.split(",").map(Number));
            const cx = coords.reduce((s, c) => s + c[0], 0) / coords.length;
            const cy = coords.reduce((s, c) => s + c[1], 0) / coords.length;
            return (
              <text
                key={`${z.id}-t`}
                x={cx}
                y={cy}
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
                fill="#F5F0E8"
                style={{ pointerEvents: "none", letterSpacing: "0.05em" }}
              >
                {z.label.split("·")[0].trim()}
              </text>
            );
          })}
        </svg>

        {hover && (
          <div
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs
                       rounded-xl border border-white/10 bg-[#1A1209]/85 backdrop-blur-lg p-3"
          >
            <div className="text-[11px] font-semibold text-[#C9A84C]">
              {hover.label}
            </div>
            <div className="text-[11px] text-[#F5F0E8]/70 mt-0.5 capitalize">
              Activity: {hover.activity} · zone-level visibility only
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#F5F0E8]/80">
          <LegendSwatch color={activityStroke.high} fill={activityFill.high} label="High activity" />
          <LegendSwatch color={activityStroke.medium} fill={activityFill.medium} label="Medium activity" />
          <LegendSwatch color={activityStroke.low} fill={activityFill.low} label="Low activity" />
        </div>
        <div className="mt-3 flex items-start gap-2 text-[11px] text-[#F5F0E8]/60 leading-relaxed">
          <Info className="h-3.5 w-3.5 mt-[1px] text-[#C9A84C] shrink-0" />
          <p>
            SAFARI is a wildlife intelligence platform — not a live tracker. We
            display shaded <span className="text-[#F5F0E8]">zones</span> instead
            of pin-precise locations. Ranger reports are aggregated on a rolling
            2-hour delay to protect animals from poaching and disturbance.
          </p>
        </div>
      </div>
    </section>
  );
}

function LegendSwatch({
  color,
  fill,
  label,
}: {
  color: string;
  fill: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-3 w-4 rounded-sm"
        style={{ background: fill, border: `1px solid ${color}` }}
      />
      {label}
    </span>
  );
}

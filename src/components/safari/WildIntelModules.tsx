import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  Activity,
  Compass,
  Clock,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

/**
 * Wildlife Intelligence — Phase 1 (VALIDATE) modules.
 * Mock adapters; interface contracts mirror Supabase public.* tables.
 * CRITICAL: all positional data is enforced 2hrs behind real-time (RLS).
 * Never label as "real-time" — use "Latest Update" / "Last Recorded".
 */

type Story = {
  id: string;
  headline: string;
  narrative: string;
  insight: string;
  species: string;
  zone: string;
  hoursAgo: number;
  confidence: number;
};

type Behavior = {
  species: string;
  zone: string;
  current: string;
  activity: "active" | "resting" | "travelling" | "feeding" | "socializing";
  speedKmh: number;
  migration: "stationary" | "local_movement" | "seasonal_migration";
  territory: "in_core" | "boundary" | "dispersing" | "unknown";
  analysis: string;
  confidence: number;
  windowHours: number;
};

type Prediction = {
  species: string;
  fromZone: string;
  predictedZone: string;
  withinHours: number;
  basis: string;
  confidence: number;
};

const stories: Story[] = [
  {
    id: "st-1",
    headline: "Matriarch leads herd toward Talek River at first light",
    narrative:
      "A 45-year-old matriarch guided 12 elephants 3km north before sunrise. Calves stayed centered — classic protective formation.",
    insight:
      "Matriarchs over 35yr hold migration memory critical to drought survival.",
    species: "Elephant",
    zone: "Talek River · Maasai Mara",
    hoursAgo: 2,
    confidence: 96,
  },
  {
    id: "st-2",
    headline: "Cheetah coalition holds position near Naabi gazelle herd",
    narrative:
      "Three brothers stalking downwind of 200+ Thomson's gazelles. Last recorded posture: low-belly approach phase.",
    insight:
      "Male coalitions raise hunt success from 30% (solo) to 58% on open plains.",
    species: "Cheetah",
    zone: "Naabi Hill · Serengeti",
    hoursAgo: 2,
    confidence: 92,
  },
  {
    id: "st-3",
    headline: "Marsh Pride resting after wildebeest kill",
    narrative:
      "Two lionesses and four cubs (~4 months old) at fresh kill site. Vultures circling — pride expected to remain 2–3 hours.",
    insight:
      "Cub survival in Marsh Pride has rebounded 41% since 2023 anti-poaching expansion.",
    species: "Lion",
    zone: "Musiara Marsh · Maasai Mara",
    hoursAgo: 3,
    confidence: 98,
  },
];

const behaviors: Behavior[] = [
  {
    species: "Elephant herd · Talek",
    zone: "Maasai Mara",
    current: "Slow northbound travel with frequent grazing stops",
    activity: "travelling",
    speedKmh: 4,
    migration: "seasonal_migration",
    territory: "in_core",
    analysis:
      "Pattern consistent with pre-rains corridor use; matriarch tracking water-source memory.",
    confidence: 93,
    windowHours: 6,
  },
  {
    species: "Cheetah coalition · Naabi",
    zone: "Serengeti",
    current: "Stationary stalk posture, wind favorable",
    activity: "active",
    speedKmh: 0,
    migration: "local_movement",
    territory: "boundary",
    analysis:
      "Coalition has rotated 4 territory edges in 14 days — typical pre-dispersal phase.",
    confidence: 88,
    windowHours: 4,
  },
  {
    species: "Marsh Pride · Musiara",
    zone: "Maasai Mara",
    current: "Group rest at kill site, cubs nursing",
    activity: "resting",
    speedKmh: 0,
    migration: "stationary",
    territory: "in_core",
    analysis:
      "Pride centroid stable within 1.2km for 36 hours — denning behavior likely.",
    confidence: 97,
    windowHours: 36,
  },
];

const predictions: Prediction[] = [
  {
    species: "Wildebeest column",
    fromZone: "Sand River",
    predictedZone: "Mara River — Crossing Point B",
    withinHours: 18,
    basis:
      "14-day movement vector + historical Aug crossing window + grass biomass NDVI.",
    confidence: 81,
  },
  {
    species: "Elephant herd (Talek)",
    fromZone: "Talek north bank",
    predictedZone: "Olare Orok confluence",
    withinHours: 8,
    basis:
      "Matriarch route memory · 3-year recurrence at this rainfall threshold.",
    confidence: 74,
  },
  {
    species: "Cheetah coalition",
    fromZone: "Naabi Hill plains",
    predictedZone: "Gol Kopjes territory edge",
    withinHours: 12,
    basis:
      "Coalition rotation cadence + gazelle herd dispersion modeling.",
    confidence: 69,
  },
];

export function WildIntelModules() {
  return (
    <section className="space-y-4">
      <DelayBanner />
      <Module
        defaultOpen
        icon={<Sparkles className="h-4 w-4" />}
        title="Wildlife Stories"
        subtitle="AI-woven narratives from ranger reports, camera traps & GPS tags"
        accent="var(--gold)"
      >
        <div className="grid md:grid-cols-3 gap-3">
          {stories.map((s) => (
            <article
              key={s.id}
              className="glass rounded-2xl p-4 space-y-2 hover:shadow-[var(--shadow-elevated)] transition"
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="font-semibold text-[var(--maasai)]">
                  {s.species}
                </span>
                <span>{s.confidence}% conf</span>
              </div>
              <h4 className="font-display text-base font-bold leading-snug">
                {s.headline}
              </h4>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {s.narrative}
              </p>
              <div className="rounded-lg bg-[var(--forest)]/8 border-l-2 border-[var(--forest)] px-2.5 py-1.5 text-[11px] text-[var(--forest)] font-medium leading-snug">
                {s.insight}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
                <Clock className="h-3 w-3" /> Last update {s.hoursAgo}h ago ·{" "}
                {s.zone}
              </div>
            </article>
          ))}
        </div>
      </Module>

      <Module
        icon={<Activity className="h-4 w-4" />}
        title="Behavioral Analysis"
        subtitle="Ethological state, movement pace & territory signal per cohort"
        accent="var(--maasai)"
      >
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-sm border-separate border-spacing-y-1.5 min-w-[640px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-semibold px-3 py-1.5">Cohort</th>
                <th className="text-left font-semibold px-3 py-1.5">State</th>
                <th className="text-left font-semibold px-3 py-1.5">Speed</th>
                <th className="text-left font-semibold px-3 py-1.5">Migration</th>
                <th className="text-left font-semibold px-3 py-1.5">Territory</th>
                <th className="text-left font-semibold px-3 py-1.5">Conf.</th>
              </tr>
            </thead>
            <tbody>
              {behaviors.map((b) => (
                <tr key={b.species} className="glass">
                  <td className="px-3 py-2.5 rounded-l-xl">
                    <div className="font-semibold text-sm">{b.species}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {b.current}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--forest)]/12 text-[var(--forest)] text-[10px] font-semibold capitalize">
                      {b.activity}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs font-mono">
                    {b.speedKmh} km/h
                  </td>
                  <td className="px-3 py-2.5 text-[11px] capitalize">
                    {b.migration.replace(/_/g, " ")}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] capitalize">
                    {b.territory.replace(/_/g, " ")}
                  </td>
                  <td className="px-3 py-2.5 rounded-r-xl text-xs font-mono">
                    {b.confidence}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[10px] text-muted-foreground mt-2 font-mono">
          Observation windows: 4–36h · positions zone-centroid only.
        </div>
      </Module>

      <Module
        icon={<Compass className="h-4 w-4" />}
        title="Movement Predictions"
        subtitle="Where the herds are likely heading — pattern + calendar modeled"
        accent="var(--forest)"
      >
        <div className="grid md:grid-cols-3 gap-3">
          {predictions.map((p) => (
            <div
              key={p.species + p.predictedZone}
              className="glass rounded-2xl p-4 space-y-2.5"
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[var(--forest)] font-semibold">
                <TrendingUp className="h-3 w-3" /> Predicted Movement
              </div>
              <div className="font-display text-base font-bold leading-tight">
                {p.species}
              </div>
              <div className="text-xs text-foreground/80">
                <span className="text-muted-foreground">{p.fromZone}</span>{" "}
                →{" "}
                <span className="font-semibold text-[var(--maasai)]">
                  {p.predictedZone}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground italic leading-snug">
                {p.basis}
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="font-mono text-foreground/80">
                  within ~{p.withinHours}h
                </span>
                <span className="font-mono text-[var(--forest)] font-semibold">
                  {p.confidence}% conf
                </span>
              </div>
              <div className="h-1 rounded-full bg-foreground/8 overflow-hidden">
                <div
                  className="h-full bg-[var(--forest)]"
                  style={{ width: `${p.confidence}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Module>
    </section>
  );
}

function DelayBanner() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-[var(--maasai)]/25 bg-[var(--maasai)]/6 px-3.5 py-2.5 text-[11px] leading-snug text-foreground/85">
      <ShieldAlert className="h-3.5 w-3.5 mt-0.5 text-[var(--maasai)] flex-shrink-0" />
      <div>
        <span className="font-semibold text-[var(--maasai)]">
          2-hour delay enforced.
        </span>{" "}
        All positions shown are zone-centroid and at least 2 hours old — a
        conservation rule that protects animals from precise tracking. "Latest
        Update" always means at least 2 hours old.
      </div>
    </div>
  );
}

function Module({
  title,
  subtitle,
  icon,
  accent,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-foreground/3 transition"
      >
        <span
          className="grid h-8 w-8 place-items-center rounded-lg flex-shrink-0"
          style={{ background: `color-mix(in oklab, ${accent} 14%, transparent)`, color: accent }}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-display text-lg font-bold leading-tight">
            {title}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {subtitle}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="px-4 sm:px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, MapPin, Sparkles, Cloud, ArrowRight, ChevronDown, Info } from "lucide-react";
import { Shell } from "@/components/safari/Shell";
import { MaasaiDivider } from "@/components/safari/MaasaiDivider";
import { parks, images } from "@/lib/safari-data";

type ExplorerPark = {
  id: string;
  name: string;
  swahiliName?: string;
  country: string;
  image: string;
  sightings: number;
  confidence: number;
  weather: string;
  tempC: number;
  highlights: string[];
};

const ACTIVE_PARKS: ExplorerPark[] = [
  {
    id: "maasai-mara",
    name: "Maasai Mara",
    country: "Kenya",
    image: images.lion,
    sightings: 47,
    confidence: 96,
    weather: "Sunny",
    tempC: 27,
    highlights: ["Big 5", "Great Migration", "Talek River pride"],
  },
  {
    id: "amboseli",
    name: "Amboseli",
    country: "Kenya",
    image: images.elephants,
    sightings: 28,
    confidence: 93,
    weather: "Clear",
    tempC: 26,
    highlights: ["Elephant herds", "Kilimanjaro views", "Ol Tukai"],
  },
  {
    id: "tsavo",
    name: "Tsavo",
    country: "Kenya",
    image: images.savanna,
    sightings: 34,
    confidence: 91,
    weather: "Warm",
    tempC: 29,
    highlights: ["Red elephants", "Mzima Springs", "Lava country"],
  },
  {
    id: "lake-nakuru",
    name: "Lake Nakuru",
    country: "Kenya",
    image: images.giraffe,
    sightings: 21,
    confidence: 90,
    weather: "Mild",
    tempC: 23,
    highlights: ["Rhino sanctuary", "Rothschild giraffe", "Lake shore"],
  },
];

const COMING_PARK_IDS = ["serengeti", "bwindi", "volcanoes", "murchison", "akagera"];
const COMING_PARKS: ExplorerPark[] = COMING_PARK_IDS.flatMap((id) => {
  const park = parks.find((candidate) => candidate.id === id);
  return park ? [park] : [];
});

function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    const dur = 1500;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n.toLocaleString()}</span>;
}

function ParkCard({ park, index, comingSoon = false }: { park: ExplorerPark; index: number; comingSoon?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={`group glass overflow-hidden rounded-2xl transition-all ${
        comingSoon ? "grayscale opacity-65" : "hover:shadow-[var(--shadow-elevated)]"
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={park.image}
          alt={park.name}
          className={`h-full w-full object-cover transition-transform duration-700 ${comingSoon ? "" : "group-hover:scale-105"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          {comingSoon ? (
            <span className="inline-flex rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              Coming soon
            </span>
          ) : (
            <div className="group/tooltip relative inline-flex">
              <span
                tabIndex={0}
                aria-describedby={`delay-tooltip-${park.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md"
              >
                <Info className="h-3 w-3" aria-hidden="true" />
                Updated 2h+ ago
              </span>
              <span
                id={`delay-tooltip-${park.id}`}
                role="tooltip"
                className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-56 rounded-md bg-foreground px-3 py-2 text-xs leading-relaxed text-background opacity-0 shadow-lg transition-opacity group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
              >
                Wildlife locations are delayed by 2 hours to protect animals.
              </span>
            </div>
          )}
          <span className="inline-flex shrink-0 items-center rounded-full border border-[var(--gold)]/50 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase text-[var(--gold)] backdrop-blur-md">
            Sample data
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-[10px] uppercase tracking-wider opacity-80">{park.country}</div>
          <h3 className="font-display text-xl font-bold leading-tight">{park.name}</h3>
          {park.swahiliName ? <p className="mt-0.5 text-xs text-white/75">{park.swahiliName}</p> : null}
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-[var(--maasai)]">{park.sightings}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sightings</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--gold)]">{park.confidence}%</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI conf.</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--forest)]">{park.tempC}°</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{park.weather}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {park.highlights.slice(0, 3).map((highlight) => (
            <span key={highlight} className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] text-muted-foreground">
              {highlight}
            </span>
          ))}
        </div>
        {!comingSoon ? (
          <Link
            to="/book"
            className="block w-full rounded-lg bg-foreground py-2 text-center text-sm font-semibold text-background transition hover:bg-foreground/85"
          >
            Quick book
          </Link>
        ) : null}
      </div>
    </motion.article>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAFARI — AI Wildlife Intelligence for East Africa" },
      {
        name: "description",
        content: "Plan your Kenya safari with SAFARI, built in Nairobi. Wildlife stories, trusted operators, KSh pricing.",
      },
      { property: "og:title", content: "SAFARI — Wildlife Intelligence" },
      {
        property: "og:description",
        content: "Plan your Kenya safari with SAFARI, built in Nairobi. Wildlife stories, trusted operators, KSh pricing.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://wild-vista-hub.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:description",
        content: "Plan your Kenya safari with SAFARI, built in Nairobi. Wildlife stories, trusted operators, KSh pricing.",
      },
      { property: "og:image", content: images.lion },
      { name: "twitter:image", content: images.lion },
    ],
    links: [{ rel: "canonical", href: "https://wild-vista-hub.lovable.app/" }],
  }),
  component: Index,
});

function Index() {
  const totalSightings = 179;
  const monitoredParks = 6;
  const avgConfidence = 94;
  const operatorsOnline = 12;

  return (
    <Shell>
      <div className="mx-auto max-w-7xl space-y-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl grain">
          <div className="absolute inset-0">
            <img
              src={images.lion}
              alt="Lion at golden hour in the Maasai Mara"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="relative px-6 py-12 sm:px-12 sm:py-20 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--maasai)]" />
                Wildlife Intelligence · Delayed for safety
              </span>
              <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95]">
                The Mara is{" "}
                <span className="bg-gradient-to-r from-[var(--gold)] via-amber-200 to-white bg-clip-text text-transparent">
                  awake.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
                Karibu. Kenya's safari platform, built in Nairobi.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/plan"
                  className="shimmer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--maasai)] text-white font-semibold shadow-[var(--shadow-glow-gold)] hover:scale-[1.02] transition"
                >
                  <Sparkles className="h-4 w-4" /> Plan with AI
                </Link>
                <Link
                  to="/wildlife"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white font-medium hover:bg-white/20 transition"
                >
                  Explore wildlife stories <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section aria-labelledby="sample-stats-label">
          <div className="mb-3 flex items-center justify-between">
            <span
              id="sample-stats-label"
              className="inline-flex items-center rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-[var(--gold)]"
            >
              Sample data
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Active sightings", value: totalSightings, suffix: "", icon: Activity, color: "var(--gold)" },
            { label: "AI confidence", value: avgConfidence, suffix: "%", icon: Sparkles, color: "var(--forest)" },
            { label: "Parks monitored", value: monitoredParks, suffix: "", icon: MapPin, color: "var(--maasai)" },
            { label: "Operators online", value: operatorsOnline, suffix: "", icon: Cloud, color: "var(--charcoal)" },
          ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="font-label text-xs text-muted-foreground">
                    {s.label}
                  </span>
                  <s.icon className="h-4 w-4" style={{ color: s.color }} />
                </div>
                <div className="mt-2 font-display text-3xl sm:text-4xl font-bold">
                  <CountUp to={s.value} />
                  <span className="text-lg text-muted-foreground">{s.suffix}</span>
                </div>
              </div>
          ))}
          </div>
        </section>

        <MaasaiDivider />

        {/* PARKS GRID */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">Explorer Dashboard</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Delayed wildlife intelligence and stories across East African parks.
              </p>
            </div>
            <Link
              to="/wildlife"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[var(--maasai)] hover:underline"
            >
              View all stories <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
            {ACTIVE_PARKS.map((park, index) => <ParkCard key={park.id} park={park} index={index} />)}
          </div>

          <details className="group/coming mt-5 overflow-hidden rounded-2xl border border-border/60 bg-muted/25">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div>
                <h3 className="font-display text-xl font-bold">Coming to East Africa</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Five regional parks in preparation</p>
              </div>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open/coming:rotate-180" aria-hidden="true" />
            </summary>
            <div className="grid grid-cols-1 gap-4 border-t border-border/60 p-4 sm:gap-5 sm:p-5 md:grid-cols-2 lg:grid-cols-3">
              {COMING_PARKS.map((park, index) => (
                <ParkCard key={park.id} park={park} index={index} comingSoon />
              ))}
            </div>
          </details>
        </section>
      </div>
    </Shell>
  );
}

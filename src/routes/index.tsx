import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown, Info, Leaf, Compass, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/safari/Shell";
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

function ParkCard({ park, index, comingSoon = false }: { park: ExplorerPark; index: number; comingSoon?: boolean }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={`group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all ${
        comingSoon ? "grayscale opacity-65" : "hover:shadow-[var(--shadow-elevated)]"
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={park.image}
          alt={park.name}
          className={`h-full w-full object-cover transition-transform duration-700 ${comingSoon ? "" : "group-hover:scale-105"}`}
        />
        <div className="absolute inset-0 safari-photo-bottom" />
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          {comingSoon ? (
            <span className="inline-flex rounded-full border border-scene-foreground/25 bg-scene/70 px-2.5 py-1 text-[11px] font-semibold text-scene-foreground backdrop-blur-md">
              Coming soon
            </span>
          ) : (
            <div className="group/tooltip relative inline-flex">
              <span
                tabIndex={0}
                aria-describedby={`delay-tooltip-${park.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-scene-foreground/25 bg-scene/70 px-2.5 py-1 text-[11px] font-medium text-scene-foreground backdrop-blur-md"
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
          <span className="inline-flex shrink-0 items-center rounded-full border border-scene-accent/50 bg-scene/70 px-2.5 py-1 text-[10px] font-semibold text-scene-accent backdrop-blur-md">
            Sample data
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-scene-foreground">
          <div className="text-[10px] uppercase tracking-wider opacity-80">{park.country}</div>
          <h3 className="font-display text-xl font-bold leading-tight">{park.name}</h3>
          {park.swahiliName ? <p className="mt-0.5 text-xs text-scene-foreground/75">{park.swahiliName}</p> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-maasai">{park.sightings}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sightings</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gold">{park.confidence}%</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI conf.</div>
          </div>
          <div>
            <div className="text-lg font-bold text-forest">{park.tempC}°</div>
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
          <Button asChild variant="secondary" className="mt-auto w-full">
            <Link to="/book">Quick book <ArrowRight aria-hidden="true" /></Link>
          </Button>
        ) : null}
      </div>
    </motion.article>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAFARI — Kenya. One Country. Every World." },
      {
        name: "description",
        content: "Plan your Kenya safari with SAFARI, built in Nairobi. Wildlife stories, trusted operators, KSh pricing.",
      },
      { property: "og:title", content: "SAFARI — Kenya. One Country. Every World." },
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
    ],
    links: [{ rel: "canonical", href: "https://wild-vista-hub.lovable.app/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <Shell fullBleed>
      <div className="public-home">
        <section className="safari-hero relative flex items-center overflow-hidden bg-scene text-scene-foreground" aria-labelledby="home-title">
          <img src={images.lion} alt="A lion resting, with a small bird perched beside its mane" fetchPriority="high" className="safari-hero-image absolute inset-0 h-full w-full object-cover" />
          <div className="safari-photo-shade absolute inset-0" />
          <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
            <div className="max-w-xl">
              <p className="editorial-label text-xs font-semibold text-scene-accent">Karibu. Kenya's safari platform, built in Nairobi.</p>
              <h1 id="home-title" className="mt-5 font-display text-6xl font-semibold leading-none sm:text-7xl lg:text-8xl">SAFARI</h1>
              <p className="mt-4 font-display text-3xl leading-tight sm:text-4xl">One Country.<br /><span className="text-scene-accent">Every World.</span></p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-scene-muted">Find your way from the savanna to the coast. Plan a Kenyan journey, discover places to stay, and get closer to the stories of the wild.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="safari" size="lg" className="h-12 px-5"><Link to="/plan"><Sparkles aria-hidden="true" /> Plan your safari</Link></Button>
                <Button asChild variant="scene" size="lg" className="h-12 px-5"><Link to="/stories">Explore wildlife stories <ArrowRight aria-hidden="true" /></Link></Button>
              </div>
            </div>
          </div>
        </section>

        <div className="border-b border-border">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-12">
            {[
              { icon: Compass, title: "Your Kenya, your pace", text: "Build a journey around your interests." },
              { icon: MapPin, title: "Rooted in place", text: "From the Mara to the Indian Ocean." },
              { icon: Leaf, title: "Wildlife comes first", text: "Thoughtful exploration, not pursuit." },
            ].map((item) => <div key={item.title} className="flex items-center gap-3 py-5 sm:px-5 sm:first:pl-0"><item.icon className="h-5 w-5 shrink-0 text-maasai" aria-hidden="true" /><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.text}</p></div></div>)}
          </div>
        </div>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12" aria-labelledby="discover-title">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-semibold text-maasai">Discover Kenya · Tazama</p><h2 id="discover-title" className="mt-2 font-display text-3xl sm:text-4xl">More than a game drive.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Open plains. Ocean air. A journey shaped by the places and people you want to meet.</p></div>
            <Button asChild variant="outline"><Link to="/plan">Start with a plan <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { image: images.elephants, alt: "Elephant in the grasslands beneath Kilimanjaro", label: "The savanna", title: "Make room for the wild.", body: "Explore wildlife stories before choosing your safari route.", to: "/stories" as const, action: "Read the stories" },
              { image: images.coast, alt: "Clear Indian Ocean water beside Kenya's coast", label: "The coast", title: "Let the journey breathe.", body: "Bring coast, culture and a slower pace into your itinerary.", to: "/plan" as const, action: "Plan your journey" },
              { image: images.giraffe, alt: "Giraffe standing among trees in the savanna", label: "A place to pause", title: "Stay close to the landscape.", body: "Browse the existing hotel collection and compare places to stay.", to: "/hotels" as const, action: "Explore stays" },
            ].map((item) => <article key={item.title} className="group overflow-hidden rounded-lg border border-border bg-card"><Link to={item.to} className="block overflow-hidden" aria-label={item.action}><img src={item.image} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></Link><div className="p-5"><p className="text-xs font-semibold text-maasai">{item.label}</p><h3 className="mt-2 font-display text-2xl">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p><Button asChild variant="link" className="mt-4 h-auto px-0 text-foreground"><Link to={item.to}>{item.action}<ArrowRight aria-hidden="true" /></Link></Button></div></article>)}
          </div>
        </section>

        <section className="bg-scene text-scene-foreground" aria-labelledby="wis-title">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-12">
            <div className="relative overflow-hidden rounded-lg"><img src={images.cheetah} alt="Cheetah resting in open grassland" loading="lazy" className="aspect-[4/3] w-full object-cover" /><span className="absolute bottom-4 left-4 rounded-md bg-scene/85 px-3 py-1.5 text-xs text-scene-accent">WIS · Sample experience</span></div>
            <div><p className="text-xs font-semibold text-scene-accent">Wildlife intelligence · Hadithi</p><h2 id="wis-title" className="mt-3 font-display text-3xl sm:text-4xl">A sighting is only<br />the beginning of a story.</h2><p className="mt-5 max-w-lg text-base leading-relaxed text-scene-muted">Meet the animals behind the landscape. Explore sample wildlife stories, follow a watchlist, and discover zone-based missions in WIS.</p><div className="mt-6 flex gap-3 border-t border-scene-foreground/20 pt-5"><Info className="mt-0.5 h-4 w-4 shrink-0 text-scene-accent" aria-hidden="true" /><p className="text-sm leading-relaxed text-scene-muted">Sample data, not a field tracking service. Wildlife locations are delayed by 2 hours to protect animals.</p></div><Button asChild variant="safari" className="mt-7 h-11"><Link to="/wis">Explore WIS <ArrowRight aria-hidden="true" /></Link></Button></div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12" aria-labelledby="parks-title">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold text-maasai">Explorer Dashboard</p><h2 id="parks-title" className="mt-2 font-display text-3xl sm:text-4xl">Kenya, first.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Four Kenyan landscapes to start exploring. The sightings, confidence and weather below are sample data, not current park conditions.</p></div><Button asChild variant="outline"><Link to="/wildlife">Wildlife stories <ArrowRight aria-hidden="true" /></Link></Button></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{ACTIVE_PARKS.map((park, index) => <ParkCard key={park.id} park={park} index={index} />)}</div>
          <details className="group/coming mt-5 border-y border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5"><div><h3 className="font-display text-xl">Coming to East Africa</h3><p className="mt-1 text-xs text-muted-foreground">Regional preview · Not yet available to book</p></div><ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open/coming:rotate-180" aria-hidden="true" /></summary>
            <div className="grid gap-4 border-t border-border py-5 sm:grid-cols-2 lg:grid-cols-3">{COMING_PARKS.map((park, index) => <ParkCard key={park.id} park={park} index={index} comingSoon />)}</div>
          </details>
        </section>

        <section className="border-y border-border bg-secondary/45" aria-labelledby="care-title">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12"><div><Leaf className="h-6 w-6 text-forest" aria-hidden="true" /><p className="mt-4 text-xs font-semibold text-maasai">Conservation & community</p><h2 id="care-title" className="mt-3 font-display text-3xl sm:text-4xl">Leave space for<br />what makes Kenya special.</h2></div><div><p className="text-base leading-relaxed text-muted-foreground">Watch without crowding. Respect a guide's advice. Ask before photographing people, and make time for the culture beyond the safari vehicle.</p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Conservation is a commitment, not a counter. SAFARI does not yet report verified trip donations or conservation outcomes.</p><Button asChild variant="outline" className="mt-6"><Link to="/about">Our story & commitments <ArrowRight aria-hidden="true" /></Link></Button></div></div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-12" aria-labelledby="start-title"><div><p className="text-xs font-semibold text-maasai">Safari njema</p><h2 id="start-title" className="mt-2 font-display text-3xl sm:text-4xl">Your next chapter starts in Kenya.</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Choose your destinations, interests and pace. The itinerary planner requires sign-in; stories and stays are open to explore.</p></div><div className="flex flex-wrap gap-3 lg:justify-end"><Button asChild variant="safari" size="lg" className="h-12 px-5"><Link to="/plan"><Sparkles aria-hidden="true" /> Plan your safari</Link></Button><Button asChild variant="outline" size="lg" className="h-12 px-5"><Link to="/hotels">Browse stays <ArrowRight aria-hidden="true" /></Link></Button></div></section>
      </div>
    </Shell>
  );
}

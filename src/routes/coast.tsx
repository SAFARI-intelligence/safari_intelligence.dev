import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/safari/Shell";
import { MaasaiDivider } from "@/components/safari/MaasaiDivider";
import { images } from "@/lib/safari-data";

export const Route = createFileRoute("/coast")({
  head: () => ({
    meta: [
      { title: "The Coast · SAFARI — Diani, Lamu & Watamu" },
      {
        name: "description",
        content:
          "Kenya's Swahili coast — dhow sailing, Lamu's stone town and marine sanctuaries. An editorial preview from SAFARI, built in Nairobi.",
      },
      { property: "og:title", content: "The Coast · SAFARI — Diani, Lamu & Watamu" },
      {
        property: "og:description",
        content:
          "Dhow sailing, Swahili heritage and marine sanctuaries along Kenya's Indian Ocean shore. An editorial preview — not yet bookable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CoastPage,
});

function Stage({ index, eyebrow, title, children }: { index: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-wider text-scene-accent">Stage {index} · {eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
    </section>
  );
}

function CoastPage() {
  return (
    <Shell>
      <article className="world-coast pb-16">
        <section className="relative overflow-hidden rounded-lg bg-scene text-scene-foreground">
          <img
            src={images.coast}
            alt="Historic stone buildings above clear green water on Kenya's coastline"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="safari-photo-shade absolute inset-0" />
          <div className="relative px-5 py-14 sm:px-10 sm:py-20 lg:px-16">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="editorial-label text-xs font-semibold text-scene-accent">Karibu pwani — welcome to the coast</p>
                <span className="rounded-full border border-scene-foreground/25 bg-scene/60 px-2.5 py-1 text-[10px] font-semibold text-scene-foreground backdrop-blur-md">
                  Editorial preview · Not yet bookable
                </span>
              </div>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">The Coast</h1>
              <p className="mt-4 text-base leading-relaxed text-scene-muted">
                From Diani's white sand to the stone alleys of Lamu, Kenya's Indian Ocean shore is a world of
                dhows, coral and Swahili heritage — a natural second chapter to any safari.
              </p>
            </div>
          </div>
        </section>

        <Stage index="01" eyebrow="Introduction" title="Kenya does not end where the savanna stops.">
          <p>
            The country runs down to the Indian Ocean, and the pace changes with it. Warm air, slow boats,
            mangoes and coconut — the coast asks you to take your time. Swahili has a word for that:
            <em> pole pole</em>, slowly, slowly.
          </p>
        </Stage>

        <Stage index="02" eyebrow="Identity" title="A shore shaped by Swahili heritage.">
          <p>
            For centuries this coastline traded with Arabia, Persia and beyond, and out of that exchange grew
            Swahili culture — the language much of East Africa speaks today, carved doors, coral-stone houses
            and the dhows that still sail these waters.
          </p>
          <p>
            Lamu Old Town, East Africa's oldest surviving settlement, is a UNESCO World Heritage Site. Its
            streets are walked, not driven.
          </p>
        </Stage>

        <Stage index="03" eyebrow="Experience" title="Pair the savanna with the shore.">
          <p>
            The classic Kenyan rhythm: days of early-morning game drives, then days of nothing but ocean.
            Snorkel the protected reefs of Watamu, sail at sunset from Diani, or wander Lamu's lanes.
          </p>
          <p>
            Our sample itinerary catalogue already sketches a savanna-and-coast combination so you can see how
            the two halves fit together — real operator inventory comes as partners join the platform.
          </p>
        </Stage>

        <Stage index="04" eyebrow="Intelligence" title="The sea is not in WIS yet — and we say so.">
          <p>
            Wildlife intelligence (WIS) today follows savanna species and zones, with every location delayed by
            two hours for animal safety. Marine intelligence — reef conditions, nesting seasons, tide-aware
            viewing — is on the roadmap, not built.
          </p>
          <p>
            We would rather tell you that plainly than show you a simulation of the sea.
          </p>
        </Stage>

        <Stage index="05" eyebrow="Connection" title="Tourism that belongs to the coast too.">
          <p>
            Community-run guesthouses, dhow crews and local guides are the coast's real economy. Lamu's old
            town survives because residents and conservators defend it daily.
          </p>
          <p>
            SAFARI does not yet list verified coastal operators. When it does, they will appear here under the
            same transparency standards as every other listing.
          </p>
        </Stage>

        <MaasaiDivider className="my-10" />

        <section className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-scene-accent">Stage 06 · Action</p>
          <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Start with the journey, not the brochure.</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Sketch a route that ends at the ocean, or browse the stays already on the platform. Coastal
            listings arrive as operators join.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="safari" size="lg" className="h-12 px-5">
              <Link to="/plan"><span>Plan a journey</span><ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-5">
              <Link to="/hotels">Browse stays <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </section>
      </article>
    </Shell>
  );
}

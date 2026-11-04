import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell } from "@/components/safari/Shell";
import { MaasaiDivider } from "@/components/safari/MaasaiDivider";

export const Route = createFileRoute("/city")({
  head: () => ({
    meta: [
      { title: "The City · SAFARI — Nairobi" },
      {
        name: "description",
        content:
          "Nairobi — a national park at the city's edge, Karura's forest trails, galleries and coffee culture. An editorial preview from SAFARI.",
      },
      { property: "og:title", content: "The City · SAFARI — Nairobi" },
      {
        property: "og:description",
        content:
          "A national park at the city's edge, urban forest trails, galleries and coffee culture in Nairobi, Kenya. An editorial preview — not yet bookable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CityPage,
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

function CityPage() {
  return (
    <Shell>
      <article className="world-city pb-16">
        <section className="relative overflow-hidden rounded-lg bg-scene text-scene-foreground">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, var(--scene), color-mix(in oklab, var(--scene) 72%, var(--maasai)))" }}
          />
          <div className="relative px-5 py-14 sm:px-10 sm:py-20 lg:px-16">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="editorial-label text-xs font-semibold text-scene-accent">Karibu mjini — welcome to the city</p>
                <span className="rounded-full border border-scene-foreground/25 bg-scene/60 px-2.5 py-1 text-[10px] font-semibold text-scene-foreground backdrop-blur-md">
                  Editorial preview · Not yet bookable
                </span>
              </div>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">The City</h1>
              <p className="mt-4 text-base leading-relaxed text-scene-muted">
                Nairobi is where most journeys begin — a green, restless capital with a national park on its
                edge, forest trails inside the city, and some of East Africa's best galleries and kitchens.
              </p>
            </div>
          </div>
        </section>

        <Stage index="01" eyebrow="Introduction" title="A capital with a wilderness inside it.">
          <p>
            Few capitals can claim what Nairobi does: a full national park within the city's boundaries, where
            giraffe and rhino graze against a skyline. Land here and the wild is not a connecting flight away.
          </p>
        </Stage>

        <Stage index="02" eyebrow="Identity" title="Urban, creative, and proudly Kenyan.">
          <p>
            Nairobi's identity is contemporary as much as it is wild — a growing gallery scene, a serious
            coffee culture, studio craft, live music and a street language all its own. The city gives the
            country its rhythm; the country gives the city its anchor.
          </p>
        </Stage>

        <Stage index="03" eyebrow="Experience" title="Curated days, walked slowly.">
          <p>
            We design the city as curated walking and cultural itineraries: Nairobi National Park at first
            light, the Karura Forest trails, wildlife sanctuaries on the city's edge, gallery mornings and a
            long lunch somewhere the locals actually eat.
          </p>
          <p>
            One to two days is the sweet spot — enough to breathe, short enough to keep the savanna the
            headline.
          </p>
        </Stage>

        <Stage index="04" eyebrow="Intelligence" title="WIS follows the savanna today.">
          <p>
            Wildlife intelligence (WIS) currently covers savanna species and zones, with locations delayed by
            two hours for animal safety. Park-level data for Nairobi National Park and other urban green
            spaces is planned, not yet built — we will not dress that up as something it is not.
          </p>
        </Stage>

        <Stage index="05" eyebrow="Connection" title="The green city survived because people defended it.">
          <p>
            Karura Forest stands today because communities — led by Wangari Maathai's movement — fought to
            protect it. Nairobi's green spaces are a civic story as much as an ecological one, and tourism
            that respects them keeps it that way.
          </p>
        </Stage>

        <MaasaiDivider className="my-10" />

        <section className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-scene-accent">Stage 06 · Action</p>
          <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Begin where the plane lands.</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Add a Nairobi chapter to your itinerary, or start with the wildlife stories that make the savanna
            worth the drive.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="safari" size="lg" className="h-12 px-5">
              <Link to="/plan"><span>Plan a journey</span><ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-5">
              <Link to="/wildlife">Wildlife stories <ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>
        </section>
      </article>
    </Shell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/safari/Shell";
import { StoryCard } from "@/components/safari/wis/StoryCard";
import { WatchlistView } from "@/components/safari/wis/WatchlistView";
import { MissionBoard } from "@/components/safari/wis/MissionBoard";
import { ZoneMap } from "@/components/safari/wis/ZoneMap";
import {
  MOCK_ANIMALS,
  MOCK_BADGES,
  MOCK_MISSIONS,
  MOCK_ZONES,
} from "@/components/safari/wis/mock";

export const Route = createFileRoute("/wis")({
  head: () => ({
    meta: [
      { title: "Wildlife Intelligence Platform — SAFARI" },
      {
        name: "description",
        content:
          "Follow animals, complete field missions, and read wildlife stories on the SAFARI wildlife intelligence platform.",
      },
      { property: "og:title", content: "Wildlife Intelligence Platform — SAFARI" },
      {
        property: "og:description",
        content:
          "Zone-based wildlife intelligence for East Africa — stories, missions and a follow system for conservation-first travel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WisPage,
});

function WisPage() {
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const toggle = (id?: string) => {
    if (!id) return;
    setFollowed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <Shell>
      <div className="min-h-screen bg-[#1A1209] text-[#F5F0E8] -mx-4 sm:-mx-6 -my-6 px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-12">
          <header className="space-y-3 max-w-3xl">
            <div className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#C9A84C]">
              Wildlife Intelligence System
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
              Karibu — East Africa's wildlife, intelligently understood.
            </h1>
            <p className="text-[#F5F0E8]/70">
              A zone-based intelligence layer built on ranger reports. Follow
              animals, complete missions, and read stories that update as the
              landscape moves — never live, always thoughtful.
            </p>
          </header>

          {/* 1 · Story cards */}
          <section className="space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#C9A84C]">
                Story Feed · Hadithi
              </div>
              <h2 className="mt-1 font-serif text-2xl font-bold">
                Evolving wildlife stories
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {MOCK_ANIMALS.map((a) => (
                <StoryCard
                  key={a.id}
                  animal={a}
                  followed={followed.has(a.id)}
                  onFollow={() => toggle(a.id)}
                />
              ))}
            </div>
          </section>

          {/* 2 · Watchlist */}
          <WatchlistView
            animals={MOCK_ANIMALS}
            followed={followed}
            onToggle={toggle}
            badges={MOCK_BADGES}
          />

          {/* 3 · Missions */}
          <MissionBoard missions={MOCK_MISSIONS} />

          {/* 4 · Zone map */}
          <ZoneMap zones={MOCK_ZONES} />

          <footer className="pt-6 text-center text-[10px] uppercase tracking-[0.22em] text-[#F5F0E8]/40">
            Wildlife intelligence platform · Pole pole, kwa uangalifu
          </footer>
        </div>
      </div>
    </Shell>
  );
}

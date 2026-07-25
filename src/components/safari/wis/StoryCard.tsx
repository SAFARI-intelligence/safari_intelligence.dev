import { MapPin, Sparkles, Clock } from "lucide-react";
import type { WisAnimal } from "./mock";

interface Props {
  animal: WisAnimal;
  followed?: boolean;
  onFollow?: () => void;
}

/**
 * StoryCard — a glassmorphism narrative card for the Wildlife Intelligence
 * Platform. Never shows precise GPS; zone label + relative "last updated".
 */
export function StoryCard({ animal, followed, onFollow }: Props) {
  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-white/10
                 bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]
                 p-5 sm:p-6 flex flex-col gap-4"
    >
      {/* gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, rgba(201,168,76,0.18), transparent 55%)",
        }}
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#C9A84C]">
            <Sparkles className="h-3 w-3" /> Wildlife Story
          </div>
          <h3 className="mt-1 font-serif text-2xl font-bold truncate text-[#F5F0E8]">
            {animal.name}
          </h3>
          <p className="text-xs text-[#F5F0E8]/60 truncate">
            {animal.species} · {animal.swahili}
          </p>
        </div>

        <button
          onClick={onFollow}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition
            ${
              followed
                ? "bg-[#C9A84C] text-[#1A1209]"
                : "border border-[#C9A84C]/60 text-[#C9A84C] hover:bg-[#C9A84C]/10"
            }`}
        >
          {followed ? "✓ Following" : "+ Follow"}
        </button>
      </header>

      <p className="relative font-serif text-[15px] leading-relaxed text-[#F5F0E8]/90 border-l-2 border-[#C9A84C]/60 pl-4">
        {animal.story}
      </p>

      <footer className="relative flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#F5F0E8]/60">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-[#2D5A27]" />
          Last-known zone:{" "}
          <span className="text-[#F5F0E8]/90 font-medium">{animal.zone}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-[#C9A84C]" />
          Updated {animal.lastUpdatedLabel}
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-[#F5F0E8]/40">
          Wildlife intelligence platform
        </span>
      </footer>
    </article>
  );
}

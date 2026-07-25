import { Heart, Sparkles } from "lucide-react";
import type { WisAnimal, WisBadge } from "./mock";

interface Props {
  animals: WisAnimal[];
  followed: Set<string>;
  onToggle: (id: string) => void;
  badges: WisBadge[];
}

export function WatchlistView({ animals, followed, onToggle, badges }: Props) {
  const followedList = animals.filter((a) => followed.has(a.id));
  const isEmpty = followedList.length === 0;

  return (
    <section className="space-y-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#C9A84C]">
            Watchlist · Wanyama Wangu
          </div>
          <h3 className="mt-1 font-serif text-2xl font-bold text-[#F5F0E8]">
            Followed animals
          </h3>
        </div>
        <span className="text-xs text-[#F5F0E8]/60">
          {followedList.length} / {animals.length} tracked
        </span>
      </header>

      {isEmpty ? (
        <EmptyState onQuickFollow={() => onToggle(animals[0]?.id)} suggestion={animals[0]} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {followedList.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-2xl border border-white/10
                         bg-white/5 backdrop-blur-xl p-4"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-lg">
                🐾
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[#F5F0E8] truncate">{a.name}</div>
                <div className="text-[11px] text-[#F5F0E8]/60 truncate">
                  {a.species} · {a.zone}
                </div>
              </div>
              <button
                onClick={() => onToggle(a.id)}
                className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-semibold text-[#F5F0E8]/70 hover:bg-white/10"
              >
                Unfollow
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Badges */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#C9A84C] mb-3">
          <Sparkles className="h-3 w-3" /> Milestones
        </div>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((b) => {
            const earned = b.id === "b-first" ? followedList.length >= 1 : b.earned;
            return (
              <div
                key={b.id}
                className={`rounded-xl border p-3 text-center transition
                  ${earned
                    ? "border-[#C9A84C]/60 bg-[#C9A84C]/10"
                    : "border-white/10 bg-white/5 opacity-60"}
                `}
              >
                <div className={`text-xl ${earned ? "text-[#C9A84C]" : "text-[#F5F0E8]/40"}`}>{b.icon}</div>
                <div className="mt-1 text-[11px] font-semibold text-[#F5F0E8]">{b.label}</div>
                <div className="text-[10px] text-[#F5F0E8]/50 leading-snug mt-0.5">{b.hint}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EmptyState({
  suggestion,
  onQuickFollow,
}: {
  suggestion?: WisAnimal;
  onQuickFollow?: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#C9A84C]/40 bg-white/5 backdrop-blur-xl p-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(201,168,76,0.15), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#C9A84C]/15 text-[#C9A84C]">
        <Heart className="h-6 w-6" />
      </div>
      <h4 className="relative mt-4 font-serif text-xl font-bold text-[#F5F0E8]">
        Start following your first animal
      </h4>
      <p className="relative mt-2 mx-auto max-w-md text-sm text-[#F5F0E8]/70">
        Your watchlist stays quiet until you follow. Get story updates whenever
        rangers file a new report on the animals you care about.
      </p>
      {suggestion && (
        <button
          onClick={onQuickFollow}
          className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-4 py-2 text-sm font-semibold text-[#1A1209] hover:brightness-105"
        >
          + Follow {suggestion.name} the {suggestion.species}
        </button>
      )}
      <div className="relative mt-3 text-[10px] uppercase tracking-wider text-[#F5F0E8]/40">
        Unlocks the “First Follow” milestone
      </div>
    </div>
  );
}

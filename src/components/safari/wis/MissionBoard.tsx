import { Target, Check, MapPin } from "lucide-react";
import type { WisMission } from "./mock";

interface Props {
  missions: WisMission[];
}

export function MissionBoard({ missions }: Props) {
  return (
    <section className="space-y-4">
      <header>
        <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#C9A84C]">
          Find & Follow · Misheni
        </div>
        <h3 className="mt-1 font-serif text-2xl font-bold text-[#F5F0E8]">
          Field missions
        </h3>
        <p className="text-sm text-[#F5F0E8]/60 mt-1 max-w-xl">
          Guided tasks that turn a game drive into wildlife intelligence. Complete
          them to earn Simba Points and unlock milestones.
        </p>
      </header>

      <ul className="grid gap-3 md:grid-cols-2">
        {missions.map((m) => (
          <MissionCard key={m.id} mission={m} />
        ))}
      </ul>
    </section>
  );
}

function MissionCard({ mission }: { mission: WisMission }) {
  const done = mission.status === "complete";
  const pct = Math.min(100, Math.round((mission.progress / mission.target) * 100));

  return (
    <li
      className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl
        ${done
          ? "border-[#2D5A27]/50 bg-[#2D5A27]/10"
          : "border-white/10 bg-white/5"}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full
            ${done ? "bg-[#2D5A27] text-[#F5F0E8]" : "bg-[#C9A84C]/15 text-[#C9A84C]"}`}
        >
          {done ? <Check className="h-4 w-4" /> : <Target className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-[#F5F0E8] leading-snug">{mission.title}</h4>
          <p className="mt-1 text-xs text-[#F5F0E8]/60 line-clamp-2">{mission.brief}</p>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#F5F0E8]/50">
            <MapPin className="h-3 w-3" /> {mission.location}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#F5F0E8]/70">
          <span>
            {mission.progress} / {mission.target}
          </span>
          <span
            className={`uppercase tracking-wider text-[10px] font-semibold
              ${done ? "text-[#2D5A27]" : "text-[#C9A84C]"}`}
          >
            {done ? "Complete" : `${pct}%`}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all
              ${done ? "bg-[#2D5A27]" : "bg-[#C9A84C]"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-3 text-[11px] text-[#F5F0E8]/60">
        <span className="text-[#C9A84C] font-semibold">Reward · </span>
        {mission.reward}
      </div>
    </li>
  );
}

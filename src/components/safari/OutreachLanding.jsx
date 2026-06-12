import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import NPSCaptureModal from "./NPSCaptureModal";

export default function OutreachLanding() {
  const [showNps, setShowNps] = useState(false);

  const steps = [
    {
      num: "01",
      icon: Calendar,
      title: "Tell us your trip",
      desc: "Dates, budget, and what you want to see.",
    },
    {
      num: "02",
      icon: Sparkles,
      title: "AI builds your itinerary",
      desc: "Personalized day-by-day in seconds.",
    },
    {
      num: "03",
      icon: CheckCircle2,
      title: "Book what you love",
      desc: "Reserve lodges and guides directly.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1209] text-white relative overflow-hidden flex flex-col">
      {/* Subtle ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,168,76,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 20% 110%, rgba(45,90,39,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* HERO */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] text-balance">
            Plan Your Kenya Safari in 2 Minutes
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/65 max-w-lg mx-auto text-pretty">
            Tell us your dates, budget, and dream experience — AI builds your
            itinerary instantly. Free.
          </p>
          <div className="mt-8">
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C9A84C] text-[#1A1209] font-semibold text-lg hover:brightness-110 transition shadow-[0_8px_30px_-8px_rgba(201,168,76,0.4)]"
            >
              Build My Safari →
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/35">
            No sign-up required. No spam. Just your safari plan.
          </p>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-6 pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <span className="text-[#C9A84C] text-[10px] font-bold tracking-[0.15em] uppercase mb-3">
                  {step.num}
                </span>
                <div className="mb-3 rounded-full bg-[#C9A84C]/10 p-2.5">
                  <step.icon className="h-5 w-5 text-[#C9A84C]" strokeWidth={2} />
                </div>
                <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">
                  {step.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="relative z-10 px-6 pb-20 sm:pb-24 text-center">
        <p className="text-sm text-white/35">
          Covers: Maasai Mara · Amboseli · Tsavo · Lake Nakuru · Samburu
        </p>
      </section>

      {/* BETA BANNER — mobile sticky */}
      <button
        onClick={() => setShowNps(true)}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#C9A84C]/90 backdrop-blur-md text-[#1A1209] text-center py-3 px-4 text-xs font-semibold cursor-pointer hover:bg-[#C9A84C] transition md:hidden"
      >
        You're in the beta. Your feedback shapes SAFARI.
      </button>

      <NPSCaptureModal isVisible={showNps} onClose={() => setShowNps(false)} />
    </div>
  );
}

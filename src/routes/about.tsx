import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, Compass, Leaf, Users, Building2, Landmark, Microscope,
  ShieldCheck, Globe2, Rocket, Heart, Award, ArrowRight,
} from "lucide-react";
import { Shell } from "@/components/safari/Shell";
import { MaasaiDivider } from "@/components/safari/MaasaiDivider";
import { images } from "@/lib/safari-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SAFARI — One Country. Every World." },
      {
        name: "description",
        content:
          "SAFARI is Kenya's AI-powered tourism and wildlife intelligence ecosystem, connecting travelers, operators, conservationists, and researchers on one intelligent platform.",
      },
      { property: "og:title", content: "About SAFARI — One Country. Every World." },
      {
        property: "og:description",
        content:
          "Kenya's intelligent tourism ecosystem — AI travel planning, wildlife intelligence, conservation, and community, unified in one platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: images.lion },
      { name: "twitter:image", content: images.lion },
    ],
  }),
  component: AboutPage,
});

function Section({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        {eyebrow && (
          <div className="font-label text-xs tracking-[0.2em] text-[var(--gold)] mb-3">
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05]">
          {title}
        </h2>
        <div className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed space-y-5 max-w-3xl">
          {children}
        </div>
      </motion.div>
    </section>
  );
}

function AboutPage() {
  const audiences = [
    { icon: Compass, title: "Travelers", body: "Plan unforgettable adventures with AI-powered itineraries, trusted recommendations, and seamless booking." },
    { icon: Users, title: "Tour Operators", body: "Reach more customers, manage bookings, and showcase authentic Kenyan experiences at global scale." },
    { icon: Building2, title: "Hotels & Lodges", body: "Increase visibility, optimize occupancy, and connect directly with travelers ready to explore." },
    { icon: Landmark, title: "National Parks", body: "Give visitors real-time information and improve park management with actionable data insights." },
    { icon: Microscope, title: "Researchers", body: "Access structured wildlife and environmental datasets that accelerate scientific discovery." },
    { icon: Leaf, title: "Conservation Orgs", body: "Monitor ecosystems, engage the public, and strengthen conservation through intelligent reporting." },
    { icon: ShieldCheck, title: "Government", body: "Support sustainable tourism planning and environmental policy with data-driven insights." },
  ];

  const values = [
    { icon: Sparkles, title: "Innovation", body: "We use AI and technology to solve real-world tourism and conservation challenges." },
    { icon: ShieldCheck, title: "Integrity", body: "We prioritize transparency, trust, and responsible data practices." },
    { icon: Leaf, title: "Sustainability", body: "Every feature is designed to support long-term environmental and community impact." },
    { icon: Heart, title: "Community", body: "We empower local businesses, guides, and communities to benefit from tourism." },
    { icon: Award, title: "Excellence", body: "We deliver reliable, secure, and world-class digital experiences." },
  ];

  const differentiators = [
    "AI-powered itinerary generation",
    "Personalized recommendations",
    "Smart budget planning",
    "Real-time wildlife insights",
    "National park intelligence",
    "Local guides and experiences",
    "Secure bookings",
    "Conservation impact tracking",
    "Offline travel assistance",
    "Sustainable travel recommendations",
  ];

  const wisInputs = [
    "Tourist observations", "Rangers", "GPS collars", "Camera traps",
    "Satellite imagery", "Weather systems", "Research institutions",
  ];
  const wisOutputs = [
    "Migration forecasting", "Species identification", "Habitat monitoring",
    "Conservation alerts", "Biodiversity analytics", "Wildlife density mapping",
  ];

  const roadmap = [
    "AI travel assistants",
    "Predictive wildlife intelligence",
    "Smart conservation tools",
    "Community tourism marketplace",
    "Research collaboration platform",
    "Government analytics dashboards",
    "Offline-first mobile experiences",
    "Cross-border East African tourism integration",
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-7xl space-y-20 sm:space-y-28 pb-16">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl grain">
          <div className="absolute inset-0">
            <img
              src={images.lion}
              alt="Lion at golden hour across the Maasai Mara plains"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/55 to-black/20" />
          </div>
          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                <Globe2 className="h-3.5 w-3.5 text-[var(--gold)]" />
                About SAFARI
              </span>
              <h1 className="mt-5 font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95]">
                One Country.{" "}
                <span className="bg-gradient-to-r from-[var(--gold)] via-amber-200 to-white bg-clip-text text-transparent">
                  Every World.
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
                SAFARI is Kenya's AI-powered unified tourism and wildlife intelligence ecosystem —
                connecting travelers, operators, hotels, conservationists, researchers, and
                government agencies through one intelligent platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/plan"
                  className="shimmer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--maasai)] text-white font-semibold shadow-[var(--shadow-glow-gold)] hover:scale-[1.02] transition"
                >
                  <Sparkles className="h-4 w-4" /> Plan with AI
                </Link>
                <a
                  href="#mission"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/25 text-white font-medium hover:bg-white/20 transition"
                >
                  Read our story <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* INTRO / WHAT WE DO */}
        <Section eyebrow="What we are" title="Kenya's intelligent tourism ecosystem.">
          <p>
            Traditional booking sites move transactions. SAFARI moves intelligence. We combine
            AI travel planning, wildlife intelligence, smart booking, conservation, research,
            real-time wildlife tracking, local experiences, and sustainable tourism into a single,
            coherent platform.
          </p>
          <p>
            Our goal is simple: make exploring Kenya effortless for the world, while protecting
            its wildlife and empowering the communities who call it home.
          </p>
        </Section>

        <MaasaiDivider />

        {/* MISSION + VISION */}
        <section id="mission" className="grid gap-6 lg:grid-cols-2">
          {[
            {
              eyebrow: "Mission",
              title: "Transform how the world experiences Kenya.",
              body: "We combine artificial intelligence, conservation, and tourism into one seamless digital ecosystem that benefits travelers, businesses, wildlife, and future generations.",
              icon: Rocket,
            },
            {
              eyebrow: "Vision",
              title: "Africa's leading intelligent tourism ecosystem.",
              body: "A future where every journey contributes to conservation, local economic growth, and unforgettable experiences across the continent.",
              icon: Globe2,
            },
          ].map((c, i) => (
            <motion.article
              key={c.eyebrow}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden"
            >
              <c.icon className="absolute -right-6 -bottom-6 h-40 w-40 text-[var(--gold)]/10" />
              <div className="font-label text-xs tracking-[0.2em] text-[var(--gold)]">
                {c.eyebrow}
              </div>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold leading-tight">
                {c.title}
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{c.body}</p>
            </motion.article>
          ))}
        </section>

        {/* OUR STORY */}
        <Section eyebrow="Our story" title="Kenya is extraordinary. Its digital experience should be too.">
          <p>
            Kenya is home to some of the world's greatest natural wonders — yet planning a trip
            often means stitching together disconnected websites, phone calls, and guesswork.
          </p>
          <p>
            Travelers struggle to find trusted information. Tour operators struggle to reach
            global customers. Conservation organizations lack accessible public engagement.
            Researchers work with fragmented data. Communities miss economic opportunities.
          </p>
          <p>
            SAFARI was created to bring everything together. By combining modern AI with Kenya's
            incredible tourism ecosystem, we've built one intelligent platform where travel
            planning, wildlife conservation, local businesses, and environmental research work
            in concert — so every trip becomes an opportunity to support conservation and the
            communities that steward these landscapes.
          </p>
        </Section>

        <MaasaiDivider />

        {/* WHAT MAKES US DIFFERENT */}
        <section>
          <Section eyebrow="What makes us different" title="Built around intelligence, not transactions.">
            <p>
              Every feature is engineered to make Kenya more discoverable, more sustainable, and
              more rewarding — for the traveler, the operator, and the ecosystem itself.
            </p>
          </Section>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {differentiators.map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="glass rounded-xl p-4 flex items-center gap-3"
              >
                <span className="h-8 w-8 grid place-items-center rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium">{d}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WIS */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[var(--forest)]/10 via-transparent to-[var(--gold)]/10 p-8 sm:p-12">
          <div className="font-label text-xs tracking-[0.2em] text-[var(--gold)]">
            Wildlife Intelligence System
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
            WIS — the AI engine behind conservation and discovery.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-3xl leading-relaxed">
            WIS transforms noisy, fragmented signals from the field into meaningful insights that
            help protect wildlife while improving every visitor's experience.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <div className="font-label text-xs tracking-widest text-muted-foreground">Signals in</div>
              <ul className="mt-4 space-y-2">
                {wisInputs.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="font-label text-xs tracking-widest text-muted-foreground">
                Intelligence out
              </div>
              <ul className="mt-4 space-y-2">
                {wisOutputs.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* WHO WE SERVE */}
        <section>
          <Section eyebrow="Who we serve" title="One platform. Seven ecosystems.">
            <p>
              SAFARI is designed for everyone whose work or wonder touches Kenya's tourism and
              conservation landscape.
            </p>
          </Section>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {audiences.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass rounded-2xl p-6 hover:shadow-[var(--shadow-elevated)] transition"
              >
                <div className="h-10 w-10 rounded-xl grid place-items-center bg-[var(--gold)]/15 text-[var(--gold)]">
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <MaasaiDivider />

        {/* SUSTAINABILITY */}
        <Section eyebrow="Sustainability" title="Every journey should leave a positive impact.">
          <p>
            SAFARI promotes responsible tourism by encouraging eco-friendly travel, supporting
            conservation projects, highlighting community-owned businesses, and helping visitors
            understand the importance of protecting Kenya's natural heritage — one trip at a time.
          </p>
        </Section>

        {/* VALUES */}
        <section>
          <Section eyebrow="Core values" title="Principles that shape every decision.">
            <p>The commitments that keep us honest as we scale.</p>
          </Section>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <motion.article
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <v.icon className="h-6 w-6 text-[var(--maasai)]" />
                <h3 className="mt-4 font-display text-xl font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* WHY KENYA */}
        <Section eyebrow="Why Kenya" title="A country of extraordinary diversity.">
          <p>
            From world-famous wildlife reserves and the Great Migration to pristine beaches,
            mountains, forests, lakes, deserts, and a vibrant cultural heritage — Kenya is a
            continent unto itself.
          </p>
          <p>
            SAFARI brings these experiences together into one intelligent platform, so every
            traveler can discover the country with confidence, clarity, and care.
          </p>
        </Section>

        {/* LOOKING AHEAD */}
        <section className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 sm:p-12">
          <div className="font-label text-xs tracking-[0.2em] text-[var(--gold)]">
            Looking ahead
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl">
            We're building Africa's digital tourism infrastructure.
          </h2>
          <p className="mt-5 text-background/70 max-w-2xl leading-relaxed">
            SAFARI is more than a travel platform. Our roadmap extends across intelligence,
            community, research, and government — the systems that will shape the next decade of
            African tourism.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roadmap.map((r) => (
              <div
                key={r}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <ArrowRight className="h-4 w-4 text-[var(--gold)]" />
                <span className="text-sm font-medium">{r}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Karibu. Come explore with intelligence.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Plan your first AI-powered Kenyan journey today — every trip supports conservation
            and the communities behind it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/plan"
              className="shimmer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--maasai)] text-white font-semibold shadow-[var(--shadow-glow-gold)] hover:scale-[1.02] transition"
            >
              <Sparkles className="h-4 w-4" /> Plan with AI
            </Link>
            <Link
              to="/wildlife"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border font-medium hover:bg-foreground/5 transition"
            >
              Explore Wildlife Intelligence <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}

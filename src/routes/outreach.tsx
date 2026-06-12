import { createFileRoute } from "@tanstack/react-router";
import OutreachLanding from "@/components/safari/OutreachLanding";

export const Route = createFileRoute("/outreach")({
  head: () => ({
    meta: [
      { title: "Plan Your Kenya Safari in 2 Minutes · SAFARI" },
      {
        name: "description",
        content:
          "Build a free AI-generated Kenya safari itinerary in 2 minutes. No sign-up required. Covers Maasai Mara, Amboseli, Tsavo & more.",
      },
      { property: "og:title", content: "Plan Your Kenya Safari in 2 Minutes · SAFARI" },
      {
        property: "og:description",
        content:
          "AI builds your personalized Kenya safari itinerary instantly. Free, no spam.",
      },
    ],
  }),
  component: OutreachLanding,
});

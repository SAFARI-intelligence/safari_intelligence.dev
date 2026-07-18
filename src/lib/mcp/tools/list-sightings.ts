import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { sightings } from "@/lib/safari-data";

export default defineTool({
  name: "list_sightings",
  title: "List wildlife sightings",
  description:
    "Return recent AI-detected wildlife sightings across SAFARI's parks (zone-level, delayed for conservation safety). Optionally filter by species or park.",
  inputSchema: {
    species: z.string().optional().describe("Species name, e.g. Lion, Elephant, Cheetah."),
    park: z.string().optional().describe("Park name, e.g. Maasai Mara, Serengeti."),
    limit: z.number().int().min(1).max(50).optional().describe("Max sightings to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ species, park, limit }) => {
    const rows = sightings
      .filter((s) => !species || s.species.toLowerCase() === species.toLowerCase())
      .filter((s) => !park || s.park.toLowerCase() === park.toLowerCase())
      .slice(0, limit ?? 20)
      .map(({ image: _image, ...rest }) => rest);
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { sightings: rows, delayNotice: "Coordinates zone-level; data delayed ~2h." },
    };
  },
});

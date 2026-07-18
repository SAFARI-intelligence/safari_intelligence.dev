import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { parks } from "@/lib/safari-data";

export default defineTool({
  name: "list_parks",
  title: "List parks",
  description:
    "List East African safari parks tracked by SAFARI, with country, live AI sighting counts, weather, status, and highlights.",
  inputSchema: {
    country: z
      .enum(["Kenya", "Tanzania", "Uganda", "Rwanda"])
      .optional()
      .describe("Optional filter by country."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ country }) => {
    const rows = parks
      .filter((p) => !country || p.country === country)
      .map(({ image: _image, ...rest }) => rest);
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { parks: rows },
    };
  },
});

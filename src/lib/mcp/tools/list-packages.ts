import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { packages } from "@/lib/safari-data";

export default defineTool({
  name: "list_safari_packages",
  title: "List safari packages",
  description:
    "Browse bookable SAFARI packages with price in KSh/USD, duration, country, inclusions and rating. Optionally filter by country or max price.",
  inputSchema: {
    country: z.string().optional().describe("Country name filter."),
    maxPriceUsd: z.number().positive().optional().describe("Max package price in USD."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ country, maxPriceUsd }) => {
    const rows = packages
      .filter((p) => !country || p.country.toLowerCase() === country.toLowerCase())
      .filter((p) => !maxPriceUsd || p.priceUsd <= maxPriceUsd)
      .map(({ image: _image, ...rest }) => rest);
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { packages: rows },
    };
  },
});

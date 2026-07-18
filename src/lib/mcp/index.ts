import { defineMcp } from "@lovable.dev/mcp-js";
import listParks from "./tools/list-parks";
import listSightings from "./tools/list-sightings";
import listPackages from "./tools/list-packages";

export default defineMcp({
  name: "safari-mcp",
  title: "SAFARI",
  version: "0.1.0",
  instructions:
    "Public read-only tools for the SAFARI East African tourism platform. Use these to browse parks, recent wildlife sightings (zone-level, delayed ~2h for conservation safety), and bookable safari packages with pricing in KSh and USD.",
  tools: [listParks, listSightings, listPackages],
});

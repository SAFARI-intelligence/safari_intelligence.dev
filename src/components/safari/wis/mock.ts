export type WisAnimal = {
  id: string;
  name: string;
  species: string;
  swahili: string;
  zone: string;
  park: string;
  story: string;
  lastUpdatedLabel: string; // relative, human — never "real-time"
  followers: number;
  conservation: "Least Concern" | "Vulnerable" | "Endangered" | "Critically Endangered";
};

export type WisMission = {
  id: string;
  title: string;
  brief: string;
  location: string;
  target: number;
  progress: number;
  reward: string;
  status: "active" | "complete";
};

export type WisZone = {
  id: string;
  label: string;
  activity: "high" | "medium" | "low";
  // svg polygon points
  points: string;
};

export type WisBadge = {
  id: string;
  label: string;
  earned: boolean;
  icon: string;
  hint: string;
};

export const MOCK_ANIMALS: WisAnimal[] = [
  {
    id: "lion-001",
    name: "Simba",
    species: "African Lion",
    swahili: "Simba wa Afrika",
    zone: "Northern Conservancy",
    park: "Maasai Mara",
    story:
      "Simba has held the Marsh Pride for three seasons. Rangers noted him leading a coalition patrol along the Talek River this morning, a rare daytime movement suggesting a shift in territory.",
    lastUpdatedLabel: "about 2 hours ago",
    followers: 3847,
    conservation: "Vulnerable",
  },
  {
    id: "ele-014",
    name: "Nuru",
    species: "African Elephant",
    swahili: "Ndovu",
    zone: "Ol Tukai Woodlands",
    park: "Amboseli",
    story:
      "The Nuru herd continues its slow browse west of the woodlands. Two new calves were observed shadowing the matriarch — the family group has grown to eleven in the last quarter.",
    lastUpdatedLabel: "earlier today",
    followers: 2104,
    conservation: "Endangered",
  },
  {
    id: "chz-007",
    name: "Kimya",
    species: "Cheetah",
    swahili: "Duma",
    zone: "Southern Plains",
    park: "Maasai Mara",
    story:
      "Kimya's three cubs are now mobile. Rangers spotted the family testing a hunting stalk on Thomson's gazelle at first light — the first coordinated attempt from the young ones.",
    lastUpdatedLabel: "yesterday",
    followers: 1592,
    conservation: "Vulnerable",
  },
];

export const MOCK_MISSIONS: WisMission[] = [
  {
    id: "m-001",
    title: "Spot a lion in Maasai Mara",
    brief: "Log a lion sighting during your next Mara game drive.",
    location: "Maasai Mara",
    target: 1,
    progress: 0,
    reward: "150 Simba Points + First Sighting badge",
    status: "active",
  },
  {
    id: "m-002",
    title: "Track the great migration",
    brief: "Report 3 wildebeest crossings between July and October.",
    location: "Mara River corridor",
    target: 3,
    progress: 2,
    reward: "400 Simba Points + Migration Watcher badge",
    status: "active",
  },
  {
    id: "m-003",
    title: "Amboseli elephant census",
    brief: "Contribute 5 herd observations for conservation research.",
    location: "Amboseli",
    target: 5,
    progress: 5,
    reward: "600 Simba Points + Guardian badge",
    status: "complete",
  },
];

export const MOCK_ZONES: WisZone[] = [
  { id: "z-a", label: "Zone A · Northern Conservancy", activity: "high", points: "40,60 180,45 200,130 55,150" },
  { id: "z-b", label: "Zone B · Talek Corridor", activity: "medium", points: "200,130 340,110 360,200 220,220" },
  { id: "z-c", label: "Zone C · Southern Plains", activity: "high", points: "55,150 220,220 205,300 60,290" },
  { id: "z-d", label: "Zone D · Mara River", activity: "low", points: "220,220 360,200 380,290 205,300" },
];

export const MOCK_BADGES: WisBadge[] = [
  { id: "b-first", label: "First Follow", earned: false, icon: "★", hint: "Follow your first animal" },
  { id: "b-three", label: "Trio", earned: false, icon: "✦", hint: "Follow 3 animals" },
  { id: "b-story", label: "Story Reader", earned: false, icon: "❦", hint: "Read 10 wildlife stories" },
];

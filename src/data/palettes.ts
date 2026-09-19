import {
  christmasColors,
  coffeeColors,
  coldColors,
  creamColors,
  cyberpunkColors,
  galaxyColors,
  goldColors,
  halloweenColors,
  initialTailwindColors,
  kidsColors,
  neonColors,
  pastelColors,
  rainbowColors,
  ramadhanColors,
  retroColors,
  seaColors,
  skyColors,
  spaceXColors,
  summerColors,
  sunsetColors,
  vintageColors,
  warmColors,
  weddingColors,
} from "@/utils/color";

export interface PaletteSection {
  title: string;
  category: string;
  colors: Record<string, string>;
}

export const PALETTE_CATEGORIES = [
  "All",
  "Nature",
  "Seasonal",
  "Mood",
  "Themed",
  "Aesthetic",
] as const;

export type PaletteCategory = (typeof PALETTE_CATEGORIES)[number];

export const allPalettes: PaletteSection[] = [
  { title: "Tailwind CSS", category: "Aesthetic", colors: initialTailwindColors },
  { title: "Pastel", category: "Aesthetic", colors: pastelColors },
  { title: "Retro", category: "Aesthetic", colors: retroColors },
  { title: "Vintage", category: "Aesthetic", colors: vintageColors },
  { title: "Neon", category: "Mood", colors: neonColors },
  { title: "Gold & Metallic", category: "Aesthetic", colors: goldColors },
  { title: "Warm", category: "Mood", colors: warmColors },
  { title: "Cold", category: "Mood", colors: coldColors },
  { title: "Summer", category: "Seasonal", colors: summerColors },
  { title: "Sunset", category: "Nature", colors: sunsetColors },
  { title: "Sky", category: "Nature", colors: skyColors },
  { title: "Sea & Ocean", category: "Nature", colors: seaColors },
  { title: "Coffee", category: "Themed", colors: coffeeColors },
  { title: "Cream", category: "Themed", colors: creamColors },
  { title: "Kids", category: "Themed", colors: kidsColors },
  { title: "Rainbow", category: "Aesthetic", colors: rainbowColors },
  { title: "Space", category: "Themed", colors: spaceXColors },
  { title: "Galaxy", category: "Themed", colors: galaxyColors },
  { title: "Cyberpunk", category: "Mood", colors: cyberpunkColors },
  { title: "Wedding", category: "Themed", colors: weddingColors },
  { title: "Halloween", category: "Seasonal", colors: halloweenColors },
  { title: "Christmas", category: "Seasonal", colors: christmasColors },
  { title: "Ramadhan", category: "Seasonal", colors: ramadhanColors },
];

import type { ColorFormat } from "@/hooks/color-main";

export const COLOR_FORMAT_OPTIONS: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "rgba", label: "RGBA" },
  { value: "hsl", label: "HSL" },
  { value: "hsla", label: "HSLA" },
  { value: "cmyk", label: "CMYK" },
];

export const COPIED_RESET_MS = 1500;

export const PALETTE_INITIAL_VISIBLE = 6;

export const FOLDER_FLOAT_ITEMS = [
  "Pick & convert colors",
  "Generate harmonies",
  "Build gradients",
  "Check contrast (WCAG)",
  "Blend two colors",
  "Extract from image",
];

export const FOLDER_FLOAT_LABEL = "Color Tools";
export const FOLDER_FLOAT_SUBLABEL = "6 features";

export const TOOLS_NAV = [
  { id: "picker", label: "Color Picker" },
  { id: "harmony", label: "Harmony" },
  { id: "gradient", label: "Gradient" },
  { id: "contrast", label: "Contrast" },
  { id: "blender", label: "Blender" },
  { id: "extract", label: "Extractor" },
  { id: "saved", label: "Saved" },
] as const;

export const HARMONY_TYPES = [
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "tetradic", label: "Tetradic" },
  { value: "split-complementary", label: "Split Complementary" },
] as const;

export const HARMONY_DESCRIPTIONS: Record<string, string> = {
  complementary: "Two colors opposite on the color wheel for maximum contrast",
  analogous: "Colors adjacent on the wheel for harmonious schemes",
  triadic: "Three colors evenly spaced (120°) for balanced palettes",
  tetradic: "Four colors forming a rectangle for diverse schemes",
  "split-complementary": "A base color and two adjacent to its complement",
};

export const GRADIENT_DIRECTIONS = [
  { value: "to right", label: "→ Right" },
  { value: "to left", label: "← Left" },
  { value: "to bottom", label: "↓ Down" },
  { value: "to top", label: "↑ Up" },
  { value: "to bottom right", label: "↘ Bottom Right" },
  { value: "to top right", label: "↗ Top Right" },
  { value: "45deg", label: "45°" },
  { value: "90deg", label: "90°" },
  { value: "135deg", label: "135°" },
  { value: "180deg", label: "180°" },
] as const;

export const BLEND_STEPS_MIN = 2;
export const BLEND_STEPS_MAX = 20;
export const BLEND_DEFAULT_COLOR1 = "#7c3aed";
export const BLEND_DEFAULT_COLOR2 = "#f97316";

export const CONTRAST_DEFAULT_FG = "#ffffff";
export const CONTRAST_DEFAULT_BG = "#7c3aed";

export const WCAG_SCORES = [
  { key: "aa", label: "AA Normal", req: "≥ 4.5:1" },
  { key: "aaa", label: "AAA Normal", req: "≥ 7:1" },
  { key: "aaLarge", label: "AA Large", req: "≥ 3:1" },
  { key: "aaaLarge", label: "AAA Large", req: "≥ 4.5:1" },
] as const;

export const GRADIENT_DEFAULT_COLORS = ["#7c3aed", "#ec4899", "#f97316"];

export const PASTE_COLOR_EXAMPLES = ["rgb(0,0,0)", "hsl(220,10%,98%)", "rgba(0,0,0,0.5)"];

export const SAVED_COLORS_KEY = "color-generator-saved-colors";
export const COLOR_HISTORY_KEY = "color-generator-history";
export const HISTORY_POLL_MS = 2000;

export const LIGHT_TUNNEL_CONFIG = {
  cableColor: "#A855F7",
  pulseColor: "#A855F7",
  tunnelColor: "#5227FF",
  tunnelOpacity: 0,
  speed: 0.1,
  pulseSpeed: 2,
  pulseLength: 0.28,
  pulseBlend: 1,
  pulseWidth: 1,
  cableCount: 20,
  thickness: 0.35,
  rimWidth: 0.15,
  waviness: 0.3,
  sway: 0.5,
  size: 1.5,
  centerX: 0,
  centerY: 0,
  glow: 1,
  fadeNear: 0.5,
  fadeFar: 2,
  brightness: 1,
  colorVariance: true,
  grain: true,
  grainIntensity: 0.05,
  opacity: 0.8,
  mouseInteraction: true,
  mouseStrength: 0.1,
} as const;

export const FOLDER_FLOAT_CONFIG = {
  folderColor: "#3f3f46",
  frontColor: "#52525b",
  paperColor: "#f5f5f5",
  itemColor: "#f5f5f5",
  itemTextColor: "#18181b",
  labelColor: "#f5f5f5",
  width: 200,
  height: 148,
  radius: 14,
  spread: 240,
  lift: 26,
  tilt: 8,
  flapAngle: 34,
  restAngle: 16,
  openDuration: 520,
  stagger: 45,
  bounce: 0.3,
  drift: 0.5,
} as const;

// ============================================================
// Color Harmony Types
// ============================================================

export type HarmonyType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "tetradic"
  | "split-complementary";

export const harmonyDescriptions: Record<HarmonyType, string> = {
  complementary: "Two colors opposite on the color wheel for maximum contrast",
  analogous: "Colors adjacent on the wheel for harmonious schemes",
  triadic: "Three colors evenly spaced (120°) for balanced palettes",
  tetradic: "Four colors forming a rectangle for diverse schemes",
  "split-complementary": "A base color and two adjacent to its complement",
};

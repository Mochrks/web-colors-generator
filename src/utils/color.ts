import type {
  ColorData,
  ColorFormat,
  GradientDirection,
  GradientType,
  HSL,
  RGB,
  CMYK,
} from "@/types/color-main";
import { SAVED_COLORS_KEY, COLOR_HISTORY_KEY } from "@/constants";

export function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) =>
        Math.max(0, Math.min(255, Math.round(x)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

export function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace("#", "");
  let fullHex = cleaned;
  if (cleaned.length === 3) {
    fullHex = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export function cmykToRgb(c: number, m: number, y: number, k: number): RGB {
  const cc = c / 100;
  const mm = m / 100;
  const yy = y / 100;
  const kk = k / 100;
  return {
    r: Math.round(255 * (1 - cc) * (1 - kk)),
    g: Math.round(255 * (1 - mm) * (1 - kk)),
    b: Math.round(255 * (1 - yy) * (1 - kk)),
  };
}

export function colorDataFromRgba(r: number, g: number, b: number, a: number = 1): ColorData {
  const hsl = rgbToHsl(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    rgba: { r, g, b, a },
    hsl,
    hsla: { ...hsl, a },
    cmyk,
  };
}

export function colorDataFromHex(hex: string): ColorData {
  const rgb = hexToRgb(hex);
  return colorDataFromRgba(rgb.r, rgb.g, rgb.b, 1);
}

export function colorDataFromHsl(h: number, s: number, l: number): ColorData {
  const rgb = hslToRgb(h, s, l);
  return colorDataFromRgba(rgb.r, rgb.g, rgb.b, 1);
}

export function parseColorString(input: string): ColorData | null {
  const trimmed = input.trim().toLowerCase();

  if (/^#?([a-f\d]{3}|[a-f\d]{6}|[a-f\d]{8})$/i.test(trimmed)) {
    let hex = trimmed.startsWith("#") ? trimmed : "#" + trimmed;
    if (hex.length === 9) {
      hex = hex.substring(0, 7);
    }
    const rgb = hexToRgb(hex);
    return colorDataFromRgba(rgb.r, rgb.g, rgb.b, 1);
  }

  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return colorDataFromRgba(r, g, b, a);
  }

  const hslMatch = trimmed.match(
    /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]);
    const l = parseInt(hslMatch[3]);
    const a = hslMatch[4] !== undefined ? parseFloat(hslMatch[4]) : 1;
    const rgb = hslToRgb(h, s, l);
    return colorDataFromRgba(rgb.r, rgb.g, rgb.b, a);
  }

  const cmykMatch = trimmed.match(
    /^cmyk\(\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/
  );
  if (cmykMatch) {
    const c = parseInt(cmykMatch[1]);
    const m = parseInt(cmykMatch[2]);
    const y = parseInt(cmykMatch[3]);
    const k = parseInt(cmykMatch[4]);
    const rgb = cmykToRgb(c, m, y, k);
    return colorDataFromRgba(rgb.r, rgb.g, rgb.b, 1);
  }

  return null;
}

export function formatColor(data: ColorData, format: ColorFormat): string {
  switch (format) {
    case "hex":
      return data.hex;
    case "rgb":
      return `rgb(${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b})`;
    case "rgba":
      return `rgba(${data.rgba.r}, ${data.rgba.g}, ${data.rgba.b}, ${data.rgba.a})`;
    case "hsl":
      return `hsl(${data.hsl.h}, ${data.hsl.s}%, ${data.hsl.l}%)`;
    case "hsla":
      return `hsla(${data.hsla.h}, ${data.hsla.s}%, ${data.hsla.l}%, ${data.hsla.a})`;
    case "cmyk":
      return `cmyk(${data.cmyk.c}%, ${data.cmyk.m}%, ${data.cmyk.y}%, ${data.cmyk.k}%)`;
  }
}

export const getColorString = (
  h: number,
  s: number,
  l: number,
  format: ColorFormat = "hsl"
): string => {
  const rgb = hslToRgb(h, s, l);
  const data = colorDataFromRgba(rgb.r, rgb.g, rgb.b, 1);
  return formatColor(data, format);
};

export function generateGradation(hex: string, steps: number = 11): ColorData[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const results: ColorData[] = [];
  for (let i = 0; i < steps; i++) {
    const l = Math.round((95 / (steps - 1)) * i + (i === 0 ? 5 : 0));
    const lightness = Math.max(5, Math.min(95, 95 - l + 5));
    const rgbVal = hslToRgb(hsl.h, hsl.s, lightness);
    results.push(colorDataFromRgba(rgbVal.r, rgbVal.g, rgbVal.b));
  }
  return results;
}

export function generateShades(hex: string, count: number = 10): ColorData[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const results: ColorData[] = [];
  for (let i = 0; i < count; i++) {
    const lightness = Math.round((100 / (count + 1)) * (i + 1));
    const rgbVal = hslToRgb(hsl.h, hsl.s, lightness);
    results.push(colorDataFromRgba(rgbVal.r, rgbVal.g, rgbVal.b));
  }
  return results;
}

export function getComplementary(hex: string): ColorData[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const comp = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
  return [colorDataFromRgba(rgb.r, rgb.g, rgb.b), colorDataFromRgba(comp.r, comp.g, comp.b)];
}

export function getAnalogous(hex: string): ColorData[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [-30, -15, 0, 15, 30].map((offset) => {
    const h = (hsl.h + offset + 360) % 360;
    const rgbVal = hslToRgb(h, hsl.s, hsl.l);
    return colorDataFromRgba(rgbVal.r, rgbVal.g, rgbVal.b);
  });
}

export function getTriadic(hex: string): ColorData[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [0, 120, 240].map((offset) => {
    const h = (hsl.h + offset) % 360;
    const rgbVal = hslToRgb(h, hsl.s, hsl.l);
    return colorDataFromRgba(rgbVal.r, rgbVal.g, rgbVal.b);
  });
}

export function getTetradic(hex: string): ColorData[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [0, 90, 180, 270].map((offset) => {
    const h = (hsl.h + offset) % 360;
    const rgbVal = hslToRgb(h, hsl.s, hsl.l);
    return colorDataFromRgba(rgbVal.r, rgbVal.g, rgbVal.b);
  });
}

export function getSplitComplementary(hex: string): ColorData[] {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return [0, 150, 210].map((offset) => {
    const h = (hsl.h + offset) % 360;
    const rgbVal = hslToRgb(h, hsl.s, hsl.l);
    return colorDataFromRgba(rgbVal.r, rgbVal.g, rgbVal.b);
  });
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getWcagRating(ratio: number): {
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
} {
  return {
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

export function blendColors(hex1: string, hex2: string, steps: number = 5): ColorData[] {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const result: ColorData[] = [];
  for (let i = 0; i <= steps + 1; i++) {
    const t = i / (steps + 1);
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t);
    result.push(colorDataFromRgba(r, g, b));
  }
  return result;
}

export function generateRandomColor(): string {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

export function generateRandomPalette(count: number = 5): ColorData[] {
  const baseHue = Math.floor(Math.random() * 360);
  return Array.from({ length: count }, (_, i) => {
    const h = (baseHue + (360 / count) * i) % 360;
    const s = 50 + Math.floor(Math.random() * 30);
    const l = 40 + Math.floor(Math.random() * 30);
    const rgb = hslToRgb(h, s, l);
    return colorDataFromRgba(rgb.r, rgb.g, rgb.b);
  });
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export function isValidHex(hex: string): boolean {
  return /^#?([a-fA-F\d]{3}|[a-fA-F\d]{6})$/.test(hex);
}

export function getLuminance(hex: string): "light" | "dark" {
  const rgb = hexToRgb(hex);
  const lum = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  return lum > 0.179 ? "light" : "dark";
}

export function getTextColor(hex: string): string {
  return getLuminance(hex) === "light" ? "#000000" : "#ffffff";
}

export function generateGradientCSS(
  colors: string[],
  type: GradientType = "linear",
  direction: GradientDirection = "to right"
): string {
  const colorStops = colors.join(", ");
  switch (type) {
    case "linear":
      return `linear-gradient(${direction}, ${colorStops})`;
    case "radial":
      return `radial-gradient(circle, ${colorStops})`;
    case "conic":
      return `conic-gradient(${colorStops})`;
  }
}

export function getSavedColors(): string[] {
  try {
    const data = localStorage.getItem(SAVED_COLORS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveColor(hex: string): void {
  const saved = getSavedColors();
  if (!saved.includes(hex)) {
    saved.unshift(hex);
    localStorage.setItem(SAVED_COLORS_KEY, JSON.stringify(saved.slice(0, 50)));
  }
}

export function removeSavedColor(hex: string): void {
  const saved = getSavedColors().filter((c) => c !== hex);
  localStorage.setItem(SAVED_COLORS_KEY, JSON.stringify(saved));
}

export function getColorHistory(): string[] {
  try {
    const data = localStorage.getItem(COLOR_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(hex: string): void {
  const history = getColorHistory().filter((c) => c !== hex);
  history.unshift(hex);
  localStorage.setItem(COLOR_HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
}

export const initialTailwindColors = {
  red: "#EF4444",
  orange: "#F97316",
  amber: "#F59E0B",
  yellow: "#EAB308",
  lime: "#84CC16",
  green: "#22C55E",
  emerald: "#10B981",
  teal: "#14B8A6",
  cyan: "#06B6D4",
  sky: "#0EA5E9",
  blue: "#3B82F6",
  indigo: "#6366F1",
  violet: "#8B5CF6",
  purple: "#A855F7",
  fuchsia: "#D946EF",
  pink: "#EC4899",
  rose: "#F43F5E",
};

export const pastelColors = {
  pink: "#FFD1DC",
  blue: "#BFEFFF",
  green: "#C1FFC1",
  yellow: "#FFFACD",
  purple: "#E6E6FA",
  orange: "#FFDAB9",
  red: "#FFA07A",
  mint: "#98FF98",
};

export const retroColors = {
  mustard: "#FFD800",
  avocado: "#568203",
  orange: "#FF7518",
  brown: "#8B4513",
  teal: "#008080",
  rust: "#B7410E",
  olive: "#808000",
  burgundy: "#800020",
};

export const vintageColors = {
  cream: "#FFFDD0",
  dustyRose: "#DCAE96",
  sage: "#9DC183",
  navy: "#000080",
  maroon: "#800000",
  goldenrod: "#DAA520",
  sepia: "#704214",
  lavender: "#E6E6FA",
};

export const neonColors = {
  pink: "#FF6EC7",
  blue: "#00FFFF",
  green: "#39FF14",
  yellow: "#FFFF00",
  orange: "#FF9933",
  purple: "#FF00FF",
  red: "#FF3131",
  lime: "#CCFF00",
};

export const goldColors = {
  yellow: "#FFD700",
  rose: "#ECC5C0",
  champagne: "#F7E7CE",
  bronze: "#CD7F32",
  copper: "#B87333",
  antique: "#CFAA88",
  pale: "#E6BE8A",
  deep: "#B8860B",
};

export const warmColors = {
  terracotta: "#E2725B",
  rust: "#B7410E",
  coral: "#FF7F50",
  peach: "#FFCBA4",
  burnt_sienna: "#E97451",
  clay: "#B94E31",
  adobe: "#D3A394",
  cinnamon: "#D2691E",
};

export const coldColors = {
  arctic: "#A5F2F3",
  glacier: "#7FCDBB",
  winter_blue: "#89CFF0",
  sage: "#9DC183",
  mint: "#98FB98",
  ice: "#A4F4F4",
  steel: "#71797E",
  lavender: "#E6E6FA",
};

export const summerColors = {
  sunshine: "#FFD700",
  mango: "#FFC324",
  watermelon: "#FC6C85",
  tropical_green: "#00FF7F",
  ocean_blue: "#4F94CD",
  coral_pink: "#FF7F9C",
  sunflower: "#FFC000",
  palm_leaf: "#32CD32",
};

export const sunsetColors = {
  tangerine: "#FFA500",
  crimson: "#DC143C",
  lavender_pink: "#FFC0CB",
  deep_orange: "#FF4500",
  soft_purple: "#9370DB",
  salmon: "#FA8072",
  golden_yellow: "#FFD700",
  dusty_rose: "#DC143C",
};

export const skyColors = {
  dawn_blue: "#87CEEB",
  cloud_white: "#F0F8FF",
  twilight_purple: "#8A4FFF",
  morning_mist: "#B0E0E6",
  horizon_blue: "#4682B4",
  pale_azure: "#87CEFA",
  silver_lining: "#C0C0C0",
  soft_periwinkle: "#CCCCFF",
};

export const seaColors = {
  caribbean: "#00CED1",
  deep_ocean: "#191970",
  turquoise: "#40E0D0",
  marine_blue: "#0077BE",
  aquamarine: "#7FFFD4",
  teal_green: "#008080",
  seafoam: "#98FB98",
  navy_blue: "#000080",
};

export const coffeeColors = {
  espresso: "#3C1414",
  latte: "#967259",
  cappuccino: "#A0522D",
  mocha: "#7B3F00",
  caramel: "#AF6E4D",
  hazelnut: "#8E4A49",
  americano: "#4B3621",
  cinnamon: "#7F4F24",
};

export const creamColors = {
  vanilla: "#F3E5AB",
  ivory: "#FFFFF0",
  buttercream: "#FFFD94",
  eggshell: "#F0EAD6",
  cream: "#FFFDD0",
  pearl: "#F0F0E0",
  champagne: "#F7E7CE",
  soft_beige: "#D2B48C",
};

export const kidsColors = {
  bubblegum: "#FFB6C1",
  sunshine: "#FFD700",
  sky_blue: "#87CEEB",
  grass_green: "#90EE90",
  candy_pink: "#FF69B4",
  orange: "#FFA500",
  lavender: "#E6E6FA",
  mint: "#98FB98",
};

export const rainbowColors = {
  red: "#FF0000",
  orange: "#FF7F00",
  yellow: "#FFFF00",
  green: "#00FF00",
  blue: "#0000FF",
  indigo: "#4B0082",
  violet: "#9400D3",
  pastel_rainbow: "#FF6B6B",
};

export const spaceXColors = {
  rocket_grey: "#708090",
  solar_panel: "#36454F",
  mission_blue: "#1E456E",
  titanium: "#8C8C8C",
  starship_silver: "#C0C0C0",
  mars_red: "#B22222",
  lunar_white: "#F0F0F0",
  deep_space: "#191970",
};

export const galaxyColors = {
  nebula_purple: "#4B0082",
  cosmic_blue: "#000080",
  stellar_pink: "#FF69B4",
  supernova: "#FF4500",
  dark_matter: "#2F4F4F",
  aurora: "#00CED1",
  plasma: "#FF00FF",
  stardust: "#B0C4DE",
};

export const cyberpunkColors = {
  neon_pink: "#FF1493",
  electric_blue: "#00FFFF",
  cyber_green: "#39FF14",
  digital_purple: "#8A2BE2",
  glitch_red: "#FF0266",
  matrix_green: "#00FF41",
  hologram: "#FF6EC7",
  circuit_blue: "#0077BE",
};

export const weddingColors = {
  blush: "#FFB6C1",
  ivory: "#FFFFF0",
  sage: "#9DC183",
  dusty_blue: "#6F8FAF",
  champagne: "#F7E7CE",
  lavender: "#E6E6FA",
  rose_gold: "#B76E79",
  pearl: "#F0EAD6",
};

export const halloweenColors = {
  pumpkin_orange: "#FF7518",
  dark_purple: "#4B0082",
  blood_red: "#8B0000",
  midnight_black: "#121212",
  toxic_green: "#39FF14",
  bone_white: "#FFFAF0",
  witch_purple: "#663399",
  spider_web: "#708090",
};

export const christmasColors = {
  santa_red: "#D22B2B",
  pine_green: "#01796F",
  snow_white: "#FFFAFA",
  gold: "#FFD700",
  candy_cane: "#B22222",
  elf_green: "#228B22",
  royal_blue: "#4169E1",
  silver: "#C0C0C0",
};

export const ramadhanColors = {
  mosque_green: "#006400",
  crescent_blue: "#4169E1",
  prayer_white: "#FFFFFF",
  arabic_gold: "#FFD700",
  sunset_orange: "#FF4500",
  night_purple: "#4B0082",
  peace_blue: "#87CEEB",
  lantern_yellow: "#FFA500",
};

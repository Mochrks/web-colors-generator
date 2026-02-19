// ============================================================
// Color Conversion & Utility Library
// Supports: HEX, RGB, RGBA, HSL, HSLA, CMYK
// ============================================================

export type ColorFormat = "hex" | "rgb" | "rgba" | "hsl" | "hsla" | "cmyk";

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSLA extends HSL {
  a: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface ColorData {
  hex: string;
  rgb: RGB;
  rgba: RGBA;
  hsl: HSL;
  hsla: HSLA;
  cmyk: CMYK;
}

// ============================================================
// Core Conversions
// ============================================================

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

// ============================================================
// Universal Color Parser — parses any format string to ColorData
// ============================================================

export function parseColorString(input: string): ColorData | null {
  const trimmed = input.trim().toLowerCase();

  // HEX
  if (/^#?([a-f\d]{3}|[a-f\d]{6}|[a-f\d]{8})$/i.test(trimmed)) {
    let hex = trimmed.startsWith("#") ? trimmed : "#" + trimmed;
    if (hex.length === 9) {
      // #RRGGBBAA
      hex = hex.substring(0, 7);
    }
    const rgb = hexToRgb(hex);
    return colorDataFromRgba(rgb.r, rgb.g, rgb.b, 1);
  }

  // RGB
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

  // HSL
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

  // CMYK
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

// ============================================================
// Color String Formatters
// ============================================================

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

// ============================================================
// Gradation Generator
// ============================================================

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

// ============================================================
// Color Harmony Generators
// ============================================================

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

// ============================================================
// Color Contrast Checker (WCAG 2.1)
// ============================================================

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

// ============================================================
// Color Blender
// ============================================================

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

// ============================================================
// Random & Utilities
// ============================================================

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

// ============================================================
// CSS Gradient Generator
// ============================================================

export type GradientDirection =
  | "to right"
  | "to left"
  | "to top"
  | "to bottom"
  | "to top right"
  | "to top left"
  | "to bottom right"
  | "to bottom left"
  | "45deg"
  | "90deg"
  | "135deg"
  | "180deg"
  | "225deg"
  | "270deg"
  | "315deg";

export type GradientType = "linear" | "radial" | "conic";

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

// ============================================================
// Saved Colors (localStorage)
// ============================================================

const SAVED_COLORS_KEY = "color-generator-saved-colors";
const COLOR_HISTORY_KEY = "color-generator-history";

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

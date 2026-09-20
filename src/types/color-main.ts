export type ColorFormat = "hex" | "rgb" | "rgba" | "hsl" | "hsla" | "cmyk";

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

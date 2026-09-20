import type { ColorData } from "@/types/color-main";

export interface ColorPickerConverterProps {
  onColorChange?: (color: ColorData) => void;
}

export type HslKey = "h" | "s" | "l";

export interface SliderConfig {
  label: string;
  value: number;
  max: number;
  suffix: string;
  key: HslKey;
}

export interface RgbInput {
  r: string;
  g: string;
  b: string;
}

export interface CmykInput {
  c: string;
  m: string;
  y: string;
  k: string;
}

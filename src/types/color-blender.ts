import type { ColorData } from "@/types/color-main";

export interface BlendResult {
  colors: ColorData[];
  steps: number;
}

export interface ColorBlenderState {
  color1: string;
  color2: string;
  steps: number;
}

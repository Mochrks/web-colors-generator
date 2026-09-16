// ============================================================
// Color Blender Types
// ============================================================

import type { ColorData } from "../hooks/color-main";

export interface BlendResult {
  colors: ColorData[];
  steps: number;
}

export interface ColorBlenderState {
  color1: string;
  color2: string;
  steps: number;
}

import type { GradientDirection, GradientType } from "@/types/color-main";

export interface GradientStop {
  color: string;
  position?: number;
}

export interface GradientConfig {
  type: GradientType;
  direction: GradientDirection;
  colors: string[];
}

export interface DirectionOption {
  value: GradientDirection;
  label: string;
}

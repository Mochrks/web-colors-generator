import type { CSSProperties } from "react";

export type SplitBy = "char" | "word" | "line";
export type Hinge = "top" | "bottom" | "left" | "right";
export type Trigger = "mount" | "hover" | "scroll" | "loop";

export interface FoldTextProps {
  text?: string;
  splitBy?: SplitBy;
  hinge?: Hinge;
  duration?: number;
  stagger?: number;
  ease?: string;
  perspective?: number;
  creaseShading?: number;
  trigger?: Trigger;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

import type { ComponentType } from "react";

export type ToolId =
  | "picker"
  | "harmony"
  | "gradient"
  | "contrast"
  | "blender"
  | "extract"
  | "saved";

export interface Tool {
  id: ToolId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  desc: string;
}

export interface StatItem {
  label: string;
  value: string;
}

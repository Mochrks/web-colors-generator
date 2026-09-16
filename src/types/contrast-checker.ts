// ============================================================
// Contrast Checker Types
// ============================================================

export interface WcagRating {
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
}

export interface WcagScoreItem {
  label: string;
  pass: boolean;
  req: string;
}

export interface ContrastCheckerState {
  fg: string;
  bg: string;
}

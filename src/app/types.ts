export type ScaleToken = "xs" | "small" | "p" | "h6" | "h5" | "h4" | "h3" | "h2" | "h1";

export type DisplayUnit = "rem" | "px";

export type ScalePresetId =
  | "minor-second"
  | "major-second"
  | "minor-third"
  | "major-third"
  | "perfect-fourth"
  | "augmented-fourth"
  | "perfect-fifth"
  | "custom";

export interface ScalePreset {
  id: ScalePresetId;
  label: string;
  ratio: number;
}

export interface AppState {
  scalePresetId: ScalePresetId;
  customRatio: number;
  baseFontSizePx: number;
  displayUnit: DisplayUnit;
  fluidTypography: boolean;
  fluidCssFunction: boolean;
  minViewportPx: number;
  maxViewportPx: number;
  bodyFontFamily: string;
  headingFontFamily: string;
  bodyFontWeight: number;
  headingFontWeight: number;
  lineHeight: number;
  letterSpacingEm: number;
  textColor: string | null;
  backgroundColor: string | null;
}

export interface TokenSize {
  token: ScaleToken;
  rem: number;
}

export const SCALE_TOKENS: ScaleToken[] = ["xs", "small", "p", "h6", "h5", "h4", "h3", "h2", "h1"];

/** Exported `--typo-size-*` / utility class suffix for each scale token. */
export const TOKEN_SIZE_NAMES: Record<ScaleToken, string> = {
  xs: "xs",
  small: "small",
  p: "default",
  h6: "sm-md",
  h5: "md",
  h4: "lg",
  h3: "xl",
  h2: "xxl",
  h1: "display",
};

export const TOKEN_EXPONENTS: Record<ScaleToken, number> = {
  xs: -2,
  small: -1,
  p: 0,
  h6: 1,
  h5: 2,
  h4: 3,
  h3: 4,
  h2: 5,
  h1: 6,
};

export const SCALE_PRESETS: ScalePreset[] = [
  { id: "minor-second", label: "Minor Second", ratio: 1.067 },
  { id: "major-second", label: "Major Second", ratio: 1.125 },
  { id: "minor-third", label: "Minor Third", ratio: 1.2 },
  { id: "major-third", label: "Major Third", ratio: 1.25 },
  { id: "perfect-fourth", label: "Perfect Fourth", ratio: 1.333 },
  { id: "augmented-fourth", label: "Augmented Fourth", ratio: 1.414 },
  { id: "perfect-fifth", label: "Perfect Fifth", ratio: 1.5 },
  { id: "custom", label: "Custom", ratio: 1.2 },
];

export const DEFAULT_STATE: AppState = {
  scalePresetId: "minor-third",
  customRatio: 1.2,
  baseFontSizePx: 16,
  displayUnit: "rem",
  fluidTypography: false,
  fluidCssFunction: false,
  minViewportPx: 375,
  maxViewportPx: 1280,
  bodyFontFamily: "Inter",
  headingFontFamily: "Lora",
  bodyFontWeight: 400,
  headingFontWeight: 600,
  lineHeight: 1.5,
  letterSpacingEm: 0,
  textColor: null,
  backgroundColor: null,
};

import { roundRem } from "./scale.ts";

export type FluidUnit = "vw" | "cqi";

export interface FluidClampInput {
  minRem: number;
  maxRem: number;
  w1Px: number;
  w2Px: number;
  rootFontSizePx: number;
  unit?: FluidUnit;
}

export interface FluidClampResult {
  min: string;
  preferred: string;
  max: string;
  css: string;
}

function remToPx(rem: number, rootFontSizePx: number): number {
  return rem * rootFontSizePx;
}

function pxToRem(px: number, rootFontSizePx: number): number {
  return px / rootFontSizePx;
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function computeFluidClamp(input: FluidClampInput): FluidClampResult {
  const { minRem, maxRem, w1Px, w2Px, rootFontSizePx, unit = "vw" } = input;

  const min = `${roundRem(minRem)}rem`;
  const max = `${roundRem(maxRem)}rem`;

  if (w2Px <= w1Px) {
    return { min, preferred: min, max: min, css: `clamp(${min}, ${min}, ${min})` };
  }

  const minPx = remToPx(minRem, rootFontSizePx);
  const maxPx = remToPx(maxRem, rootFontSizePx);
  const m = (maxPx - minPx) / (w2Px - w1Px);
  const b = minPx - m * w1Px;
  const mUnit = round(m * 100, 2);
  const interceptRem = roundRem(pxToRem(b, rootFontSizePx));

  const unitToken = unit === "cqi" ? "cqi" : "vw";
  const preferred = `${interceptRem}rem + ${mUnit}${unitToken}`;
  const css = `clamp(${min}, ${preferred}, ${max})`;

  return { min, preferred, max, css };
}

/** Body-size ratios at min/max viewport used to derive per-token fluid bounds. */
export const FLUID_MIN_BASE_RATIO = 14 / 16;
export const FLUID_MAX_BASE_RATIO = 18 / 16;

export function formatFluidFunctionDefinition(
  minViewportPx: number,
  maxViewportPx: number,
  rootFontSizePx: number,
): string {
  const minVw = roundRem(minViewportPx / rootFontSizePx);
  const maxVw = roundRem(maxViewportPx / rootFontSizePx);
  return `@function --fluid-size(
  --min <length>,
  --max <length>,
  --min-vw <length>: ${minVw}rem,
  --max-vw <length>: ${maxVw}rem
) returns <length> {
  result: clamp(
    var(--min),
    var(--min) + (var(--max) - var(--min))
      * (100vw - var(--min-vw))
      / (var(--max-vw) - var(--min-vw)),
    var(--max)
  );
}`;
}

export function formatFluidFunctionCall(min: string, max: string): string {
  return `--fluid-size(${min}, ${max})`;
}

/** Evaluate preferred font size in px at a given width (for tests). */
export function preferredSizeAtWidthPx(input: FluidClampInput, widthPx: number): number {
  const { w1Px, w2Px, rootFontSizePx } = input;
  if (w2Px <= w1Px) {
    return remToPx(input.minRem, rootFontSizePx);
  }
  const minPx = remToPx(input.minRem, rootFontSizePx);
  const maxPx = remToPx(input.maxRem, rootFontSizePx);
  const m = (maxPx - minPx) / (w2Px - w1Px);
  const b = minPx - m * w1Px;
  return b + m * widthPx;
}

import { roundRem } from "./scale.ts";
import type { DisplayUnit } from "../app/types.ts";

export function remToPx(rem: number, baseFontSizePx: number): number {
  return roundRem(rem * baseFontSizePx, 2);
}

export function formatSize(rem: number, unit: DisplayUnit, baseFontSizePx: number): string {
  if (unit === "rem") {
    return `${roundRem(rem)}rem`;
  }
  return `${remToPx(rem, baseFontSizePx)}px`;
}

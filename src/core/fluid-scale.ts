import { FLUID_MAX_BASE_RATIO, FLUID_MIN_BASE_RATIO } from "./fluid.ts";
import { computeScale } from "./scale.ts";
import type { TokenSize } from "../app/types.ts";

export function computeFluidScales(ratio: number): {
  baseScale: TokenSize[];
  minScale: TokenSize[];
  maxScale: TokenSize[];
} {
  const baseScale = computeScale(ratio);

  return {
    baseScale,
    minScale: baseScale.map(({ token, rem }) => ({ token, rem: rem * FLUID_MIN_BASE_RATIO })),
    maxScale: baseScale.map(({ token, rem }) => ({ token, rem: rem * FLUID_MAX_BASE_RATIO })),
  };
}

import { describe, expect, it } from "vitest";
import {
  computeFluidClamp,
  formatFluidFunctionDefinition,
  preferredSizeAtWidthPx,
} from "./fluid.ts";

describe("computeFluidClamp", () => {
  it("matches article worked example shape", () => {
    const result = computeFluidClamp({
      minRem: 1.625,
      maxRem: 2.25,
      w1Px: 252,
      w2Px: 432,
      rootFontSizePx: 16,
    });
    expect(result.css).toMatch(/clamp\(1\.625rem,/);
    expect(result.css).toContain("vw");
    expect(result.css).toMatch(/2\.25rem\)$/);
  });

  it("returns fixed min when w1 equals w2", () => {
    const result = computeFluidClamp({
      minRem: 1,
      maxRem: 2,
      w1Px: 400,
      w2Px: 400,
      rootFontSizePx: 16,
    });
    expect(result.css).toBe("clamp(1rem, 1rem, 1rem)");
  });

  it("hits MIN and MAX at W1 and W2 (article example)", () => {
    const input = {
      minRem: 1.625,
      maxRem: 2.25,
      w1Px: 252,
      w2Px: 432,
      rootFontSizePx: 16,
    };
    const atW1 = preferredSizeAtWidthPx(input, 252);
    const atW2 = preferredSizeAtWidthPx(input, 432);
    expect(atW1).toBeCloseTo(26, 0);
    expect(atW2).toBeCloseTo(36, 0);
  });
});

describe("formatFluidFunctionDefinition", () => {
  it("uses viewport bounds as rem defaults", () => {
    const css = formatFluidFunctionDefinition(375, 1280, 16);
    expect(css).toContain("--min-vw <length>: 23.438rem");
    expect(css).toContain("--max-vw <length>: 80rem");
    expect(css).toContain("@function --fluid-size(");
  });
});

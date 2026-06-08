import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "../app/types.ts";
import { exportCss } from "./css-export.ts";

describe("exportCss custom property names", () => {
  it("exports renamed typography tokens and utilities", () => {
    const css = exportCss(DEFAULT_STATE);
    expect(css).toContain("--typescale-ratio:");
    expect(css).toContain("--typo-body-family:");
    expect(css).toContain("--typo-heading-family:");
    expect(css).toContain("--typo-body-weight-default:");
    expect(css).toContain("--typo-heading-weight-default:");
    expect(css).toContain("--typo-line-height:");
    expect(css).toContain("--typo-letter-spacing: 0;");
    expect(css).toContain("--typo-size-default:");
    expect(css).toContain("--typo-size-display:");
    expect(css).toContain(".typo-default {");
    expect(css).toContain(".typo-display {");
    expect(css).not.toContain("--scale-ratio:");
    expect(css).not.toContain("--font-body:");
    expect(css).not.toContain("--text-p:");
    expect(css).not.toContain("--text-color");
    expect(css).not.toContain("--background-color");
    expect(css).not.toContain("color:");
  });
});

describe("exportCss fluid typography", () => {
  it("exports clamp() custom properties when fluid typography is enabled", () => {
    const css = exportCss({ ...DEFAULT_STATE, fluidTypography: true });
    expect(css).toContain("--typo-size-default: clamp(");
    expect(css).toContain(".typo-default {");
    expect(css).toContain("font-size: var(--typo-size-default);");
    expect(css).not.toContain("@function --fluid-size");
  });

  it("exports @function and dual font-size declarations when enabled", () => {
    const css = exportCss({
      ...DEFAULT_STATE,
      fluidTypography: true,
      fluidCssFunction: true,
    });
    expect(css).toContain("@function --fluid-size(");
    expect(css).toContain("--min-vw <length>: 20rem");
    expect(css).toContain("--max-vw <length>: 80rem");
    expect(css).toMatch(/\.typo-display \{[\s\S]*font-size: var\(--typo-size-display\)/);
    expect(css).toMatch(/\.typo-display \{[\s\S]*font-size: --fluid-size\(/);
    expect(css).not.toMatch(/\.typo-display \{[\s\S]*font-size: clamp\(/);
  });
});

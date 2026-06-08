import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "../app/types.ts";
import { exportCss } from "./css-export.ts";
import { exportPreviewColor, PREVIEW_COLORS } from "./preview-colors.ts";

describe("exportPreviewColor", () => {
  it("exports light-dark() when no custom color is set", () => {
    expect(exportPreviewColor(null, PREVIEW_COLORS.text.light, PREVIEW_COLORS.text.dark)).toBe(
      "light-dark(#2b2d42, #edf2f4)",
    );
  });

  it("exports a fixed color when customized", () => {
    expect(exportPreviewColor("#ff0000", PREVIEW_COLORS.text.light, PREVIEW_COLORS.text.dark)).toBe(
      "#ff0000",
    );
  });
});

describe("exportCss preview colors", () => {
  it("uses light-dark() for default preview colors", () => {
    const css = exportCss(DEFAULT_STATE);
    expect(css).toContain(
      `--text-color: light-dark(${PREVIEW_COLORS.text.light}, ${PREVIEW_COLORS.text.dark});`,
    );
    expect(css).toContain(
      `--background-color: light-dark(${PREVIEW_COLORS.background.light}, ${PREVIEW_COLORS.background.dark});`,
    );
  });

  it("uses fixed colors when customized", () => {
    const css = exportCss({
      ...DEFAULT_STATE,
      textColor: "#111111",
      backgroundColor: "#fefefe",
    });
    expect(css).toContain("--text-color: #111111;");
    expect(css).toContain("--background-color: #fefefe;");
  });
});

describe("exportCss custom property names", () => {
  it("exports renamed typography tokens and utilities", () => {
    const css = exportCss(DEFAULT_STATE);
    expect(css).toContain("--typescale-ratio:");
    expect(css).toContain("--typo-body-family:");
    expect(css).toContain("--typo-heading-family:");
    expect(css).toContain("--typo-body-weight-default:");
    expect(css).toContain("--typo-heading-weight-default:");
    expect(css).toContain("--typo-line-height:");
    expect(css).toContain("--typo-letter-spacing:");
    expect(css).toContain("--typo-size-default:");
    expect(css).toContain("--typo-size-display:");
    expect(css).toContain(".typo-default {");
    expect(css).toContain(".typo-display {");
    expect(css).not.toContain("--scale-ratio:");
    expect(css).not.toContain("--font-body:");
    expect(css).not.toContain("--text-p:");
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
    expect(css).toContain("--min-vw <length>: 23.438rem");
    expect(css).toContain("--max-vw <length>: 80rem");
    expect(css).toMatch(/\.typo-display \{[\s\S]*font-size: var\(--typo-size-display\)/);
    expect(css).toMatch(/\.typo-display \{[\s\S]*font-size: --fluid-size\(/);
    expect(css).not.toMatch(/\.typo-display \{[\s\S]*font-size: clamp\(/);
  });
});

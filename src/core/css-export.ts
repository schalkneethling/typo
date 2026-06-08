import {
  computeFluidClamp,
  formatFluidFunctionCall,
  formatFluidFunctionDefinition,
} from "./fluid.ts";
import { computeFluidScales } from "./fluid-scale.ts";
import { getRatio } from "./scale.ts";
import { formatSize } from "./units.ts";
import {
  SCALE_PRESETS,
  SCALE_TOKENS,
  TOKEN_SIZE_NAMES,
  type AppState,
  type ScaleToken,
} from "../app/types.ts";

function cssVarName(token: ScaleToken): string {
  return `--typo-size-${TOKEN_SIZE_NAMES[token]}`;
}

function className(token: ScaleToken): string {
  return `.typo-${TOKEN_SIZE_NAMES[token]}`;
}

function fluidClampForToken(
  state: AppState,
  minRem: number,
  maxRem: number,
): ReturnType<typeof computeFluidClamp> {
  return computeFluidClamp({
    minRem,
    maxRem,
    w1Px: state.minViewportPx,
    w2Px: state.maxViewportPx,
    rootFontSizePx: state.baseFontSizePx,
    unit: "vw",
  });
}

export function exportCss(state: AppState): string {
  const ratio = getRatio(state.scalePresetId, state.customRatio, SCALE_PRESETS);
  const lines: string[] = [];

  const families = new Set([state.bodyFontFamily, state.headingFontFamily]);
  const googleFamilies = [...families]
    .filter((f) => f && !f.includes("system-ui"))
    .map((f) => f.replace(/ /g, "+"));
  if (googleFamilies.length > 0) {
    lines.push(
      `@import url('https://fonts.googleapis.com/css2?family=${googleFamilies.join("&family=")}&display=swap');`,
      "",
    );
  }

  const letterSpacing = state.letterSpacingEm === 0 ? "0" : `${state.letterSpacingEm}em`;

  lines.push(":root {");
  lines.push(`  --typescale-ratio: ${ratio}; /* ratio this static scale was generated against */`);
  lines.push(`  --typo-body-family: "${state.bodyFontFamily}", system-ui, sans-serif;`);
  lines.push(`  --typo-heading-family: "${state.headingFontFamily}", Georgia, serif;`);
  lines.push(`  --typo-body-weight-default: ${state.bodyFontWeight};`);
  lines.push(`  --typo-heading-weight-default: ${state.headingFontWeight};`);
  lines.push(`  --typo-line-height: ${state.lineHeight};`);
  lines.push(`  --typo-letter-spacing: ${letterSpacing};`);

  const { baseScale, minScale, maxScale } = computeFluidScales(ratio);
  const fluidByToken = new Map<ScaleToken, ReturnType<typeof computeFluidClamp>>();

  for (const { token, rem } of baseScale) {
    if (state.fluidTypography) {
      const minEntry = minScale.find((t) => t.token === token)!;
      const maxEntry = maxScale.find((t) => t.token === token)!;
      const fluid = fluidClampForToken(state, minEntry.rem, maxEntry.rem);
      fluidByToken.set(token, fluid);
      lines.push(`  ${cssVarName(token)}: ${fluid.css};`);
    } else {
      lines.push(
        `  ${cssVarName(token)}: ${formatSize(rem, state.displayUnit, state.baseFontSizePx)};`,
      );
    }
  }

  lines.push("}", "");

  if (state.fluidTypography && state.fluidCssFunction) {
    lines.push(
      formatFluidFunctionDefinition(state.minViewportPx, state.maxViewportPx, state.baseFontSizePx),
      "",
    );
  }

  for (const token of SCALE_TOKENS) {
    const isHeading = token.startsWith("h");
    const fontFamily = isHeading ? "var(--typo-heading-family)" : "var(--typo-body-family)";
    const weight = isHeading
      ? "var(--typo-heading-weight-default)"
      : "var(--typo-body-weight-default)";

    lines.push(`${className(token)} {`);
    lines.push(`  font-family: ${fontFamily};`);
    lines.push(`  font-size: var(${cssVarName(token)});`);
    if (state.fluidTypography && state.fluidCssFunction) {
      const fluid = fluidByToken.get(token)!;
      lines.push(`  font-size: ${formatFluidFunctionCall(fluid.min, fluid.max)};`);
    }
    lines.push(`  font-weight: ${weight};`);
    lines.push(`  line-height: var(--typo-line-height);`);
    lines.push(`  letter-spacing: var(--typo-letter-spacing);`);
    lines.push("}", "");
  }

  return lines.join("\n").trimEnd();
}

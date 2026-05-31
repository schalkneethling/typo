import { html } from "lit";
import type { PropertyValues } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { DEFAULT_STATE, SCALE_PRESETS, type AppState } from "../app/types.ts";
import { computeFluidClamp } from "../core/fluid.ts";
import { computeFluidScales } from "../core/fluid-scale.ts";
import { getRatio } from "../core/scale.ts";
import { formatSize } from "../core/units.ts";
import { LightDomElement } from "../lit/light-dom-element.ts";

const PANGRAM = "How vexingly quick daft zebras jump";

function sampleStyles(
  state: AppState,
  token: string,
  rem: number,
  minScale: { token: string; rem: number }[],
  maxScale: { token: string; rem: number }[],
): Record<string, string> {
  const isHeading = token.startsWith("h");
  const styles: Record<string, string> = {
    fontFamily: isHeading
      ? `"${state.headingFontFamily}", Georgia, serif`
      : `"${state.bodyFontFamily}", system-ui, sans-serif`,
    fontWeight: String(isHeading ? state.headingFontWeight : state.bodyFontWeight),
    lineHeight: String(state.lineHeight),
    letterSpacing: `${state.letterSpacingEm}em`,
  };

  if (state.fluidTypography) {
    const minEntry = minScale.find((t) => t.token === token)!;
    const maxEntry = maxScale.find((t) => t.token === token)!;
    styles.fontSize = computeFluidClamp({
      minRem: minEntry.rem,
      maxRem: maxEntry.rem,
      w1Px: state.minViewportPx,
      w2Px: state.maxViewportPx,
      rootFontSizePx: state.baseFontSizePx,
      unit: "cqi",
    }).css;
  } else {
    styles.fontSize = `${rem}rem`;
  }

  return styles;
}

export class TypoPreview extends LightDomElement {
  static properties = {
    state: { attribute: false },
  };

  declare state: AppState;

  constructor() {
    super();
    this.state = DEFAULT_STATE;
  }

  willUpdate(changed: PropertyValues<this>): void {
    if (!changed.has("state")) return;

    const { backgroundColor, textColor } = this.state;
    if (backgroundColor) {
      this.style.setProperty("--preview-bg", backgroundColor);
    } else {
      this.style.removeProperty("--preview-bg");
    }
    if (textColor) {
      this.style.setProperty("--preview-text", textColor);
    } else {
      this.style.removeProperty("--preview-text");
    }
  }

  render() {
    const state = this.state;
    const ratio = getRatio(state.scalePresetId, state.customRatio, SCALE_PRESETS);
    const { baseScale: scale, minScale, maxScale } = computeFluidScales(ratio);

    return html`
      ${scale.map(
        ({ token, rem }) => html`
          <div
            class=${classMap({
              "preview-row": true,
              "preview-row--body": token === "p",
              "preview-row--heading": token.startsWith("h"),
            })}
          >
            <span class="preview-row__label">${token}</span>
            <span class="preview-row__sample-size preview-row__size">
              ${formatSize(rem, state.displayUnit, state.baseFontSizePx)}
            </span>
            <p
              class="preview-row__sample"
              style=${styleMap(sampleStyles(state, token, rem, minScale, maxScale))}
            >
              ${PANGRAM}
            </p>
          </div>
        `,
      )}
    `;
  }
}

if (!customElements.get("typo-preview")) {
  customElements.define("typo-preview", TypoPreview);
}

declare global {
  interface HTMLElementTagNameMap {
    "typo-preview": TypoPreview;
  }
}

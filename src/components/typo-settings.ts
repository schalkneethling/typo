import { html, nothing } from "lit";
import { DEFAULT_STATE, SCALE_PRESETS, type AppState, type DisplayUnit } from "../app/types.ts";
import { previewBackgroundForPicker, previewTextForPicker } from "../core/preview-colors.ts";
import { hasApiKey } from "../fonts/google-fonts.ts";
import { LightDomElement } from "../lit/light-dom-element.ts";
import { bindSettingsDelegation } from "../ui/settings-delegation.ts";
import "./typo-font-picker.ts";

export class TypoSettings extends LightDomElement {
  static properties = {
    state: { attribute: false },
  };

  declare state: AppState;

  constructor() {
    super();
    this.state = DEFAULT_STATE;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("aria-label", "Settings");
  }

  firstUpdated(): void {
    bindSettingsDelegation(this);
  }

  render() {
    const state = this.state;
    const units: DisplayUnit[] = ["rem", "px"];

    return html`
      <h1 class="sidebar__title">Typo</h1>
      ${hasApiKey()
        ? nothing
        : html`<p class="sidebar__hint">
            Google Fonts API key not loaded — using curated fallback list.
          </p>`}

      <details class="settings-group" open>
        <summary class="settings-group__label">Scale</summary>
        <div class="settings-group__body">
          <div class="field">
            <label class="field__label" for="field-scalePresetId">Preset</label>
            <select
              id="field-scalePresetId"
              data-state-key="scalePresetId"
              .value=${state.scalePresetId}
            >
              ${SCALE_PRESETS.map(
                (preset) => html`
                  <option value=${preset.id}>${preset.label} (${preset.ratio})</option>
                `,
              )}
            </select>
          </div>
          ${state.scalePresetId === "custom"
            ? html`
                <div class="field">
                  <label class="field__label" for="field-customRatio">Custom ratio</label>
                  <input
                    id="field-customRatio"
                    type="number"
                    step="0.001"
                    min="1.001"
                    max="3"
                    data-state-key="customRatio"
                    .value=${String(state.customRatio)}
                  />
                </div>
              `
            : nothing}
        </div>
      </details>

      <details class="settings-group" open>
        <summary class="settings-group__label">Base</summary>
        <div class="settings-group__body">
          <div class="field">
            <label class="field__label" for="field-baseFontSizePx">Base font size (px)</label>
            <input
              id="field-baseFontSizePx"
              type="number"
              min="10"
              max="24"
              data-state-key="baseFontSizePx"
              .value=${String(state.baseFontSizePx)}
            />
          </div>
          <div class="field">
            <span id="display-unit-label" class="field__label">Display unit</span>
            <div class="unit-toggle" role="group" aria-labelledby="display-unit-label">
              ${units.map(
                (unit) => html`
                  <button
                    type="button"
                    data-state-key="displayUnit"
                    data-state-value=${unit}
                    aria-pressed=${state.displayUnit === unit ? "true" : "false"}
                  >
                    ${unit}
                  </button>
                `,
              )}
            </div>
          </div>
        </div>
      </details>

      <details class="settings-group">
        <summary class="settings-group__label">Fluid typography</summary>
        <div class="settings-group__body">
          <label class="checkbox-field" for="field-fluidTypography">
            <input
              id="field-fluidTypography"
              type="checkbox"
              data-state-key="fluidTypography"
              ?checked=${state.fluidTypography}
            />
            Fluid typography
          </label>
          ${state.fluidTypography
            ? html`
                <label class="checkbox-field" for="field-fluidCssFunction">
                  <input
                    id="field-fluidCssFunction"
                    type="checkbox"
                    data-state-key="fluidCssFunction"
                    ?checked=${state.fluidCssFunction}
                  />
                  With CSS @function
                </label>
              `
            : nothing}
          <div class="field">
            <label class="field__label" for="field-minViewportPx">Min viewport (W₁)</label>
            <input
              id="field-minViewportPx"
              type="number"
              min="320"
              data-state-key="minViewportPx"
              .value=${String(state.minViewportPx)}
            />
          </div>
          <div class="field">
            <label class="field__label" for="field-maxViewportPx">Max viewport (W₂)</label>
            <input
              id="field-maxViewportPx"
              type="number"
              min="480"
              data-state-key="maxViewportPx"
              .value=${String(state.maxViewportPx)}
            />
          </div>
        </div>
      </details>

      <details class="settings-group" open>
        <summary class="settings-group__label">Fonts</summary>
        <div class="settings-group__body">
          <typo-font-picker
            .state=${state}
            .label=${"Body font"}
            .familyKey=${"bodyFontFamily"}
            .weightKey=${"bodyFontWeight"}
          ></typo-font-picker>
          <typo-font-picker
            .state=${state}
            .label=${"Heading font"}
            .familyKey=${"headingFontFamily"}
            .weightKey=${"headingFontWeight"}
          ></typo-font-picker>
        </div>
      </details>

      <details class="settings-group" open>
        <summary class="settings-group__label">Body</summary>
        <div class="settings-group__body">
          <div class="field">
            <label class="field__label" for="field-lineHeight">Line height</label>
            <input
              id="field-lineHeight"
              type="number"
              step="0.05"
              min="1"
              max="2.5"
              data-state-key="lineHeight"
              .value=${String(state.lineHeight)}
            />
          </div>
          <div class="field">
            <label class="field__label" for="field-letterSpacingEm">Letter spacing (em)</label>
            <input
              id="field-letterSpacingEm"
              type="number"
              step="0.01"
              min="-0.1"
              max="0.2"
              data-state-key="letterSpacingEm"
              .value=${String(state.letterSpacingEm)}
            />
          </div>
          <div class="color-fields">
            <label class="color-field" for="field-textColor">
              <span class="color-field__label">Text</span>
              <input
                class="color-field__swatch"
                id="field-textColor"
                type="color"
                data-state-key="textColor"
                .value=${previewTextForPicker(state.textColor)}
              />
            </label>
            <label class="color-field" for="field-backgroundColor">
              <span class="color-field__label">Background</span>
              <input
                class="color-field__swatch"
                id="field-backgroundColor"
                type="color"
                data-state-key="backgroundColor"
                .value=${previewBackgroundForPicker(state.backgroundColor)}
              />
            </label>
          </div>
        </div>
      </details>
    `;
  }
}

if (!customElements.get("typo-settings")) {
  customElements.define("typo-settings", TypoSettings);
}

declare global {
  interface HTMLElementTagNameMap {
    "typo-settings": TypoSettings;
  }
}

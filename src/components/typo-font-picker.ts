import { html } from "lit";
import type { PropertyValues } from "lit";
import { update } from "../app/store.ts";
import { DEFAULT_STATE, type AppState } from "../app/types.ts";
import { getFallbackFonts, getPopularFonts, type FontOption } from "../fonts/google-fonts.ts";
import { LightDomElement } from "../lit/light-dom-element.ts";

type FamilyKey = "bodyFontFamily" | "headingFontFamily";
type WeightKey = "bodyFontWeight" | "headingFontWeight";

export class TypoFontPicker extends LightDomElement {
  static properties = {
    label: { type: String },
    familyKey: { type: String, attribute: "family-key" },
    weightKey: { type: String, attribute: "weight-key" },
    state: { attribute: false },
  };

  declare label: string;
  declare familyKey: FamilyKey;
  declare weightKey: WeightKey;
  declare state: AppState;

  #fonts: FontOption[] = getFallbackFonts();

  constructor() {
    super();
    this.label = "";
    this.familyKey = "bodyFontFamily";
    this.weightKey = "bodyFontWeight";
    this.state = DEFAULT_STATE;
  }

  connectedCallback(): void {
    super.connectedCallback();
    void this.#loadPopularFonts();
  }

  async #loadPopularFonts(): Promise<void> {
    this.#fonts = await getPopularFonts();
    this.requestUpdate();
  }

  #fieldId(): string {
    return `field-${this.familyKey}`;
  }

  #fontOptions(): FontOption[] {
    const family = this.state[this.familyKey];
    if (family && !this.#fonts.some((font) => font.family === family)) {
      return [{ family, category: "sans-serif", weights: [400, 600, 700] }, ...this.#fonts];
    }
    return this.#fonts;
  }

  #syncWeightForFamily(family: string): void {
    const font = this.#fontOptions().find((option) => option.family === family);
    const currentWeight = this.state[this.weightKey];
    if (!font || font.weights.includes(currentWeight)) return;

    update({ [this.weightKey]: font.weights[0] ?? currentWeight } as Partial<AppState>);
  }

  updated(changed: PropertyValues<this>): void {
    if (changed.has("state")) {
      const previous = changed.get("state") as AppState | undefined;
      if (!previous || previous[this.familyKey] !== this.state[this.familyKey]) {
        this.#syncWeightForFamily(this.state[this.familyKey]);
      }
    }

    const familySelect = this.querySelector<HTMLSelectElement>(`#${this.#fieldId()}`);
    if (familySelect) {
      const family = this.state[this.familyKey];
      if (familySelect.value !== family) {
        if ([...familySelect.options].some((option) => option.value === family)) {
          familySelect.value = family;
        }
      }
    }

    const weightSelect = this.querySelector<HTMLSelectElement>(`#field-${this.weightKey}`);
    if (weightSelect) {
      const weight = String(this.state[this.weightKey]);
      if (weightSelect.value !== weight) {
        weightSelect.value = weight;
      }
    }
  }

  render() {
    const family = this.state[this.familyKey];
    const weight = this.state[this.weightKey];
    const weights = [300, 400, 500, 600, 700, 800];

    return html`
      <div class="field">
        <label class="field__label" for=${this.#fieldId()}>${this.label}</label>
        <select id=${this.#fieldId()} data-state-key=${this.familyKey} .value=${family}>
          ${this.#fontOptions().map(
            (font) => html` <option value=${font.family}>${font.family}</option> `,
          )}
        </select>
      </div>
      <div class="field">
        <label class="field__label" for="field-${this.weightKey}">Weight</label>
        <select
          id="field-${this.weightKey}"
          data-state-key=${this.weightKey}
          data-state-parse="int"
          .value=${String(weight)}
        >
          ${weights.map((w) => html` <option value=${String(w)}>${w}</option> `)}
        </select>
      </div>
    `;
  }
}

if (!customElements.get("typo-font-picker")) {
  customElements.define("typo-font-picker", TypoFontPicker);
}

declare global {
  interface HTMLElementTagNameMap {
    "typo-font-picker": TypoFontPicker;
  }
}

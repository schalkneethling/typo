import { html } from "lit";
import { DEFAULT_STATE, type AppState } from "../app/types.ts";
import { exportCss } from "../core/css-export.ts";
import { LightDomElement } from "../lit/light-dom-element.ts";

export class TypoExport extends LightDomElement {
  static properties = {
    state: { attribute: false },
  };

  declare state: AppState;

  #copyLabel = "Copy CSS";

  constructor() {
    super();
    this.state = DEFAULT_STATE;
  }

  #copyCss = async (): Promise<void> => {
    const css = exportCss(this.state);
    try {
      await navigator.clipboard.writeText(css);
    } catch {
      const textarea = this.renderRoot.querySelector<HTMLTextAreaElement>("#export-css-output");
      textarea?.select();
      document.execCommand("copy");
    }
    this.#copyLabel = "Copied!";
    this.requestUpdate();
    setTimeout(() => {
      this.#copyLabel = "Copy CSS";
      this.requestUpdate();
    }, 2000);
  };

  render() {
    const css = exportCss(this.state);

    return html`
      <div class="export-panel__header">
        <h2>CSS export</h2>
        <button type="button" class="btn btn--primary" @click=${this.#copyCss}>
          ${this.#copyLabel}
        </button>
      </div>
      <label class="sr-only" for="export-css-output">Exported CSS</label>
      <textarea id="export-css-output" readonly .value=${css}></textarea>
    `;
  }
}

if (!customElements.get("typo-export")) {
  customElements.define("typo-export", TypoExport);
}

declare global {
  interface HTMLElementTagNameMap {
    "typo-export": TypoExport;
  }
}

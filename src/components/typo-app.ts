import { html } from "lit";
import { getState, onStateChange } from "../app/store.ts";
import type { AppState } from "../app/types.ts";
import { LightDomElement } from "../lit/light-dom-element.ts";
import "./typo-main-panel.ts";
import "./typo-settings.ts";

export class TypoApp extends LightDomElement {
  static properties = {
    appState: { attribute: false, state: true },
  };

  declare appState: AppState;

  #unsubscribe?: () => void;

  constructor() {
    super();
    this.appState = getState();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#unsubscribe = onStateChange((state) => {
      this.appState = state;
    });
  }

  disconnectedCallback(): void {
    this.#unsubscribe?.();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="app-shell">
        <typo-settings class="sidebar" .state=${this.appState}></typo-settings>
        <typo-main-panel .state=${this.appState}></typo-main-panel>
      </div>
    `;
  }
}

if (!customElements.get("typo-app")) {
  customElements.define("typo-app", TypoApp);
}

declare global {
  interface HTMLElementTagNameMap {
    "typo-app": TypoApp;
  }
}

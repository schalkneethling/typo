import { html, nothing } from "lit";
import { getState, onStateChange } from "../app/store.ts";
import type { AppState } from "../app/types.ts";
import { LightDomElement } from "../lit/light-dom-element.ts";
import "./typo-main-panel.ts";
import "./typo-settings.ts";

const SIDEBAR_ID = "typo-sidebar";
const MOBILE_QUERY = "(width < 48rem)";

export class TypoApp extends LightDomElement {
  static properties = {
    appState: { attribute: false, state: true },
    sidebarOpen: { attribute: false, state: true },
  };

  declare appState: AppState;
  declare sidebarOpen: boolean;

  #unsubscribe?: () => void;
  #mobileQuery = window.matchMedia(MOBILE_QUERY);
  #abort?: AbortController;

  constructor() {
    super();
    this.appState = getState();
    this.sidebarOpen = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#abort = new AbortController();
    const { signal } = this.#abort;

    this.#unsubscribe = onStateChange((state) => {
      this.appState = state;
    });
    this.#mobileQuery.addEventListener("change", this.#onMobileChange, { signal });
    document.addEventListener("keydown", this.#onKeydown, { signal });
  }

  disconnectedCallback(): void {
    this.#unsubscribe?.();
    this.#abort?.abort();
    super.disconnectedCallback();
  }

  #onMobileChange = (): void => {
    if (this.sidebarOpen) {
      this.sidebarOpen = false;
    } else {
      this.requestUpdate();
    }
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.sidebarOpen) {
      this.#closeSidebar();
    }
  };

  #openSidebar = (): void => {
    if (!this.#mobileQuery.matches) return;
    this.sidebarOpen = true;
    this.updateComplete.then(() => {
      this.querySelector<HTMLButtonElement>(".sidebar-drawer__close")?.focus();
    });
  };

  #closeSidebar = (): void => {
    this.sidebarOpen = false;
    this.updateComplete.then(() => {
      this.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
    });
  };

  render() {
    const shellClass = this.sidebarOpen ? "app-shell app-shell--sidebar-open" : "app-shell";

    return html`
      <div class=${shellClass}>
        ${this.sidebarOpen
          ? html`
              <button
                type="button"
                class="sidebar-backdrop"
                aria-label="Close settings"
                @click=${this.#closeSidebar}
              ></button>
            `
          : nothing}
        <div
          id=${SIDEBAR_ID}
          class="sidebar-container"
          ?inert=${this.#mobileQuery.matches && !this.sidebarOpen}
        >
          <button
            type="button"
            class="sidebar-drawer__close"
            aria-label="Close settings"
            @click=${this.#closeSidebar}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z"
              />
            </svg>
          </button>
          <typo-settings class="sidebar" .state=${this.appState}></typo-settings>
        </div>
        <header class="mobile-chrome">
          <button
            type="button"
            class="menu-toggle"
            aria-label="Open settings"
            aria-expanded=${String(this.sidebarOpen)}
            aria-controls=${SIDEBAR_ID}
            @click=${this.#openSidebar}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M3 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm0 6a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z"
              />
            </svg>
          </button>
          <span class="mobile-chrome__title">Typo</span>
        </header>
        <typo-main-panel .state=${this.appState} ?inert=${this.sidebarOpen}></typo-main-panel>
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

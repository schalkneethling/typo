import { html, nothing } from "lit";
import type { AppState } from "../app/types.ts";
import { LightDomElement } from "../lit/light-dom-element.ts";
import {
  PANEL_SPLIT_DEFAULT,
  PANEL_SPLIT_MAX,
  PANEL_SPLIT_MIN,
  clampPanelSplit,
  panelSplitEnter,
  panelSplitFromPointer,
  readStoredPanelSplit,
  stepPanelSplit,
  storePanelSplit,
} from "../ui/panel-splitter.ts";
import "./typo-export.ts";
import "./typo-preview.ts";

const PREVIEW_PANE_ID = "typo-preview-pane";
const PREVIEW_PANE_LABEL_ID = "typo-preview-pane-label";

export class TypoMainPanel extends LightDomElement {
  static properties = {
    state: { attribute: false },
  };

  declare state: AppState;

  #splitRatio = readStoredPanelSplit() ?? PANEL_SPLIT_DEFAULT;
  #collapsed = false;
  #restoreRatio = PANEL_SPLIT_DEFAULT;
  #dragging = false;
  #splitEnabled = true;
  #mediaQuery = window.matchMedia("(min-width: 48.0625rem)");

  constructor() {
    super();
    this.#mediaQuery.addEventListener("change", this.#onSplitModeChange);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.#splitEnabled = this.#mediaQuery.matches;
  }

  disconnectedCallback(): void {
    this.#mediaQuery.removeEventListener("change", this.#onSplitModeChange);
    this.#endDrag();
    super.disconnectedCallback();
  }

  #onSplitModeChange = (): void => {
    this.#splitEnabled = this.#mediaQuery.matches;
    this.requestUpdate();
  };

  #setRatio(value: number, persist = true): void {
    const next = clampPanelSplit(value);
    if (next === this.#splitRatio && !this.#collapsed) return;
    this.#splitRatio = next;
    this.#collapsed = false;
    if (persist) storePanelSplit(next);
    this.requestUpdate();
  }

  #onSeparatorKeydown = (event: KeyboardEvent): void => {
    if (!this.#splitEnabled) return;

    let handled = false;
    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft":
        this.#setRatio(stepPanelSplit(this.#splitRatio, -1));
        handled = true;
        break;
      case "ArrowDown":
      case "ArrowRight":
        this.#setRatio(stepPanelSplit(this.#splitRatio, 1));
        handled = true;
        break;
      case "Home":
        this.#setRatio(PANEL_SPLIT_MIN);
        handled = true;
        break;
      case "End":
        this.#setRatio(PANEL_SPLIT_MAX);
        handled = true;
        break;
      case "Enter": {
        const result = panelSplitEnter(this.#splitRatio, this.#collapsed, this.#restoreRatio);
        if (result.kind === "collapse") {
          this.#restoreRatio = result.restoreValue;
          this.#splitRatio = result.nextValue;
          this.#collapsed = true;
          storePanelSplit(this.#restoreRatio);
        } else {
          this.#splitRatio = result.nextValue;
          this.#collapsed = false;
          storePanelSplit(this.#splitRatio);
        }
        handled = true;
        break;
      }
      default:
        break;
    }

    if (handled) {
      event.preventDefault();
    }
  };

  #onSeparatorPointerDown = (event: PointerEvent): void => {
    if (!this.#splitEnabled || event.button !== 0) return;
    const separator = event.currentTarget as HTMLElement;
    separator.setPointerCapture(event.pointerId);
    this.#dragging = true;
    this.#collapsed = false;
    event.preventDefault();
  };

  #onSeparatorPointerMove = (event: PointerEvent): void => {
    if (!this.#dragging) return;
    const panel = this.querySelector<HTMLElement>(".main-panel");
    if (!panel) return;
    this.#setRatio(panelSplitFromPointer(event.clientY, panel.getBoundingClientRect()), false);
  };

  #onSeparatorPointerUp = (event: PointerEvent): void => {
    if (!this.#dragging) return;
    const separator = event.currentTarget as HTMLElement;
    if (separator.hasPointerCapture(event.pointerId)) {
      separator.releasePointerCapture(event.pointerId);
    }
    this.#endDrag(true);
  };

  #endDrag(persist = false): void {
    if (!this.#dragging) return;
    this.#dragging = false;
    if (persist) storePanelSplit(this.#splitRatio);
  }

  render() {
    const ratio = this.#collapsed ? PANEL_SPLIT_MIN : this.#splitRatio;
    const secondaryGrow = PANEL_SPLIT_MAX - ratio;
    const splitStyle = this.#splitEnabled
      ? `--split-primary-grow: ${ratio}; --split-secondary-grow: ${secondaryGrow};`
      : "";

    return html`
      <div class="main-panel ${this.#splitEnabled ? "main-panel--split" : ""}" style=${splitStyle}>
        <section
          id=${PREVIEW_PANE_ID}
          class="main-panel__primary ${this.#collapsed ? "main-panel__primary--collapsed" : ""}"
          ?hidden=${this.#collapsed}
        >
          <h2 class="sr-only" id=${PREVIEW_PANE_LABEL_ID}>Typography preview</h2>
          <typo-preview class="preview-canvas" .state=${this.state}></typo-preview>
        </section>
        ${this.#splitEnabled
          ? html`
              <div
                role="separator"
                class="panel-splitter"
                tabindex="0"
                aria-orientation="horizontal"
                aria-valuemin=${PANEL_SPLIT_MIN}
                aria-valuemax=${PANEL_SPLIT_MAX}
                aria-valuenow=${ratio}
                aria-controls=${PREVIEW_PANE_ID}
                aria-labelledby=${PREVIEW_PANE_LABEL_ID}
                @keydown=${this.#onSeparatorKeydown}
                @pointerdown=${this.#onSeparatorPointerDown}
                @pointermove=${this.#onSeparatorPointerMove}
                @pointerup=${this.#onSeparatorPointerUp}
                @pointercancel=${this.#onSeparatorPointerUp}
              ></div>
            `
          : nothing}
        <typo-export class="export-panel main-panel__secondary" .state=${this.state}></typo-export>
      </div>
    `;
  }
}

if (!customElements.get("typo-main-panel")) {
  customElements.define("typo-main-panel", TypoMainPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    "typo-main-panel": TypoMainPanel;
  }
}

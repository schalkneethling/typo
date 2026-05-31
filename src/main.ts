import "./styles/app.css";
import { getState, loadFromStorage, onStateChange } from "./app/store.ts";
import type { AppState } from "./app/types.ts";
import "./components/typo-app.ts";
import { applyFontsToDocument } from "./fonts/google-fonts.ts";

function syncPreviewFonts(state: AppState): void {
  applyFontsToDocument(
    state.bodyFontFamily,
    state.headingFontFamily,
    state.bodyFontWeight,
    state.headingFontWeight,
  );
}

function initApp(): void {
  loadFromStorage();
  onStateChange(syncPreviewFonts);
  syncPreviewFonts(getState());

  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) return;

  root.replaceChildren(document.createElement("typo-app"));
}

initApp();

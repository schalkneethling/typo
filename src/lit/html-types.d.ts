import type { TypoApp } from "../components/typo-app.ts";
import type { TypoExport } from "../components/typo-export.ts";
import type { TypoFontPicker } from "../components/typo-font-picker.ts";
import type { TypoMainPanel } from "../components/typo-main-panel.ts";
import type { TypoPreview } from "../components/typo-preview.ts";
import type { TypoSettings } from "../components/typo-settings.ts";

declare module "lit" {
  interface HTMLElementTagNameMap {
    "typo-app": TypoApp;
    "typo-settings": TypoSettings;
    "typo-main-panel": TypoMainPanel;
    "typo-preview": TypoPreview;
    "typo-export": TypoExport;
    "typo-font-picker": TypoFontPicker;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "typo-app": Partial<TypoApp>;
      "typo-settings": Partial<TypoSettings>;
      "typo-main-panel": Partial<TypoMainPanel>;
      "typo-preview": Partial<TypoPreview>;
      "typo-export": Partial<TypoExport>;
      "typo-font-picker": Partial<TypoFontPicker>;
    }
  }
}

export {};

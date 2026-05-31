/** Preview palette — mirrors app surface/text tokens for export and pickers. */
export const PREVIEW_COLORS = {
  text: {
    light: "#1a1a2e",
    dark: "#e8e8f0",
  },
  background: {
    light: "#f8f8fc",
    dark: "#0c0c18",
  },
} as const;

export function previewTextForPicker(value: string | null): string {
  if (value) return value;
  return prefersDarkScheme() ? PREVIEW_COLORS.text.dark : PREVIEW_COLORS.text.light;
}

export function previewBackgroundForPicker(value: string | null): string {
  if (value) return value;
  return prefersDarkScheme() ? PREVIEW_COLORS.background.dark : PREVIEW_COLORS.background.light;
}

export function exportPreviewColor(custom: string | null, light: string, dark: string): string {
  return custom ?? `light-dark(${light}, ${dark})`;
}

function prefersDarkScheme(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Preview palette — mirrors app surface/text tokens for export and pickers. */
export const PREVIEW_COLORS = {
  text: {
    light: "#2b2d42",
    dark: "#edf2f4",
  },
  background: {
    light: "#edf2f4",
    dark: "#2b2d42",
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

export const PANEL_SPLIT_MIN = 0;
export const PANEL_SPLIT_MAX = 100;
export const PANEL_SPLIT_STEP = 5;
export const PANEL_SPLIT_DEFAULT = 62;
export const PANEL_SPLIT_STORAGE_KEY = "typo-panel-split-ratio";

export function clampPanelSplit(value: number): number {
  return Math.min(PANEL_SPLIT_MAX, Math.max(PANEL_SPLIT_MIN, value));
}

export function stepPanelSplit(value: number, delta: number): number {
  return clampPanelSplit(value + delta * PANEL_SPLIT_STEP);
}

export function readStoredPanelSplit(): number | null {
  try {
    const raw = localStorage.getItem(PANEL_SPLIT_STORAGE_KEY);
    if (raw == null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? clampPanelSplit(parsed) : null;
  } catch {
    return null;
  }
}

export function storePanelSplit(value: number): void {
  try {
    localStorage.setItem(PANEL_SPLIT_STORAGE_KEY, String(clampPanelSplit(value)));
  } catch {
    /* ignore quota / private mode */
  }
}

export type PanelSplitEnterResult =
  | { kind: "collapse"; nextValue: number; restoreValue: number }
  | { kind: "restore"; nextValue: number };

/** Enter toggles between collapsed (min) and the previous ratio. */
export function panelSplitEnter(
  value: number,
  collapsed: boolean,
  restoreValue: number,
): PanelSplitEnterResult {
  if (collapsed) {
    return { kind: "restore", nextValue: clampPanelSplit(restoreValue) };
  }
  return {
    kind: "collapse",
    nextValue: PANEL_SPLIT_MIN,
    restoreValue: clampPanelSplit(value),
  };
}

/** Map pointer Y within a container to a 0–100 primary-pane ratio. */
export function panelSplitFromPointer(
  clientY: number,
  rect: Pick<DOMRect, "top" | "height">,
): number {
  if (rect.height <= 0) return PANEL_SPLIT_DEFAULT;
  const ratio = ((clientY - rect.top) / rect.height) * PANEL_SPLIT_MAX;
  return clampPanelSplit(Math.round(ratio));
}

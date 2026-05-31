import { describe, expect, it } from "vitest";
import {
  PANEL_SPLIT_DEFAULT,
  PANEL_SPLIT_MAX,
  PANEL_SPLIT_MIN,
  clampPanelSplit,
  panelSplitEnter,
  panelSplitFromPointer,
  stepPanelSplit,
} from "./panel-splitter.ts";

describe("panel splitter", () => {
  it("clamps to 0–100", () => {
    expect(clampPanelSplit(-10)).toBe(PANEL_SPLIT_MIN);
    expect(clampPanelSplit(150)).toBe(PANEL_SPLIT_MAX);
    expect(clampPanelSplit(40)).toBe(40);
  });

  it("steps by 5", () => {
    expect(stepPanelSplit(50, 1)).toBe(55);
    expect(stepPanelSplit(3, -1)).toBe(0);
    expect(stepPanelSplit(98, 1)).toBe(100);
  });

  it("maps pointer position to ratio", () => {
    const rect = { top: 100, height: 200 };
    expect(panelSplitFromPointer(100, rect)).toBe(0);
    expect(panelSplitFromPointer(200, rect)).toBe(50);
    expect(panelSplitFromPointer(300, rect)).toBe(100);
  });

  it("toggles collapse on Enter", () => {
    expect(panelSplitEnter(60, false, 0)).toEqual({
      kind: "collapse",
      nextValue: 0,
      restoreValue: 60,
    });
    expect(panelSplitEnter(0, true, 60)).toEqual({
      kind: "restore",
      nextValue: 60,
    });
  });

  it("has a sensible default", () => {
    expect(PANEL_SPLIT_DEFAULT).toBeGreaterThan(0);
    expect(PANEL_SPLIT_DEFAULT).toBeLessThan(100);
  });
});

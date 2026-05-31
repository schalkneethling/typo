import { describe, expect, it } from "vitest";
import { reduce } from "./state-machine.ts";
import { DEFAULT_STATE } from "./types.ts";

describe("reduce", () => {
  it("merges patches into state", () => {
    const next = reduce(DEFAULT_STATE, {
      type: "patch",
      patch: { baseFontSizePx: 18, fluidTypography: true },
    });
    expect(next.baseFontSizePx).toBe(18);
    expect(next.fluidTypography).toBe(true);
    expect(next.scalePresetId).toBe(DEFAULT_STATE.scalePresetId);
  });

  it("resets to defaults", () => {
    const changed = reduce(DEFAULT_STATE, {
      type: "patch",
      patch: { baseFontSizePx: 20 },
    });
    const reset = reduce(changed, { type: "reset" });
    expect(reset).toEqual(DEFAULT_STATE);
  });

  it("clears fluidCssFunction when fluid typography is disabled", () => {
    const enabled = reduce(DEFAULT_STATE, {
      type: "patch",
      patch: { fluidTypography: true, fluidCssFunction: true },
    });
    const next = reduce(enabled, {
      type: "patch",
      patch: { fluidTypography: false },
    });
    expect(next.fluidTypography).toBe(false);
    expect(next.fluidCssFunction).toBe(false);
  });
});

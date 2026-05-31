import { describe, expect, it } from "vitest";
import { formatSize, remToPx } from "./units.ts";

describe("units", () => {
  it("converts rem to px at base 16", () => {
    expect(remToPx(1, 16)).toBe(16);
    expect(remToPx(1.2, 16)).toBe(19.2);
  });

  it("formats rem and px", () => {
    expect(formatSize(1.2, "rem", 16)).toBe("1.2rem");
    expect(formatSize(1.2, "px", 16)).toBe("19.2px");
  });
});

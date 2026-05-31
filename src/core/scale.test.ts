import { describe, expect, it } from "vitest";
import { computeScale, computeTokenRem } from "./scale.ts";

describe("computeTokenRem", () => {
  const ratio = 1.2;

  it("matches golden values at ratio 1.2", () => {
    expect(computeTokenRem("p", ratio)).toBe(1);
    expect(computeTokenRem("h6", ratio)).toBe(1.2);
    expect(computeTokenRem("h5", ratio)).toBe(1.44);
    expect(computeTokenRem("h4", ratio)).toBe(1.728);
    expect(computeTokenRem("h3", ratio)).toBe(2.074);
    expect(computeTokenRem("h2", ratio)).toBe(2.488);
    expect(computeTokenRem("h1", ratio)).toBe(2.986);
    expect(computeTokenRem("small", ratio)).toBe(0.833);
    expect(computeTokenRem("xs", ratio)).toBe(0.694);
  });
});

describe("computeScale", () => {
  it("returns nine tokens", () => {
    expect(computeScale(1.2)).toHaveLength(9);
  });
});

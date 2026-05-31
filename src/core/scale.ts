import { SCALE_TOKENS, TOKEN_EXPONENTS, type ScaleToken, type TokenSize } from "../app/types.ts";

export function getRatio(
  presetId: string,
  customRatio: number,
  presets: { id: string; ratio: number }[],
): number {
  if (presetId === "custom") {
    return customRatio;
  }
  const preset = presets.find((p) => p.id === presetId);
  return preset?.ratio ?? customRatio;
}

export function computeTokenRem(token: ScaleToken, ratio: number): number {
  const exponent = TOKEN_EXPONENTS[token];
  return roundRem(Math.pow(ratio, exponent));
}

export function computeScale(ratio: number): TokenSize[] {
  return SCALE_TOKENS.map((token) => ({
    token,
    rem: computeTokenRem(token, ratio),
  }));
}

export function roundRem(value: number, decimals = 3): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

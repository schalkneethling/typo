import { ENV } from "varlock/env";
import { FALLBACK_FONTS } from "./fallback-fonts.ts";

export interface FontOption {
  family: string;
  category: string;
  weights: number[];
}

interface GoogleFontsApiItem {
  family: string;
  category: string;
  variants: string[];
}

interface GoogleFontsApiResponse {
  items?: GoogleFontsApiItem[];
}

/** Icon / non-text families to omit from the typography picker. */
const EXCLUDED_FONT_FAMILIES = new Set(["Material Symbols Outlined"]);

function isExcludedFont(family: string): boolean {
  return EXCLUDED_FONT_FAMILIES.has(family);
}

function fontLinkId(family: string): string {
  return `typo-font-${family.toLowerCase().replace(/\s+/g, "-")}`;
}

function parseWeights(variants: string[]): number[] {
  const weights = new Set<number>();
  for (const v of variants) {
    const match = /^(\d+)/.exec(v);
    if (match) {
      weights.add(Number.parseInt(match[1]!, 10));
    } else if (v === "regular") {
      weights.add(400);
    }
  }
  return [...weights].sort((a, b) => a - b);
}

export function getApiKey(): string {
  const key =
    ENV.VITE_GOOGLE_FONTS_API_KEY ??
    (import.meta.env.VITE_GOOGLE_FONTS_API_KEY as string | undefined);
  return typeof key === "string" ? key.trim() : "";
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}

export function getFallbackFonts(): FontOption[] {
  return FALLBACK_FONTS.map((f) => ({
    family: f.family,
    category: f.category,
    weights: f.weights,
  }));
}

let popularFontsPromise: Promise<FontOption[]> | undefined;

export function getPopularFonts(): Promise<FontOption[]> {
  if (!hasApiKey()) {
    return Promise.resolve(getFallbackFonts());
  }
  popularFontsPromise ??= searchFonts("").catch(() => getFallbackFonts());
  return popularFontsPromise;
}

export async function searchFonts(query: string): Promise<FontOption[]> {
  const key = getApiKey();
  if (!key) {
    const q = query.toLowerCase().trim();
    return getFallbackFonts().filter((f) => !q || f.family.toLowerCase().includes(q));
  }

  const url = new URL("https://www.googleapis.com/webfonts/v1/webfonts");
  url.searchParams.set("key", key);
  url.searchParams.set("sort", "popularity");
  if (query.trim()) {
    url.searchParams.set("family", query.trim());
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Fonts API error: ${res.status}`);
  }

  const data = (await res.json()) as GoogleFontsApiResponse;
  const items = data.items ?? [];

  return items
    .filter((item) => !isExcludedFont(item.family))
    .slice(0, 30)
    .map((item) => ({
      family: item.family,
      category: item.category,
      weights: parseWeights(item.variants),
    }));
}

export function loadFontFamily(family: string, weights: number[] = [400, 600]): void {
  if (!family) return;

  const w = [...new Set(weights)].sort((a, b) => a - b).join(";");
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${w}&display=swap`;
  const id = fontLinkId(family);

  let link = document.getElementById(id) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    document.head.append(link);
  }

  if (link.href !== href) {
    link.href = href;
  }
}

export function applyFontsToDocument(
  bodyFamily: string,
  headingFamily: string,
  bodyWeight: number,
  headingWeight: number,
): void {
  loadFontFamily(bodyFamily, [bodyWeight, 400, 600, 700]);
  if (headingFamily !== bodyFamily) {
    loadFontFamily(headingFamily, [headingWeight, 400, 600, 700]);
  }
}

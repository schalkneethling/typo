export interface FallbackFont {
  family: string;
  category: "sans-serif" | "serif" | "monospace";
  weights: number[];
}

export const FALLBACK_FONTS: FallbackFont[] = [
  { family: "Inter", category: "sans-serif", weights: [400, 500, 600, 700] },
  { family: "Lora", category: "serif", weights: [400, 500, 600, 700] },
  {
    family: "Source Sans 3",
    category: "sans-serif",
    weights: [400, 600, 700],
  },
  {
    family: "Source Serif 4",
    category: "serif",
    weights: [400, 600, 700],
  },
  { family: "Roboto", category: "sans-serif", weights: [400, 500, 700] },
  { family: "Open Sans", category: "sans-serif", weights: [400, 600, 700] },
  { family: "Merriweather", category: "serif", weights: [400, 700] },
  { family: "Playfair Display", category: "serif", weights: [400, 600, 700] },
  { family: "DM Sans", category: "sans-serif", weights: [400, 500, 700] },
  { family: "Fraunces", category: "serif", weights: [400, 600, 700] },
  { family: "JetBrains Mono", category: "monospace", weights: [400, 600] },
  { family: "Work Sans", category: "sans-serif", weights: [400, 600, 700] },
];

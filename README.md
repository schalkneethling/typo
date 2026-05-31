# Typo

**Design a modular type scale, preview it live, and copy production-ready CSS.**

Typo is a browser-based typography tool for building harmonious type scales from musical ratios. Tune body and heading fonts, line height, and spacing, then export CSS custom properties and utility classes you can drop into any project. Optional fluid typography generates per-token `clamp()` values — and, for cutting-edge browsers, an opt-in `@function --fluid-size()` helper with `clamp()` fallbacks.

Repository: [github.com/schalkneethling/typo](https://github.com/schalkneethling/typo)

## Features

- **Modular scale presets** — Minor third, perfect fourth, perfect fifth, and more, plus a custom ratio
- **Live preview** — Every scale step rendered with your chosen body and heading fonts
- **CSS export** — Custom properties (`--typo-size-*`), font stacks, and `.typo-*` utility classes
- **Fluid typography** — Viewport-aware `clamp()` sizing across the full scale, with configurable min/max viewport widths
- **CSS `@function` export** — Optional `--fluid-size(min, max)` output with `clamp()` fallbacks for progressive enhancement
- **Google Fonts integration** — Search popular families when an API key is configured; curated fallback list otherwise
- **Persistent settings** — Your configuration is saved to `localStorage` between visits
- **Light / dark** — Preview colors adapt to system color scheme (`light-dark()` in exported CSS)

## Quick start

Requires [Bun](https://bun.sh/) (see `packageManager` in `package.json`).

```bash
git clone https://github.com/schalkneethling/typo.git
cd typo
vp install
npm run dev
```

Open the URL printed by the dev server (typically `http://localhost:5173`).

## Google Fonts API key

Font search uses the [Google Fonts Developer API](https://developers.google.com/fonts/docs/developer_api). Without a key, the app uses a curated fallback list — everything else works normally.

### Local development (1Password)

[`.env.schema`](.env.schema) is committed and safe to version-control: it contains an `op://` secret reference, not the API key itself. [Varlock](https://varlock.dev/) resolves the real value via the [1Password plugin](https://varlock.dev/plugins/1password/) when you run `npm run dev` (`varlock run -- vp dev`).

Requires the [1Password CLI](https://developer.1password.com/docs/cli/get-started/) with desktop app integration (`account=my.1password.com`).

### Netlify / CI

Set **`VITE_GOOGLE_FONTS_API_KEY`** in your build environment (Netlify: Site configuration → Environment variables). Enable scope **Builds** (and **Deploy previews** if you want font search on preview URLs).

At build time, Varlock detects Netlify via `$VARLOCK_ENV` (`production` or `preview`) and reads the key from the process environment — no 1Password on the build image. The same variable name is used locally (1Password), on Netlify (secrets), and in the browser bundle (`VITE_` prefix).

Restrict the key in [Google Cloud Console](https://console.cloud.google.com/) with HTTP referrer rules for your deployment domain.

## Scripts

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Dev server (`varlock run` + Vite)             |
| `npm run build` | Production build                              |
| `npm run preview` | Preview the production build locally        |
| `npm run test`  | Unit tests                                    |
| `npm run check` | Format, lint, typecheck (`VARLOCK_ENV=test`)  |

## Exported CSS at a glance

With fluid typography enabled, Typo emits per-token sizes as CSS variables:

```css
:root {
  --typo-size-default: clamp(0.875rem, 0.771rem + 0.44vw, 1.125rem);
  --typo-size-display: clamp(2.613rem, 2.303rem + 1.32vw, 3.359rem);
}

.typo-default {
  font-size: var(--typo-size-default);
}
```

Enable **With CSS @function** to also get a reusable `--fluid-size()` function and dual `font-size` declarations on each utility class.

## Tech stack

- [Lit](https://lit.dev/) (light DOM components)
- [Vite+](https://viteplus.dev/) (`vp` CLI)
- [Varlock](https://varlock.dev/) for environment and secrets
- TypeScript

## Status

Beta — feedback and issues welcome on [GitHub](https://github.com/schalkneethling/typo/issues).

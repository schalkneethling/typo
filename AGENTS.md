<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# Agent guidance

## Do not fight the framework

If you find yourself working around the framework — manual `requestUpdate()` loops, revision counters, duplicate subscriptions, or imperative DOM sync to compensate for stale UI — stop and assume the architecture is wrong.

Before adding more patches:

1. Read the relevant **official documentation** (for UI work here: [Lit](https://lit.dev/docs/)).
2. Reconsider the **data flow and component boundaries**, even when that implies a large refactor.
3. Prefer the framework’s native patterns over bespoke glue code.

### Lit (this project)

- **State flows down as properties.** `TypoApp` subscribes to the store once and passes `.state` to children. Child components render from `this.state`; they do not call `getState()` inside `render()` and expect updates.
- **Side effects belong at the app boundary.** Example: loading Google Fonts runs from `main.ts` on store changes, not inside a child’s lifecycle hooks.
- **Light DOM is intentional** (`LightDomElement`) so global CSS applies; still follow Lit’s property-driven update model.

When in doubt, simplify toward **one reactive owner** and explicit props rather than adding another layer of synchronization. This is the same idea as **lifting state up** in React: keep shared state in the nearest common ancestor (`TypoApp` + the store), pass it down as props (Lit properties), and let children stay presentational or emit changes back through the store — not through parallel subscriptions or imperative sync.

## TypeScript

Prefer inference. Add types only when TypeScript cannot reliably infer the correct type, or when being explicit has a clear DX benefit (e.g. `PropertyValues<this>` on Lit `willUpdate` / `updated` so `changed.has(...)` is checked correctly).

### `override` and platform base classes

TypeScript’s [`override`](https://www.typescriptlang.org/tsconfig/#noImplicitOverride) keyword (with [`noImplicitOverride`](https://www.typescriptlang.org/tsconfig/#noImplicitOverride)) helps subclasses stay in sync when a **base class renames or removes** a member you thought you were overriding — without `override`, a stale method name can silently become a new method on the subclass.

That risk matters most when the base class is **your own code** or a **third-party library** that evolves across versions. It is much less relevant for **platform-native bases** (`HTMLElement`, `EventTarget`, etc.): the web platform’s backwards-compatibility guarantees make breaking renames of APIs like `connectedCallback` or `disconnectedCallback` extremely unlikely.

This project does **not** enable `noImplicitOverride` and does **not** use `override` on custom-element lifecycle methods or other stable platform APIs. Do not add `override` by default on web components unless we explicitly turn on `noImplicitOverride` and the base is something we expect to change underneath us (e.g. an internal abstract base we maintain).

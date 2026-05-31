import { varlockVitePlugin } from "@varlock/vite-integration";
import { defineConfig } from "vite-plus";

/** Vitest sets VITEST; skip Varlock injection so unit tests do not need 1Password. */
const useVarlock = !process.env.VITEST;

export default defineConfig({
  plugins: useVarlock ? [varlockVitePlugin()] : [],
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: [".agents/**", "node_modules/**", "dist/**"],
  },
  lint: {
    ignorePatterns: [".agents/**", "src/**/*.test.ts"],
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // pins TS-01 even if the preset's default changes
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // the locked hook scripts are CommonJS and cannot be edited, so only this rule is off for them
    files: [".claude/hooks/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "node_modules/**",
    "next-env.d.ts",
    "coverage/**",
    ".velite/**",
  ]),
]);

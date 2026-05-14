import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("typescript-eslint").ConfigArray} */
export default tseslint.config(js.configs.recommended, tseslint.configs.recommended, {
  rules: {
    // TypeScript
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "none", // exercise stubs intentionally have unused params
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
        disallowTypeAnnotations: false, // allows typeof import() in function signatures
      },
    ],

    // General
    "no-console": "warn",
    eqeqeq: ["error", "always"],
    "no-var": "error",
    "prefer-const": "error",
  },
});

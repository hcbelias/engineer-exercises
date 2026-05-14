import globals from "globals";
import tseslint from "typescript-eslint";
import baseConfig from "./base.js";

/** @type {import("typescript-eslint").ConfigArray} */
export default tseslint.config(...baseConfig, {
  languageOptions: {
    globals: globals.node,
  },
  rules: {
    "no-console": "off", // logging is expected in server code
    "@typescript-eslint/no-require-imports": "error",
  },
});

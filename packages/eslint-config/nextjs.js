import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import reactConfig from "./react.js";

/** @type {import("typescript-eslint").ConfigArray} */
export default tseslint.config(...reactConfig, {
  plugins: {
    "@next/next": nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,

    // Next.js specific
    "@next/next/no-html-link-for-pages": "error",
  },
});

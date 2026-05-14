import reactConfig from "@exercises/eslint-config/react";
import nodeConfig from "@exercises/eslint-config/node";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Client — React SPA rules
  {
    files: ["client/**/*.{ts,tsx}"],
    extends: reactConfig,
  },

  // Server — Node.js rules
  {
    files: ["server/**/*.ts"],
    extends: nodeConfig,
  },

  {
    ignores: ["dist/**", "node_modules/**"],
  },
);

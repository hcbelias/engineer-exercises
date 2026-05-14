import nextConfig from "@exercises/eslint-config/nextjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...nextConfig,
  {
    // Test files can capture React setters in outer `let` variables — standard vitest pattern.
    files: ["src/test/**", "**/*.test.{ts,tsx}"],
    rules: {
      "react-hooks/globals": "off",
    },
  },
  {
    // Next.js error boundaries are expected to log errors for observability.
    files: ["src/app/error.tsx"],
    rules: {
      "no-console": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
);

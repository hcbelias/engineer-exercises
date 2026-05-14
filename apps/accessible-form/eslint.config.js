import reactConfig from "@exercises/eslint-config/react";
import tseslint from "typescript-eslint";

export default tseslint.config(...reactConfig, {
  ignores: ["dist/**", "node_modules/**"],
});

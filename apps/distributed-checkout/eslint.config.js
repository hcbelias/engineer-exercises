import nodeConfig from "@exercises/eslint-config/node";
import tseslint from "typescript-eslint";

export default tseslint.config(...nodeConfig, {
  ignores: ["dist/**", "node_modules/**"],
});

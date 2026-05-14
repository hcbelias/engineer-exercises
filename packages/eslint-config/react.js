import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";
import baseConfig from "./base.js";

/** @type {import("typescript-eslint").ConfigArray} */
export default tseslint.config(...baseConfig, {
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
  },
  languageOptions: {
    globals: globals.browser,
  },
  settings: {
    react: { version: "detect" },
  },
  rules: {
    // React
    ...reactPlugin.configs.recommended.rules,
    "react/react-in-jsx-scope": "off", // not needed with React 17+ JSX transform
    "react/prop-types": "off", // TypeScript handles this
    "react/self-closing-comp": "error",
    "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],

    // Hooks
    ...reactHooksPlugin.configs.recommended.rules,
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/refs": "warn", // ref.current = value during render is valid for syncing callbacks
  },
});

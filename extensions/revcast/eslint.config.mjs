import raycastConfig from "@raycast/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...raycastConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

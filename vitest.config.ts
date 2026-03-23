import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing/vitest-plugin";

export default defineConfig({
  plugins: [await WxtVitest()],
  test: {
    environment: "happy-dom",
    include: ["**/__tests__/**/*.test.ts", "**/*.test.ts", "**/*.spec.ts"],
    exclude: ["node_modules/**", ".output/**", ".wxt/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["entrypoints/**/*.ts"],
      exclude: ["entrypoints/**/__tests__/**"],
    },
  },
});

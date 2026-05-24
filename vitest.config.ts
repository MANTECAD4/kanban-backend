import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: "setup-test.ts",
    fileParallelism: false,
    // exclude: [...configDefaults.exclude, "packages/template/*"],
  },
});

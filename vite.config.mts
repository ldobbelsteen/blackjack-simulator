/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
  },
  test: {
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      include: ["src/engine/"],
      exclude: ["src/engine/worker.ts"],
    },
  },
});

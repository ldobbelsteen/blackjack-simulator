import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      include: ["src/engine/"],
      exclude: ["src/engine/worker.ts"],
    },
  },
});

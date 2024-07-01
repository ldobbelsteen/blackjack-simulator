/** @type {import('vite').UserConfig} */
export default {
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
};

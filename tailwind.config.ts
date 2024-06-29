import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
    },
    colors: {
      deepgray: "#1a1a1a",
      darkgray: "#2a2a2a",
      semidarkgray: "#3a3a3a",
      lightgray: "#e5e5e5",
    },
  },
  plugins: [],
} satisfies Config;

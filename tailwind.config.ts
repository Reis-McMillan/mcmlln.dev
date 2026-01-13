import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      colors: {
        gray: {
          50: "#f2f2f2",
          100: "#ededed",
          200: "#e0e0e0",
          300: "#d4d4d4",
          400: "#c4c4c4",
          500: "#b3b3b3",
          600: "#a1a1a1",
          700: "#8a8a8a",
          800: "#6b6b6b",
          900: "#404040",
          950: "#000",
        },
      },
    },
  },
} satisfies Config;

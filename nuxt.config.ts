// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  compatibilityDate: "2025-07-15",
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/fonts",
    "nuxt-security",
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  icon: {
    serverBundle: {
      collections: ["logos", "devicon", "mdi", "skill-icons", "lucide"],
    },
  },
  fonts: {
    families: [{ name: "JetBrains Mono", provider: "google" }],
    experimental: {
      processCSSVariables: true,
    },
  },
  image: {
    quality: 80,
    format: ["webp"],
  },
  app: {
    head: {
      title: "Reis McMillan",
      titleTemplate: "%s - Reis McMillan",
      link: [
        {
          rel: "icon",
          href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✨</text></svg>",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      buildAt: new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
      environment: "production",
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  telemetry: false,
});

import Tailwind from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },
  compatibilityDate: "2025-07-15",
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/fonts",
    "nuxt-security",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [Tailwind()],
  },
  fonts: {
    experimental: {
      processCSSVariables: true,
    },
  },
  postcss: {
    plugins: {
      cssnano: {
        preset: "default",
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [
        {
          rel: "icon",
          href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%2318181b%22 width=%22100%22 height=%22100%22 rx=%228%22/><text x=%2250%22 y=%2272%22 font-family=%22monospace%22 font-size=%2270%22 font-weight=%22bold%22 fill=%22%2322c55e%22 text-anchor=%22middle%22>r</text></svg>",
        },
      ],
      meta: [
        { name: "author", content: "Reis McMillan" },
        { name: "theme-color", content: "#DD6031" },
      ],
    },
  },
  runtimeConfig: {
    monkeytypeApeKey: process.env.APE_KEY ?? "",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    contactToEmail: process.env.CONTACT_TO_EMAIL ?? "",
    contactFromEmail: process.env.CONTACT_FROM_EMAIL ?? "",
    public: {
      siteUrl: "https://mcmlln.dev",
      buildAt: new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      }),
      environment: "production",
    },
  },
  typescript: {
    strict: true,
  },
  telemetry: false,
  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
    },
  },
  routeRules: {
    "/resume.pdf": {
      security: {
        headers: {
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false,
        },
      },
    },
  },
});

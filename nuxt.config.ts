export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      BACKEND_SERVICE: process.env.NUXT_PUBLIC_BACKEND_SERVICE || 'http://localhost:8000/api',
    },
  },
  nitro: {
    preset: 'static'
  },
  ssr: false,
  css: ["vuetify/styles", '@mdi/font/css/materialdesignicons.css'],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    ssr: {
      noExternal: ["vuetify"],
    },
  },
  compatibilityDate: "2025-02-09",

  // Tambahkan module Pinia
  modules: ['@pinia/nuxt'],
});

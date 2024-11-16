// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [],
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.VITE_API_URL,
      apiToken: process.env.VITE_API_TOKEN
    }
  }
})

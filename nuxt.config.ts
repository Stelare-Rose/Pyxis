// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],
  ssr: false,
  components: [
    {
      path: '~/components/',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },
  srcDir: './app/',
  build: {
    transpile: ['@vuepic/vue-datepicker'],
  },
  compatibilityDate: '2025-05-15',
  nitro: {
    preset: 'static',
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})

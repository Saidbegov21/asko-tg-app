// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/color-mode'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  app: {
    head: {
      meta: [{
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0 user-scalable=no, viewport-fit=cover'
      }],
      script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }]
    }
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'light'
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

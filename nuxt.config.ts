import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@intlify/nuxt3'],
    runtimeConfig: {
        secretKey: '', // variable that can only be accessed on the server side
        base_api: process.env.BASE_URL_API,
        public: {
            BASE_URL_API: process.env.BASE_URL_API || 'https://nuxtjs.org' // variable that can also be accessed on the client side
        }
    },
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
        transpile: ['vee-validate', '@vee-validate/rules', 'moment'],
    },
    css: [
        "~/assets/css/tailwind.css",
        "~/assets/css/app.css"
    ],
    alias: {
        '~/*': './*',
    },
    intlify: {
        localeDir: 'locales',
        vueI18n: {
            fallbackLocale: ['lo', 'en'],
            locale: 'lo',
        }
    }
})

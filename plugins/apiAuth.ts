export default defineNuxtPlugin((nuxtApp) => {
    // const config = useRuntimeConfig();
    const Auth = useCookie('autKey');
    nuxtApp.vueApp.provide('auth', Auth)
    nuxtApp.provide('auth', Auth)
})
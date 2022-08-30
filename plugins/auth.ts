export default defineNuxtPlugin(() => {
    const router = useRoute()
    addRouteMiddleware('auth', () => {
        const { $auth } = useNuxtApp()
        console.log($auth.value)
        if ($auth.value) {
        } else {
            return navigateTo('/login')
        }
    })
})

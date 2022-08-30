import { useCookie, setCookie } from 'h3'
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
export default async (req, res) => {
    let Auth = useCookie(req, 'autKey')
    const data = await $fetch(`${BaseApi}users`, {
        headers: {
            'Authorization': 'Bearer ' + Auth
        }
    })
    return { data }
}
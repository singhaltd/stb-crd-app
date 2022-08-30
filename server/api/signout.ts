import { useCookie, setCookie } from 'h3'
// const router = useRouter()
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
export default async (req, res) => {
    let Auth = useCookie(req, 'autKey')
    const data = await $fetch(`${BaseApi}logout`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + Auth
        }
    })
    setCookie(req, 'autKey', null)
    return data
}
export const fetchUsers = async (url: string,method: string) => {
    const res = await $fetch.raw(url)
    const cookies = (res.headers.get('set-cookie') || '').split(',')
    res.headers.set('method','GET')
    console.log(res)
    for (const cookie of cookies) {
      appendHeader(useRequestEvent(), 'set-cookie', cookie)
    }
    return res._data
  }
import type { IncomingMessage, ServerResponse } from 'http'
// let token = useCookie('autKey')
// import { createError, useCookie } from 'h3'
export default async (req: IncomingMessage, res: ServerResponse, next) => {
    if (req.url.includes('/api/')) {
        
        try {
            console.log('auth')
            next()
        }
        catch (e) {
            console.error('Error auth:::', e)
            throw createError({ statusCode: 401, statusMessage: 'You must be signed in to access to resource.' })
        }
    }
}
import { serialize, parse } from "cookie";
import { Request } from "express";

export const userCookie = (token: string | null, clear = false) => {
    
    if (clear) {
        return serialize('authToken', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 0,
            path: '/'
        })
    }
    
    return serialize('authToken', token || '', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60,
        path: '/'
    })
}

export const parseCookies = (req: Request): Record<string, string | undefined> => {
    const cookieHeader = req.headers.cookie;
    return cookieHeader ? parse(cookieHeader) : {}
}
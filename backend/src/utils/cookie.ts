import { serialize } from "cookie";

export const userCookie = (token: string) => {
    return serialize('authToken', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60,
        path: '/'
    })
}
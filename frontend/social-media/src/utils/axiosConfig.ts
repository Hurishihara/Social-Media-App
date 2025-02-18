import axios from 'axios'

const apiRoute: Record<string, string> = {
    auth: '/auth',
    conversation: '/conversation',
    friendship: '/friendship',
    like: '/like',
    message: '/message',
    notification: '/notification',
    post: '/post',
    user: '/user',
}

export const api = (route: string) => {
    const baseUrl = `http://localhost:3000/api${apiRoute[route] || ''}`
    return axios.create({
        baseURL: baseUrl,
        withCredentials: true,
    })
}

/*
export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
})
    */
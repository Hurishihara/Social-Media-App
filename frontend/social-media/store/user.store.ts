import { create } from 'zustand';


interface UserStore {
    userId: number | null
    userName: string | null
    setUserId: (id: number) => void
    setUserName: (name: string) => void
    clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    userId: JSON.parse(localStorage.getItem('userId') || 'null'),
    userName: JSON.parse(localStorage.getItem('userName') || 'null'),
    setUserId: (id: number) => {
        set({ userId: id })
        localStorage.setItem('userId', JSON.stringify(id))
    },
    setUserName: (name: string) => {
        set({ userName: name })
        localStorage.setItem('userName', JSON.stringify(name))
    },
    clearUser: () => {
        set({ userId: null, userName: null })
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
    }
}))
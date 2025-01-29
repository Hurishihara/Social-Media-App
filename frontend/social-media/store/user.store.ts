import { create } from 'zustand';


interface UserStore {
    userId: number | null
    userName: string | null
    profilePicture: string | null
    bio: string | null
    setUserId: (id: number) => void
    setUserName: (name: string) => void
    setProfilePicture: (profilePicture: string) => void
    setBio: (bio: string) => void
    clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
    userId: JSON.parse(localStorage.getItem('userId') || 'null'),
    userName: JSON.parse(localStorage.getItem('userName') || 'null'),
    profilePicture: JSON.parse(localStorage.getItem('profilePicture') || 'null'),
    bio: JSON.parse(localStorage.getItem('bio') || 'null'),
    setUserId: (id: number) => {
        set({ userId: id })
        localStorage.setItem('userId', JSON.stringify(id))
    },
    setUserName: (name: string) => {
        set({ userName: name })
        localStorage.setItem('userName', JSON.stringify(name))
    },
    setProfilePicture: (profilePicture: string) => {
        set({ profilePicture: profilePicture })
        localStorage.setItem('profilePicture', JSON.stringify(profilePicture))
    },
    setBio: (bio: string) => {
        set({ bio: bio })
        localStorage.setItem('bio', JSON.stringify(bio))
    },
    clearUser: () => {
        set({ userId: null, userName: null })
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
    }
}))
import { create } from 'zustand'

export interface Notification {
    created_at: string
    has_seen: boolean
    id: number
    notificationText: string
    notification_type: string
    receiver_id: number
    related_post_id: number | null
    releated_user_id: number | null
    senderProfilePicture: string
    senderUserId: number
    senderUserName: string
    sender_id: number
}

interface NotificationStore {
    userNotifications: Notification[]
    setUserNotifications: (notifications: Notification[]) => void
    clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    userNotifications: JSON.parse(localStorage.getItem('notifications') || '[]'),
    setUserNotifications: (newNotifications: Notification[]) => {
        set(() => {
            localStorage.setItem('notifications', JSON.stringify(newNotifications))
            return { userNotifications: newNotifications}
        })
    },
    clearNotifications: () => {
        set({ userNotifications: [] })
        localStorage.removeItem('notifications')
    }
}))

export default useNotificationStore
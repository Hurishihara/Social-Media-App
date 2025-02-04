import { create } from 'zustand'

interface Notification {
    createdAt: string
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
    notifications: Notification[]
    setNotifications: (notifications: Notification[]) => void
    clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: JSON.parse(localStorage.getItem('notifications') || '[]'),
    setNotifications: (notifications: Notification[]) => {
        set({ notifications })
        localStorage.setItem('notifications', JSON.stringify(notifications))
    },
    clearNotifications: () => {
        set({ notifications: [] })
        localStorage.removeItem('notifications')
    }
}))

export default useNotificationStore
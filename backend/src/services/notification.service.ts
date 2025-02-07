import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { NotificationsTable, PostsTable, UsersTable } from "../drizzle/schema";


type NotificationType = 'like' | 'comment' | 'friend_request' | 'friend_accept' | 'friend_decline';

const notificationTexts: Record<NotificationType, (senderUserName: string) => string> = {
    like: (senderUserName: string) => `${senderUserName} liked your post`,
    comment: (senderUserName: string) => `${senderUserName} commented on your post`,
    friend_request: (senderUserName: string) => `${senderUserName} sent you a friend request`,
    friend_accept: (senderUserName: string) => `${senderUserName} accepted your friend request`,
    friend_decline: (senderUserName: string) => `${senderUserName} declined your friend request`,
};

class NotificationService {
    async createNotification(notificationType: NotificationType, receiverId: number, senderId: number, relatedPostId?: number | null, relatedUserId?: number | null): Promise<any> {
        const notifications = await db.insert(NotificationsTable).values({
            notification_type: notificationType,
            receiver_id: receiverId,
            sender_id: senderId,
            related_post_id: relatedPostId ?? null,
            related_user_id: relatedUserId ?? null
        }).returning()

        const sender = await db.select({
            senderUserId: UsersTable.id,
            senderUserName: UsersTable.username,
            senderProfilePicture: UsersTable.profile_picture
        })
        .from(UsersTable)
        .where(eq(UsersTable.id, senderId))

        if (!sender.length) {
            return []
        }

        return notifications.map((notification: { notification_type: NotificationType }) => ({
            ...notification,
            senderUserName: sender[0].senderUserName,
            senderProfilePicture: sender[0].senderProfilePicture,
            senderUserId: sender[0].senderUserId,
            notificationText: notificationTexts[notification.notification_type](sender[0].senderUserName)
        }))
    }

    async getNotifications(receiverId: number): Promise<any> {
        const notifications = await db.select({
            created_at: NotificationsTable.created_at,
            has_seen: NotificationsTable.has_seen,
            id: NotificationsTable.id,
            notification_type: NotificationsTable.notification_type,
            receiver_id: NotificationsTable.receiver_id,
            related_post_id: NotificationsTable.related_post_id,
            related_user_id: NotificationsTable.related_user_id,
            senderProfilePicture: UsersTable.profile_picture,
            senderUserId: UsersTable.id,
            senderUserName: UsersTable.username,
            sender_id: NotificationsTable.sender_id
        })
        .from(NotificationsTable)
        .leftJoin(UsersTable, eq(UsersTable.id, NotificationsTable.sender_id))
        .where(eq(NotificationsTable.receiver_id, receiverId))
        .orderBy(desc(NotificationsTable.created_at))
        
        console.log('notifications', notifications)
        return notifications.map((notification: { notification_type: NotificationType }) => ({
            ...notification,
            notificationText: notificationTexts[notification.notification_type]((notification as any).senderUserName)
        }))
    }

    async deleteNotification(senderId: number, postId: number): Promise<any> {
        const deletedNotification = await db.delete(NotificationsTable).where(
            and(
                eq(NotificationsTable.sender_id, senderId),
                eq(NotificationsTable.related_post_id, postId)
            )
        ).returning({
            postId: NotificationsTable.related_post_id,
            senderId: NotificationsTable.sender_id
        })
        return deletedNotification[0]
    }

    async markNotificationAsSeen(notificationId: number): Promise<void> {
        await db.update(NotificationsTable).set({
            has_seen: true
        }).where(eq(NotificationsTable.id, notificationId))
    }
}


export default new NotificationService();
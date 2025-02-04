import { desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { NotificationsTable, PostsTable, UsersTable } from "../drizzle/schema";


type NotificationType = 'like' | 'comment' | 'friend_request' | 'friend_accept' | 'friend_decline';

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

        const notificationTexts: Record<NotificationType, (senderUserName: string) => string> = {
            like: (senderUserName: string) => `${senderUserName} liked your post`,
            comment: (senderUserName: string) => `${senderUserName} commented on your post`,
            friend_request: (senderUserName: string) => `${senderUserName} sent you a friend request`,
            friend_accept: (senderUserName: string) => `${senderUserName} accepted your friend request`,
            friend_decline: (senderUserName: string) => `${senderUserName} declined your friend request`,
        };

        return notifications.map((notification: { notification_type: NotificationType }) => ({
            ...notification,
            senderUserName: sender[0].senderUserName,
            senderProfilePicture: sender[0].senderProfilePicture,
            senderUserId: sender[0].senderUserId,
            notificationText: notificationTexts[notification.notification_type](sender[0].senderUserName)
        }))
    }
    async deleteNotification(senderId: number): Promise<any> {
        const deletedNotification = await db.delete(NotificationsTable).where(eq(NotificationsTable.sender_id, senderId)).returning({
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
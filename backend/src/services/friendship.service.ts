import { and, desc, eq, or } from "drizzle-orm";
import { db } from "../db/db";
import { FriendshipsTable } from "../drizzle/schema";
import notificationService from "./notification.service";

type FriendshipStatus = 'pending' | 'accepted' | 'declined';

class FriendshipService {
    async createFriendship(friendshipStatus: FriendshipStatus, senderId: number, receiverId: number): Promise<any> {
        const checkExistingFriendship = await db.select().from(FriendshipsTable).where(or(
            and(eq(FriendshipsTable.sender_id, senderId), eq(FriendshipsTable.receiver_id, receiverId)),
            and(eq(FriendshipsTable.sender_id, receiverId), eq(FriendshipsTable.receiver_id, senderId))
        ))
        if (checkExistingFriendship.length) {
            return checkExistingFriendship[0]
        }
        const friendships = await db.insert(FriendshipsTable).values({
            friendship_status: friendshipStatus,
            sender_id: senderId,
            receiver_id: receiverId
        }).returning({
            id: FriendshipsTable.id,
            receiverId: FriendshipsTable.receiver_id,
            friendshipStatus: FriendshipsTable.friendship_status
        });
        return friendships[0]
    }
    async acceptFriendship(friendshipStatus: FriendshipStatus, friendshipId: number): Promise<any> {
        const friendship = await db.update(FriendshipsTable).set({
            friendship_status: friendshipStatus
        }).where(eq(FriendshipsTable.id, friendshipId)).returning({
            id: FriendshipsTable.id,
            receiverId: FriendshipsTable.receiver_id,
            friendshipStatus: FriendshipsTable.friendship_status
        })
        return friendship[0];
    }
    async cancelFriendship(friendshipId: number): Promise<any> {
        const checkFriendship = await db.query.FriendshipsTable.findFirst({
            where: eq(FriendshipsTable.id, friendshipId),
            columns: {
                id: true
            }
        })
        if (checkFriendship) {
            const deletedNotification = await notificationService.deleteNotification(undefined, checkFriendship.id)
            console.log('deleted friendship notification', deletedNotification)
            const friendship = await db.delete(FriendshipsTable).where(eq(FriendshipsTable.id, friendshipId)).returning({
                id: FriendshipsTable.id,
                receiverId: FriendshipsTable.receiver_id,
                friendshipStatus: FriendshipsTable.friendship_status
            })
            return { friendship: friendship[0], notification: deletedNotification }
        }
    }

    async getFriends(userId: number): Promise<any> {
        const friends = await db.query.FriendshipsTable.findMany({
            where: or(
                and(eq(FriendshipsTable.sender_id, userId), eq(FriendshipsTable.friendship_status, 'accepted')),
                and(eq(FriendshipsTable.receiver_id, userId), eq(FriendshipsTable.friendship_status, 'accepted'))
            ),
            with: {
                sender: true,
                receiver: true
            }
        })
        return friends.map(friendship => {
            if (friendship.sender_id === userId) {
                return {
                    id: friendship.receiver.id,
                    userName: friendship.receiver.username,
                    profilePicture: friendship.receiver.profile_picture
                }
            }
            else {
                return {
                    id: friendship.sender.id,
                    userName: friendship.sender.username,
                    profilePicture: friendship.sender.profile_picture
                }
            }
        })
    }
}

export default new FriendshipService();
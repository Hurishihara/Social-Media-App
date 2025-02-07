import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { FriendshipsTable } from "../drizzle/schema";

type FriendshipStatus = 'pending' | 'accepted' | 'declined';

class FriendshipService {
    async createFriendship(friendshipStatus: FriendshipStatus, senderId: number, receiverId: number): Promise<any> {
        const checkExistingFriendship = await db.select().from(FriendshipsTable).where(and(
            eq(FriendshipsTable.sender_id, senderId),
            eq(FriendshipsTable.receiver_id, receiverId)
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
            senderId: FriendshipsTable.sender_id,
            friendshipStatus: FriendshipsTable.friendship_status
        });
        return friendships[0]
    }
    async acceptFriendship(friendshipStatus: FriendshipStatus, friendshipId: number, receiverId: number): Promise<any> {
        return await db.update(FriendshipsTable).set({
            friendship_status: friendshipStatus
        }).where(and(
            eq(FriendshipsTable.id, friendshipId),
            eq(FriendshipsTable.receiver_id, receiverId)
        )).returning()
    }
    async declineFriendship(friendshipId: number, receiverId: number): Promise<any> {
        return await db.delete(FriendshipsTable).where(and(
            eq(FriendshipsTable.id, friendshipId),
            eq(FriendshipsTable.receiver_id, receiverId)
        )).returning()
    }
}

export default new FriendshipService();
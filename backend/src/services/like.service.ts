import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { LikesTable, PostsTable } from "../drizzle/schema";
import notificationService from "./notification.service";


class LikeService {
   async likePost(userId: number, postId: number): Promise<any> {
        try {
            const likeExists = await db.query.LikesTable.findFirst({
                where: and(
                    eq(LikesTable.user_id, userId),
                    eq(LikesTable.post_id, postId)
                ),
                columns: {
                    id: true
                }
            })
            if (!likeExists) {
                const insertedData = await db.insert(LikesTable).values({
                    user_id: userId,
                    post_id: postId
                }).returning({
                    id: LikesTable.id
                })
                const totalLikes = await db.select().from(LikesTable).where(eq(LikesTable.post_id, postId))
                await db.update(PostsTable).set({
                    likes_count: totalLikes.length
                }).where(eq(PostsTable.id, postId))
    
                return { message: 'Post liked', id: insertedData[0].id }
            }
            return { message: 'Post already liked'}
        }
        catch {
            throw new Error('Database error')
        }
   }
   async unlikePost(userId: number, postId: number): Promise<any> {
        try {
            const likeExists = await db.query.LikesTable.findFirst({
                where: and(
                    eq(LikesTable.user_id, userId),
                    eq(LikesTable.post_id, postId)
                ),
                columns: {
                    id: true
                }
            })
            if (likeExists) {
                const deletedNotification = await notificationService.deleteNotification(likeExists.id)
                const deletedData = await db.delete(LikesTable).where(eq(LikesTable.id, likeExists.id)).returning({
                    id: LikesTable.id
                })
                const totalLikes = await db.select().from(LikesTable).where(eq(LikesTable.post_id, postId))
                await db.update(PostsTable).set({
                    likes_count: totalLikes.length
                }).where(eq(PostsTable.id, postId))
    
                return { message: 'Post unliked', id: deletedData[0].id, notification: deletedNotification }
            }
        }
        catch {
            throw new Error('Database error')

        }
   }
}

export default new LikeService();
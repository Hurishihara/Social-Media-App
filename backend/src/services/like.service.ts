import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { LikesTable, PostsTable, UsersTable } from "../drizzle/schema";
import { check } from "drizzle-orm/mysql-core";


class LikeService {
   async likePost(userId: number, postId: number): Promise<any> {
        const likeExists = await db.query.LikesTable.findFirst({
            where: and(
                eq(LikesTable.user_id, userId),
                eq(LikesTable.post_id, postId)
            )
        })
        if (!likeExists) {
            await db.insert(LikesTable).values({
                user_id: userId,
                post_id: postId
            })
            const totalLikes = await db.select().from(LikesTable).where(eq(LikesTable.post_id, postId))
            await db.update(PostsTable).set({
                likes_count: totalLikes.length
            }).where(eq(PostsTable.id, postId))

            return { message: 'Post liked' }
        }
        return { message: 'Post already liked' }
   }
   async unlikePost(userId: number, postId: number): Promise<any> {
        const likeExists = await db.query.LikesTable.findFirst({
            where: and(
                eq(LikesTable.user_id, userId),
                eq(LikesTable.post_id, postId)
            )
        })
        if (likeExists) {
            await db.delete(LikesTable).where(and(
                eq(LikesTable.user_id, userId),
                eq(LikesTable.post_id, postId)
            ))
            const totalLikes = await db.select().from(LikesTable).where(eq(LikesTable.post_id, postId))
            await db.update(PostsTable).set({
                likes_count: totalLikes.length
            }).where(eq(PostsTable.id, postId))
        }
   }
}

export default new LikeService();
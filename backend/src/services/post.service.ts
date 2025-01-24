import { desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { PostsTable, UsersTable } from "../drizzle/schema";


class PostService {
    async getPosts(): Promise<any[]> {
        return await db.select({
            postId: PostsTable.id,
            content: PostsTable.content,
            mediaURL: PostsTable.mediaURL,
            likesCount: PostsTable.likes_count,
            commentsCount: PostsTable.comments_count,
            createdAt: PostsTable.created_at,
            updatedAt: PostsTable.updated_at,
            authorName: UsersTable.username
        }).from(PostsTable).innerJoin(UsersTable, eq(PostsTable.author_id, UsersTable.id)).orderBy(desc(PostsTable.created_at))
    }
    
    async createPost(userId: number, content: string, image: string): Promise<void> {
        await db.insert(PostsTable).values({
            author_id: userId,
            content: content,
            mediaURL: image
        })
    }

    async deletePost(postId: number): Promise<void> {
        await db.delete(PostsTable).where(eq(PostsTable.id, postId));
    }

    async updatePost(postId: number, content: string): Promise<void> {
        await db.update(PostsTable).set({
            content: content,
            updated_at: new Date()
        }).where(eq(PostsTable.id, postId))
    }
}

export default new PostService();
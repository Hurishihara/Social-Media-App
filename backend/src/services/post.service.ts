import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { PostsTable } from "../drizzle/schema";


class PostService {
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
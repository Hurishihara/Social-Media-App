import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { CommentsTable, PostsTable } from "../drizzle/schema";

class CommentService {
    async createComment(content: string, userId: number, postId: number): Promise<any> {
        try {
            const comment = await db.insert(CommentsTable).values({
                content: content,
                user_id: userId,
                post_id: postId
            }).returning({
                commentId: CommentsTable.id,
                commentContent: CommentsTable.content,
                commentUserId: CommentsTable.user_id,
                commentPostId: CommentsTable.post_id
            });
    
            const totalComments = await db.select().from(CommentsTable).where(eq(CommentsTable.post_id, postId));
            await db.update(PostsTable).set({
                comments_count: totalComments.length
            }).where(eq(PostsTable.id, postId));
    
            return comment[0];
        }
        catch {
            throw new Error('Database error');
        }
    }
    async getComment(postId: number): Promise<any> {
        try {
            const comments = await db.query.CommentsTable.findMany({
                where: eq(CommentsTable.post_id, postId),
                columns: {
                    id: true,
                    content: true,
                    post_id: true,
                },
                with: {
                    userComment: {
                        columns: {
                            id: true,
                            username: true,
                            profile_picture: true
                        }
                    }
                }
            });
            if (comments.length === 0) {
                return [];
            };
            return comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                postId: comment.post_id,
                user: {
                    id: comment.userComment.id,
                    username: comment.userComment.username,
                    profilePicture: comment.userComment.profile_picture
                }
            }));
        }
        catch {
            throw new Error('Database error');
        }
    }
}

export default new CommentService()
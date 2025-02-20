import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { CommentsTable } from "../drizzle/schema";

class CommentService {
    async createComment(content: string, userId: number, postId: number): Promise<any> {
        const comment = await db.insert(CommentsTable).values({
            content: content,
            user_id: userId,
            post_id: postId
        }).returning({
            commentId: CommentsTable.id,
            commentContent: CommentsTable.content,
            commentUserId: CommentsTable.user_id,
            commentPostId: CommentsTable.post_id
        })

        return comment[0]
    }
    async getComment(postId: number): Promise<any> {
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
        })
        if (comments.length === 0) return []
        return comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            postId: comment.post_id,
            user: {
                id: comment.userComment.id,
                username: comment.userComment.username,
                profilePicture: comment.userComment.profile_picture
            }
        }))
    }
}

export default new CommentService()
import { desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { LikesTable, PostsTable, UsersTable } from "../drizzle/schema";
import { JsonWebTokenError } from "jsonwebtoken";



interface Post {
    postId: number;
    content: string | null;
    mediaURL: string | null;
    likesCount: number | null;
    commentsCount: number | null;
    createdAt: Date;
    updatedAt: Date;
}

class PostService {
    async getPosts(): Promise<any[]> {
        const result = await db.select({
            post: PostsTable,
            authorName: UsersTable.username,
            likes: LikesTable
        })
        .from(PostsTable)
        .innerJoin(UsersTable, eq(PostsTable.author_id, UsersTable.id))
        .leftJoin(LikesTable, eq(PostsTable.id, LikesTable.post_id))
        .orderBy(desc(PostsTable.created_at))

        const posts = result.reduce<Record<number, { post: Post, authorName: string, likes: any[] }>>(
            (acc, row) => {
                const post = row.post
                const like = row.likes
                const authorName = row.authorName
    
                if (!acc[post.id]) {
                    acc[post.id] = {
                        post: {
                            postId: post.id,
                            content: post.content,
                            mediaURL: post.mediaURL,
                            likesCount: post.likes_count,
                            commentsCount: post.comments_count,
                            createdAt: post.created_at,
                            updatedAt: post.updated_at
                        },
                        authorName,
                        likes: []
                    }
                }
                if (like) {
                    acc[post.id].likes.push({
                        likeId: like.id,
                        userId: like.user_id,
                        createdAt: like.created_at
                    })
                }
                return acc
            }, 
           {})
        const sortedPosts = Object.values(posts).sort((a, b) => {
            return b.post.createdAt.getTime() - a.post.createdAt.getTime()
        })
        return sortedPosts;
        }

    
    
    async createPost(userId: number, content: string, image: string): Promise<void> {
        await db.insert(PostsTable).values({
            author_id: userId,
            content: content,
            mediaURL: image
        })
    }

    async deletePost(postId: number): Promise<any> {
        const response: { deletedImageUrl: string | null }[] = await db.delete(PostsTable).where(eq(PostsTable.id, postId)).returning({ deletedImageUrl: PostsTable.mediaURL })
        console.log('Post service response', response)
        return response[0].deletedImageUrl
    }

    async updatePost(postId: number, content: string): Promise<void> {
        await db.update(PostsTable).set({
            content: content,
            updated_at: new Date()
        }).where(eq(PostsTable.id, postId))
    }
}

export default new PostService();
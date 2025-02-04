import { desc, eq } from "drizzle-orm";
import { db } from "../db/db";
import { LikesTable, PostsTable, UsersTable } from "../drizzle/schema";

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
    async getPosts(userName: string): Promise<any[]> {
        if (!userName) {
            const result = await db.select({
                post: PostsTable,
                authorId: UsersTable.id,
                authorName: UsersTable.username,
                authorProfilePicture: UsersTable.profile_picture,
                likes: LikesTable
            })
            .from(PostsTable)
            .innerJoin(UsersTable, eq(PostsTable.author_id, UsersTable.id))
            .leftJoin(LikesTable, eq(PostsTable.id, LikesTable.post_id))
            .orderBy(desc(PostsTable.created_at))
            
            const posts = result.reduce<Record<number, { post: Post, authorName: string, likes: any[], authorProfilePicture: string | null, authorId: number }>>(
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
                            likes: [],
                            authorProfilePicture: row.authorProfilePicture,
                            authorId: row.authorId
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
        
        const result = await db.select({
            post: PostsTable,
            authorId: UsersTable.id,
            authorName: UsersTable.username,
            authorProfilePicture: UsersTable.profile_picture,
            likes: LikesTable
        })
        .from(PostsTable)
        .innerJoin(UsersTable, eq(PostsTable.author_id, UsersTable.id))
        .leftJoin(LikesTable, eq(PostsTable.id, LikesTable.post_id))
        .orderBy(desc(PostsTable.created_at))
        .where(eq(UsersTable.username, userName))

        const posts = result.reduce<Record<number, { post: Post, authorName: string, likes: any[], authorProfilePicture: string | null, authorId: number }>>(
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
                        likes: [],
                        authorProfilePicture: row.authorProfilePicture,
                        authorId: row.authorId
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

    
    
    async createPost(userId: number, content: string, image: string): Promise<any[]> {
        const newPost = await db.insert(PostsTable).values({
            author_id: userId,
            content: content,
            mediaURL: image
        }).returning()

        const authorName = await db.select({
            username: UsersTable.username,
            profilePicture: UsersTable.profile_picture
        }).from(UsersTable).where(eq(UsersTable.id, userId))

        const formattedPost = {
            post: {
                postId: newPost[0].id,
                content: newPost[0].content,
                mediaURL: newPost[0].mediaURL,
                likesCount: newPost[0].likes_count,
                commentsCount: newPost[0].comments_count,
                createdAt: newPost[0].created_at,
                updatedAt: newPost[0].updated_at
            },
            authorName: authorName[0].username,
            likes: [],
            authorProfilePicture: authorName[0].profilePicture

        }
        return [formattedPost]
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
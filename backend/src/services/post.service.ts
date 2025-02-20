import { desc, eq, or, and, aliasedTable } from "drizzle-orm";
import { db } from "../db/db";
import { CommentsTable, FriendshipsTable, LikesTable, PostsTable, UsersTable } from "../drizzle/schema";

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
    async getPosts(userId: number): Promise<any[]> {
        const PostAuthorTable = aliasedTable(UsersTable, 'PostAuthor')
        const CommentAuthorTable = aliasedTable(UsersTable, 'CommentAuthor')

        const result = await db.select({
            post: PostsTable,
            authorId: PostAuthorTable.id,
            authorName: PostAuthorTable.username,
            authorProfilePicture: PostAuthorTable.profile_picture,
            likes: LikesTable,
            comments: CommentsTable,
            commentAuthorId: CommentAuthorTable.id,
            commentAuthorName: CommentAuthorTable.username,
            commentAuthorProfilePicture: CommentAuthorTable.profile_picture
        }).from(PostsTable)
        .innerJoin(PostAuthorTable, eq(PostsTable.author_id, PostAuthorTable.id))
        .leftJoin(LikesTable, eq(PostsTable.id, LikesTable.post_id))
        .leftJoin(CommentsTable, eq(PostsTable.id, CommentsTable.post_id))
        .leftJoin(CommentAuthorTable, eq(CommentsTable.user_id, CommentAuthorTable.id))
        .orderBy(desc(PostsTable.created_at))

        const filteredPost = await Promise.all(result.map(async (post: any) => {
            if (post.authorId === userId) {
                return post;
            }
            const checkIsFriend = await db.query.FriendshipsTable.findFirst({
                where: or(
                    and(eq(FriendshipsTable.sender_id, userId), eq(FriendshipsTable.receiver_id, post.authorId)),
                    and(eq(FriendshipsTable.receiver_id, userId), eq(FriendshipsTable.sender_id, post.authorId))
                ),
                columns: {
                    id: true,
                    friendship_status: true,
                    sender_id: true,
                    receiver_id: true
                }
            })
            if (checkIsFriend && checkIsFriend.friendship_status === 'accepted' ) {
                return post;
            }
            return null;
        }))
        const listOfFilteredPosts = filteredPost.filter(post => post !== null)
        const posts = listOfFilteredPosts.reduce<Record<number, { post: Post, authorName: String, likes: any[], comments: any[], authorProfilePicture: string | null, authorId: number }>>((acc, row) => {
            const post = row.post
            const like = row.likes
            const comment = row.comments
            const authorName = row.authorName
            const commentAuthorId = row.commentAuthorId
            const commentAuthorName = row.commentAuthorName
            const commentAuthorProfilePicture = row.commentAuthorProfilePicture

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
                    comments: [],
                    authorProfilePicture: row.authorProfilePicture,
                    authorId: row.authorId
                }
            }
            if (like && !acc[post.id].likes.some(existingLike => existingLike.likeId === like.id)) {
                acc[post.id].likes.push({
                    likeId: like.id,
                    userId: like.user_id,
                    createdAt: like.created_at
                })
            }
            if (comment && !acc[post.id].comments.some(existingComment => existingComment.commentId === comment.id)) {
                acc[post.id].comments.push({
                    commentId: comment.id,
                    commentContent: comment.content,
                    commentAuthorId: commentAuthorId,
                    commentAuthorName: commentAuthorName,
                    commentAuthorProfilePicture: commentAuthorProfilePicture,
                })
            }
            return acc
        }, {})

        const sortedPosts = Object.values(posts).sort((a, b) => {
            return b.post.createdAt.getTime() - a.post.createdAt.getTime()
        })
        return sortedPosts
    }

    async getPostsByProfile(userName: string) {
        const PostAuthorTable = aliasedTable(UsersTable, 'PostAuthor')
        const CommentAuthorTable = aliasedTable(UsersTable, 'CommentAuthor')

        const result = await db.select({
            post: PostsTable,
            authorId: PostAuthorTable.id,
            authorName: PostAuthorTable.username,
            authorProfilePicture: PostAuthorTable.profile_picture,
            likes: LikesTable,
            comments: CommentsTable,
            commentAuthorId: CommentAuthorTable.id,
            commentAuthorName: CommentAuthorTable.username,
            commentAuthorProfilePicture: CommentAuthorTable.profile_picture
        }).from(PostsTable)
        .innerJoin(PostAuthorTable, eq(PostsTable.author_id, PostAuthorTable.id))
        .leftJoin(LikesTable, eq(PostsTable.id, LikesTable.post_id))
        .leftJoin(CommentsTable, eq(PostsTable.id, CommentsTable.post_id))
        .leftJoin(CommentAuthorTable, eq(CommentsTable.user_id, CommentAuthorTable.id))
        .orderBy(desc(PostsTable.created_at))
        .where(eq(PostAuthorTable.username, userName))

        const posts = result.reduce<Record<number, { post: Post, authorName: string, likes: any[], comments: any[], authorProfilePicture: string | null, authorId: number}>>((acc, row: any) => {
                const post = row.post
                const like = row.likes
                const comment = row.comments
                const authorName = row.authorName
                const commentAuthorId = row.commentAuthorId
                const commentAuthorName = row.commentAuthorName
                const commentAuthorProfilePicture = row.commentAuthorProfilePicture

                if (!acc[post.id]) {
                    acc[post.id] ={
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
                        comments: [],
                        authorProfilePicture: row.authorProfilePicture,
                        authorId: row.authorId
                    }
                }
                if (like && !acc[post.id].likes.some(existingLike => existingLike.likeId === like.id)) {
                    acc[post.id].likes.push({
                        likeId: like.id,
                        userId: like.user_id,
                        createdAt: like.created_at
                    })
                }
                if (comment && !acc[post.id].comments.some(existingComment => existingComment.commentId === comment.id)) {
                    acc[post.id].comments.push({
                        commentId: comment.id,
                        commentContent: comment.content,
                        commentAuthorId: commentAuthorId,
                        commentAuthorName: commentAuthorName,
                        commentAuthorProfilePicture: commentAuthorProfilePicture,
                    })
                }
                return acc
            },
        {})
        const sortedPosts = Object.values(posts).sort((a, b) => {
            return b.post.createdAt.getTime() - a.post.createdAt.getTime()
        })
        return sortedPosts
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
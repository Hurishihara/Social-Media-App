import { create } from 'zustand'

interface Post {
    postId: number
    content: string
    mediaURL: string
    likesCount: number
    commentsCount: number
    createdAt: Date
    updatedAt: Date
    authorName: string
}

interface PostStore {
    posts: Post[]
    setPosts: (posts: Post[]) => void
    clearPosts: () => void
}

export const usePostStore = create<PostStore>((set) => ({
    posts: JSON.parse(localStorage.getItem('posts') || '[]'),
    setPosts: (posts: Post[]) => {
        set({ posts })
        localStorage.setItem('posts', JSON.stringify(posts))
    },
    clearPosts: () => {
        set({ posts: [] })
        localStorage.removeItem('posts')
    }
}))

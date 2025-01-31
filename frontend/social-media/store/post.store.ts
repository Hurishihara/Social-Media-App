import { create } from 'zustand'

export interface Post {
   post: {
    postId: number
    content: string
    mediaURL: string
    likesCount: number
    commentsCount: number
    createdAt: string
    updatedAt: string
   };
   authorName: string
   authorProfilePicture: string
   isLiked: boolean
   likes: any[]
}

interface PostStore {
    posts: Post[]
    setPosts: (posts: Post[]) => void
    clearPosts: () => void
}

export const usePostStore = create<PostStore>((set) => ({
    posts: JSON.parse(localStorage.getItem('posts') || '[]').map((post: Post) => ({
        ...post,
        isLiked: false
    })),
    setPosts: (posts: Post[]) => {
        set({ posts })
        localStorage.setItem('posts', JSON.stringify(posts))
    },
    clearPosts: () => {
        set({ posts: [] })
        localStorage.removeItem('posts')
    }
}))

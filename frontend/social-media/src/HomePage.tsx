import { Grid, GridItem } from '@chakra-ui/react';
import CreatePost from './CreatePost';
import FriendList from './FriendList';
import Navbar from './subpages/Navbar'
import PostsList from './PostsList';
import { useUserStore } from '../store/user.store';
import { useEffect } from 'react';
import { api } from './utils/axiosConfig';
import { Post, usePostStore } from '../store/post.store';


const HomePage = () => {

    const { userId } = useUserStore();
    const { setPosts } = usePostStore();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postApi = api('post');
                const response = await postApi.get('/posts');
                const updatedPosts = response.data.map((post: Post) => ({
                    ...post,
                    isLiked: post.likes.some((like: { likeId: number, userId: number, createdAt: string }) => like.userId === userId) ? true : false
                }))
                console.log(updatedPosts);
                setPosts(updatedPosts);
            }
            catch (err) {
                console.error(err);
            }
        }
        fetchPosts();
    }, [userId])

    return (
        <>
            <Navbar />
            <Grid templateColumns='repeat(12, 1fr)' mt='1rem' ml='1rem'>
                <GridItem colSpan={4}>
                    <FriendList />
                </GridItem>
                <GridItem colSpan={4}>
                    <CreatePost createPostButtonSize={'28rem'} />
                    <PostsList />
                </GridItem>
            </Grid>
        </>
    )
}

export default HomePage;
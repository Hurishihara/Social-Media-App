import { Grid, GridItem } from '@chakra-ui/react';
import CreatePost from './CreatePost';
import FriendList from './FriendList';
import Navbar from './subpages/Navbar'
import PostsList from './PostsList';
import { useUserStore } from '../store/user.store';
import { useEffect, useState, useCallback } from 'react';
import { api } from './utils/axiosConfig';
import { Post, usePostStore } from '../store/post.store';
import { useSocket } from './SocketContext';


const HomePage = () => {
    const [ onlineFriends, setOnlineFriends ] = useState<Record<string, boolean>>({})
    const [ friends, setFriends ] = useState<Array<{
        id: number,
        name: string,
        profilePicture: string,
        isOnline: boolean
    }>>([{
        id: 0,
        name: '',
        profilePicture: '',
        isOnline: false
    }])
    const { userId } = useUserStore();
    const { setPosts } = usePostStore();
    const socket = useSocket();


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postApi = api('post');
                const response = await postApi.get('/posts');
                const updatedPosts = response.data.map((post: Post) => ({
                    ...post,
                    isLiked: post.likes.some((like: { userId: number }) => like.userId === userId)
                }));
                setPosts(updatedPosts);
            } catch (err) {
                console.error(err);
            }
        };
        const fetchFriends = async () => {
            try {
                const friendApi = api('friendship');
                const response = await friendApi.get('/friends', { params: { userId } });

                const friendsOnlineStatus: Record<string, boolean> = {};
                response.data.forEach((friend: { id: number}) => {
                    friendsOnlineStatus[friend.id] = false;
                })
                const updatedFriends = response.data.map((friend: { id: number, userName: string, profilePicture: string }) => ({
                    id: friend.id,
                    name: friend.userName,
                    profilePicture: friend.profilePicture,
                    isOnline: friendsOnlineStatus[friend.id] || false
                }))

                setFriends(updatedFriends);
            } catch (err) {
                console.error(err);
            }
        };

        
        fetchFriends();
        fetchPosts();
    }, [userId, setPosts]);

    useEffect(() => {
        if (!socket) return;

        setTimeout(() => {
            socket?.emit('request-online-users');
        }, 100);

        socket?.on('online-users', (onlineUserIds: string[]) => {
            setFriends((prevFriends) => prevFriends.map((friend) => 
                onlineUserIds.includes(friend.id.toString()) ? { ...friend, isOnline: true} : { ...friend, isOnline: false }
            ))
        })

        socket?.on('update-user-status', (data: { userId: number; status: boolean }) => {
            setFriends((prevFriends) =>
                prevFriends.map((friend) =>
                    friend.id === data.userId ? { ...friend, isOnline: data.status } : friend
                )
            );
        });
        return () => {
            socket?.off('update-user-status');
            socket?.off('online-users');
            socket?.off('request-online-users');
        };
    }, [socket]);
    

    useEffect(() => {
        console.log('friends', friends);
    }, [friends])

    return (
        <>
            <Navbar />
            <Grid templateColumns='repeat(12, 1fr)' mt='1rem' ml='1rem'>
                <GridItem colSpan={4}>
                    <FriendList friends={friends} />
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
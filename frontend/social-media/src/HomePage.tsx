import { Grid, GridItem, useBreakpoint, useBreakpointValue } from '@chakra-ui/react';
import CreatePost from './CreatePost';
import FriendList from './FriendList';
import Navbar from './subpages/Navbar'
import PostsList from './PostsList';
import { useUserStore } from '../store/user.store';
import { useEffect, useState, useCallback } from 'react';
import { api } from './utils/axiosConfig';
import { Post, usePostStore } from '../store/post.store';
import { useSocket } from './SocketContext';
import React from 'react';
import axios from 'axios';
import { ErrorResponse } from './ProfilePage';
import { Toaster, toaster } from './src/components/ui/toaster';


const HomePage = () => {
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
    const isMobile = useBreakpointValue({
        base: true,
        sm: true,
        md: true,
        lg: true,
        tablet: false,
        desktop: false,
        wide: false
    });
    const marginLeft = useBreakpointValue({
        base: '0',
        sm: '0',
        md: '0',
        lg: '8rem',
        tablet: '1rem',
        desktop: '1rem',
        wide: '1rem',
        wideDesktop: '1rem'
    })
    const marginRight = useBreakpointValue({
        base: '0',
        sm: '0',
        md: '0',
        lg: '0',
        tablet: '0',
        desktop: '1rem',
        wide: '1rem',
        wideDesktop: '1rem'
    })



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
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorResponse = err.response?.data as ErrorResponse;
                    toaster.create({
                        title: errorResponse.name,
                        description: errorResponse.message,
                        type: 'error'
                    })
                }
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
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const errorResponse = err.response?.data as ErrorResponse;
                    toaster.create({
                        title: errorResponse.name,
                        description: errorResponse.message,
                        type: 'error'
                    })
                }
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
    
    const postButtonSize = useBreakpointValue({
        base: '14.5rem',
        sm: '18rem',
        md: '20.5rem',
        lg: '27.5rem',
        tablet: '35rem',
        desktop: '31rem',
        wide: '23rem',
        wideDesktop: '29rem'
    })

    return (
        <>
            <Navbar />
            <Grid templateColumns='repeat(12, 1fr)' mt='1rem' ml={marginLeft} mr={marginRight}>
                {!isMobile ? (
                    <GridItem colSpan={!isMobile ? { tablet: 3, desktop: 4, wide: 4} : null }>
                        <FriendList friends={friends} /> 
                    </GridItem>
                ): null}
                <GridItem colSpan={{ base: 12, sm: 12, md: 12, lg: 10, tablet: 8, desktop: 6, wide: 4 }}>
                    <CreatePost createPostButtonSize={postButtonSize || 'defaultSize'} />
                    <PostsList mt='1rem' />
                </GridItem>
            </Grid>
            <Toaster />
        </>
    )
}

export default HomePage;
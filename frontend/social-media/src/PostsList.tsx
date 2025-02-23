import { Card, Icon, List, Stack, Image, Text, IconButton, Flex, Separator, Button, Box, Input } from '@chakra-ui/react'
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
  } from './src/components/ui/menu'
import { Avatar } from './src/components/ui/avatar'
import React, { useEffect, useState }from 'react'
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { api } from './utils/axiosConfig'
import { Post, usePostStore } from '../store/post.store'
import CustomDialog from './CustomDialog';
import { useUserStore } from '../store/user.store';
import { socket } from './utils/socket.io'
import { DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from './src/components/ui/dialog'
import Picker from '@emoji-mart/react'
import { LuSendHorizontal, LuSmile } from 'react-icons/lu'




export const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        timeZone: 'UTC',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
}


const PostsList = () => {
    
    const { posts, setPosts } = usePostStore()
    const { userId, userName, profilePicture } = useUserStore()
    const [ selectedPost, setSelectedPost ] = useState(null)
    const [ open, setOpen ] = useState<Boolean>(false)
    const [ userCommment, setUserComment ] = useState('')
    const [ showEmojiPicker, setShowEmojiPicker ] = useState(false)

    interface EmojiData {
        id: string,
        keywords: string[],
        name: string,
        native: string,
        shortcodes: string,
        unified: string
    }

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>, postId: number): Promise<void> => {
        e.preventDefault()
        const updatedPost = posts.map(post => {
            if (post.post.postId === postId) {
                const newIsLiked = !post.isLiked
                const newLikeCount = newIsLiked ? post.post.likesCount + 1 : post.post.likesCount - 1

                return {
                    ...post,
                    isLiked: newIsLiked,
                    post: {
                        ...post.post,
                        likesCount: newLikeCount
                    }
                }
            }
            return post
        })
        setPosts(updatedPost)
        
        try {
            const likedPost = updatedPost.find(post => post.post.postId === postId)
            if (likedPost) {
                const likeApi = api('like')
                await likeApi.post('/like-post', { postId: likedPost.post.postId, userId: userId, author: likedPost.authorId })
            }
        }
        catch(err) {
            console.error(err)
        }
    }

    const handleComment = async (postId: number, authorId: number): Promise<void> => {
        try {
            const commentApi = api('comment')
            const response = await commentApi.post('/create-comment', {
                content: userCommment,
                postId: postId,
                authorId: authorId
            })
            console.log(response)
        }
        catch(err) {
            console.error(err)
        }
    }
    
    const handleEdit = (post: any): void => {
        setSelectedPost(post)
        setOpen(true)
    }

    const handleDelete = async (postId: number): Promise<void> => {
        try {
            const postApi = api('post')
            await postApi.delete(`/delete-post`, {
                data: { postId }
            })
            alert('Post deleted')
        }
        catch(err) {
            console.error(err)
        }
    }

    const handleSelectEmoji = (emoji: EmojiData) => {
        setUserComment((prevComment) => prevComment + emoji.native)
    }

    useEffect(() => {
        socket.on('new-post', (newPost: Post) => {
            setPosts([newPost, ...posts])
            
        })

        socket.on('delete-post', (postId: number) => {
            const updatedPosts = posts.filter(post => post.post.postId !== postId)
            setPosts(updatedPosts)
        })

        return () => {
            socket.off('new-post')
            socket.off('delete-post')
        }
    }, [])

    
    return (
        <>
            <List.Root listStyleType='none' mt='1.5rem' gap='5'>
                {posts.map((post: Post) => (
                    <Card.Root key={post.post.postId} borderRadius='0.8rem' >
                        <Card.Body>
                            <Flex justifyContent='space-between'>
                                <Stack direction='row' gap='3' align='center' mb='2rem'>
                                    <Avatar name={post.authorName} src={post.authorProfilePicture} />
                                <Stack direction='column' align='flex-start' justify='center' gap='0'>
                                    <Card.Title>{ post.authorName }</Card.Title>
                                    <Text color='gray' fontSize='0.8rem' fontWeight='medium'> { formatDate(post.post.createdAt) } </Text>
                                </Stack>
                                </Stack>
                                {post.authorName === userName && (
                                    <MenuRoot positioning={{ placement: 'bottom-end' }}>
                                        <MenuTrigger asChild>
                                            <IconButton rounded='full' variant='ghost' size='md'>
                                                <HiOutlineDotsHorizontal />
                                            </IconButton>
                                        </MenuTrigger>
                                        <MenuContent>
                                            <MenuItem value='edit' onClick={() => handleEdit(post)} >
                                                <MdEdit />
                                                Edit
                                            </MenuItem>
                                            <MenuItem value='delete' onClick={() => handleDelete(post.post.postId)} >
                                                <MdDeleteForever />
                                                Delete
                                            </MenuItem>
                                        </MenuContent>
                                    </MenuRoot>
                                )}
                                </Flex>
                            <Card.Description fontSize='1rem'  color='black'> { post.post.content}
                            <Image src={post.post.mediaURL} mt='1rem' />
                            </Card.Description>
                            <Stack direction='row' mt='2rem' gap='1.5rem' align='center'>
                                <Flex flexDirection='row' justify='flex-start' align='center' gap='0.3rem'>
                                    <Icon>
                                        {!post.isLiked ? <FaRegHeart /> : <FaHeart color='#3B5998' />}
                                    </Icon>
                                    <Text fontSize='1rem' fontWeight='medium'> { post.post.likesCount } </Text>
                                </Flex>
                                <Flex flexDirection='row' justify='flex-start' align='center' gap='0.3rem'>
                                    <Icon>
                                        <FaRegComment />
                                    </Icon>
                                    <Text fontSize='1rem' fontWeight='medium'> { post.post.commentsCount } </Text>
                                </Flex>
                            </Stack>
                            <Separator variant='solid' w='100%' size='sm' mt='1rem' orientation='horizontal' />
                            <Flex justifyContent='space-around' direction='row'>
                                <Button variant='ghost' color={!post.isLiked ? 'gray' : '#3B5998'} onClick={(event) => handleLike(event, post.post.postId)} fontSize='1rem' w='50%' fontWeight='medium'>Like</Button>
                                <DialogRoot size='sm' placement='center' >
                                    <DialogTrigger asChild>
                                        <Button variant='ghost' color='gray' fontSize='1rem' w='50%' fontWeight='medium'>Comment</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle align='center'> {`${post.authorName}'s Post`} </DialogTitle>
                                            <Separator mt='1rem' mb='1rem' />
                                            <Stack direction='row' gap='3' align='center' >
                                                <Avatar name={post.authorName} src={post.authorProfilePicture} />
                                                <Stack direction='column' align='flex-start' justify='center' gap='0'>
                                                    <DialogTitle> { post.authorName }</DialogTitle>
                                                    <Box color='gray'>
                                                        { formatDate(post.post.createdAt) }
                                                    </Box>
                                                </Stack>
                                            </Stack>
                                        </DialogHeader>
                                        <DialogBody>
                                            <Box>
                                                { post.post.content }
                                            </Box>
                                            <Image src={post.post.mediaURL} mt='1rem' />
                                            <Stack direction='row' mt='2rem' gap='1.5rem' align='center'>
                                                <Flex flexDirection='row' justify='flex-start' align='center' gap='0.3rem'>
                                                    <Icon>
                                                        {!post.isLiked ? <FaRegHeart /> : <FaHeart color='#3B5998' />}
                                                    </Icon>
                                                    <Text fontSize='1rem' fontWeight='medium'> { post.post.likesCount } </Text>
                                                </Flex>
                                                <Flex flexDirection='row' justify='flex-start' align='center' gap='0.3rem'>
                                                    <Icon>
                                                        <FaRegComment />
                                                    </Icon>
                                                    <Text fontSize='1rem' fontWeight='medium'> { post.post.commentsCount } </Text>
                                                </Flex>
                                            </Stack>
                                            <Separator variant='solid' w='100%' size='sm' mt='1rem' orientation='horizontal' />
                                            <Flex justifyContent='space-around' direction='row' >
                                                <Button variant='ghost' color={!post.isLiked ? 'gray' : '#3B5998'} onClick={(event) => handleLike(event, post.post.postId)} fontSize='1rem' w='50%' fontWeight='medium'>Like</Button>
                                                <Button variant='ghost' color='gray' fontSize='1rem' w='50%' fontWeight='medium' onClick={() => handleComment(post.post.postId, post.authorId)}>Comment</Button>
                                            </Flex>
                                            <Separator variant='solid' w='100%' size='sm' mb='2rem' orientation='horizontal' />
                                            <Flex direction='column' gap={2} >
                                                {post.comments.length > 0 && (
                                                    post.comments.map((comment: any) => (
                                                        <Stack direction='row' gap={2} key={comment.commentId} align='center'>
                                                            <Avatar size='sm' name={comment.commentAuthorName} src={comment.commentAuthorProfilePicture} />
                                                            <Stack direction='column' gap={0} bgColor='#EFF3F4' borderRadius='1.5rem' align='flex-start' justify='center' p='1.3rem' h='3.5rem'>
                                                                <Box fontSize='0.8rem' fontWeight='semibold' >
                                                                    {comment.commentAuthorName}
                                                                </Box>
                                                                <Box fontSize='0.8rem' >
                                                                    {comment.commentContent}
                                                                </Box>
                                                            </Stack>
                                                        </Stack>
                                                    ))
                                                )}
                                            </Flex>
                                            <Separator variant='solid' w='100%' size='sm' mt='2rem'  orientation='horizontal' />
                                            <Flex direction='row' justify='flex-start' align='center' gap={2} mt='1rem'>
                                                <Box>
                                                    <Avatar size='sm' name={userName || undefined} src={profilePicture || undefined} />
                                                </Box>
                                                <Stack 
                                                direction='row' 
                                                gap={2}  
                                                bgColor='#EFF3F4'
                                                align='center'
                                                borderRadius='2rem'
                                                p='0.3rem'
                                                w='100%'>
                                                    <IconButton size='sm' variant='plain' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                                        <LuSmile />
                                                    </IconButton>
                                                    <Input placeholder='Post your comment'  _focus={{ outline: 'none'}} borderStyle='none' onChange={(e) => setUserComment(e.target.value)} />
                                                    <IconButton size='sm' variant='plain' onClick={() => handleComment(post.post.postId, post.authorId)}>
                                                        <LuSendHorizontal />
                                                    </IconButton>
                                                </Stack>
                                                {showEmojiPicker && (
                                                    <Box position='absolute' bottom='7rem'>
                                                        <Picker 
                                                        set='apple'
                                                        perLine='9'
                                                        navPosition='top'
                                                        previewEmoji='point_up'
                                                        onEmojiSelect={handleSelectEmoji}
                                                        />
                                                    </Box>
                                                )}
                                            </Flex>
                                            
                                        </DialogBody>
                                    </DialogContent>
                                </DialogRoot>
                            </Flex>
                        </Card.Body>
                    </Card.Root>
                ))}
            </List.Root>
            {selectedPost && <CustomDialog post={selectedPost} open={open} setOpen={(e: any) => setOpen(e.open)} />}
        </>
    )
}

export default PostsList



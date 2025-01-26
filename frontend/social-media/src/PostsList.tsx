import { Card, Icon, List, Stack, Image, Text, IconButton, Flex, Separator, Button, DialogTrigger, } from '@chakra-ui/react'
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
  } from './src/components/ui/menu'
import React, { useEffect, useState }from 'react'
import { IoPersonSharp } from 'react-icons/io5'
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { api } from './utils/axiosConfig'
import { usePostStore } from '../store/post.store'
import CustomDialog from './CustomDialog';
import { useUserStore } from '../store/user.store';

const PostsList = () => {
    
    const { posts, setPosts } = usePostStore()
    const { userName } = useUserStore()
    const [ selectedPost, setSelectedPost ] = useState(null)
    const [ open, setOpen ] = useState(false)
    
    const handleEdit = (post: any): void => {
        setSelectedPost(post)
        setOpen(true)
    }

    const handleDelete = async (postId: number): Promise<void> => {
        try {
            await api.delete(`/delete-post`, {
                data: { postId }
            })
            alert('Post deleted')
        }
        catch(err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts')
                setPosts(response.data)
                console.log(posts)
            }
            catch(err) {
                console.error(err)
            }
        }
        fetchPosts()
    }, [])

    const formatDate = (dateString: string): string => {
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
    
    
    
    return (
        <>
            <List.Root listStyleType='none' mt='1.5rem' gap='5'>
                {posts.map((post) => (
                    <Card.Root key={post.postId} borderRadius='0.8rem' >
                        <Card.Body>
                            <Flex justifyContent='space-between'>
                                <Stack direction='row' gap='3' align='center' mb='2rem'>
                                    <Icon>
                                        <IoPersonSharp />
                                    </Icon>
                                <Stack direction='column' align='flex-start' justify='center' gap='0'>
                                    <Card.Title>{ post.authorName }</Card.Title>
                                    <Text color='gray' fontSize='0.8rem' fontWeight='medium'> { formatDate(post.createdAt.toString()) } </Text>
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
                                            <MenuItem value='delete' onClick={() => handleDelete(post.postId)} >
                                                <MdDeleteForever />
                                                Delete
                                            </MenuItem>
                                        </MenuContent>
                                    </MenuRoot>
                                )}
                                </Flex>
                            <Card.Description fontSize='1rem'  color='black'>{ post.content }
                            <Image src={post.mediaURL} mt='1rem' />
                            </Card.Description>
                            <Stack direction='row' mt='2rem' gap='2.5rem'>
                                <Icon>
                                    <FaRegHeart />
                                </Icon>
                                <Icon>
                                    <FaRegComment />
                                </Icon>
                            </Stack>
                            <Separator variant='solid' w='100%' size='sm' mt='1rem' orientation='horizontal' />
                            <Flex justifyContent='space-around' direction='row'>
                                <Button variant='ghost' color='gray' fontSize='1rem' w='50%' fontWeight='medium'>Like</Button>
                                <Button variant='ghost' color='gray' fontSize='1rem' w='50%' fontWeight='medium'>Comment</Button>
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



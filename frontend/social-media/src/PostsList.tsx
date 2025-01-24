import { Card, Icon, List, Stack, Image } from '@chakra-ui/react'
import React, { useEffect }from 'react'
import { IoPersonSharp } from 'react-icons/io5'
import { api } from './utils/axiosConfig'
import { usePostStore } from '../store/post.store'

const PostsList = () => {
    
    const { posts, setPosts } = usePostStore()

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
    
    
    
    return (
        <>
            <List.Root listStyleType='none' mt='1.5rem' gap='2'>
                {posts.map((post) => (
                    <Card.Root key={post.postId}>
                        <Card.Body>
                            <Stack direction='row' gap='3' align='center' mb='2rem'>
                                <Icon>
                                    <IoPersonSharp />
                                </Icon>
                                <Card.Title>{ post.authorName }</Card.Title>
                            </Stack>
                            <Card.Description fontSize='1.2rem' >{ post.content }
                            <Image src={post.mediaURL} mt='2rem' />
                            </Card.Description>
                        </Card.Body>
                    </Card.Root>
                ))}
            </List.Root>
        </>
    )
}

export default PostsList



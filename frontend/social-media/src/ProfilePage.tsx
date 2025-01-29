import React from 'react'
import Navbar from './subpages/Navbar'
import { Button, Card, Grid, GridItem, Image, Stack, Box, Flex, Icon } from '@chakra-ui/react'
import { Avatar, AvatarGroup } from './src/components/ui/avatar'
import { MdEdit } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import CreatePost from './CreatePost';
import PostsList from './PostsList';
import { useUserStore } from '../store/user.store';

const ProfilePage = () => {

    const { userName } = useUserStore()

    return (
        <>
            <Navbar />
           <Grid templateColumns='repeat(12, 1fr)' gap='1rem' mx='17rem'>
                <GridItem colSpan='12'>
                    <Card.Root >
                        <Card.Body position='relative' padding='1rem'>
                            <Stack direction='row' gap='1.5rem' align='center'>
                                <Image src='https://bit.ly/sage-adebayo' borderRadius='full' boxSize='10rem' css={{ outlineWidth: '4px', outlineColor: 'gray.300', outlineOffset: '1px', outlineStyle: 'solid' }} />
                                <Stack direction='column' align='flex-start' justify='center' gap='2'>
                                    <Card.Title fontSize='2rem'> { userName } </Card.Title>
                                    <Card.Description fontSize='1rem'>981 friends</Card.Description>
                                    <Stack direction='row' gap='1.5rem' align='center'>
                                        <AvatarGroup>
                                            <Avatar name='Ryan Florence' src='https://bit.ly/ryan-florence' />
                                            <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
                                            <Avatar name='Kent Dodds' src='https://bit.ly/kent-c-dodds' />
                                            <Avatar name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
                                            <Avatar name='Christian Nwamba' src='https://bit.ly/code-beast' />
                                        </AvatarGroup>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Button position='absolute' borderRadius='0.5rem' right='2rem' bottom='3rem' variant='subtle' color='black' >
                                <MdEdit />
                                Edit Profile
                            </Button>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem colSpan='5'>
                    <Card.Root>
                        <Card.Body>
                           <Card.Title fontSize='1.3rem' fontWeight='bold'>Intro</Card.Title>
                            <Flex flexDirection='column' gap='1rem' justify='center' mt='1rem'>
                                <Card.Description fontSize='1rem' wordBreak='break-word' textAlign='center' >
                                    ig: @johndoe
                                </Card.Description>
                                <Button variant='subtle' color='black' ml='0.5rem'>Edit Bio</Button>
                                <Stack direction='row' align='center' fontSize='1.3rem'>
                                    <Icon color='gray.400'>
                                        <FaClock />
                                    </Icon>
                                    <Card.Description fontSize='1rem'>Joined November 2012</Card.Description>
                                </Stack>
                            </Flex>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem colSpan='7'>
                    <CreatePost createPostButtonSize={'36rem'} />
                    <PostsList userNameFilter={userName} />
                </GridItem>
           </Grid>
        </>
    )
}

export default ProfilePage

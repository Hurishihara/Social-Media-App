import React from 'react'
import Navbar from './subpages/Navbar'
import { Button, Card, Grid, GridItem, Image, Stack, Box, Flex, Icon, Separator, Text, FileUploadRootProvider, useFileUpload, FileUploadHiddenInput, useEditable, Editable, IconButton} from '@chakra-ui/react'
import {
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogContent,
    DialogRoot,
    DialogCloseTrigger,
    DialogFooter
} from './src/components/ui/dialog'
import {
    FileUpload,
    FileUploadList,
    FileUploadRoot,
    FileUploadTrigger
} from './src/components/ui/file-upload'
import { Avatar, AvatarGroup } from './src/components/ui/avatar'
import { MdEdit } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import CreatePost from './CreatePost';
import PostsList from './PostsList';
import { useUserStore } from '../store/user.store';
import { LuX } from 'react-icons/lu'
import { api } from './utils/axiosConfig'

const ProfilePage = () => {

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)  
    const [ isEditNameClick, setIsEditNameClick ] = React.useState<boolean>(false)
    const [ isEditBioClick, setIsEditBioClick ] = React.useState<boolean>(false)
    const { userName, userId, profilePicture, bio } = useUserStore() || { userName: '' }
    const [ newName, setNewName ] = React.useState<string>(userName || '')
    const [ newBio, setNewBio ] = React.useState<string>(bio || 'Gago')

    const fileUpload = useFileUpload({
        maxFiles: 1,
        name: 'profilePicture',
        accept: ['image/png', 'image/jpeg', 'image/jpg'],
        onFileChange (file) {
            if(file) {
                const reader = new FileReader()
                reader.onload = () => {
                    setPreviewUrl(reader.result as string);
                }
                reader.readAsDataURL(file.acceptedFiles[0])
            }
            else {
                setPreviewUrl(null)
            }
        },
    })

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const file = fileUpload.acceptedFiles[0]
        try {
            const response = await api.patch('/edit-profile', {
                userId, 
                username: newName,
                bio: newBio,
                profilePicture: file
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(await response.data)
            alert('Profile updated')
        }
        catch (err) {
            console.error(err)
        }
    }



    return (
        <>
            <Navbar />
           <Grid templateColumns='repeat(12, 1fr)' gap='1rem' mx='17rem'>
                <GridItem colSpan='12'>
                    <Card.Root >
                        <Card.Body position='relative' padding='1rem'>
                            <Stack direction='row' gap='1.5rem' align='center'>
                                <Image src={!profilePicture ? 'https://bit.ly/sage-adebayo' : profilePicture} borderRadius='full' boxSize='10rem' css={{ outlineWidth: '4px', outlineColor: 'gray.300', outlineOffset: '1px', outlineStyle: 'solid' }} />
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
                            <form id='edit-profile' onSubmit={handleSubmit} >
                            <DialogRoot size='md' placement='center'>
                                <DialogTrigger asChild>
                                    <Button position='absolute' borderRadius='0.5rem' right='2rem' bottom='3rem' variant='subtle' color='black' >
                                        <MdEdit />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle align='center'>
                                            Edit profile
                                        </DialogTitle>
                                        <Separator mt='1rem' />
                                        <Flex gap='4' justify='space-between' align='center' mt='1rem'>
                                            <DialogTitle>
                                                Profile Picture
                                            </DialogTitle>
                                            <FileUploadRootProvider value={fileUpload} w='1rem' mr='3rem'>
                                                <FileUploadHiddenInput />
                                                <FileUploadTrigger asChild>
                                                    <Button variant='ghost'>
                                                        Edit
                                                    </Button>
                                                </FileUploadTrigger>
                                            </FileUploadRootProvider>
                                        </Flex>
                                        <Flex flexDirection='row' justify='center' align='center' mt='1rem'>
                                            <Image src={ previewUrl || 'https://bit.ly/sage-adebayo' } borderRadius='full' boxSize='10rem' />
                                        </Flex>
                                        <Flex gap='4' justify='space-between' align='center' mt='1rem'>
                                            <DialogTitle>
                                                Name
                                            </DialogTitle>
                                            <Button variant='ghost' onClick={() => setIsEditNameClick(!isEditNameClick)}>
                                                Edit
                                            </Button>
                                        </Flex>
                                        <Flex flexDirection='row' justify='center' align='center' mt='1rem'>
                                            {isEditNameClick && (
                                                <Flex flexDirection='row' justify='center' align='center'>
                                                    <Editable.Root defaultValue='Gago' value={newName} onValueChange={(e: any) => setNewName(e.value)} >
                                                        <Editable.Preview alignItems='center' minH='2rem' w='full' />
                                                        <Editable.Input h='2rem' borderStyle='none'  />
                                                        <Editable.CancelTrigger asChild ml='1rem'>
                                                            <IconButton variant='subtle' size='md' rounded='full'>
                                                                <LuX />
                                                            </IconButton>
                                                        </Editable.CancelTrigger>
                                                    </Editable.Root>
                                                </Flex>
                                            )}
                                        </Flex>
                                        <Flex gap='4' justify='space-between' align='center' mt='1rem'>
                                            <DialogTitle>
                                                Intro
                                            </DialogTitle>
                                            <Button variant='ghost' onClick={() => setIsEditBioClick(!isEditBioClick)}>
                                                Edit
                                            </Button>
                                        </Flex>
                                        <Flex flexDirection='row' justify='center' align='center' mt='1rem'>
                                            {isEditBioClick && (
                                                <Flex flexDirection='row' justify='center' align='center'>
                                                    <Editable.Root defaultValue='Gago' value={newBio}  onValueChange={(e: any) => setNewBio(e.value)}>
                                                        <Editable.Preview alignItems='center' h='2rem' w='full' />
                                                        <Editable.Textarea borderStyle='none' h='5rem' />
                                                        <Editable.CancelTrigger asChild ml='1rem'>
                                                            <IconButton variant='subtle' size='md' rounded='full'>
                                                                <LuX />
                                                            </IconButton>
                                                        </Editable.CancelTrigger>
                                                    </Editable.Root>
                                                </Flex>
                                            )}
                                        </Flex>
                                    </DialogHeader>
                                    <Button form='edit-profile' m='1rem' type='submit' onSubmit={handleSubmit}>Save</Button>
                                    <DialogCloseTrigger />
                                </DialogContent>
                            </DialogRoot>
                            </form>
                        </Card.Body>
                    </Card.Root>
                </GridItem>
                <GridItem colSpan='5'>
                    <Card.Root>
                        <Card.Body>
                           <Card.Title fontSize='1.3rem' fontWeight='bold'>Intro</Card.Title>
                            <Flex flexDirection='column' gap='2rem' justify='center' mt='1rem'>
                                <Card.Description fontSize='1rem' wordBreak='break-word' textAlign='center' >
                                    { bio }
                                </Card.Description>
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

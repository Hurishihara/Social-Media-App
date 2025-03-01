import { Button, Card, FileUploadHiddenInput, FileUploadRootProvider, Heading, Icon, IconButton, Separator, Stack, Textarea, useBreakpointValue, useFileUpload, } from '@chakra-ui/react'
import {
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogContent,
    DialogRoot,
    DialogCloseTrigger,
} from './src/components/ui/dialog'
import {
    FileUploadTrigger
} from './src/components/ui/file-upload'
import { Avatar } from './src/components/ui/avatar'
import React, { useState } from 'react'
import { IoPersonSharp } from 'react-icons/io5'
import { FaRegImages } from "react-icons/fa";
import { api } from './utils/axiosConfig'
import { useUserStore } from '../store/user.store'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { ErrorResponse } from './ProfilePage'
import { Toaster, toaster } from './src/components/ui/toaster'


interface CreatePostProps {
    createPostButtonSize: string
}


const CreatePost: React.FC<CreatePostProps> = ({ createPostButtonSize }) => {
    
    const navigate = useNavigate()
    const { userName, userId, profilePicture } = useUserStore()
    const [content, setContent] = useState<string>('')
    const postButtonSize = useBreakpointValue({
        base: createPostButtonSize,
        sm: createPostButtonSize,
        md: createPostButtonSize,
        lg: createPostButtonSize,
        tablet: createPostButtonSize,
        desktop: createPostButtonSize,
        wide: createPostButtonSize,
        wideDesktop: createPostButtonSize
    })


    const fileUpload = useFileUpload({
        maxFiles: 1,
        name: 'image',
        accept: ['image/png', 'image/jpeg', 'image/jpg'],
    })

    const accepted = fileUpload.acceptedFiles.map((file) => file.name)

    const handleClearFile = () => {
        fileUpload.clearFiles()
    }

    const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            if (fileUpload.acceptedFiles.length > 0) {
                const file = fileUpload.acceptedFiles[0]
            
            const postApi = api('post')
            await postApi.post('/create-post', {
                userId,
                content,
                picture: file
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })
            navigate('/')
        }
        }
        catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errorResponse = err.response?.data as ErrorResponse;
                toaster.create({
                    title: errorResponse.name,
                    description: errorResponse.message,
                    type: 'error'
                })
            }
        }
    }
   
    
    return (
        <>
            <Card.Root borderRadius='0.8rem' boxShadow='md'>
                <Card.Body>
                    <Stack direction='row' gap='3' align='center' >
                        <Avatar src={profilePicture} size='sm'/>
                        <form id='create-post' method='post' onSubmit={handleCreatePost} encType='multipart/form-data'>
                        <DialogRoot size='md' placement='center'>
                            <DialogTrigger asChild>
                                <Button borderRadius='3rem' w={postButtonSize} size='md' variant='subtle' color='gray.500'>
                                    Create a new post...
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader >
                                    <DialogTitle align='center'>
                                        Create Post
                                    </DialogTitle>
                                    <Separator mt='1rem' />
                                    <Stack direction='row' gap='3' align='center' mt='1rem'>
                                        <Icon>
                                            <IoPersonSharp />
                                        </Icon>
                                        <DialogTitle>
                                            Sebastian Casal
                                        </DialogTitle>
                                    </Stack>
                                </DialogHeader>
                                <DialogBody>
                                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} autoresize maxH='20lh' size='xl' borderStyle='none' placeholder={`What's up, ${userName}?`} />
                                    <Card.Root mt='1rem' size='sm'>
                                       <Stack direction='row' align='center'>
                                        <Card.Body fontWeight='medium'>
                                            Add to your post
                                        </Card.Body>
                                        <FileUploadRootProvider value={fileUpload} mr='3rem' w='1rem'>
                                            <FileUploadHiddenInput />
                                            <FileUploadTrigger asChild>
                                                <IconButton variant='subtle' size='md' rounded='full'>
                                                    <FaRegImages />
                                                </IconButton>
                                            </FileUploadTrigger>
                                        </FileUploadRootProvider>
                                       </Stack>
                                    </Card.Root>
                                    {accepted.length > 0 && (
                                        <Card.Root mt='1rem' size='sm'>
                                            <Card.Body>
                                                <Heading fontWeight='medium' size='md'>
                                                {accepted.join(", ")}
                                                <IconButton variant='subtle' size='sm' rounded='full' onClick={handleClearFile}>
                                                    <FaRegImages />
                                                </IconButton>
                                                </Heading>
                                            </Card.Body>
                                        </Card.Root>
                                    )}
                                    <Button form='create-post' borderRadius='3rem' w='29rem' size='md' type='submit' mt='1rem'>
                                        Post
                                    </Button>
                                </DialogBody>
                                <DialogCloseTrigger/>
                            </DialogContent>
                        </DialogRoot>
                        </form>
                    </Stack>
                </Card.Body>
            </Card.Root>
            <Toaster />
        </>
    )
}

export default CreatePost
    
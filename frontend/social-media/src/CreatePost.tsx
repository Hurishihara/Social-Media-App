import { Box, Button, Card, Code, FileUploadHiddenInput, FileUploadRootProvider, Heading, Icon, IconButton, Separator, Stack, Textarea, useFileUpload, } from '@chakra-ui/react'
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
import React, { useState } from 'react'
import { IoPersonSharp } from 'react-icons/io5'
import { FaRegImages } from "react-icons/fa";
import { api } from './utils/axiosConfig'





const CreatePost = () => {
    
    const [userId, setUserId] = useState<number>(4)
    const [content, setContent] = useState<string>('')

    const fileUpload = useFileUpload({
        maxFiles: 1,
        name: 'image',
        accept: ['image/png', 'image/jpeg', 'image/jpg'],
    })

    const accepted = fileUpload.acceptedFiles.map((file) => file.name)
    const rejected = fileUpload.rejectedFiles.map((e) => e.file.name)
    

    const handleClearFile = () => {
        fileUpload.clearFiles()
    }

    const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (fileUpload.acceptedFiles.length > 0) {
            const file = fileUpload.acceptedFiles[0]
        
        console.log('file', file)
        console.log('content', content)
        console.log('userId', userId)

        const response = await api.post('/create-post', {
            userId,
            content,
            picture: file
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
        console.log('response', response)
        alert('Post created')
    }
}
   
    
    return (
        <>
            <Card.Root>
                <Card.Body>
                    <Stack direction='row' gap='3' align='center' >
                        <Icon>
                            <IoPersonSharp />
                        </Icon>
                        <form id='create-post' method='post' onSubmit={handleCreatePost} encType='multipart/form-data'>
                        <DialogRoot size='md' placement='center'>
                            <DialogTrigger asChild>
                                <Button borderRadius='3rem' w='29rem' size='md' variant='subtle'>
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
                                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} autoresize maxH='20lh' size='xl' borderStyle='none' placeholder="What's up, Sebastian?" />
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
        </>
    )
}

export default CreatePost
//<Button borderRadius='3rem' w='30rem' variant='subtle' >
  //                          Create a new post...
    //                    </Button>
    
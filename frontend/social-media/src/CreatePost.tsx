import { Box, Button, Card, Icon, IconButton, Separator, Stack, Textarea, } from '@chakra-ui/react'
import {
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogContent,
    DialogRoot,
    DialogCloseTrigger
} from './src/components/ui/dialog'
import {
    FileUpload,
    FileUploadList,
    FileUploadRoot,
    FileUploadTrigger
} from './src/components/ui/file-upload'
import React from 'react'
import { IoPersonSharp } from 'react-icons/io5'
import { FaRegImages } from "react-icons/fa";





const CreatePost = () => {
    
    
    
    
    return (
        <>
            <Card.Root>
                <Card.Body>
                    <Stack direction='row' gap='3' align='center' >
                        <Icon>
                            <IoPersonSharp />
                        </Icon>
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
                                    <Textarea autoresize maxH='20lh' size='xl' borderStyle='none' placeholder="What's up, Sebastian?" />
                                    <Card.Root mt='1rem' size='sm'>
                                       <Stack direction='row' align='center'>
                                       <Card.Body fontWeight='medium'>
                                            Add to your post
                                        </Card.Body>
                                        <FileUploadRoot directory='true' w='1rem' mr='3rem' >
                                            <FileUploadTrigger asChild>
                                                <IconButton aria-label='Add images' rounded='full' variant='ghost' size='md'>
                                                    <Icon>
                                                        <FaRegImages />
                                                    </Icon>
                                                </IconButton>
                                            </FileUploadTrigger>
                                            <FileUploadList />
                                        </FileUploadRoot>
                                       </Stack>
                                    </Card.Root>
                                </DialogBody>
                                <DialogCloseTrigger/>
                            </DialogContent>
                        </DialogRoot>
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
import { Box, Button, Card, useDialog, Heading, Icon, IconButton, Separator, Stack, Textarea, DialogRootProvider, Editable } from '@chakra-ui/react'
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
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
import React, { useState } from 'react'
import { IoPersonSharp } from 'react-icons/io5'
import { FaRegImages } from "react-icons/fa";
import { api } from './utils/axiosConfig'
import { Post } from '../store/post.store'




const CustomDialog = ({ post, open, setOpen }: { post: Post, open: boolean, setOpen: any  }) => {
    
    const [editedContent, setEditedContent] = useState<string>(post.content)


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        
        try {
            const response = await api.patch('/edit-post', {
                postId: post.postId,
                content: editedContent
            })
            console.log(response.data)
        }
        catch (err) {
            console.error(err)
        }
    }

    return (
        <>
        <form id='edit-post' onSubmit={handleSubmit} >
            <DialogRoot open={open} onOpenChange={setOpen} placement='center' size='md'>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle align='center'>
                            Edit post
                        </DialogTitle>
                        <Separator mt='1rem' />
                        <Stack direction='row' gap='3' align='center' mt='1rem'>
                            <Icon>
                                <IoPersonSharp />
                            </Icon>
                            <DialogTitle>
                                {post.authorName}
                            </DialogTitle>
                        </Stack>
                    </DialogHeader>
                    <DialogBody>
                        <Editable.Root defaultValue={post.content} value={editedContent} onValueChange={(e: any) => setEditedContent(e.value)}>
                            <Editable.Preview alignItems='flex-start' minH='5rem' w='full' />
                            <Editable.Textarea h='5rem' borderStyle='none' placeholder={`What's on your mind, ${post.authorName}?`} />
                            <Editable.CancelTrigger asChild ml='1rem'>
                                <IconButton variant='subtle' size='md' rounded='full'>
                                    <LuX />
                                </IconButton>
                            </Editable.CancelTrigger>
                        </Editable.Root>
                        <Button form='edit-post' borderRadius='3rem' w='29rem' mt='1.5rem' type='submit' onSubmit={handleSubmit}>Save</Button>
                    </DialogBody>
                    <DialogCloseTrigger/>
                </DialogContent>
            </DialogRoot>
        </form>
        </>
    )
}

export default CustomDialog

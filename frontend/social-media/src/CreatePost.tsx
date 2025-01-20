import { Button, Card, Icon, Stack } from '@chakra-ui/react'
import React from 'react'
import { IoPersonSharp } from 'react-icons/io5'

const CreatePost = () => {
    return (
        <>
            <Card.Root>
                <Card.Body>
                    <Stack direction='row' gap='3' align='center' >
                        <Icon>
                            <IoPersonSharp />
                        </Icon>
                        <Button borderRadius='3rem' w='30rem' variant='subtle'>
                            Create a new post...
                        </Button>
                    </Stack>
                </Card.Body>
            </Card.Root>
        </>
    )
}

export default CreatePost

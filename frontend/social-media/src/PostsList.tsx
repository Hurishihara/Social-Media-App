import { Card, Icon, List, Stack } from '@chakra-ui/react'
import React from 'react'
import { IoPersonSharp } from 'react-icons/io5'

const PostsList = () => {
    return (
        <>
            <List.Root listStyleType='none' mt='1.5rem' gap='2'>
                <Card.Root>
                    <Card.Body>
                        <Stack direction='row' gap='3' align='center' mb='2rem'>
                            <Icon>
                                <IoPersonSharp />
                            </Icon>
                            <Card.Title>Sebastian Casal</Card.Title>
                        </Stack>
                        <Card.Description>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam accumsan, purus ac porta finibus, justo arcu dictum odio, non scelerisque diam dui eu urna. Vestibulum scelerisque tincidunt purus, sit amet rhoncus odio pellentesque non. Duis at urna felis. Nam auctor cursus erat at ultricies. Maecenas nec nunc aliquet, lacinia mauris luctus, sagittis ante. Curabitur scelerisque libero non blandit faucibus. Ut vel diam feugiat, luctus nibh at, condimentum ligula. Donec porttitor ex quis nulla condimentum egestas. Suspendisse at viverra arcu. Maecenas eleifend condimentum ex, et elementum dui sagittis at. Nunc ut massa odio.</Card.Description>
                    </Card.Body>
                </Card.Root>
                <Card.Root>
                    <Card.Body>
                        <Stack direction='row' gap='3' align='center' mb='2rem'>
                            <Icon>
                                <IoPersonSharp />
                            </Icon>
                            <Card.Title>Stefanie Lacap</Card.Title>
                        </Stack>
                        <Card.Description>Maecenas tempus rhoncus nisl sed tempor. Aenean a orci vel dolor semper porttitor vel a elit. Nam convallis aliquet arcu, in convallis turpis dapibus ut. Phasellus eleifend erat in dictum ultrices. Curabitur congue arcu non turpis auctor bibendum. Mauris lobortis lacinia gravida. Nulla facilisi.</Card.Description>
                    </Card.Body>
                </Card.Root>
            </List.Root>
        </>
    )
}

export default PostsList

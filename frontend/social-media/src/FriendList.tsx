import { Box, Circle, Float, Heading, List, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { IoPersonSharp } from "react-icons/io5"
import { Avatar } from "@chakra-ui/react"
import { useNavigate } from "react-router"

interface Friend {
    id: number,
    name: string,
    profilePicture: string,
    isOnline: boolean
}

interface FriendListProps {
    friends: Friend[]
}


const FriendList: React.FC<FriendListProps> = ({ friends }) => {
    
    const navigate = useNavigate()

    const handleUserClick = (userName: string) => {
        navigate(`/${userName}`)
    }

    return (
        <>
        <Heading fontWeight='medium' size='lg' color='gray.600'>
            Friends
        </Heading>
        <List.Root gap='0.9rem' mt='0.7rem' listStyleType='none' fontSize='1.1rem' ml='1rem'>
            {friends.map((friend) => (
                <List.Item key={friend.id} onClick={() => handleUserClick(friend.name)} cursor='pointer' >
                    <List.Indicator asChild>
                        <Avatar.Root size='sm' >
                            <Avatar.Image src={friend.profilePicture} />
                            <Float placement='bottom-end' offsetX='1' offsetY='1'>
                                <Circle bg={friend.isOnline ? 'green.500' : 'gray.500'} size='8px' outline='0.2em solid' outlineColor='bg' />
                            </Float>
                        </Avatar.Root>
                    </List.Indicator>
                    {friend.name}
                </List.Item>
            ))}
        </List.Root>
        </>
    )
}

export default FriendList

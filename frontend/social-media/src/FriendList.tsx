import { Box, Heading, List, Stack, Text } from "@chakra-ui/react"
import { IoPersonSharp } from "react-icons/io5"


const FriendList = () => {
    
    return (
        <>
        <Heading fontWeight='medium' size='lg' color='gray.600'>
            Contacts
        </Heading>
        <List.Root gap='0.9rem' mt='0.7rem' listStyleType='none' fontSize='1.1rem' ml='1rem'>
            <List.Item>
                <List.Indicator asChild>
                    <IoPersonSharp />
                </List.Indicator>
                Sebastian Casal
            </List.Item>
            <List.Item>
                <List.Indicator asChild>
                    <IoPersonSharp />
                </List.Indicator>
                Stefanie Lacap
            </List.Item>
            <List.Item>
                <List.Indicator asChild>
                    <IoPersonSharp />
                </List.Indicator>
                Ruby Andrada
            </List.Item>
            <List.Item>
                <List.Indicator asChild>
                    <IoPersonSharp />
                </List.Indicator>
                Luis Sarmiento
            </List.Item>
        </List.Root>
        </>
    )
}

export default FriendList

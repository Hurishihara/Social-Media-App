import { Card, Grid, GridItem, List, Box, Flex, Stack, Button, Textarea, Input, IconButton } from '@chakra-ui/react'
import { Avatar } from './src/components/ui/avatar'
import { useNavigate, useParams } from 'react-router'
import Navbar from './subpages/Navbar'
import React, { useEffect }from 'react'
import { api } from './utils/axiosConfig'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useUserStore } from '../store/user.store'
import { LuSmile } from "react-icons/lu";
import { LuSendHorizontal } from "react-icons/lu";
import { formatDate } from './PostsList'

const Conversation = () => {
    
    type ConversationType = {
        id: number,
        user: {
            profilePicture: string,
            username: string
        }
    }

    type MessageType = {
        id: number,
        content: string,
        createdAt: string,
        isRead: boolean,
        sender: {
            id: number,
            username: string,
            profilePicture: string
        }
    }

    const { userId } = useUserStore()
    const navigate = useNavigate()
    const { conversationId } = useParams<{ conversationId: string }>() 

    const [conversations, setConversations] = React.useState<ConversationType[]>([])
    const [message, setMessage] = React.useState<string>('')
    const [ userMessage, setUserMessage ] = React.useState<MessageType[]>([])
    const [showEmojiPicker, setShowEmojiPicker] = React.useState<boolean>(false)

    useEffect(() => {
        const getConversation = async () => {
            const conversationApi = api('conversation')
            const response = await conversationApi.get('/get-conversation')
            setConversations(response.data)
        }
        getConversation()
    }, [])

    useEffect(() => {
        if (conversationId) {
            const getMessages = async () => {
                const messageApi = api('message')
                const response = await messageApi.get(`/get-messages/${conversationId}`)
                console.log(response.data)
                setUserMessage(response.data)
            }
            getMessages()
        } 
    }, [conversationId])
    

    const onClickConversation = (conversationId: number) => {
        navigate(`/messages/${conversationId}`)
    }

    interface EmojiData {
        id: string,
        keywords: string[],
        name: string,
        native: string,
        shortcodes: string,
        unified: string
    }

    const handleSelectEmoji = (emoji: EmojiData) => {
        setMessage((prevMessage) => prevMessage + emoji.native)
    }

  return (
    <>
       <Navbar />
       <Grid templateColumns='repeat(12, 1fr)' >
            <GridItem colSpan={3}>
                <Card.Root minH='92.8vh' maxH='92.8vh'>
                    <Card.Body overflowY='auto' p={0}>
                        <Card.Title pl='1.5rem' pt='1rem'>Messages</Card.Title>
                        <List.Root listStyleType='none' mt='1rem' p={0}>
                            {conversations.map((conversation, index) => (
                                <Box _hover={{ bg: 'gray.100', cursor: 'pointer'}}  pl='1rem' py='1rem' onClick={() => onClickConversation(conversation.id)}>
                                    <List.Item key={index} fontWeight='semibold'>
                                        <List.Indicator>
                                            <Avatar src={conversation.user.profilePicture} />
                                        </List.Indicator>
                                        {conversation.user.username}
                                    </List.Item>
                                </Box>
                            ))}
                        </List.Root>
                    </Card.Body>
                </Card.Root>
            </GridItem>
                <GridItem colSpan={9}>
                    <Card.Root minH='92.8vh' maxH='92.8vh'>
                        <Card.Body overflowY='auto' p={0}>
                            <Box bg='rgba(255, 255, 255, 0.3)' borderRadius='md' >
                                <Stack direction='row' align='center' gap={3} pl='1rem' py='1rem'>
                                    {<Avatar src={conversations.find(conversation => conversation.id === Number(conversationId))?.user?.profilePicture} />}
                                    <Card.Title> {conversations.find(conversation => conversation.id === Number(conversationId))?.user?.username} </Card.Title>    
                                </Stack>   
                            </Box>
                            <Stack gap={2} p='1rem' direction='column'>
                                {userMessage.map((message, index) => (
                                    <>
                                    <Flex key={index} direction='row' align='center' justify={message.sender.id === userId ? 'flex-end' : 'flex-start'} >
                                        {message.sender.id !== userId && <Avatar src={message.sender.profilePicture} name={message.sender.username} />}
                                        <Box 
                                        bgColor={message.sender.id === userId ? 'blue.400' : 'gray.200' } 
                                        color={message.sender.id === userId ? 'white' : 'black' } 
                                        p='1rem' 
                                        borderEndRadius={message.sender.id === userId ? '0' : '1.3rem'}
                                        borderEndStartRadius={message.sender.id === userId ? '1.3rem' : '0'} 
                                        borderTopEndRadius='1.3rem' 
                                        borderTopStartRadius='1.3rem' 
                                        mx='1rem'
                                        >
                                            {message.content}
                                        </Box>
                                    </Flex>
                                    <Box 
                                    textAlign={message.sender.id === userId ? 'end' : 'start'} 
                                    fontSize='0.8rem' color='gray.500'
                                    ml={message.sender.id === userId ? '0' : '3.5rem'}
                                    mr={message.sender.id === userId ? '1rem' : '0'}
                                    >
                                        {formatDate(message.createdAt)}
                                    </Box>
                                    </>
                                ))}
                            </Stack>
                        </Card.Body>
                        <Card.Footer  pl='1rem' py='1rem'>
                        <Stack direction='row' align='center' gap={2} p='1rem' bgColor='#EFF3F4' borderRadius='2rem'>
                                <IconButton size='lg' variant='plain' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <LuSmile />
                                </IconButton>
                                <Input w='64.5vw' placeholder='Start a new message...' fontSize='1.1rem' _focus={{ outline: 'none' }} borderStyle='none'  value={message} onChange={(e) => setMessage(e.target.value)} />
                                <IconButton size='lg' variant='plain'>
                                    <LuSendHorizontal />
                                </IconButton>
                        </Stack>
                        {showEmojiPicker && (
                                <Box position='absolute' bottom='7rem'>
                                    <Picker 
                                    set='apple'
                                    perLine='9'
                                    navPosition='top'
                                    previewEmoji='point_up'
                                    onEmojiSelect={handleSelectEmoji}
                                    />
                                </Box>
                        )}
                        </Card.Footer>
                    </Card.Root>
                </GridItem>
       </Grid>
    </>
  )
}

export default Conversation

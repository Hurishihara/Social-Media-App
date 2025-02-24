import { Card, Grid, GridItem, List, Box, Flex, Stack, Button, Input, IconButton, Center } from '@chakra-ui/react'
import { Avatar } from './src/components/ui/avatar'
import { useNavigate, useParams } from 'react-router'
import Navbar from './subpages/Navbar'
import React, { useEffect }from 'react'
import { api } from './utils/axiosConfig'
import Picker from '@emoji-mart/react'
import { useUserStore } from '../store/user.store'
import { LuSmile } from "react-icons/lu";
import { LuSendHorizontal } from "react-icons/lu";
import { formatDate } from './PostsList'
import { useSocket } from './SocketContext'

const Conversation = () => {
    
    type ConversationType = {
        id: number,
        user: {
            id: number,
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

    interface EmojiData {
        id: string,
        keywords: string[],
        name: string,
        native: string,
        shortcodes: string,
        unified: string
    }

    const { userId } = useUserStore()
    const navigate = useNavigate()
    const socket = useSocket()
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
                setUserMessage(response.data)
            }
            getMessages()
        }
        socket?.on('new-message', (message: MessageType) => {
            setUserMessage((prevMessage) => [...prevMessage, message])
        })

        return () => {
            socket?.off('new-message')
        }
    }, [conversationId])
    

    const handleSendMessage = async () => {
       try {
        const messageApi = api('message')
        const response = await messageApi.post('/send-message', {
            conversationId: conversationId,
            receiverId: conversations.find(conversation => conversation.id === Number(conversationId))?.user.id,
            content: message
        })
        setUserMessage((prevMessage) => [...prevMessage, response.data])
        setMessage('')
       }
       catch (err) {
           console.error('Error sending message', err)
       }
    }

    const onClickConversation = (conversationId: number) => {
        navigate(`/messages/${conversationId}`)
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
            {!conversationId ? (
                <GridItem colSpan={9}>
                    <Center h='92.8vh'>
                        <Stack gap={1} direction='column'>
                            <Box fontSize='2.7rem' fontWeight='semibold'>
                                Select a message
                            </Box>
                            <Box color='gray.500' fontSize='1.1rem'>
                                Revisit an old chat, begin a fresh discussion, <br /> or go with the flow. The choice is yours.
                            </Box>
                            <Box>
                                <Button mt='1.5rem' bgColor='blue.400' color='white' borderRadius='2rem' p='1.5rem' w='13rem' _hover={{ bgColor: 'blue.500' }} fontSize='1.1rem' fontWeight='semibold'>
                                    New message
                                </Button>
                            </Box>
                        </Stack>
                    </Center>
                </GridItem>
            ): userMessage.length > 0 ? (
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
                                <IconButton size='lg' variant='plain' onClick={handleSendMessage}>
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
            ) : (
                <GridItem colSpan={9}>
                    <Card.Root minH='92.8vh' maxH='92.8vh'>
                        <Card.Body overflowY='auto' p={0}>
                            <Box bg='rgba(255, 255, 255, 0.5)' borderRadius='md' >
                                <Stack direction='row' align='center' gap={3} pl='1rem' py='1rem'>
                                    {<Avatar src={conversations.find(conversation => conversation.id === Number(conversationId))?.user?.profilePicture} />}
                                    <Card.Title> {conversations.find(conversation => conversation.id === Number(conversationId))?.user?.username} </Card.Title>    
                                </Stack>   
                            </Box>
                            
                        </Card.Body>
                        <Card.Footer  pl='1rem' py='1rem'>
                        <Stack direction='row' align='center' gap={2} p='1rem' bgColor='#EFF3F4' borderRadius='2rem'>
                                <IconButton size='lg' variant='plain' onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <LuSmile />
                                </IconButton>
                                <Input w='64.5vw' placeholder='Start a new message...' fontSize='1.1rem' _focus={{ outline: 'none' }} borderStyle='none'  value={message} onChange={(e) => setMessage(e.target.value)} />
                                <IconButton size='lg' variant='plain' onClick={handleSendMessage}>
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
            )}
       </Grid>
    </>
  )
}

export default Conversation

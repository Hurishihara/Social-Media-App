import { useState, useEffect } from 'react';
import { Card, Flex, Input, Box, Stack, IconButton, Icon, Spinner, useMenu, MenuContextTrigger, Button, Image, Float, Circle } from '@chakra-ui/react'
import { Avatar } from '../src/components/ui/avatar';
import { TiHome } from 'react-icons/ti'
import { LuMessageCircleMore } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import { LuUserRoundSearch } from "react-icons/lu";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { LuSquareUserRound } from "react-icons/lu";
import { InputGroup } from '@/src/components/ui/input-group';
import { useNavigate } from 'react-router';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/src/components/ui/menu';
import { api } from '@/utils/axiosConfig';
import { useUserStore } from '../../store/user.store';
import { usePostStore } from '../../store/post.store';
import { useNotificationStore, Notification } from '../../store/notification.store';
import { formatDate } from '../PostsList'
import { useSocket } from '@/SocketContext';

const Navbar = () => {


  const [ query, setQuery ] = useState<string>('')
  const [ results, setResults ] = useState<any[]>([])
  const [ debounceTimeout, setDebounceTimeout ] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate()
  const { userName, userId, profilePicture, clearUser } = useUserStore()
  const { clearPosts } = usePostStore()
  const socket = useSocket()
  const { userNotifications, setUserNotifications, clearNotifications } = useNotificationStore()
 

  const handleHomeButtonClick = () => {
    navigate('/home')
  }

  const handleLogOut = async (): Promise<void> => {
    try {
      socket?.disconnect()
      const authApi = api('auth')
      await authApi.post('/logout')
      navigate('/')
      clearUser()
      clearPosts()
      clearNotifications()
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    const fetchNotifications = async (userIdFilter?: number) => {
      try {
        const notificationApi = api('notification')
        const response = await notificationApi.get('/notifications', {
          params: userIdFilter ? { userId: userIdFilter } : {}
        })
        console.log('fetch notifications', response.data)
        setUserNotifications(response.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchNotifications(userId ?? undefined)

    socket?.on('searchResults', (data) => {
      setResults(data)
      console.log('data', data)
    })
    socket?.on('like-notification', (data) => {
      console.log('like data', data)
      const currentNotification = useNotificationStore.getState().userNotifications
      const updatedNotifications = [data, ...currentNotification]
      setUserNotifications(updatedNotifications)
    })
    socket?.on('unlike-notification', (data) => {
      console.log('unlike data', data)
      const currentNotification = useNotificationStore.getState().userNotifications
      console.log('current notification', currentNotification)
      const updatedNotifications = currentNotification.filter(notification => notification.id !== data.id)
      console.log('updated notification', updatedNotifications)
      setUserNotifications(updatedNotifications)
    })
    socket?.on('friend-request-notification', (data) => {
      const currentNotification = useNotificationStore.getState().userNotifications
      const updatedNotifications = [data, ...currentNotification]
      setUserNotifications(updatedNotifications)
    })
    socket?.on('friend-accept-notification', (data) => {
      const currentNotification = useNotificationStore.getState().userNotifications
      const updatedNotifications = [data, ...currentNotification]
      setUserNotifications(updatedNotifications)
    })
    socket?.on('cancel-friend-request', (data) => {
      const currentNotification = useNotificationStore.getState().userNotifications
      const updatedNotifications = currentNotification.filter(notification => notification.id !== data.id)
      setUserNotifications(updatedNotifications)
    })
    socket?.on('comment-notification', (data) => {
      const currentNotification = useNotificationStore.getState().userNotifications
      const updatedNotifications = [data, ...currentNotification]
      setUserNotifications(updatedNotifications)
    })


    return () => {
      socket?.off('searchResults')
      socket?.off('like-notification')
      socket?.off('unlike-notification')
      socket?.off('friend-request-notification')
      socket?.off('friend-accept-notification')
      socket?.off('cancel-friend-request')
      socket?.off('comment-notification')
    }
  }, [userId])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    const timeOut = setTimeout(() => {
      socket?.emit('search', value);
    }, 1000)

    setDebounceTimeout(timeOut)
  }

  const handleProfileClick = () => {
    navigate(`/${userName}`)
  }

  const handleSearchUser = (username: string) => {
    navigate(`/${username}`)
  }

  const handleMessageClick = () => {
    navigate('/messages')
  }

  return (
    <>
        <Card.Root height='4rem' borderRadius='none' position='sticky' top='0' zIndex='1000'>
          <Flex justifyContent='space-between' alignItems='center' h='100%'  direction='row'>
            <Flex gap='3' alignItems='center' ml='1rem' >
              <Card.Title fontSize='1.3rem'>Social Media App</Card.Title>
                <Box>
                  <InputGroup startElement={<LuUserRoundSearch />} 
                  endElement={
                    <MenuRoot positioning={{ placement: 'bottom-end'}}>
                      <MenuTrigger asChild>
                      <Button borderRadius='2rem' fontSize='' w='100%' ml='1.3rem' h='2.6rem'>Search</Button>
                      </MenuTrigger>
                      <MenuContent>
                        {results.length > 0 ? (
                          results.map((results, index) => (
                            <MenuItem key={index} value={results.username} gap='1rem' fontSize='1rem' onClick={() => handleSearchUser(results.username)} >
                              <Avatar name={results.username} src={results.profilePicture} />
                              {results.username}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value='No results found'>
                            No results found
                          </MenuItem>
                        )}
                      </MenuContent>
                    </MenuRoot>
                  } >
                      <Input 
                      type='text' 
                      value={query} 
                      onChange={handleSearch}  
                      placeholder='Search' 
                      borderRadius='4rem' 
                      h='2.7rem' w='17rem' 
                      fontSize='0.9rem'
                      />
                  </InputGroup>
                </Box>
            </Flex>
            <Box>
              <IconButton aria-label='Home' rounded='full' variant='ghost' size='md' onClick={handleHomeButtonClick}>
                <TiHome />
              </IconButton>
            </Box>
            <Flex alignItems='center' gap='1' mr='1rem'>
              <IconButton aria-label='Messages' rounded='full' variant='ghost' size='md' onClick={handleMessageClick}>
                <LuMessageCircleMore />
              </IconButton>
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton aria-label='Notifications' rounded='full'  variant='ghost' size='md' fontSize='0.6rem'>
                    <Box position='relative'>
                      <IoMdNotificationsOutline />
                      {userNotifications.length > 0 && (
                        <Float placement='top-end'>
                        <Circle  bg='red' size='3.5' color='white'>
                          {userNotifications.length}
                        </Circle>
                        </Float>
                      )}
                    </Box>
                  </IconButton>
                </MenuTrigger>
                <MenuContent>
                  {userNotifications.length > 0 ? userNotifications.map((notification) => (
                    <MenuItem key={notification.id} value={notification.id.toString()}>
                      <Avatar name={notification.senderUserName} src={notification.senderProfilePicture} />
                      <Stack direction='column' gap='0'>
                        <Box fontSize='1rem'>
                          {notification.notificationText}
                        </Box>
                        <Box fontSize='0.7rem'>
                          {formatDate(notification.created_at)}
                        </Box>
                      </Stack>
                    </MenuItem>
                  )): (
                    <MenuItem value='No notifications'>
                      No notifications
                    </MenuItem>
                  )}
                </MenuContent>
              </MenuRoot>
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton aria-label='Profile' rounded='full' variant='ghost' size='md'>
                    <Avatar name={userName} src={profilePicture} size='sm' />
                  </IconButton>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem value={userName ?? ''} onClick={handleProfileClick} >
                    <Avatar name={userName} src={profilePicture} size='sm' />
                    {userName}
                  </MenuItem>
                  <MenuItem value="logout" onClick={handleLogOut}>
                    <RiLogoutBoxRLine size='1.3rem' color='black' />
                    Log Out
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            </Flex>
          </Flex>
        </Card.Root>
    </>
  )
}

export default Navbar
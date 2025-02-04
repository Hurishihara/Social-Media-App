import { useState, useEffect } from 'react';
import { Card, Flex, Input, Box, Stack, IconButton, Icon, Spinner, useMenu, MenuContextTrigger, Button, Image, } from '@chakra-ui/react'
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
import { socket } from '../utils/socket.io'
import { useUserStore } from '../../store/user.store';
import { usePostStore } from '../../store/post.store';
import { useNotificationStore } from '../../store/notification.store';

const Navbar = () => {


  const [ query, setQuery ] = useState<string>('')
  const [ results, setResults ] = useState<any[]>([])
  const [ debounceTimeout, setDebounceTimeout ] = useState<NodeJS.Timeout | null>(null);

  const navigate = useNavigate()
  const { userName, userId, profilePicture, clearUser } = useUserStore()
  const { clearPosts } = usePostStore()
  const { notifications, setNotifications, clearNotifications } = useNotificationStore()
 

  const handleHomeButtonClick = () => {
    navigate('/home')
  }

  const handleLogOut = async (): Promise<void> => {
    try {
      const response = await api.post('/logout')
      navigate('/')
      clearUser()
      clearPosts()
      clearNotifications()
      alert(response.data.message)
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (userId) {
      socket.emit('join-room', userId)
    }

    socket.on('searchResults', (data) => {
      setResults(data)
      console.log('data', data)
    })
    socket.on('like-notification', (data) => {
      console.log(data)
      setNotifications(data)
    })
    socket.on('unlike-notification', (data) => {
      console.log('unlike data', data)
      const updatedNotifications = notifications.filter((notifications: any) => notifications.sender_id !== data.senderId && notifications.related_post_id !== data.postId)
      setNotifications(updatedNotifications)
    })

    return () => {
      socket.off('searchResults')
      socket.off('like-notification')
      socket.off('unlike-notification')
    }
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    const timeOut = setTimeout(() => {
      socket.emit('search', value);
    }, 1000)

    setDebounceTimeout(timeOut)
  }

  const handleProfileClick = () => {
    navigate('/profile')
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
                            <MenuItem key={index} value={results.username} gap='1rem' fontSize='1rem'>
                              <Avatar name={results.username} src={results.profile_picture} />
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
              <IconButton aria-label='Messages' rounded='full'  variant='ghost' size='md'>
                <LuMessageCircleMore />
              </IconButton>
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton aria-label='Notifications' rounded='full'  variant='ghost' size='md'>
                    <IoMdNotificationsOutline />
                  </IconButton>
                </MenuTrigger>
                <MenuContent>
                  {notifications.length > 0 ? notifications.map((notification, index) => (
                    <MenuItem key={index} value={notification.senderUserName} >
                      <Avatar name={notification.senderUserName} src={notification.senderProfilePicture} />
                      {notification.notificationText}
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
                  <MenuItem value='profile' onClick={handleProfileClick} >
                    <LuSquareUserRound />
                    {userName}
                  </MenuItem>
                  <MenuItem value="logout" onClick={handleLogOut}>
                    <RiLogoutBoxRLine />
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
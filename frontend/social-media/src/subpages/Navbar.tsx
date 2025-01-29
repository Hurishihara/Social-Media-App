import { Card, Flex, Input, Box, Stack, IconButton, Icon } from '@chakra-ui/react'
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

const Navbar = () => {

  const navigate = useNavigate()
  const { userName, clearUser } = useUserStore()
  const { clearPosts } = usePostStore()

  const handleHomeButtonClick = () => {
    navigate('/home')
  }

  const handleLogOut = async (): Promise<void> => {
    try {
      const response = await api.post('/logout')
      navigate('/')
      clearUser()
      clearPosts()
      alert(response.data.message)
    }
    catch (error) {
      console.log(error)
    }
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
                <InputGroup startElement={<LuUserRoundSearch />}>
                  <Input placeholder='Search' borderRadius='4rem' h='2.7rem' w='17rem' fontSize='0.9rem'/>
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
              <IconButton aria-label='Notifications' rounded='full'  variant='ghost' size='md'>
                <IoMdNotificationsOutline />
              </IconButton>
              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton aria-label='Profile' rounded='full' variant='ghost' size='md'>
                    <IoPersonSharp />
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
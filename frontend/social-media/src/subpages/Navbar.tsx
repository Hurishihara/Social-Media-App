import { Card, Flex, Input, Box, Stack, IconButton, Icon } from '@chakra-ui/react'
import { TiHome } from 'react-icons/ti'
import { LuMessageCircleMore } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import { LuUserRoundSearch } from "react-icons/lu";
import { InputGroup } from '@/src/components/ui/input-group';

const Navbar = () => {
  return (
    <>
        <Card.Root height='4rem' borderRadius='none'>
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
              <IconButton aria-label='Home' rounded='full' variant='ghost' size='md'>
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
              <IconButton aria-label='Profile' rounded='full'  variant='ghost' size='md'>
                <IoPersonSharp />
              </IconButton>
            </Flex>
          </Flex>
        </Card.Root>
    </>
  )
}

export default Navbar

import { useState } from "react"
import { Box, 
  Card, 
  Flex, 
  Input, 
  Separator, 
  Stack, 
  Text,
  Link as ChakraLink,
  Field,
  defineStyle,
  Center,
  Grid,
  GridItem,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Link, useNavigate } from "react-router"
import { Button } from "./src/components/ui/button"
import { PasswordInput } from "./src/components/ui/password-input"
import { api } from "./utils/axiosConfig"
import { useAuth } from "./AuthContext"
import { useUserStore } from '../store/user.store'
import axios from "axios"
import { ErrorResponse } from "./ProfilePage"
import { Toaster, toaster } from "./src/components/ui/toaster"
import logo from './assets/logo1.png'
import logo2 from './assets/logo2.png'
import { Avatar } from "./src/components/ui/avatar"
import React from "react"

const floatingStyles = defineStyle({
  pos: "absolute",
  bg: "bg",
  px: "0.5",
  top: "-3",
  insetStart: "2",
  fontWeight: "normal",
  pointerEvents: "none",
  transition: "position",
  _peerPlaceholderShown: {
    color: "fg.muted",
    top: "2.5",
    insetStart: "3",
  },
  _peerFocusVisible: {
    color: "fg",
    top: "-3",
    insetStart: "2",
  },
})

const LoginPage = () => {
 
  
  const [ email, setEmail ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const { setUserId, setUserName, setProfilePicture, setBio } = useUserStore()
  
  const { setIsAuthenticated } = useAuth()
  const navigate = useNavigate()


  const handleLogin = async (e: any): Promise<void> => {
    e.preventDefault()

    try {
      const loginApi = api('auth')
      const response = await loginApi.post('/login', {
        email,
        password
      })
      setUserId(response.data.userId)
      setUserName(response.data.userName)
      setProfilePicture(response.data.profilePicture)
      setBio(response.data.bio)
      setIsAuthenticated(true)
      navigate('/home')

    }
    catch (err: unknown) {
      console.error('Error logging in', err)
      if (axios.isAxiosError(err)) {
        const errorResponse = err.response?.data as ErrorResponse
        toaster.create({
          title: errorResponse.name,
          description: errorResponse.message,
          type: 'error'
        })
      }
    }
  }

  const isMobile = useBreakpointValue({
        base: true,
        sm: true,
        md: true,
        lg: true,
        tablet: false,
        desktop: false,
        wide: false,
        wideDesktop: false
    });

    const createAccountMargin = useBreakpointValue({
      base: '0',
      sm: '0',
      md: '0.5rem',
      lg: '0.5rem',
      tablet: '0.5rem',
      desktop: '0.5rem',
      wide: '0.5rem',
      wideDesktop: '0.5rem'
    })

    const welcomeBackFontSize = useBreakpointValue({
      base: '2rem',
      sm: '2rem',
      md: '3rem',
      lg: '4rem',
      tablet: '3rem',
      desktop: '4rem',
      wide: '4rem',
      wideDesktop: '4rem'
    })

    const cardMinWidth = useBreakpointValue({
      base: '100vw',
      sm: '100vw',
      md: '100vw',
      lg: '100vw',
      tablet: '100vw',
      desktop: '50vw',
      wide: '50vw',
      wideDesktop: '50vw'
    })

    const cardMinHeigth = useBreakpointValue({
      base: '100vh',
      sm: '100vh',
      md: '100vh',
      lg: '100vh',
      tablet: '100vh',
      desktop: '50vh',
      wide: '50vh',
      wideDesktop: '50vh'
    })

    const cardBorderRadius = useBreakpointValue({
      base: '0',
      sm: '0',
      md: '0',
      lg: '0',
      tablet: '0',
      desktop: '0.7rem',
      wide: '0.7rem',
      wideDesktop: '0.7rem'
    })

  return (
    <>
      <Box bgGradient='to-r' gradientFrom='#111111 50%' gradientTo='#ffffff 100%'>
      <Center minW='100vw' minH='100vh' color='white'>
        <Card.Root borderRadius={cardBorderRadius} boxShadow='md' minW={cardMinWidth} minH={cardMinHeigth}>
          <Grid templateColumns='repeat(12, 1fr)'>
            {isMobile ? null : (
              <GridItem colSpan={6} p='1rem'>
                <Image src={logo2} alt='logo' h='40rem' borderRadius='0.7rem' />
              </GridItem>
            )}
            <GridItem colSpan={isMobile ? 12 : 6}>
              <Card.Body>
                <Flex direction='column' align='flex-start' justify='space-between' h='100%' gap='5rem' p={!isMobile ? '3rem' : '0'}>
                  <Stack direction='row' align='center'>
                    <Avatar size='lg' src={logo} shape='rounded' />
                    <Card.Title fontSize='2rem'> Connectify </Card.Title>
                  </Stack>
                  <Stack direction='column' gap='2rem' wrap='wrap'>
                    <Card.Title fontSize={welcomeBackFontSize} fontWeight='semibold'> Welcome back </Card.Title>
                    <Box fontSize='1.1rem' color='gray.400' fontWeight='medium'>
                      Don't have an account yet? 
                      <ChakraLink color='black' ml={createAccountMargin} fontWeight='medium' fontSize='1.1rem'>
                        <Link to='/register'> Create Account </Link>
                      </ChakraLink>
                    </Box>
                  </Stack>
                  {/* Wrap inputs inside a form */}
                  <form onSubmit={handleLogin} style={{ width: "100%" }}>
                    <Stack direction='column' gap='2rem'>
                      <Field.Root>
                        <Box pos='relative' w='full'>
                          <Input 
                            placeholder='e.g., test@gmail.com' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            borderRadius='0.7rem'
                          />
                          <Field.Label css={floatingStyles}>Email</Field.Label>
                        </Box>
                      </Field.Root>
  
                      <Field.Root>
                        <Box pos='relative' w='full'>
                          <PasswordInput 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder='Enter your password'
                            borderRadius='0.7rem' 
                          />
                          <Field.Label css={floatingStyles}>Password</Field.Label>
                        </Box>
                      </Field.Root>
                      {/* Submit Button inside the form */}
                      <Button type='submit' borderRadius='0.7rem' p='1.5rem' fontWeight='medium'>Login</Button>
                    </Stack>
                  </form>
                </Flex>
              </Card.Body>
            </GridItem>
          </Grid>
        </Card.Root>
      </Center>
      </Box>
      <Toaster />
    </>
  )
}

export default LoginPage

import { useState } from "react"
import { api } from "./utils/axiosConfig"
import { Box, Card, Center, Flex, Grid, GridItem, Image, Input, Span, Stack, Link as ChakraLink, defineStyle, Field, useBreakpointValue} from "@chakra-ui/react"
import { Button } from "./src/components/ui/button"
import { PasswordInput } from "./src/components/ui/password-input"
import axios from "axios"
import { ErrorResponse } from "./ProfilePage"
import { Toaster, toaster } from "./src/components/ui/toaster"
import { Avatar } from "./src/components/ui/avatar"
import logo from './assets/logo1.png'
import logo2 from './assets/logo2.png'
import { Link, useNavigate } from "react-router"
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


const RegisterPage = () => {
 
  
  const [ username, setUsername ] = useState<string>('')
  const [ email, setEmail ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')

  const handleRegister = async (e: any) => {
    e.preventDefault()

    try {
      const authApi = api('auth')
      await authApi.post('/register', { username, email, password })
    }
    catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorResponse = err.response?.data as ErrorResponse;
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

    const loginMargin = useBreakpointValue({
          base: '0',
          sm: '0.5rem',
          md: '0.5rem',
          lg: '0.5rem',
          tablet: '0.5rem',
          desktop: '0.5rem',
          wide: '0.5rem',
          wideDesktop: '0.5rem'
        })
    
        const getStartedFontSize = useBreakpointValue({
          base: '3rem',
          sm: '3rem',
          md: '4rem',
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
      <Box bgGradient='to-l' gradientFrom='#111111 50%' gradientTo='#ffffff 100%'>
      <Center minW='100vw' minH='100vh' color='white'>
        <Card.Root borderRadius={cardBorderRadius} boxShadow='md' minW={cardMinWidth} minH={cardMinHeigth}>
          <Grid templateColumns='repeat(12, 1fr)'>
            <GridItem colSpan={!isMobile ? 6 : 12}>
              <Card.Body>
                <Flex direction='column' align='flex-start' justify='space-between' h='100%' gap='5rem' p={!isMobile ? '3rem' : '0'}>
                  <Stack direction='row' align='center'>
                    <Avatar size='lg' src={logo} shape='rounded' />
                    <Card.Title fontSize='2rem'> Connectify </Card.Title>
                  </Stack>
                  <Stack direction='column' gap='2rem'>
                    <Card.Title fontSize={getStartedFontSize} fontWeight='semibold'> Get started </Card.Title>
                    <Box fontSize='1.1rem' color='gray.400' fontWeight='medium'>
                      Already have an account? 
                      <ChakraLink color='black' ml={loginMargin} fontWeight='medium' fontSize='1.1rem'>
                        <Link to='/login'> Login </Link>
                      </ChakraLink>
                    </Box>
                  </Stack>
                  {/* Wrap inputs inside a form */}
                  <form onSubmit={handleRegister} style={{ width: "100%" }}>
                    <Stack direction='column' gap='2rem'>
                      <Field.Root>
                        <Box pos='relative' w='full'>
                          <Input 
                            placeholder='e.g., Hurishihara123' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            borderRadius='0.7rem' 
                          />
                          <Field.Label css={floatingStyles}>Username</Field.Label>
                        </Box>
                      </Field.Root>
  
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
                      <Button type='submit' borderRadius='0.7rem' p='1.5rem' fontWeight='medium'>Create Account</Button>
                    </Stack>
                  </form>
                </Flex>
              </Card.Body>
            </GridItem>
            {!isMobile ? (
              <GridItem colSpan={6} p='1rem'>
                <Image src={logo2} alt='logo' height='45rem' borderRadius='0.7rem' />
              </GridItem>
            ) : null}
          </Grid>
        </Card.Root>
      </Center>
      </Box>
      <Toaster />
    </>
  )
}

export default RegisterPage

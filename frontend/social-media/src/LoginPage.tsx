import { useState } from "react"
import { Box, 
  Card, 
  Flex, 
  Input, 
  Separator, 
  Stack, 
  Text,
  Link as ChakraLink
} from "@chakra-ui/react"
import { Link, useNavigate } from "react-router"
import { Button } from "./src/components/ui/button"
import { PasswordInput } from "./src/components/ui/password-input"
import { api } from "./utils/axiosConfig"
import { useAuth } from "./AuthContext"
import { useUserStore } from '../store/user.store'


const LoginPage = () => {
 
  
  const [ email, setEmail ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const { setUserId, setUserName } = useUserStore()
  
  const { setIsAuthenticated } = useAuth()
  const navigate = useNavigate()


  const handleLogin = async (e: any): Promise<void> => {
    e.preventDefault()

    try {
      const response = await api.post('/login', { email, password })
      setUserId(response.data.userId)
      setUserName(response.data.userName)
      setIsAuthenticated(true)
      navigate('/home')

    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <Flex justifyContent='center' alignItems='center' h='90vh'>
    <Box w='400px'>
    <Card.Root p='1rem' gap='1.5rem'>
      <Card.Body>
      <Card.Title ml='3rem' fontSize='1.5rem'>Social Media App</Card.Title>
      </Card.Body>
      <Card.Body>
      <Stack gap='1rem' direction='column'>
        <form id='login-form' onSubmit={handleLogin} method='post'>
          <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordInput placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </form>
      </Stack>
      <Button form='login-form' type='submit' mt='0.5rem'>Sign In</Button>
      </Card.Body>
      <Separator />
      <Card.Footer justifyContent='flex-start' fontSize='1.1rem'>
        <Text>
          Don't have an account? <ChakraLink colorPalette='teal'><Link to='/register' >Sign Up</Link></ChakraLink>
        </Text>
      </Card.Footer>
    </Card.Root>
    </Box>
    </Flex>
  )
}

export default LoginPage

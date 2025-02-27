import { useState } from "react"
import { api } from "./utils/axiosConfig"
import { Box, Card, Flex, Input, Stack, } from "@chakra-ui/react"
import { Button } from "./src/components/ui/button"
import { PasswordInput } from "./src/components/ui/password-input"
import axios from "axios"
import { ErrorResponse } from "./ProfilePage"
import { Toaster, toaster } from "./src/components/ui/toaster"


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

  return (
    <>
      <Flex justifyContent='center' alignItems='center' h='90vh'>
        <Box w='400px'>
          <Card.Root p='1rem' gap='1.3rem'>
            <Card.Body>
              <Card.Title ml='3rem' fontSize='1.5rem'>Social Media App</Card.Title>
            </Card.Body>
            <Card.Body>
              <Stack gap='1rem' direction='column'>
                <form id='register-form' onSubmit={handleRegister} method="post">
                  <Input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                  <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                  <PasswordInput placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </form>
                <Button type='submit' form='register-form' >Sign Up</Button>
              </Stack>
            </Card.Body>
          </Card.Root>
        </Box>
      </Flex>
      <Toaster />
    </>
  )
}

export default RegisterPage

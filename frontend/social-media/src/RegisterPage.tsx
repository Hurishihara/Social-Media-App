import { Box, Card, Flex, Input, Link, Separator, Stack, Text } from "@chakra-ui/react"
import { Button } from "./src/components/ui/button"
import { PasswordInput } from "./src/components/ui/password-input"


const RegisterPage = () => {
 
  return (
    <Flex justifyContent='center' alignItems='center' h='90vh'>
    <Box w='400px'>
    <Card.Root p='1rem' gap='1.3rem'>
      <Card.Body>
      <Card.Title ml='3rem' fontSize='1.5rem'>Social Media App</Card.Title>
      </Card.Body>
      <Card.Body>
      <Stack gap='1rem' direction='column'>
        <Input placeholder='Name' />
        <Input placeholder='Username' />
        <Input placeholder='Email' />
        <PasswordInput placeholder='Password' />
        <Button>Sign Up</Button>
      </Stack>
      </Card.Body>
    </Card.Root>
    </Box>
    </Flex>
  )
}

export default RegisterPage

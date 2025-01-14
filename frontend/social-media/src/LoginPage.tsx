import { Box, Card, Flex, Input, Link, Separator, Stack, Text } from "@chakra-ui/react"
import { Button } from "./src/components/ui/button"
import { PasswordInput } from "./src/components/ui/password-input"


const LoginPage = () => {
 
  return (
    <Flex justifyContent='center' alignItems='center' h='90vh'>
    <Box w='400px'>
    <Card.Root p='1rem' gap='1.5rem'>
      <Card.Body>
      <Card.Title ml='2.5rem' fontSize='1.5rem'>Social Media App</Card.Title>
      </Card.Body>
      <Card.Body>
      <Stack gap='1rem' direction='column'>
        <Input placeholder='Email' />
        <PasswordInput placeholder='Password' />
        <Button>Login</Button>
      </Stack>
      </Card.Body>
      <Separator />
      <Card.Footer justifyContent='flex-start' fontSize='1.1rem'>
        <Text>
          Don't have an account? <Link colorPalette='teal' href="https://google.com.ph">Sign up</Link>
        </Text>
      </Card.Footer>
    </Card.Root>
    </Box>
    </Flex>
  )
}

export default LoginPage

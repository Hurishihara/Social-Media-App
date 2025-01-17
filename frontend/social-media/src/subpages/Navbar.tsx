import { Card, Flex, Input, Box, Stack } from '@chakra-ui/react'

const Navbar = () => {
  return (
    <>
        <Card.Root height='4rem' borderRadius='none'>
          <Flex alignItems='center' h='100%' direction='row'>
            <Flex gap='3' alignItems='center'>
              <Card.Title ml='1rem' fontSize='1.3rem'>Social Media App</Card.Title>
              <Box>
                <Input placeholder='Search' borderRadius='4rem' h='2.7rem' w='17rem' />
              </Box>
            </Flex>
          </Flex>
        </Card.Root>
    </>
  )
}

export default Navbar

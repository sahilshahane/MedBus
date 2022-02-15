import { Flex, Box, Text, Heading } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'

const Header = () => {
  return (
    <Flex w='100%' bgColor='black' color='white' p={3} align='center'>
      <Flex align='center' gap={3}>
        <Image
          borderRadius='full'
          boxSize='40px'
          src='https://img.icons8.com/fluency/48/000000/ambulance.png'
          alt='MedBus Icon'
        />

        <Heading fontSize='2xl'>Med Bus</Heading>
      </Flex>
    </Flex>
  )
}

export default Header

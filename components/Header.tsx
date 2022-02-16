import { Flex, Box, Text, Heading, HStack } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'
import { Button } from '@chakra-ui/button'
import { NextPage } from 'next'
interface HeaderProps {
  options?: { value: string; onClick: () => void }[]
}

const Header: NextPage<HeaderProps> = ({ options }) => {
  return (
    <Flex
      w='100%'
      bgColor='black'
      color='white'
      p={3}
      align='center'
      justifyContent='space-between'
    >
      <Flex align='center' gap={3}>
        <Image
          borderRadius='full'
          boxSize='40px'
          src='https://img.icons8.com/fluency/48/000000/ambulance.png'
          alt='MedBus Icon'
        />

        <Heading fontSize='2xl'>Med Bus</Heading>
      </Flex>
      {options && (
        <Flex>
          <HStack>
            {options.map(({ value, onClick }) => (
              <Button
                key={value}
                colorScheme='yellow'
                variant='outline'
                onClick={onClick}
              >
                <Text>{value}</Text>
              </Button>
            ))}
          </HStack>
        </Flex>
      )}
    </Flex>
  )
}

export default Header

import { Flex, Box, Text, Heading, HStack } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/image'
import { Button } from '@chakra-ui/button'
import { NextPage } from 'next'
import type { FC } from 'react'
import Link from 'next/link'
import { BsArrowUpRightCircle } from 'react-icons/bs'
interface HeaderProps {
  options?: { text: string; onClick: () => void }[]
}

const HospitalBtn: FC = () => {
  return (
    <Button
      rightIcon={<BsArrowUpRightCircle size='1.1rem' />}
      colorScheme='red'
      variant='outline'
    >
      <Link href='/hospital/admin'>Hospital</Link>
    </Button>
  )
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
      <Flex>
        <HStack>
          <HospitalBtn />
          {options &&
            options.map(({ text, onClick }) => (
              <Button
                key={text}
                colorScheme='yellow'
                variant='outline'
                onClick={onClick}
              >
                <Text>{text}</Text>
              </Button>
            ))}
        </HStack>
      </Flex>
    </Flex>
  )
}

export default Header

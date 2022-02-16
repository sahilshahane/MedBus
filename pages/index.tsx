import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '@components/Header'
import { Flex } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { BiSearchAlt as SearchIcon } from 'react-icons/bi'

const FindBtn = () => {
  return (
    <Button
      variant='outline'
      colorScheme='red'
      rightIcon={<SearchIcon size='1.5em' />}
    >
      Find Nearest Hospital
    </Button>
  )
}

const LandingPage = () => {
  return (
    <>
      <Flex width='100%' height='100%' justifyContent='center' align='center'>
        <FindBtn />
      </Flex>
    </>
  )
}

const Home: NextPage = () => {
  return (
    <Flex>
      <Head>
        <title>MedBus</title>
        <meta name='description' content='A ambulance system app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Flex w='100vw' h='100vh' gap={1} flexDir='column' flexWrap='nowrap'>
        <Header />

        <LandingPage />
      </Flex>
    </Flex>
  )
}

export default Home

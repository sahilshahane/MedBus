import { Flex, Text, Heading } from '@chakra-ui/layout'
import { NextPage } from 'next'

interface LoadingProp {
  isLoading: boolean
}

const Loading: NextPage<LoadingProp> = ({ isLoading, children }) => {
  if (isLoading)
    return (
      <Flex
        justifyContent='center'
        alignItems='center'
        position='absolute'
        w='100vw'
        h='100vh'
        overflow='hidden'
      >
        <Heading as='h2' size='2xl'>
          Loading...
        </Heading>
      </Flex>
    )

  return <Flex>{children}</Flex>
}

export default Loading

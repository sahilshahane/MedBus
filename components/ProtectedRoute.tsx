import type { NextPage } from 'next'
import useAuth from '@hooks/useAuth'
import { Flex, Box } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import LazyLoading from '@components/LazyLoading'
import Header from '@components/Header'
import { useRouter } from 'next/router'

const ProtectedRoute: NextPage = ({ children }) => {
  const auth = useAuth()
  const router = useRouter()
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    if (auth.user) {
      setLoading(false)
    } else {
      router.push('/hospital/authenticate')
    }
  }, [auth.user])

  return (
    <Box>
      <LazyLoading isLoading={isLoading}>
        <Flex w='100vw' h='100vh' gap={1} flexDir='column' flexWrap='nowrap'>
          <Header
            options={[
              {
                value: 'Sign out',
                onClick: () => auth.signout(),
              },
            ]}
          />
          {children}
        </Flex>
      </LazyLoading>
    </Box>
  )
}

export default ProtectedRoute

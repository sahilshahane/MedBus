import { NextPage } from 'next'
import ProtectedRoute from '@components/ProtectedRoute'
import { Flex } from '@chakra-ui/layout'

const Dashboard: NextPage = () => {
  return (
    <>
      <ProtectedRoute>
        <Flex>Dashboard</Flex>
      </ProtectedRoute>
    </>
  )
}

export default Dashboard

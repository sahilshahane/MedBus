import { NextPage } from 'next'
import { Flex } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { HRL_Response } from 'pages/api/admin/get_request_list'

const useRequestList = () => {
  const [list, setList] = useState<HRL_Response>([])

  useEffect(() => {}, [])
}

const Dashboard: NextPage = () => {
  return (
    <>
      <Flex>Dashboard</Flex>
    </>
  )
}

export default Dashboard

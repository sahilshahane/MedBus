import { NextPage } from 'next'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { HRL_Entry, HRL_Response } from 'pages/api/admin/get_request_list'
import { VStack, Box, Flex, Divider, Text } from '@chakra-ui/layout'
import axios from 'axios'
import { Button } from '@chakra-ui/button'
import { approve_req_res } from 'pages/api/admin/approve_request'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs'

const useRequest = (delay = 1000, data: any = {}) => {
  const [response, setResponse] = useState<HRL_Response>()
  const [failed, setFailed] = useState(false)
  const [stopRequests, setStopRequests] = useState(false)
  const [reqs_made, setReqsMade] = useState(0)

  const request = () =>
    axios
      .post<HRL_Response>('/api/admin/get_request_list', data)
      .then(({ data }) => {
        setFailed(false)
        setResponse(data)
      })
      .catch(() => {
        setFailed(true)
      })
      .finally(() => setReqsMade((prev) => prev + 1))

  useEffect(() => {
    request()
  }, [])

  useEffect(() => {
    if (stopRequests || reqs_made === 0) return

    setTimeout(() => request(), delay)
  }, [reqs_made])

  const STOP = () => setStopRequests(true)
  return [response, failed, request, STOP] as const
}

const useRequestList = (delay: number = 1000) => {
  const [pendingList, setPendingList] = useState<HRL_Response>([])
  const [approvedList, setApprovedList] = useState<HRL_Response>([])
  const [response] = useRequest(delay)

  useEffect(() => {
    setPendingList(
      response?.filter((entry) => entry.status === 'pending') || []
    )

    setApprovedList(
      response?.filter((entry) => entry.status !== 'pending') || []
    )
  }, [response])

  return [pendingList, approvedList] as const
}

const ApprovedList: FC<{ list: HRL_Response }> = (props) => {
  const { list } = props
  return (
    <VStack>
      {list.map((HRL_Entry, idx) => {
        const {
          req_id,
          driver_id,
          location_lat,
          location_lng,
          status,
          approxDistance,
          dev_id,
        } = HRL_Entry

        return (
          <Flex
            key={idx}
            border='2px'
            p='1.5'
            flexFlow='column nowrap'
            alignItems='center'
            justifyContent='center'
            gap='5'
          >
            <Box>
              Request ID : {req_id} <br />
              Driver ID : {driver_id} <br />
              Location : {location_lat}, {location_lng} <br />
              Status : {status} <br />
              Dev ID : {dev_id} <br />
              Approx Distance : {(approxDistance / 1000).toFixed(2)} Kms
            </Box>
          </Flex>
        )
      })}
    </VStack>
  )
}

const approveRequest = (
  { req_id, dev_id }: HRL_Entry,
  setMessage: Dispatch<SetStateAction<any>>
) => {
  axios
    .post<approve_req_res>('/api/admin/approve_request', {
      req_id,
      dev_id,
    })
    .then(({ data }) => {
      if (data.message) {
        setMessage(data.message)
      }

      setTimeout(() => setMessage(''), 3000)
    })
    .catch((error) => {
      console.error('Something went wrong while approving request', error)
    })
}

const PendingList: FC<{ list: HRL_Response }> = (props) => {
  const { list } = props

  const [message, setMessage] = useState<string>()

  return (
    <>
      {message && (
        <>
          <Text>Server : {message}</Text>
          <br />
        </>
      )}
      <VStack>
        {list.map((HRL_Entry, idx) => {
          const {
            req_id,
            driver_id,
            location_lat,
            location_lng,
            status,
            approxDistance,
            dev_id,
          } = HRL_Entry

          return (
            <Flex
              key={idx}
              border='2px'
              p='1.5'
              flexFlow='column nowrap'
              alignItems='center'
              justifyContent='center'
              gap='5'
            >
              <Box>
                Request ID : {req_id} <br />
                Driver ID : {driver_id} <br />
                Location : {location_lat}, {location_lng} <br />
                Status : {status} <br />
                Dev ID : {dev_id} <br />
                Approx Distance : {(approxDistance / 1000).toFixed(2)} Kms
              </Box>
              <Button
                colorScheme={'red'}
                onClick={() => approveRequest(HRL_Entry, setMessage)}
              >
                Approve
              </Button>
            </Flex>
          )
        })}
      </VStack>
    </>
  )
}

const Dashboard: NextPage = () => {
  const [pendingList, approvedList] = useRequestList(2000)

  return (
    <>
      <VStack>
        <Text fontSize={'3xl'}>Dashboard</Text>
        <Divider />
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList>
            <Tab>Pending List</Tab>
            <Tab>Approved List</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <PendingList list={pendingList} />
            </TabPanel>
            <TabPanel>
              <ApprovedList list={approvedList} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </>
  )
}

export default Dashboard

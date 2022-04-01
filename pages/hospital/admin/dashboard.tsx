import { NextPage } from 'next'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { HRL_Entry, HRL_Response } from 'pages/api/admin/get_request_list'
import { VStack, Box, Flex } from '@chakra-ui/layout'

import axios from 'axios'
import { Button } from '@chakra-ui/button'
import { approve_req_res } from 'pages/api/admin/approve_request'

const request = (
  setList: Dispatch<SetStateAction<HRL_Response>>,
  callback = () => {},
  last_req_id = -1
) => {
  axios
    .post<HRL_Response>('/api/admin/get_request_list', {
      last_req_id,
    })
    .then(({ data: list }) => {
      if (list.length > 0) setList((prev) => [...list, ...prev])
    })
    .catch((error) => console.error('(request list fetch)', error))
    .finally(() => callback())
}

const useRequestList = (delay: number = 1000) => {
  const [list, setList] = useState<HRL_Response>([])
  const [reqs_made, setReqsMade] = useState(0)

  useEffect(() => {
    console.log('Requests Made :', reqs_made)
  }, [reqs_made])

  const refresh = () => {
    let last_req_id = -1

    // GET ONLY NEW PENDING REQUESTS
    // if (list.length > 0) last_req_id = list[0].req_id

    request(setList, () => setReqsMade((prev) => prev + 1), last_req_id)
  }

  return [list, refresh] as const
}

const approveRequest = ({ req_id, dev_id }: HRL_Entry) => {
  axios
    .post<approve_req_res>('/api/admin/approve_request', {
      req_id,
      dev_id,
    })
    .catch((error) => {
      console.error('Something went wrong while approving request', error)
    })
}

const Dashboard: NextPage = () => {
  const [list, refresh] = useRequestList(2000)

  return (
    <>
      <Flex>Dashboard</Flex>
      <Button onClick={refresh} color='black' variant='outline'>
        Refresh
      </Button>
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
              flexFlow='row wrap'
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

              <Button color='red' onClick={() => approveRequest(HRL_Entry)}>
                Approve
              </Button>
            </Flex>
          )
        })}
      </VStack>
    </>
  )
}

export default Dashboard

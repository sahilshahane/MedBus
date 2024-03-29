import { Box } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { Tag } from '@chakra-ui/tag'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { update_loc_res } from 'pages/api/admin/update-location'
import { FC, useEffect, useState } from 'react'

const useRequest = (delay = 1000) => {
  const [response, setResponse] = useState<update_loc_res>()
  const [failed, setFailed] = useState(false)
  const [stopRequests, setStopRequests] = useState(false)
  const [reqs_made, setReqsMade] = useState(0)

  const request = () =>
    axios
      .post<update_loc_res>('/api/admin/update-location')
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
    if (response?.req_id) setStopRequests(true)
  }, [response])

  useEffect(() => {
    if (stopRequests || reqs_made === 0) return

    setTimeout(() => request(), delay)
  }, [reqs_made])

  const STOP = () => setStopRequests(true)
  return [response, failed] as const
}

const AvailablityTag: FC<{ res?: update_loc_res }> = ({ res }) => {
  const getScheme = () => {
    if (!res) return 'orange'
    if (res.req_id) return 'green'
    return 'red'
  }

  const getStatus = () => {
    if (!res) return 'Checking'
    if (res.req_id) return 'Available'
    return 'Not Available'
  }

  return (
    <Tag size='lg' colorScheme={getScheme()} variant='solid'>
      {getStatus()}
    </Tag>
  )
}

const UpdateLocation: NextPage = () => {
  const [res, requestFailed] = useRequest(1000)

  const router = useRouter()
  const START_UPDATING = () => router.push('/update-location/' + res?.req_id)

  return (
    <>
      <Box>
        <AvailablityTag res={res} />
        <br />
        <Button onClick={START_UPDATING}>START RIDE</Button>
        <br />
      </Box>
    </>
  )
}

export default UpdateLocation

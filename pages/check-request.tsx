import { REQUEST_STATUSES } from '@typedef/authenticate'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { REQUEST_STATUS_RESPONSE } from 'pages/api/request_status'
import { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/layout'

type CUSTOM_REQUEST_STATUS = REQUEST_STATUSES | 'invalid' | 'checking'

// @ts-expect-error
interface RequestResponse extends REQUEST_STATUS_RESPONSE {
  status?: CUSTOM_REQUEST_STATUS
}

const useIntervalFetch = (timeout: number) => {
  const router = useRouter()

  const [req_data, setReqData] = useState<RequestResponse>({
    status: 'checking',
  })
  const [intervalID, setIntervalID] = useState<any>()

  useEffect(() => {
    let request_made = 0

    const URL =
      location.href.substring(0, location.href.indexOf('/', 9)) +
      '/api/request_status'

    const req = (callback: any) => {
      axios
        .post<RequestResponse>(URL)
        .then(({ data }) => setReqData(data))
        .catch((err) => {
          console.error(
            'Something went wrong while checking request status',
            err
          )
        })
        .finally(() => {
          console.log('Request Made ', ++request_made)
          callback && callback()
        })
    }

    req(() => {
      let tempID = setInterval(req, timeout)
      setIntervalID(tempID)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const StopRequestUpdates = () => clearInterval(intervalID)

  useEffect(() => {
    if (req_data.status === 'hospitalized') StopRequestUpdates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [req_data])

  return [req_data] as const
}

const CheckRequest: NextPage = () => {
  const [data] = useIntervalFetch(5000)
  const { status } = data

  return (
    <>
      {status === 'checking' && <Box>Please Wait...</Box>}
      {status === 'invalid' && <Box>No requests has been made</Box>}
      {status === 'pending' && <Box>Request is sent to near by hospitals</Box>}
      {status === 'approved' && (
        <Box>Request by been approved by ---- Hospital [TODO]</Box>
      )}

      {status === 'arriving' && (
        <Box>Ambulance has been dispatched, Make sure patient is alive</Box>
      )}

      {status === 'returning' && (
        <Box>Patient has been picked up by ambulance</Box>
      )}

      {status === 'hospitalized' && <Box>Patient has been hospitalized</Box>}
    </>
  )
}

export default CheckRequest

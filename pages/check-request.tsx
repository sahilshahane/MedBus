import { REQUEST_STATUSES } from '@typedef/authenticate'
import axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { REQUEST_STATUS_RESPONSE } from 'pages/api/check-request-status'
import { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/layout'
import Map from '@components/MapVanilla'
import useHospitalDetails from '@hooks/useHospitalDetails'
import useRequestDetails from '@hooks/useRequestDetails'

type CUSTOM_REQUEST_STATUS = REQUEST_STATUSES | 'invalid' | 'checking'

// @ts-expect-error
interface RequestResponse extends REQUEST_STATUS_RESPONSE {
  status?: CUSTOM_REQUEST_STATUS
}

const useIntervalFetch = (timeout: number) => {
  const [hospitalDetails] = useHospitalDetails()

  const [req_data, setReqData] = useState<RequestResponse>({
    status: 'checking',
  })
  const [intervalID, setIntervalID] = useState<any>()

  useEffect(() => {
    let request_made = 0

    const req = (callback: any) => {
      axios
        .post<RequestResponse>('/api/check-request-status')
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
  const [
    [hospitalDetails],
    [driverDetails],
    [patientDetails],
    [statusDetails],
  ] = useRequestDetails()

  const status = statusDetails?.status

  if (!status) return <Box>Please Wait...</Box>
  if (status === 'hospitalized') return <Box>Patient has been hospitalized</Box>

  return (
    <Box>
      Status : {status} <br />
      Patient Coords - {JSON.stringify(patientDetails?.position, null, 2)}
      <br />
      Hospital Name - {hospitalDetails?.name} <br />
      Hospital Coords - {JSON.stringify(hospitalDetails?.position, null, 2)}
      <br />
      Driver Coords - {JSON.stringify(driverDetails?.position, null, 2)}
      <br />
      {hospitalDetails && patientDetails && driverDetails && (
        <Map
          driver_coords={driverDetails?.position}
          hospital_coords={hospitalDetails?.position}
          user_coords={patientDetails?.position}
        />
      )}
    </Box>
  )
}

export default CheckRequest

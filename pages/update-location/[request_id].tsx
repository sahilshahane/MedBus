import { Box, Flex } from '@chakra-ui/layout'
import useDynamicLocation from '@hooks/useDynamicLocation'
import useStaticLocation, {
  Coordinates,
  PermissionType,
} from '@hooks/useStaticLocation'
import { DRIVER_LOCATION_UPDATE_INTERVAL } from '@libs/client_constants'
import axios from 'axios'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { update_loc_ResData } from 'pages/api/admin/update-location/[request_id]'
import { useEffect, useRef, useState } from 'react'
import { Select } from '@chakra-ui/select'
import { Button } from '@chakra-ui/button'
import { REQUEST_STATUSES } from '@typedef/authenticate'

const Request = (
  coords: Coordinates,
  request_id: string,
  callback = () => {}
) => {
  return axios
    .post<update_loc_ResData>('/api/admin/update-location/' + request_id, {
      loc_lat: coords.lat,
      loc_lng: coords.lng,
    })
    .then(({ data }) => console.log('server :', data.message))
    .finally(callback)
}

const useUpdateLocation = (delay: number = 3000) => {
  const [coords, permission, stopLocUpdates] = useDynamicLocation(delay)
  const [previousCoords, setPreviousCoords] = useState(coords)
  const [req_made, setReq_made] = useState(0)
  const { query } = useRouter()
  const request_id = query.request_id as string | undefined

  useEffect(() => {
    if (permission !== PermissionType.GRANTED || !request_id) return

    if (
      coords.lat === previousCoords.lat &&
      coords.lng === previousCoords.lng
    ) {
      // console.log('same coords')
      return
    }

    setPreviousCoords(coords)

    Request(coords, request_id, () => {
      setReq_made(req_made + 1)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, permission, request_id])

  return [coords, permission, stopLocUpdates, req_made] as const
}

const useRequest = () => {
  const [isFailed, setIsFailed] = useState(false)
  const request = (status: REQUEST_STATUSES) => {
    setIsFailed(false)
    axios
      .post('/api/admin/update-request-status', {
        status,
      })
      .then(() => console.log('Updated Status'))
      .catch(() => setIsFailed(true))
  }

  return [request, isFailed] as const
}

const UpdateDriverLocation: NextPage = () => {
  const [coords, locationPermission, stopUpdates, req_made] = useUpdateLocation(
    DRIVER_LOCATION_UPDATE_INTERVAL
  )

  const [changeStatus, statusChangeFailed] = useRequest()

  const handleStatusChange = () => {
    if (!statusRef || !statusRef.current?.value) {
      console.log('Provide a valid value for status')
      return
    }

    changeStatus(statusRef.current.value as any)
  }

  const statusRef = useRef<HTMLSelectElement>(null)

  return (
    <>
      {locationPermission === PermissionType.ASKING && (
        <Box>Please Press Allow if location dialog box appears</Box>
      )}

      {locationPermission === PermissionType.DENIED && (
        <Box>Please Grant Location Permission (try reloading page)</Box>
      )}

      {locationPermission === PermissionType.GRANTED && (
        <Box>
          Updating Location...
          <br />
          Coords - Lat : {coords.lat} Lng : {coords.lng}
          <br />
          Total Requests Made : {req_made}
          <br />
          <Box>
            <Flex gap={5} flexFlow={'row nowrap'}>
              <Select ref={statusRef} placeholder='Select Status' size={'md'}>
                <option value='arriving'>Arriving</option>
                <option value='returning'>Returning</option>
                <option value='hospitalized' onClick={() => stopUpdates()}>
                  Hospitalized
                </option>
              </Select>

              <Button onClick={handleStatusChange}>Change Status</Button>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  )
}

export default UpdateDriverLocation

import { useState, useEffect } from 'react'
import { Coordinates, PermissionType } from '@hooks/useStaticLocation'
import axios from 'axios'
import {
  NearestHospitalResponseData,
  NearestHospitalRequestData,
  GenerateRequestResponse,
} from '@typedef/googleMaps'
import useStaticLocation from '@hooks/useStaticLocation'
import { REQUEST_STATUS_RESPONSE } from 'pages/api/check-request-status'

export enum REQUEST_STATUS {
  INITIATING,
  WAITING,
  FAILED,
  SUCCESS,
}

const useInitiateRequest = () => {
  const [coords, permission] = useStaticLocation()
  const [requestMade, setRequestMade] = useState(false)
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.INITIATING)

  useEffect(() => {
    ;(async () => {
      if (requestMade || permission !== PermissionType.GRANTED) return
      setRequestMade(true)

      setRequestStatus(REQUEST_STATUS.WAITING)
      axios
        .post<GenerateRequestResponse>('/api/generate-requests', {
          loc_lat: coords.lat,
          loc_lng: coords.lng,
        })
        .then(() => setRequestStatus(REQUEST_STATUS.SUCCESS))
        .catch((error) => {
          setRequestMade(false)
          setRequestStatus(REQUEST_STATUS.FAILED)
          console.error('Failed to initiate request', error)
        })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestMade, permission])

  return [requestStatus, permission] as const
}

export default useInitiateRequest

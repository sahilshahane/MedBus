import { useState, useEffect } from 'react'
import { Coordinates, PermissionType } from '@hooks/useStaticLocation'
import axios from 'axios'
import {
  NearestHospitalResponseData,
  NearestHospitalRequestData,
  GenerateRequestResponse,
} from '@typedef/googleMaps'
import useStaticLocation from '@hooks/useStaticLocation'

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
  const [REQUEST_RESPONSE, setREQUEST_RESPONSE] =
    useState<GenerateRequestResponse>({
      REQUEST_ID: '',
    })
  useEffect(() => {
    if (requestMade || permission !== PermissionType.GRANTED) return

    setRequestMade(true)
    setRequestStatus(REQUEST_STATUS.WAITING)
    axios
      .post<GenerateRequestResponse>('/api/generate-requests', {
        loc_lat: coords.lat,
        loc_lng: coords.lng,
      })
      .then(({ data }) => {
        if (typeof Storage === 'undefined') {
          alert('Sorry no Web Storage API Support')
          return
        }

        window.localStorage.setItem('REQUEST_ID', data.REQUEST_ID)

        setREQUEST_RESPONSE(data)
        setRequestStatus(REQUEST_STATUS.SUCCESS)
      })
      .catch((error) => {
        setRequestMade(false)
        setRequestStatus(REQUEST_STATUS.FAILED)
        console.error('Failed to initiate request', error)
      })
  }, [coords, requestMade, permission])

  return [requestStatus, REQUEST_RESPONSE] as const
}

export default useInitiateRequest

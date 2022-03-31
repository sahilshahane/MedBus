import { useState, useEffect } from 'react'
import { Coordinates, PermissionType } from '@hooks/useStaticLocation'
import axios from 'axios'
import {
  NearestHospitalResponseData,
  NearestHospitalRequestData,
  GenerateRequestResponse,
} from '@typedef/googleMaps'
import useStaticLocation from '@hooks/useStaticLocation'
import { REQUEST_STATUS_RESPONSE } from 'pages/api/request_status'

export enum REQUEST_STATUS {
  INITIATING,
  WAITING,
  FAILED,
  SUCCESS,
  CHECKING_PREVIOUS_REQUEST,
  PREVIOUS_REQUEST_EXISTS,
}

// TODO
const isRequestValid = async (REQUEST_ID: string) => {
  const is_valid = await axios
    .post<REQUEST_STATUS_RESPONSE>('/api/request_status', {
      REQUEST_ID,
    })
    .then(({ data }) => {
      console.log(data.status)

      if (data.status === 'hospitalized') return false

      return true
    })
    .catch(() => false)

  return is_valid
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
    ;(async () => {
      if (requestMade || permission !== PermissionType.GRANTED) return

      setRequestStatus(REQUEST_STATUS.CHECKING_PREVIOUS_REQUEST)

      const REQ_ID = window.localStorage.getItem('REQUEST_ID')
      // TODO
      if (REQ_ID != null && (await isRequestValid(REQ_ID))) {
        setREQUEST_RESPONSE({
          REQUEST_ID: REQ_ID,
        })
        setRequestStatus(REQUEST_STATUS.PREVIOUS_REQUEST_EXISTS)
        return
      }

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
    })()
  }, [coords, requestMade, permission])

  return [requestStatus, REQUEST_RESPONSE] as const
}

export default useInitiateRequest

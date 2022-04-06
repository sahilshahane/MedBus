import { STATUS_DETAILS_RESPONSE } from 'pages/api/get-status-details'
import axios from 'axios'
import { HOSPITAL_DETAILS_RESPONSE } from 'pages/api/get-hospital-details'
import { PATIENT_DETAILS_RESPONSE } from 'pages/api/get-patient-details'
import { DRIVER_DETAILS_RESPONSE } from 'pages/api/get-driver-details'
import useRequest from 'ahooks/lib/useRequest'
import {
  CHECK_REQUEST_INTERVAL,
  DRIVER_LOCATION_UPDATE_INTERVAL,
  RIDING_DETAILS_CHECK_INTERVAL,
} from '@libs/client_constants'
import { useEffect, useState } from 'react'
import { REQUEST_STATUSES } from '@typedef/authenticate'
import { RIDE_DETAILS_RESPONSE } from 'pages/api/get-ride-details'

export interface STATUS_DETAILS_RESPONSE_EXTENDED {
  status: REQUEST_STATUSES | 'invalid' | 'checking'
}

const reqStatusDetails = () =>
  axios.post<STATUS_DETAILS_RESPONSE_EXTENDED>('/api/get-status-details')

const reqHospitalDetails = () =>
  axios.post<HOSPITAL_DETAILS_RESPONSE>('/api/get-hospital-details')

const reqPatientDetails = () =>
  axios.post<PATIENT_DETAILS_RESPONSE>('/api/get-patient-details')

const reqDriverDetails = () =>
  axios.post<DRIVER_DETAILS_RESPONSE>('/api/get-driver-details')

const reqRideDetails = () =>
  axios.post<RIDE_DETAILS_RESPONSE>('/api/get-ride-details')

export const useStatusDetails = () => {
  const [details, setDetails] = useState<STATUS_DETAILS_RESPONSE_EXTENDED>({
    status: 'checking',
  })

  const req = useRequest(reqStatusDetails, {
    pollingInterval: CHECK_REQUEST_INTERVAL,
  })

  const { data, loading } = req

  useEffect(() => {
    if (!loading && data && data?.data.status !== details.status)
      setDetails(data.data)
  }, [data])

  return [details, req] as const
}

export const useHospitalDetails = () => {
  const [details, setDetails] = useState<HOSPITAL_DETAILS_RESPONSE>({
    name: '',
    position: {
      lat: 0,
      lng: 0,
    },
  })

  const req = useRequest(reqHospitalDetails, {
    pollingInterval: CHECK_REQUEST_INTERVAL,
  })

  const { data, loading } = req

  useEffect(() => {
    if (!loading && data && data?.data) {
      setDetails(data.data)
      req.cancel()
    }
  }, [data])

  return [details, req] as const
}
export const usePatientDetails = () => {
  const [details, setDetails] = useState<PATIENT_DETAILS_RESPONSE>({
    position: {
      lat: 0,
      lng: 0,
    },
  })

  const req = useRequest(reqPatientDetails)

  const { data, loading } = req

  useEffect(() => {
    if (!loading && data && data?.data) {
      setDetails(data.data)
    }
  }, [data])

  return [details, req] as const
}

export const useDriverDetails = () => {
  const [details, setDetails] = useState<DRIVER_DETAILS_RESPONSE>({
    position: {
      lat: 0,
      lng: 0,
    },
  })

  const req = useRequest(reqDriverDetails, {
    pollingInterval: DRIVER_LOCATION_UPDATE_INTERVAL,
  })

  const { data, loading } = req

  useEffect(() => {
    if (!loading && data && data?.data) {
      if (
        data.data.position.lat !== details.position.lat &&
        data.data.position.lng !== details.position.lng
      )
        setDetails(data.data)
    }
  }, [data])

  return [details, req] as const
}

export const useRideDetails = () => {
  const [details, setDetails] = useState<RIDE_DETAILS_RESPONSE>({
    time: {
      text: '[development time]',
      value: 0,
    },
    distance: {
      text: '[development distance]',
      value: 0,
    },
  })

  const req = useRequest(reqRideDetails, {
    pollingInterval: RIDING_DETAILS_CHECK_INTERVAL,
  })

  const { data } = req

  useEffect(() => {
    const res = data?.data

    if (res) {
      if (res.distance.value === 0 || res.time.value === 0) {
        req.cancel()
      }

      setDetails(res)
    }
  }, [data])

  return [details, req] as const
}

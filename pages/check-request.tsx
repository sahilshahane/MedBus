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
import { DRIVER_LOCATION_UPDATE_INTERVAL } from '@libs/client_constants'

const useGetDetails = () => {
  const [
    [hospitalDetails],
    [driverDetails, refreshDriverDetails],
    [patientDetails],
    [statusDetails, refreshStatusDetails],
  ] = useRequestDetails()

  useEffect(() => {
    setInterval(() => {
      // console.log(driverDetails)
      refreshStatusDetails()
      refreshDriverDetails()
    }, DRIVER_LOCATION_UPDATE_INTERVAL)
  }, [])

  return [
    [hospitalDetails],
    [driverDetails, refreshDriverDetails],
    [patientDetails],
    [statusDetails, refreshStatusDetails],
  ] as const
}

const CheckRequest: NextPage = () => {
  const [
    [hospitalDetails],
    [driverDetails],
    [patientDetails],
    [statusDetails],
  ] = useGetDetails()

  const status = statusDetails?.status

  if (!status) return <Box>Please Wait...</Box>
  if (status === 'hospitalized') return <Box>Patient has been hospitalized</Box>

  const getLinePath = () => {
    if (status === 'returning') return 'hospital-driver'

    return 'driver-patient'
  }

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
          line_between={getLinePath()}
          driver_coords={driverDetails?.position}
          hospital_coords={hospitalDetails?.position}
          user_coords={patientDetails?.position}
        />
      )}
    </Box>
  )
}

export default CheckRequest

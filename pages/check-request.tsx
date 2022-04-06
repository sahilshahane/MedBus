import type { NextPage } from 'next'
import { useEffect } from 'react'
import { Box } from '@chakra-ui/layout'
import Map from '@components/MapVanilla'
import {
  STATUS_DETAILS_RESPONSE_EXTENDED,
  useDriverDetails,
  useHospitalDetails,
  usePatientDetails,
  useRideDetails,
  useStatusDetails,
} from '@hooks/useRequestDetails'
import { HOSPITAL_DETAILS_RESPONSE } from './api/get-hospital-details'
import { PATIENT_DETAILS_RESPONSE } from './api/get-patient-details'
import { DRIVER_DETAILS_RESPONSE } from './api/get-driver-details'

const isMapLoading = (
  status: STATUS_DETAILS_RESPONSE_EXTENDED,
  hospital: HOSPITAL_DETAILS_RESPONSE,
  driver: DRIVER_DETAILS_RESPONSE,
  patient: PATIENT_DETAILS_RESPONSE
) => {
  if (status.status === 'pending' || status.status === 'checking') return true
  if (hospital.position.lat === 0 && hospital.position.lng === 0) return true
  if (driver.position.lat === 0 && driver.position.lng === 0) return true
  if (patient.position.lat === 0 && patient.position.lng === 0) return true

  return false
}

const CheckRequest: NextPage = () => {
  const [status, statusRequest] = useStatusDetails()
  const [hospital, hospitalRequest] = useHospitalDetails()
  const [patient, patientRequest] = usePatientDetails()
  const [driver, driverRequest] = useDriverDetails()
  const [ride, rideRequest] = useRideDetails()

  const getLinePath = () => {
    if (status?.status === 'returning') return 'hospital-driver'

    return 'driver-patient'
  }

  const isLoading = isMapLoading(status, hospital, driver, patient)

  return (
    <Box>
      Status : {status.status} <br />
      Time : {ride.time.text} <br />
      Distance : {ride.distance.text} <br />
      Hospital Name - {hospital?.name} <br />
      Patient Coords - {JSON.stringify(patient.position, null, 2)} <br />
      Hospital Coords - {JSON.stringify(hospital.position, null, 2)} <br />
      Driver Coords - {JSON.stringify(driver.position, null, 2)} <br />
      <br />
      {isLoading ? (
        <Box>Map is loading...</Box>
      ) : (
        <Map
          line_between={getLinePath()}
          driver_coords={driver.position}
          hospital_coords={hospital.position}
          user_coords={patient.position}
        />
      )}
    </Box>
  )
}

export default CheckRequest

import type { NextPage } from 'next'
import { FC, FormEvent, useEffect } from 'react'
import { Box, Flex, Text } from '@chakra-ui/layout'
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
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input'
import { Table, Tbody, Tr, Td, TableContainer } from '@chakra-ui/table'
import { Button } from '@chakra-ui/button'
import axios from 'axios'
import { RIDE_DETAILS_RESPONSE } from './api/get-ride-details'
import { STATUS_DETAILS_RESPONSE } from './api/get-status-details'

const isMapLoading = (
  status: STATUS_DETAILS_RESPONSE_EXTENDED,
  hospital: HOSPITAL_DETAILS_RESPONSE,
  driver: DRIVER_DETAILS_RESPONSE,
  patient: PATIENT_DETAILS_RESPONSE
) => {
  if (status.status === 'checking') return [true, 'Please Wait...']
  if (status.status === 'pending') return [true, 'Waiting for Approval...']
  if (patient.position.lat === 0 && patient.position.lng === 0)
    return [true, 'Getting Patient Location...']
  if (hospital.position.lat === 0 && hospital.position.lng === 0)
    return [true, 'Getting Hospital Location...']
  if (driver.position.lat === 0 && driver.position.lng === 0)
    return [true, "Waiting for Driver's Location..."]

  return [false, '']
}

const MapWrapper: FC<{
  status: STATUS_DETAILS_RESPONSE_EXTENDED
  hospital: HOSPITAL_DETAILS_RESPONSE
  patient: PATIENT_DETAILS_RESPONSE
  driver: DRIVER_DETAILS_RESPONSE
}> = (props) => {
  const { status, driver, hospital, patient } = props

  const getLinePath = () => {
    if (status?.status === 'returning') return 'hospital-driver'

    return 'driver-patient'
  }

  const [isLoading, LoadingMsg] = isMapLoading(
    status,
    hospital,
    driver,
    patient
  )

  if (isLoading)
    return (
      <Flex id='map' justifyContent={'center'} alignItems='center'>
        <Text fontWeight={'semibold'} fontSize='2xl'>
          {LoadingMsg}
        </Text>
      </Flex>
    )

  return (
    <Map
      status={status as STATUS_DETAILS_RESPONSE}
      driver_coords={driver.position}
      hospital_coords={hospital.position}
      user_coords={patient.position}
    />
  )
}

const handleNotify = (evt: FormEvent<HTMLFormElement>) => {
  evt.preventDefault()
  const form = evt.currentTarget
  const phone = String(form['phone'].value)

  if (!phone.length) return

  axios
    .post('/api/situation-notify', {
      phone,
    })
    .then(() => alert(`Notified ${phone} successfully!`))
    .catch(() => alert(`Failed to Notify ${phone}`))
}

const NotifyOthers = () => {
  return (
    <form onSubmit={handleNotify}>
      <FormControl isRequired margin={'1rem'}>
        <FormLabel htmlFor='phone'>Phone Number</FormLabel>

        <Flex>
          <Box>
            <InputGroup>
              <InputLeftAddon>+91</InputLeftAddon>
              <Input type='tel' id='phone' name='phone' maxLength={10} />
            </InputGroup>
          </Box>
          <Button type='submit'>Notify</Button>
        </Flex>
      </FormControl>
    </form>
  )
}

const DataText: FC = (props) => {
  return <Text>{props.children}</Text>
}

const DataComponent: FC<{
  status: STATUS_DETAILS_RESPONSE_EXTENDED
  hospital: HOSPITAL_DETAILS_RESPONSE
  patient: PATIENT_DETAILS_RESPONSE
  driver: DRIVER_DETAILS_RESPONSE
  ride: RIDE_DETAILS_RESPONSE
}> = (props) => {
  const { driver, hospital, patient, ride, status } = props

  return (
    <>
      <TableContainer>
        <Table variant='simple'>
          <Tbody>
            <Tr>
              <Td>Status</Td>
              <Td>
                <DataText>{status.status}</DataText>
              </Td>
            </Tr>
            <Tr>
              <Td>Time</Td>
              <Td>
                <DataText>{ride.time.text}</DataText>
              </Td>
            </Tr>
            <Tr>
              <Td>Distance</Td>
              <Td>
                <DataText>{ride.distance.text}</DataText>
              </Td>
            </Tr>
            <Tr>
              <Td>Hospital</Td>
              <Td>
                <DataText>{hospital?.name || '-'}</DataText>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}

const CheckRequest: NextPage = () => {
  const [status, statusRequest] = useStatusDetails()
  const [hospital, hospitalRequest] = useHospitalDetails()
  const [patient, patientRequest] = usePatientDetails()
  const [driver, driverRequest] = useDriverDetails()
  const [ride, rideRequest] = useRideDetails()

  const dataProps = { driver, hospital, patient, status }

  return (
    <Flex id='req_status'>
      <Flex>
        <MapWrapper {...dataProps} />
      </Flex>
      <Flex id='data_component'>
        <DataComponent {...{ driver, hospital, patient, ride, status }} />
        <NotifyOthers />
      </Flex>
    </Flex>
  )
}

export default CheckRequest

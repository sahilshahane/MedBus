/* eslint-disable react-hooks/rules-of-hooks */
import { Box } from '@chakra-ui/react'
import { useRequest } from 'ahooks'
import axios from 'axios'
import { Button } from '@chakra-ui/react'
import {
  useStatusDetails,
  useHospitalDetails,
  usePatientDetails,
  useDriverDetails,
} from '@hooks/useRequestDetails'

const sample = () => {
  const [status, statusRequest] = useStatusDetails()
  const [hospital, hospitalRequest] = useHospitalDetails()
  const [patient, patientRequest] = usePatientDetails()
  const [driver, driverRequest] = useDriverDetails()

  return (
    <Box>
      name - {hospital?.name} <br />
      coords - {JSON.stringify(hospital?.position)} <br />
      patient coords - {JSON.stringify(patient.position)} <br />
      driver coords - {JSON.stringify(driver.position)}
    </Box>
  )
}

export default sample

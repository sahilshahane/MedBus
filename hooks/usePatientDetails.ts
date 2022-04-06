import axios from 'axios'
import { PATIENT_DETAILS_RESPONSE } from 'pages/api/get-patient-details'
import { useEffect, useState } from 'react'

const usePatientDetails = () => {
  const [patientDetails, setPatientDetails] =
    useState<PATIENT_DETAILS_RESPONSE>()

  useEffect(() => {
    axios
      .post<PATIENT_DETAILS_RESPONSE>('/api/get-patient-details')
      .then(({ data }) => {
        setPatientDetails(data)
      })
      .catch((error) =>
        console.error('Failed to retrieve patient details.', error)
      )
  }, [])

  return [patientDetails] as const
}

export default usePatientDetails

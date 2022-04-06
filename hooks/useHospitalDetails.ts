import axios from 'axios'
import { HOSPITAL_DETAILS_RESPONSE } from 'pages/api/get-hospital-details'
import { useEffect, useState } from 'react'

const useHospitalDetails = () => {
  const [hospitalDetails, setHospitalDetails] =
    useState<HOSPITAL_DETAILS_RESPONSE>()

  useEffect(() => {
    axios
      .post<HOSPITAL_DETAILS_RESPONSE>('/api/get-hospital-details')
      .then(({ data }) => {
        setHospitalDetails(data)
      })
      .catch((error) =>
        console.error('Failed to retrieve hospital details.', error)
      )
  }, [])

  return [hospitalDetails] as const
}

export default useHospitalDetails

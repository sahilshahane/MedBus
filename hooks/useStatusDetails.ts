import axios from 'axios'
import { STATUS_DETAILS_RESPONSE } from 'pages/api/get-status-details'
import { useEffect, useState } from 'react'

const useStatusDetails = () => {
  const [statusDetails, setStatusDetails] = useState<STATUS_DETAILS_RESPONSE>()
  const request = () =>
    axios
      .post<STATUS_DETAILS_RESPONSE>('/api/get-status-details')
      .then(({ data }) => {
        if (!statusDetails?.status || data.status !== statusDetails.status)
          setStatusDetails(data)
      })
      .catch((error) =>
        console.error('Failed to retrieve status details.', error)
      )
  useEffect(() => {
    request()
  }, [])

  return [statusDetails, request] as const
}

export default useStatusDetails

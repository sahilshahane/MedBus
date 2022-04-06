import axios from 'axios'
import { DRIVER_DETAILS_RESPONSE } from 'pages/api/get-driver-details'
import { useEffect, useState } from 'react'

const useDriverDetails = () => {
  const [driverDetails, setDriverDetails] = useState<DRIVER_DETAILS_RESPONSE>()
  const refresh = () =>
    axios
      .post<DRIVER_DETAILS_RESPONSE>('/api/get-driver-details')
      .then(({ data }) => {
        setDriverDetails(data)
      })
      .catch((error) =>
        console.error('Failed to retrieve driver details.', error)
      )

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    // console.log('driver details updated')
  }, [driverDetails])

  return [driverDetails, refresh] as const
}

export default useDriverDetails

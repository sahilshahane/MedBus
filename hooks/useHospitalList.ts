import { useState, useEffect } from 'react'
import type { Coordinates } from '@hooks/useStaticLocation'
import axios from 'axios'
import {
  NearestHospitalResponseData,
  NearestHospitalRequestData,
} from '@typedef/googleMaps'

const useHospitalList = (coords: Coordinates) => {
  const [list, setList] = useState<NearestHospitalResponseData>([])

  useEffect(() => {
    if (coords.lat != 0 && coords.lng != 0)
      axios
        .post<NearestHospitalResponseData>('/api/nearestHospital', {
          loc_lat: coords.lat,
          loc_lng: coords.lng,
        })
        .then(({ data }) => {
          setList(data)
        })
        .catch((error) => {
          console.error('Failed to retrieve hospital list', error)
        })
  }, [coords])

  return [list]
}

export default useHospitalList

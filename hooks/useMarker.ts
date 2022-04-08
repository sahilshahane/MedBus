import { useState, useEffect } from 'react'
import { Coordinates } from '@hooks/useStaticLocation'
import { STATUS_DETAILS_RESPONSE } from 'pages/api/get-status-details'

const useMarker = (options: google.maps.MarkerOptions) => {
  const { map, position } = options

  const [marker, setMarker] = useState<google.maps.Marker>()

  useEffect(() => {
    if (!map) return

    if (!marker) {
      setMarker(new window.google.maps.Marker())
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker, map])

  useEffect(() => {
    if (marker && map) {
      marker.setOptions(options)

      // marker.setMap(map)
    }
  }, [marker, position, options])

  return [marker] as const
}

export const useGetMarkers = (
  map: google.maps.Map | undefined,
  user_coords: Coordinates,
  driver_coords: Coordinates,
  hospital_coords: Coordinates,
  status: STATUS_DETAILS_RESPONSE
) => {
  const commonOptions = {}

  const imgSize = 50

  // MARKER [PATIENT]
  const [patient_marker] = useMarker({
    map,
    position: user_coords,
    title: 'Patient',
    // label: 'Patient',
    visible: status.status === 'arriving',
    icon: `https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/${imgSize}/000000/external-patient-biochemistry-and-medicine-healthcare-flatart-icons-lineal-color-flatarticons.png`,
    ...commonOptions,
  })

  // MARKER [DRIVER]
  const [driver_marker] = useMarker({
    map,
    position: driver_coords,
    title: 'Driver',
    // label: 'Driver',
    visible: status.status !== 'hospitalized',
    icon: `https://img.icons8.com/fluency/${imgSize}/000000/ambulance.png`,
    ...commonOptions,
  })

  // MARKER [HOSPITAL]
  const [hospital_marker] = useMarker({
    map,
    position: hospital_coords,
    title: 'Hospital',
    // label: 'Hospital',
    icon: `https://img.icons8.com/stickers/${50}/000000/hospital-3.png`,
    ...commonOptions,
  })

  return [patient_marker, driver_marker, hospital_marker] as const
}

export default useMarker

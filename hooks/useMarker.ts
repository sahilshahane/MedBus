import { useState, useEffect } from 'react'
import { Coordinates } from '@hooks/useStaticLocation'

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
  line_between: 'hospital-driver' | 'driver-patient'
) => {
  // MARKER [PATIENT]
  const [patient_marker] = useMarker({
    map,
    position: user_coords,
    title: 'Patient',
    label: 'Patient',
    visible: line_between === 'driver-patient',
  })

  // MARKER [DRIVER]
  const [driver_marker] = useMarker({
    map,
    position: driver_coords,
    title: 'Driver',
    label: 'Driver',
  })

  // MARKER [HOSPITAL]
  const [hospital_marker] = useMarker({
    map,
    position: hospital_coords,
    title: 'Hospital',
    label: 'Hospital',
  })

  return [patient_marker, driver_marker, hospital_marker] as const
}

export default useMarker

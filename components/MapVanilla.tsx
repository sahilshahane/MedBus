import { FC, useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { Coordinates } from '@hooks/useStaticLocation'
import { Box } from '@chakra-ui/layout'
import { useGetMarkers } from '@hooks/useMarker'
import { STATUS_DETAILS_RESPONSE } from 'pages/api/get-status-details'

interface MapProps extends google.maps.MapOptions {
  hospital_coords: Coordinates
  user_coords: Coordinates
  driver_coords: Coordinates
  status: STATUS_DETAILS_RESPONSE
}

const renderer = (status: Status) => {
  if (status === Status.FAILURE)
    return <Box>Failed to load map&apos;s library</Box>

  if (status === Status.LOADING) return <Box>Loading map&apos;s library</Box>

  return <></>
}

const MapWrapper: FC<MapProps> = (props) => {
  const { driver_coords } = props
  const apiKey = process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY as string

  return (
    <Wrapper
      apiKey={apiKey}
      render={renderer}
      callback={(status) => console.log(status)}
    >
      <Map
        {...props}
        mapId={'d0fb69b34846781a'}
        center={driver_coords}
        zoom={13}
        disableDefaultUI
      />
    </Wrapper>
  )
}

const Map: FC<MapProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map>()
  const [linePath, setLinePath] = useState<google.maps.Polyline>()

  const { user_coords, hospital_coords, driver_coords, status } = props

  const [patient_marker, driver_marker] = useGetMarkers(
    map,
    user_coords,
    driver_coords,
    hospital_coords,
    status
  )

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          ...props,
        })
      )
    }
  }, [ref, map])

  useEffect(() => {
    if (linePath) {
      linePath.setMap(null)
    }

    if (!map || !patient_marker || !driver_marker) return

    if (status.status === 'arriving')
      setLinePath(
        new google.maps.Polyline({
          path: [user_coords, driver_coords],
          map,
        })
      )
    else if (status.status === 'returning')
      setLinePath(
        new google.maps.Polyline({
          path: [hospital_coords, driver_coords],
          map,
          strokeColor: 'red',
        })
      )
  }, [driver_marker, driver_coords, status])

  return (
    <>
      <Box ref={ref} id='map' />
    </>
  )
}

export default MapWrapper

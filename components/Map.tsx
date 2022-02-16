import type { NextPage } from 'next'
import { Box } from '@chakra-ui/layout'
import GoogleMaps from 'google-map-react'
import type googleMapReact from 'google-map-react'
import Marker from '@components/MapMarker'

enum ZoomLevel {
  WORLD = 1,
  CONTINENT = 5,
  CITY = 10,
  STREETS = 15,
  BUILDINGS = 20,
}

interface googleMapsPropModified extends googleMapReact.Props {
  zoom: ZoomLevel
}

const GoogleMapsDefaultProps: googleMapsPropModified = {
  zoom: ZoomLevel.STREETS,
  bootstrapURLKeys: {
    key: process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY as string,
  },
}

interface MapOptions extends googleMapReact.Props {
  height: number | string
  width?: number | string | 'auto'

  lat: number
  lng: number
}

const Map: NextPage<MapOptions> = (props) => {
  const { width = 'auto', height, lat, lng } = props
  return (
    <Box h={height} w={width} bg='grey'>
      <GoogleMaps {...GoogleMapsDefaultProps} center={{ lat, lng }}>
        <Marker type='normal' lat={lat} lng={lng} />
      </GoogleMaps>
    </Box>
  )
}

export default Map

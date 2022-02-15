import type { NextPage } from 'next'
import { Box } from '@chakra-ui/layout'
import GoogleMaps from 'google-map-react'
import type { MapOptions as GoogleMapOptions } from 'google-map-react'
import type googleMapReact from 'google-map-react'

// const gMapOptions: MapOptions = {
//   height,
// }

interface MapOptions extends googleMapReact.Props {
  height: number | string
  width?: number | string | 'auto'
}

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
    key: 'AIzaSyDXUOcx0aIA_zYKTLUbXs2tgcHh_nxW9A8',
  },
}

const Map: NextPage<MapOptions> = (props) => {
  const { width = 'auto', height } = props
  return (
    <Box h={height} w={width} bg='grey'>
      <GoogleMaps {...GoogleMapsDefaultProps} center={props.center} />
    </Box>
  )
}

export default Map

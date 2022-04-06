import { Box } from '@chakra-ui/layout'
import type { NextPage } from 'next'
import { MdLocationOn as NormalLocPin } from 'react-icons/md'

interface MarkerProps {
  type: 'normal' | 'driver' | 'hospital'
  lat: number
  lng: number
  pinSize?: number
}

const MapMarker: NextPage<MarkerProps> = (props) => {
  const PIN_SIZE = props.pinSize || 45
  const { type } = props

  return (
    <Box>
      {type == 'normal' && <NormalLocPin color='red' size={PIN_SIZE} />}
      {type == 'driver' && <NormalLocPin color='red' size={PIN_SIZE} />}
      {type == 'hospital' && <NormalLocPin color='red' size={PIN_SIZE} />}
    </Box>
  )
}

export default MapMarker

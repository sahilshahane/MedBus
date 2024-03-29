import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import useStaticLocation, { PermissionType } from '@hooks/useStaticLocation'
import Map from '@components/Map'
import { Box } from '@chakra-ui/layout'

const LocationCheck: NextPage = () => {
  const [coords, permission] = useStaticLocation()

  useEffect(() => {
    console.log('Location Coordinates : ', coords)
  }, [coords])

  return (
    <>
      {permission == PermissionType.ASKING && (
        <div>Getting Location Access</div>
      )}

      {permission == PermissionType.DENIED && (
        <div>Please Grant Location Access</div>
      )}

      {permission == PermissionType.GRANTED && (
        <Box w='100%' h='100vh'>
          <Map height='100%' width='100%' lat={coords.lat} lng={coords.lng} />
        </Box>
      )}
    </>
  )
}

export default LocationCheck

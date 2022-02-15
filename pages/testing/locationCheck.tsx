import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import useStaticLocation, { PermissionType } from '@hooks/useStaticLocation'
import Map from '@components/Map'
import { Box } from '@chakra-ui/layout'

const LocationCheck: NextPage = () => {
  const [coordinates, permission] = useStaticLocation()

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
          <Map height='100%' width='100%' center={coordinates} />
        </Box>
      )}
    </>
  )
}

export default LocationCheck

import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import useStaticLocation, { PermissionType } from '@hooks/useStaticLocation'
import Map from '@components/Map'
import { Box } from '@chakra-ui/layout'
import useHospitalList from '@hooks/useHospitalList'

const ListHospitals: NextPage = () => {
  const [coords, permission] = useStaticLocation()
  const [hospitalList] = useHospitalList(coords)
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

      {permission == PermissionType.GRANTED &&
        hospitalList.map((value, idx) => {
          return `<br>${JSON.stringify(value)}</br>`
        })}
    </>
  )
}

export default ListHospitals

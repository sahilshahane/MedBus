import { useState, useEffect } from 'react'

const GeoLocationSettings: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
}

const PermissionOptions: PermissionDescriptor = {
  name: 'geolocation',
}

const getPosition = () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    const permissonState = navigator.permissions
      .query(PermissionOptions)
      .then((status) => {
        switch (status.state) {
          case 'prompt':
          case 'granted':
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              GeoLocationSettings
            )
            break
          case 'denied':
            reject('Location Access Denied')
        }
      })
      .catch(reject)
  })
}

export interface Coordinates {
  lat: number
  lng: number
}

export enum PermissionType {
  GRANTED,
  DENIED,
  ASKING,
}

function useLocation() {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 0,
    lng: 0,
  })

  const [permission, setPermission] = useState<PermissionType>(
    PermissionType.ASKING
  )

  const askLocation = () => {
    if (navigator.geolocation) {
      getPosition()
        .then(({ coords: { longitude, latitude } }) => {
          setCoordinates({
            lng: longitude,
            lat: latitude,
          })
        })
        .then(() => setPermission(PermissionType.GRANTED))
        .catch((error) => {
          alert(error)
          console.error(error)
          // alert("Please Grant Location access")
          setPermission(PermissionType.DENIED)
        })
    } else {
      alert('This Device does not have Geolocation Support')
    }
  }

  useEffect(() => {
    askLocation()
  }, [])

  return [coordinates, permission] as const
}

export default useLocation

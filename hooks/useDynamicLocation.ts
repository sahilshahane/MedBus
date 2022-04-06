import useStaticLocation, { PermissionType } from '@hooks/useStaticLocation'
import { useEffect, useState } from 'react'

const useDynamicLocation = (intervalDelay: number) => {
  const [coords, permission, refresh] = useStaticLocation()

  const [stopUpdates, setStopUpdates] = useState(false)

  useEffect(() => {
    if (permission !== PermissionType.GRANTED || stopUpdates) return

    setTimeout(() => refresh(), intervalDelay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, permission, stopUpdates])

  const stopLocUpdates = () => setStopUpdates(true)

  return [coords, permission, stopLocUpdates] as const
}

export default useDynamicLocation

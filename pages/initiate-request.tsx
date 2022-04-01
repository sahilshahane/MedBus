import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import useStaticLocation, { PermissionType } from '@hooks/useStaticLocation'
import Map from '@components/Map'
import { Box } from '@chakra-ui/layout'
import useInitiateRequest, { REQUEST_STATUS } from '@hooks/useInitiateRequest'

const Redirect = (delay = 3000) => {
  const SITE_NAME = location.href.substring(0, location.href.indexOf('/', 9))

  setTimeout(() => window.location.replace(SITE_NAME + '/check-request'), delay)
}

const InitiateRequest: NextPage = () => {
  const [requestStatus, locationPermission] = useInitiateRequest()

  useEffect(() => {
    switch (requestStatus) {
      case REQUEST_STATUS.SUCCESS:
        Redirect(3000)
        break
    }
  }, [requestStatus])

  return (
    <>
      {locationPermission === PermissionType.ASKING && (
        <Box>Please Press Allow if location dialog box appears</Box>
      )}

      {locationPermission === PermissionType.DENIED && (
        <Box>Please Grant Location Permission (try reloading page)</Box>
      )}

      {requestStatus === REQUEST_STATUS.INITIATING && (
        <Box>Initiating Request</Box>
      )}

      {requestStatus === REQUEST_STATUS.WAITING && (
        <Box>Request made, waiting for processing</Box>
      )}

      {requestStatus === REQUEST_STATUS.SUCCESS && (
        <Box>Request was successfull, redirecting to Request Status page</Box>
      )}

      {requestStatus === REQUEST_STATUS.FAILED && <Box>Request failed</Box>}
    </>
  )
}

export default InitiateRequest

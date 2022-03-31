import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import useStaticLocation, { PermissionType } from '@hooks/useStaticLocation'
import Map from '@components/Map'
import { Box } from '@chakra-ui/layout'
import useInitiateRequest, { REQUEST_STATUS } from '@hooks/useInitiateRequest'

const InitiateRequest: NextPage = () => {
  const [requestStatus, reqest_RESPONSE] = useInitiateRequest()

  useEffect(() => {
    if (requestStatus === REQUEST_STATUS.SUCCESS) {
      const SITE_NAME = location.href.substring(
        0,
        location.href.indexOf('/', 10)
      )

      setTimeout(
        () =>
          window.location.replace(
            SITE_NAME + '/check-request/' + reqest_RESPONSE.REQUEST_ID
          ),
        3000
      )
    }
  }, [requestStatus])

  return (
    <>
      {requestStatus === REQUEST_STATUS.INITIATING && (
        <Box>Initiating Request</Box>
      )}

      {requestStatus === REQUEST_STATUS.WAITING && (
        <Box>Request made, waiting for processing</Box>
      )}

      {requestStatus === REQUEST_STATUS.SUCCESS && (
        <Box>Request was successfull, redirecting to Checking lobby</Box>
      )}

      {requestStatus === REQUEST_STATUS.FAILED && <Box>Request failed</Box>}
    </>
  )
}

export default InitiateRequest

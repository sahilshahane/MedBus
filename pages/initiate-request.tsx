import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import useStaticLocation, { PermissionType } from '@hooks/useStaticLocation'
import Map from '@components/Map'
import { Box } from '@chakra-ui/layout'
import useInitiateRequest, { REQUEST_STATUS } from '@hooks/useInitiateRequest'

const Redirect = (REQUEST_ID: string, delay = 3000) => {
  const SITE_NAME = location.href.substring(0, location.href.indexOf('/', 10))

  setTimeout(
    () => window.location.replace(SITE_NAME + '/check-request/' + REQUEST_ID),
    delay
  )
}

const InitiateRequest: NextPage = () => {
  const [requestStatus, reqest_RESPONSE] = useInitiateRequest()

  useEffect(() => {
    switch (requestStatus) {
      case REQUEST_STATUS.SUCCESS:
        Redirect(reqest_RESPONSE.REQUEST_ID, 3000)
        break
      case REQUEST_STATUS.PREVIOUS_REQUEST_EXISTS:
        Redirect(reqest_RESPONSE.REQUEST_ID, 0)
        break
    }
  }, [requestStatus])

  return (
    <>
      {requestStatus === REQUEST_STATUS.CHECKING_PREVIOUS_REQUEST && (
        <Box>Checking for previous requests made</Box>
      )}

      {requestStatus === REQUEST_STATUS.PREVIOUS_REQUEST_EXISTS && (
        <Box>
          Previous Request has been made, Redirecting to Request Status page
        </Box>
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

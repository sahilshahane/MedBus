import type { NextPage } from 'next'
import { useEffect, FC } from 'react'
import { PermissionType } from '@hooks/useStaticLocation'
import useInitiateRequest, { REQUEST_STATUS } from '@hooks/useInitiateRequest'
import { Text, Flex } from '@chakra-ui/layout'

const getRequestMessage = (status: REQUEST_STATUS) => {
  switch (status) {
    case REQUEST_STATUS.FAILED:
      return 'Request failed'
    case REQUEST_STATUS.INITIATING:
      return 'Initiating Request'
    case REQUEST_STATUS.SUCCESS:
      return 'Request was successfull, redirecting to Request Status page'
    case REQUEST_STATUS.WAITING:
      return 'Request made, waiting for processing'
  }
}
const getLocationMessage = (status: PermissionType) => {
  switch (status) {
    case PermissionType.ASKING:
      return 'Please Press Allow if location dialog box appears'
    case PermissionType.DENIED:
      return 'Please Grant Location Permission (try reloading page with location enabled)'
    case PermissionType.GRANTED:
      return ''
  }
}

const Message: FC = (props) => {
  return (
    <Text fontSize='xl' fontWeight='semibold'>
      {props.children}
    </Text>
  )
}

const Redirect = (delay = 3000) => {
  const SITE_NAME = location.href.substring(0, location.href.indexOf('/', 9))

  setTimeout(() => window.location.replace(SITE_NAME + '/check-request'), delay)
}

const InitiateRequest: NextPage = () => {
  const [requestStatus, locationPermission] = useInitiateRequest()

  useEffect(() => {
    switch (requestStatus) {
      case REQUEST_STATUS.SUCCESS:
        Redirect(1000)
        break
    }
  }, [requestStatus])

  // const locationPermission = PermissionType.GRANTED
  // const requestStatus = REQUEST_STATUS.SUCCESS

  return (
    <>
      <Flex w='100vw' h='100vh' alignItems='center' justifyContent='center'>
        <Message>{getLocationMessage(locationPermission)}</Message>

        {locationPermission === PermissionType.GRANTED && (
          <Message>{getRequestMessage(requestStatus)}</Message>
        )}
      </Flex>
    </>
  )
}

export default InitiateRequest

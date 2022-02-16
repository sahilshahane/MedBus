import type { NextPage } from 'next'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/alert'
import { CloseButton } from '@chakra-ui/close-button'
import type { Status, StatusKind } from '@typedef/authenticate'

interface AuthAlertProps {
  status: Status
  onClickCloseBtn: () => any
}

const getStatusLabel = (type: StatusKind) => {
  switch (type) {
    case 'loading':
      return 'info'
    default:
      return type
  }
}

const AuthAlert: NextPage<AuthAlertProps> = ({ status, onClickCloseBtn }) => {
  return (
    <>
      <Alert status={getStatusLabel(status.type)} variant='top-accent'>
        <AlertIcon />
        {status.title && <AlertTitle mr={2}>{status.title}</AlertTitle>}
        {status.message && (
          <AlertDescription>{status.message}</AlertDescription>
        )}
        <CloseButton
          position='absolute'
          right='8px'
          top='8px'
          onClick={onClickCloseBtn}
        />
      </Alert>
    </>
  )
}

export default AuthAlert

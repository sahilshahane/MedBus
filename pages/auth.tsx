import type { NextPage } from 'next'
import { Flex, Box, Container } from '@chakra-ui/layout'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import {
  AuthenticateResponse,
  SendDataFuncType,
  Status,
} from '@typedef/authenticate'
import Alert from '@components/AuthAlert'
import { useRouter } from 'next/router'
import axios from 'axios'
import Signup from '@components/signup'
import SignIn from '@components/signin'

const SendDataWrapper =
  (
    redirect: RedirectFuncType,
    setState: Dispatch<SetStateAction<Status>>
  ): SendDataFuncType =>
  (URL, data, redirectURL = '') => {
    return axios
      .post<AuthenticateResponse>(URL, data)
      .then((res) => {
        const { message, title } = res.data

        setState({
          type: 'success',
          enabled: true,
          message,
          title,
        })

        if (res.data.redirect) redirect(res.data.redirect, res.data)
      })
      .catch((error) => {
        let title = error?.response?.data?.message || ''

        setState({
          type: 'error',
          enabled: true,
          title,
        })
      })
  }

interface BlockProps {
  text: string
  isSelected: boolean
  onClick: () => void
}
const Block: FC<BlockProps> = ({ text, isSelected, onClick }) => {
  return (
    <Flex
      roundedTop='2xl'
      justifyContent='space-around'
      alignItems='center'
      px={2}
      py={3}
      w='50%'
      boxShadow={isSelected ? 'dark-lg' : 'revert'}
      onClick={onClick}
      cursor='pointer'
    >
      {text}
    </Flex>
  )
}

type OperationTypes = 'signin' | 'signup'
type RedirectFuncType = (URL: string, data: AuthenticateResponse) => any

const Authenticate: NextPage = () => {
  const router = useRouter()

  const [status, setStatus] = useState<Status>({
    type: 'loading',
    enabled: false,
  })

  const [operationType, setOperationType] = useState<OperationTypes>('signin')
  const handleRedirect: RedirectFuncType = (URL, data) => {
    setTimeout(() => router.push(URL), 5000)
  }

  const SendData = SendDataWrapper(handleRedirect, setStatus)

  return (
    <Flex w='100vw' minH='100vh' alignItems='center'>
      <Container rounded='2xl' p='0' bg='transparent' boxShadow='2xl'>
        <Flex
          // overflow='clip'
          w='100%'
          bg='transparent'
          flexFlow='row nowrap'
          position='relative'
          zIndex={1}
        >
          <Block
            onClick={() => setOperationType('signin')}
            text='Sign In'
            isSelected={operationType === 'signin'}
          />
          <Block
            onClick={() => setOperationType('signup')}
            text='Sign Up'
            isSelected={operationType === 'signup'}
          />
        </Flex>
        <Box
          position='relative'
          zIndex={2}
          roundedBottom='2xl'
          px={[10, 5]}
          py={[10, 5]}
          bg='white'
        >
          {operationType === 'signup' && <Signup sendData={SendData} />}
          {operationType === 'signin' && <SignIn sendData={SendData} />}
        </Box>
        {status.enabled && (
          <Alert
            onClickCloseBtn={() => setStatus({ ...status, enabled: false })}
            status={status}
          />
        )}
      </Container>
    </Flex>
  )
}

export default Authenticate

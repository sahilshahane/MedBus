import type { NextPage } from 'next'
import useAuth, { AuthContextProps } from '@hooks/useAuth'
import { Flex, Box, Container, VStack, HStack } from '@chakra-ui/layout'
import { Input } from '@chakra-ui/input'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import type { FirebaseError } from '@firebase/util'
import { Status } from '@typedef/authenticate'
import Alert from '@components/AuthAlert'
import { useRouter } from 'next/router'

const handleSubmit =
  (
    auth: AuthContextProps,
    operationType: OperationTypes,
    setState: Dispatch<SetStateAction<Status>>
  ) =>
  (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    const operation = operationType === 'signin' ? auth.signin : auth.signup
    const email = evt.currentTarget.email.value
    const password = evt.currentTarget.password.value

    setState({
      type: 'loading',
      enabled: true,
      message: 'Authenticating with Server',
      title: 'Please Wait',
    })

    operation(email, password)
      .then(() =>
        setState({
          type: 'success',
          enabled: true,
          message: 'Redirecting to Dashboard',
          title:
            operationType === 'signin'
              ? 'Signed In Successfully'
              : 'Account Created',
        })
      )
      .catch((error: FirebaseError) => {
        console.error(error.message)

        let message = error.message
        let title = 'Oops Something Went Wrong!'

        if (message.includes('wrong-password')) {
          message = ''
          title = 'Incorrect Password'
        }

        setState({
          type: 'error',
          enabled: true,
          message,
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

const Authenticate: NextPage = () => {
  const auth = useAuth()
  const router = useRouter()

  const [status, setStatus] = useState<Status>({
    type: 'loading',
    enabled: false,
  })

  const [operationType, setOperationType] = useState<OperationTypes>('signin')

  const handleSubmitWrapper = handleSubmit(auth, operationType, setStatus)

  useEffect(() => {
    console.log('Change Detected : ', auth.user?.email)
    if (auth.user) {
      setStatus({
        type: 'info',
        title: 'Redirecting to dashboard',
        message: 'User account already present',
        enabled: true,
      })

      setTimeout(() => router.push('/hospital/dashboard'), 5000)
    }
  }, [auth.user])

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
          <form onSubmit={handleSubmitWrapper}>
            <VStack gap={2}>
              <FormControl>
                <FormLabel htmlFor='email'>Email address</FormLabel>
                <Input id='email' name='email' type='email' />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <Input id='password' name='password' type='password' />
              </FormControl>
              <FormControl>
                <Input
                  value={operationType === 'signin' ? 'Login' : 'Register'}
                  type='submit'
                  disabled={status.type == 'loading' && status.enabled}
                  cursor='pointer'
                />
              </FormControl>
              {status.enabled && (
                <Alert
                  onClickCloseBtn={() =>
                    setStatus({ ...status, enabled: false })
                  }
                  status={status}
                />
              )}
            </VStack>
          </form>
        </Box>
      </Container>
    </Flex>
  )
}

export default Authenticate

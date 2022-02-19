import type { NextPage } from 'next'
import { VStack } from '@chakra-ui/layout'
import { Input } from '@chakra-ui/input'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { FormEvent, useState } from 'react'
import { SendDataFuncType, SignInRequestData } from '@typedef/authenticate'
import PasswordField from './PasswordField'

const handleSubmit =
  (sendData: SendDataFuncType, setControlsEnabled: (enabled: boolean) => any) =>
  (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    const form = evt.currentTarget
    const data: SignInRequestData = {
      email: form['email'].value,
      password: form['password'].value,
    }
    const URL = '/api/signin'
    sendData(URL, data).finally(() => setControlsEnabled(true))
  }

interface SignInProps {
  sendData: SendDataFuncType
}

const SignIn: NextPage<SignInProps> = ({ sendData }) => {
  const [controlsEnabled, setControlEnabled] = useState(true)

  const handleSubmitWrapper = handleSubmit(sendData, setControlEnabled)

  return (
    <form onSubmit={handleSubmitWrapper}>
      <VStack gap={2}>
        <FormControl isDisabled={!controlsEnabled}>
          <FormLabel htmlFor='email'>Email address</FormLabel>
          <Input id='email' name='email' type='email' />
        </FormControl>

        <FormControl isDisabled={!controlsEnabled}>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <PasswordField />
        </FormControl>

        <FormControl>
          <Input
            value='Login'
            type='submit'
            cursor='pointer'
            onClick={() => setControlEnabled(false)}
          />
        </FormControl>
      </VStack>
    </form>
  )
}

export default SignIn

import type { NextPage } from 'next'
import { VStack } from '@chakra-ui/layout'
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input'
import { Select } from '@chakra-ui/select'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { FormEvent, useRef, useState } from 'react'
import {
  AccountTypes,
  SendDataFuncType,
  DriverSignUpReqestData,
  HospitalSignUpReqestData,
} from '@typedef/authenticate'
import PasswordField from './PasswordField'
import PlacesAutoComplete from '@components/PlacesAutocomplete'

const handleSubmit =
  (sendData: SendDataFuncType, setControlsEnabled: (enabled: boolean) => any) =>
  (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    const form = evt.currentTarget
    const accountType: AccountTypes = form['accountType'].value
    let data: DriverSignUpReqestData | HospitalSignUpReqestData

    if (accountType === 'hospital') {
      const _data: HospitalSignUpReqestData = {
        email: form['email'].value,
        password: form['password'].value,
        type: form['accountType'].value,
        hospital_address: form['hospital_address'].value,
      }

      data = _data
    } else if (accountType === 'driver') {
      const _data: DriverSignUpReqestData = {
        email: form['email'].value,
        password: form['password'].value,
        type: form['accountType'].value,
        hospital_address: form['hospital_address'].value,
        driver_name: form['driverName'].value,
        phone: form['phone'].value,
      }

      data = _data
    }

    const URL = '/api/signup'

    // @ts-expect-error
    sendData(URL, data).finally(() => setControlsEnabled(true))
  }

interface SignUpProps {
  sendData: SendDataFuncType
}

const SignUp: NextPage<SignUpProps> = ({ sendData }) => {
  const [controlsEnabled, setControlEnabled] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)
  const handleSubmitWrapper = handleSubmit(sendData, setControlEnabled)
  const [accountType, setAccountType] = useState<AccountTypes>('hospital')

  return (
    <form onSubmit={handleSubmitWrapper} ref={formRef}>
      <VStack gap={2}>
        <FormControl isDisabled={!controlsEnabled} isRequired>
          <FormLabel htmlFor='email'>Email address</FormLabel>
          <Input id='email' name='email' type='email' />
        </FormControl>

        <FormControl isDisabled={!controlsEnabled} isRequired>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <PasswordField />
        </FormControl>

        <FormControl isDisabled={!controlsEnabled} isRequired>
          <FormLabel htmlFor='accountType'>Account Type</FormLabel>
          <Select
            name='accountType'
            defaultValue={accountType}
            onChange={(evt) =>
              setAccountType(evt.currentTarget.value as AccountTypes)
            }
          >
            <option value='hospital'>Hospital</option>
            <option value='driver'>Driver</option>
          </Select>
        </FormControl>

        {/* <PlacesAutoComplete controlsEnabled={controlsEnabled} /> */}
        <FormControl isRequired isDisabled={!controlsEnabled}>
          <FormLabel htmlFor='hospital_address'>Hospital Address</FormLabel>
          <Input type='text' id='hospital_address' name='hospital_address' />
        </FormControl>

        {accountType === 'driver' && (
          <>
            <FormControl isDisabled={!controlsEnabled} isRequired>
              <FormLabel htmlFor='driverName'>Name</FormLabel>
              <Input
                id='driverName'
                name='driverName'
                type='text'
                maxLength={50}
              />
            </FormControl>

            <FormControl isDisabled={!controlsEnabled} isRequired>
              <FormLabel htmlFor='phone'>Phone Number</FormLabel>

              <InputGroup>
                <InputLeftAddon>+91</InputLeftAddon>
                <Input type='tel' id='phone' name='phone' maxLength={10} />
              </InputGroup>
            </FormControl>
          </>
        )}

        <FormControl>
          <Input
            value='Register'
            type='submit'
            cursor='pointer'
            onClick={() => setControlEnabled(false)}
          />
        </FormControl>
      </VStack>
    </form>
  )
}

export default SignUp

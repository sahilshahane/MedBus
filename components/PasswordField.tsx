import { FC, useState } from 'react'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Button } from '@chakra-ui/button'

const PasswordField: FC = () => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input
        id='password'
        name='password'
        pr='4.5rem'
        type={show ? 'text' : 'password'}
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

export default PasswordField

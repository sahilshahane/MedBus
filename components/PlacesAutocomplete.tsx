import { Box, Flex, VStack } from '@chakra-ui/layout'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import type { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { BsSearch as SearchIcon } from 'react-icons/bs'
import { Icon } from '@chakra-ui/icon'
import usePlacesAutocomplete from '@hooks/usePlacesAutocomplete'
import { Suggestion } from 'use-places-autocomplete'

interface PlacesAutoCompleteProps {
  controlsEnabled: boolean
}

const PlacesAutoComplete: NextPage<PlacesAutoCompleteProps> = ({
  controlsEnabled,
}) => {
  const [isLoading, autocomplete, enableSuggestions, setEnableSuggestions] =
    usePlacesAutocomplete()
  const { ready, setValue, value, suggestions, clearSuggestions } = autocomplete
  const searchRef: any = useRef()

  return (
    <Box
      w='100%'
      position='relative'
      onBlur={() => setTimeout(() => setEnableSuggestions(false), 500)}
      onFocus={() => setEnableSuggestions(true)}
    >
      <FormControl isDisabled={isLoading || !controlsEnabled} isRequired>
        <FormLabel htmlFor='hospital_placeid'>Hospital Search</FormLabel>
        <InputGroup>
          <InputRightElement
            pointerEvents='none'
            // eslint-disable-next-line react/no-children-prop
            children={<Icon as={SearchIcon} />}
          />
          <Input
            id='hospitalSearch'
            name='hospitalSearch'
            type='search'
            value={value}
            placeholder='Eg. Lotus Hospital, Pune'
            onChange={(evt) => {
              setValue(evt.currentTarget.value)
              // if (!enableSuggestions) setEnableSuggestions(true)
            }}
            maxLength={150}
          />

          <Input
            ref={searchRef}
            id='hospital_placeid'
            name='hospital_placeid'
            type='text'
            hidden
            readOnly
          />
        </InputGroup>
      </FormControl>
      {
        <VStack
          w='100%'
          bg='gray.100'
          position='absolute'
          zIndex={1}
          // onMouseEnter={() => setEnableSuggestions(true)}
          // onFocus={() => setEnableSuggestions(true)}
          hidden={!enableSuggestions}
        >
          {suggestions.data.map(({ description, place_id }) => {
            if (value == description) return null

            return (
              <Flex
                rounded='md'
                bg='white'
                className='SuggestionBlockItem'
                key={place_id}
                py={1.5}
                px={1}
                borderWidth={1}
                w='100%'
                justifyContent='center'
                alignContent='center'
                cursor='pointer'
                onClick={() => {
                  console.log(description)
                  searchRef.current.value = place_id
                  setValue(description)
                  setEnableSuggestions(false)
                  clearSuggestions()
                }}
              >
                {description}
              </Flex>
            )
          })}
        </VStack>
      }
    </Box>
  )
}

export default PlacesAutoComplete

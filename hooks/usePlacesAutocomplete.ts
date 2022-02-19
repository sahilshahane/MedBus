import { useEffect, useState } from 'react'
import usePlacesAutocomplete from 'use-places-autocomplete'

const useGooglePlacesAutocomplete = () => {
  const [isLoading, setLoading] = useState(true)
  const autocomplete = usePlacesAutocomplete({
    initOnMount: false,
    debounce: 1000,
  })
  const { init, ready, value, suggestions } = autocomplete

  const [enableSuggestions, setEnableSuggestions] = useState(true)

  useEffect(() => {
    if (ready) {
      setLoading(false)
      console.log('Google Places API ready')
    } else console.log('Google Places API Initializing')
  }, [ready])

  useEffect(() => {
    const existingScript = document.getElementById('googlePlacesApi')

    if (!existingScript) {
      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`
      script.id = 'googlePlacesApi'
      document.body.appendChild(script)
      script.onload = () => {
        console.log('Google Map Script Loaded')
        setLoading(false)
      }
    } else {
      console.log('Google Map Script Already Loaded')
      init()
    }
  }, [])

  useEffect(() => {
    if (ready) {
      console.log('Value : ', value)
      console.log('Suggestions : ', suggestions)
    }
  }, [value])

  useEffect(() => {
    if (enableSuggestions) {
      console.log('Suggestions Enabled')
    } else {
      console.log('Suggestions Disabled')
    }
  }, [enableSuggestions])

  return [
    isLoading,
    autocomplete,
    enableSuggestions,
    setEnableSuggestions,
  ] as const
}

export default useGooglePlacesAutocomplete

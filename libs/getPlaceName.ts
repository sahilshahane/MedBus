import axios from 'axios'

const getPlaceNameByPlaceID = async (place_id: string) => {
  try {
    const config: any = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`,
      headers: {},
    }

    const res = await axios(config)
    return res?.data?.result?.name
  } catch (error) {
    console.log(error)
  }

  return undefined
}

export default getPlaceNameByPlaceID

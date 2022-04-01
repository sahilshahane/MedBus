import { Client, PlaceInputType } from '@googlemaps/google-maps-services-js'

const gmap = new Client()

const getPlaceData = async (place_id: string) => {
  const res = await gmap.placeDetails({
    params: {
      place_id,
      fields: ['name', 'geometry'],
      key: process.env.SERVER_GOOGLE_MAPS_KEY as string,
    },
  })

  return res.data.result
}
const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180

// calculates approx distance between two points, gives answer in meters
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.

  lon1 = Number(lon1)
  lon2 = Number(lon2)
  lat1 = Number(lat1)
  lat2 = Number(lat2)

  const earthRadiusKm = 6371

  const dLat = degreesToRadians(lat2 - lat1)
  const dLon = degreesToRadians(lon2 - lon1)

  lat1 = degreesToRadians(lat1)
  lat2 = degreesToRadians(lat2)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c * 1000
}

export const getPlaceIDByAddress = async (address: string) => {
  const res = await gmap.findPlaceFromText({
    params: {
      input: address,
      inputtype: PlaceInputType.textQuery,
      fields: ['place_id'],
      key: process.env.SERVER_GOOGLE_MAPS_KEY as string,
    },
  })

  return res.data.candidates[0]
}

export default getPlaceData

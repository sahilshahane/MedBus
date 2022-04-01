export interface NearestHospitalRequestData {
  loc_lat: number
  loc_lng: number
}

export type NearestHospitalResponseData = Array<{
  hospital_placeid: string
  hos_loc_lat: number
  hos_loc_lng: number
  hos_name: string
  approxDistance: number
  distance: number
  duration: number
  id: number
}>

export type GenerateRequestResponse = {
  success: boolean
  error?: any
}

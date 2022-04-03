import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import sql, { RowDataPacket } from 'mysql2'
import { REQUEST_STATUSES } from '@typedef/authenticate'
import { getAccountID } from '@libs/server-side'
import { calculateDistance } from '@libs/googleMapsAPI'
import { MAX_HOSPITAL_RADIUS } from '@libs/constants'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

export interface HRL_Entry {
  location_lat: number
  location_lng: number
  status: REQUEST_STATUSES
  driver_id: number | null
  dev_id: number
  /** Request ID*/
  req_id: number
  approxDistance: number
}

interface QueryHRL extends RowDataPacket, HRL_Entry {}

/** Hospital Request List Response, contains list of paitients to serve */
export type HRL_Response = HRL_Entry[]
export type HRL_ReqData = {
  /** Last fetched request id, required for optimization also gives offset to fetch only new requests */
  last_req_id?: number
}

export interface CustomNextApiRequest extends NextApiRequest {
  body: HRL_ReqData
}

interface LocationCoords {
  lat: number
  lng: number
}

interface LocationQuery extends RowDataPacket, LocationCoords {}

/** Request Details Fetch Query*/
interface DetailsFetchQuery extends RowDataPacket, HRL_Entry {}

const getWithInRange = (
  hospital: LocationCoords,
  locs: DetailsFetchQuery[]
) => {
  return locs
    .map((device) => {
      const approxDistance = calculateDistance(
        device.location_lat,
        device.location_lng,
        hospital.lat,
        hospital.lng
      )

      return { ...device, approxDistance }
    })
    .filter(({ approxDistance }) => approxDistance < MAX_HOSPITAL_RADIUS)
    .sort((a, b) => a.approxDistance - b.approxDistance)
}

const getHospitalLocation = async (hospital_id: number) => {
  const [[result]] = await conn.query<LocationQuery[]>(
    'SELECT loc_lat AS lat, loc_lng AS lng FROM HOSPITALS WHERE id = ? LIMIT 1',
    [hospital_id]
  )

  return result
}

const handler = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<HRL_Response>
) => {
  const hospital_id = getAccountID(res)
  const last_req_id = req.body.last_req_id || -1
  const hos_loc_coords = await getHospitalLocation(hospital_id)
  // console.log(hos_loc_coords)

  // const [result] = await conn.query<QueryHRL[]>(
  //   'SELECT DISTINCT id AS req_id, location_lat, location_lng, status, driver_id, dev_id FROM REQUEST_STATUS WHERE hospital_id = ? AND id > ? ORDER BY req_id DESC',
  //   [hospital_id, last_req_id]
  // )

  const [requests] = await conn.query<DetailsFetchQuery[]>(
    'SELECT id AS req_id, location_lat, location_lng, status, driver_id, dev_id FROM REQUEST_STATUS',
    [hospital_id]
  )

  const result = getWithInRange(hos_loc_coords, requests)
  // console.log(result)

  res.status(200).json(result)
}

export default handler

// location_lat: number
// location_lng: number
// status: REQUEST_STATUSES
// driver_id: number | null
// dev_id: number
// /** Request ID*/
// req_id: number

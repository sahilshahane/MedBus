import { getAccountID, getSQLConnection } from '@libs/server-side'
import { REQUEST_STATUSES } from '@typedef/authenticate'
import { RowDataPacket } from 'mysql2'
import { NextApiRequest, NextApiResponse } from 'next'

const conn = getSQLConnection()

export interface update_loc_ReqData {
  loc_lat: number
  loc_lng: number
}
export interface update_loc_ResData {
  message?: string
}

interface CustomNextApiRequest extends NextApiRequest {
  body: update_loc_ReqData
  query: {
    request_id: string
  }
}

interface RequestDetailsQuery extends RowDataPacket {
  status: REQUEST_STATUSES
  req_id: number
  driver_loc_lat: number
  driver_loc_lng: number
}

const isValidRequest = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<update_loc_ResData>
) => {
  const driver_id = getAccountID(res)
  const request_id = Number(req.query.request_id)

  const [result] = await conn.query<RequestDetailsQuery[]>(
    'SELECT id AS req_id, status, driver_loc_lat, driver_loc_lng FROM REQUEST_STATUS WHERE id = ? AND driver_id = ? LIMIT 1',
    [request_id, driver_id]
  )

  return result.length ? result[0] : undefined
}

const handler = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<update_loc_ResData>
) => {
  const { loc_lat, loc_lng } = req.body

  if (!loc_lat || !loc_lng) {
    res.status(200).json({
      message: 'Please provide loc_lat & loc_lng',
    })

    return
  }
  const request_details = await isValidRequest(req, res)

  if (!request_details) {
    res.status(200).json({
      message: '(Forbidden) Invalid Request',
    })
    return
  }

  if (
    request_details.driver_loc_lat === loc_lat &&
    request_details.driver_loc_lng === loc_lng
  ) {
    res.status(200).json({
      message: 'Please Prove different coordinates',
    })

    return
  }

  const { request_id } = req.query

  // UPDATE DRIVER's LOCATION
  await conn.query(
    'UPDATE REQUEST_STATUS SET driver_loc_lat = ?, driver_loc_lng = ? WHERE id = ?',
    [loc_lat, loc_lng, request_id]
  )

  // console.table({
  //   type: 'location update',
  //   request_id: request_id,
  //   driver_id: getAccountID(res),
  //   lat: loc_lat,
  //   lng: loc_lng,
  // })

  res.status(200).json({
    message: 'location updated!',
  })
}

export default handler

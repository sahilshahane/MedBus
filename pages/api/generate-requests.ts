import type { NextApiRequest, NextApiResponse } from 'next'
import { DEV_ID_COOKIE_NAME } from '@libs/constants'
import {
  GenerateRequestResponse,
  NearestHospitalRequestData,
} from '@typedef/googleMaps'
import { getSQLConnection } from '@libs/server-side'
import { RowDataPacket } from 'mysql2'
const conn = getSQLConnection()

interface NextApiRequestCustom extends NextApiRequest {
  body: NearestHospitalRequestData
}

const checkPreviousRequests = async (req: NextApiRequestCustom) => {
  const [result] = await conn.query<RowDataPacket[]>(
    'SELECT id FROM REQUEST_STATUS WHERE dev_id = ? LIMIT 1',
    [req.cookies[DEV_ID_COOKIE_NAME]]
  )

  return result.length
}

const handler = async (
  req: NextApiRequestCustom,
  res: NextApiResponse<GenerateRequestResponse>
) => {
  try {
    // CHECK IF USER HAS MADE PREVIOUS REQUESTS
    if (await checkPreviousRequests(req)) {
      // res.redirect('/check-request')

      res.status(200).json({
        success: true,
      })
      return
    }

    const { loc_lat, loc_lng } = req.body

    // ADD REQUEST TO DB
    await conn.query(
      'insert into REQUEST_STATUS (location_lat, location_lng, dev_id, status, brought_by) VALUES (?, ?, ?, "pending", "driver");',
      [loc_lat, loc_lng, req.cookies[DEV_ID_COOKIE_NAME]]
    )

    res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    if (typeof error === 'object') {
      res.status(400).json({
        success: false,
        // @ts-expect-error
        message: error.message,
        // @ts-expect-error
        specific_message: error?.response?.data?.error_message,
      })
    }
  }
}
export default handler

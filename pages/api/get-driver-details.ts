import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from '@libs/JWTVerification'
import sql, { RowDataPacket } from 'mysql2'
import {
  AuthenticateResponse,
  REQUEST_STATUSES,
  SignInRequestData,
} from '@typedef/authenticate'
import { DEV_ID_COOKIE_NAME, HOSPITAL_DASHBOARD_URL } from '@libs/constants'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

interface NextApiRequestCustom extends NextApiRequest {}

export interface DRIVER_DETAILS_RESPONSE {
  position: {
    lat: number
    lng: number
  }
}

interface DRIVER_QUERY_RESULT extends RowDataPacket {
  driver_lat: number
  driver_lng: number
}

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse<DRIVER_DETAILS_RESPONSE>
) {
  const DEV_ID = req.cookies[DEV_ID_COOKIE_NAME]

  try {
    const [query_result] = await conn.query<DRIVER_QUERY_RESULT[]>(
      'SELECT driver_loc_lat AS driver_lat, driver_loc_lng AS driver_lng FROM REQUEST_STATUS WHERE dev_id = ? LIMIT 1',
      [DEV_ID]
    )

    if (query_result.length === 0) {
      res.status(404).end()
      return
    }

    const driverDetails = query_result[0]

    if (!driverDetails.driver_lat || !driverDetails.driver_lng) {
      res.status(404).end()
    }

    res.json({
      position: {
        lat: driverDetails.driver_lat,
        lng: driverDetails.driver_lng,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      res.statusMessage = error.message
    }

    res.status(400).end()
  }
}

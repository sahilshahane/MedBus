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

export interface PATIENT_DETAILS_RESPONSE {
  position: {
    lat: number
    lng: number
  }
}

interface PATIENT_QUERY_RESULT extends RowDataPacket {
  location_lat: number
  location_lng: number
}

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse<PATIENT_DETAILS_RESPONSE>
) {
  const DEV_ID = req.cookies[DEV_ID_COOKIE_NAME]

  try {
    const [query_result] = await conn.query<PATIENT_QUERY_RESULT[]>(
      'SELECT location_lat, location_lng FROM REQUEST_STATUS WHERE dev_id = ?',
      [DEV_ID]
    )

    if (query_result.length === 0) {
      res.status(404).end()
      return
    }

    const patientDetails = query_result[0]

    res.json({
      position: {
        lat: patientDetails.location_lat,
        lng: patientDetails.location_lng,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      res.statusMessage = error.message
    }

    res.status(400).end()
  }
}

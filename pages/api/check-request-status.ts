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

interface NextApiRequestCustom extends NextApiRequest {
  body: {
    /** SELECTED hospital ID */
    selected_hos: number
  }
}

enum STATUS_TYPES {
  PENDING,
  APPROVED,
  ARRVING,
  RETURNING,
  HOSPITALIZED,
  INVALID,
}

export interface REQUEST_STATUS_RESPONSE {
  status?: REQUEST_STATUSES | 'invalid'

  /** No. of hospitals in the range (range in @lib/constants) */
  hos_area?: number
  error?: {
    message: any
    title: any
  }
}

interface STATUS_QUERY_RESULT extends RowDataPacket {
  status: REQUEST_STATUSES
}

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse<REQUEST_STATUS_RESPONSE>
) {
  const DEV_ID = req.cookies[DEV_ID_COOKIE_NAME]

  try {
    res.status(200)

    const [query_result] = await conn.query<STATUS_QUERY_RESULT[]>(
      'SELECT status, driver_loc_lat, driver_loc_lng, hospital_duration, hospital_distance FROM REQUEST_STATUS WHERE dev_id = ?',
      [DEV_ID]
    )

    if (query_result.length === 0) {
      res.json({
        status: 'invalid',
      })

      return
    }

    res.json({
      status: query_result[0].status,
    })
  } catch (_error) {
    let code = 400
    let message, title
    const error: any = _error
    console.error(_error)
    res.status(code).json({
      error: {
        message: 'Something went wrong',
        title,
      },
    })
  }
}

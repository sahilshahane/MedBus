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
  body: any
}

type STATUS_TYPES =
  | 'pending'
  | 'approved'
  | 'arriving'
  | 'returning'
  | 'hospitalized'

export interface STATUS_DETAILS_RESPONSE {
  status?: STATUS_TYPES | 'invalid'
}

interface STATUS_QUERY_RESULT extends RowDataPacket {
  status: STATUS_TYPES
}

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse<STATUS_DETAILS_RESPONSE>
) {
  const DEV_ID = req.cookies[DEV_ID_COOKIE_NAME]

  try {
    res.status(200)

    const [query_result] = await conn.query<STATUS_QUERY_RESULT[]>(
      'SELECT status FROM REQUEST_STATUS WHERE dev_id = ?',
      [DEV_ID]
    )

    if (query_result.length === 0) {
      res.json({
        status: 'invalid',
      })

      return
    }

    const statusDetails = query_result[0]

    res.json({
      status: statusDetails.status,
    })
  } catch (error) {
    if (error instanceof Error) {
      res.statusMessage = error.message
    }

    res.status(400)
  }
}

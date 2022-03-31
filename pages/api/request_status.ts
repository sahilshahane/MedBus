import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from '@libs/JWTVerification'
import sql, { RowDataPacket } from 'mysql2'
import {
  AuthenticateResponse,
  REQUEST_STATUSES,
  SignInRequestData,
} from '@typedef/authenticate'
import { HOSPITAL_DASHBOARD_URL } from '@libs/constants'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

interface NextApiRequestCustom extends NextApiRequest {
  body: {
    REQUEST_ID: string
  }
}

export interface REQUEST_STATUS_RESPONSE {
  status?: REQUEST_STATUSES
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
  const { REQUEST_ID } = req.body
  try {
    const [[result]] = await conn.query<STATUS_QUERY_RESULT[]>(
      'SELECT status FROM REQUEST_STATUS WHERE req_id = ?',
      [REQUEST_ID]
    )

    res.status(200).json({
      status: result.status,
    })
  } catch (_error) {
    let code = 400
    let message, title
    const error: any = _error

    res.status(code).json({
      error: {
        message: 'Something went wrong',
        title,
      },
    })
  }
}

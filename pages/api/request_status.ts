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

const status_strTenum = (status: REQUEST_STATUSES) => {
  switch (status) {
    case 'pending':
      return STATUS_TYPES.PENDING
    case 'approved':
      return STATUS_TYPES.APPROVED
    case 'arriving':
      return STATUS_TYPES.ARRVING
    case 'returning':
      return STATUS_TYPES.RETURNING
    case 'hospitalized':
      return STATUS_TYPES.HOSPITALIZED
  }
}

const status_enumTstr = (status: STATUS_TYPES) => {
  switch (status) {
    case STATUS_TYPES.PENDING:
      return 'pending'
    case STATUS_TYPES.APPROVED:
      return 'approved'
    case STATUS_TYPES.ARRVING:
      return 'arriving'
    case STATUS_TYPES.RETURNING:
      return 'returning'
    case STATUS_TYPES.HOSPITALIZED:
      return 'hospitalized'
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
      'SELECT status FROM REQUEST_STATUS WHERE dev_id = ?',
      [DEV_ID]
    )

    if (query_result.length === 0) {
      res.json({
        status: 'invalid',
      })

      return
    }
    /** ALL STATUSes are converted to enum STATUES for faster efficiency*/
    const result = query_result.map((req_data) => ({
      ...req_data,
      status: status_strTenum(req_data.status),
    }))

    const not_pending = result.filter(
      ({ status }) => status !== STATUS_TYPES.PENDING
    )

    if (not_pending.length === 0) {
      res.json({
        status: 'pending',
        hos_area: result.length,
      })

      return
    }

    const selected_hospital = not_pending.sort((a, b) => b.status - a.status)[0]

    res.json({
      status: status_enumTstr(selected_hospital.status),
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

import type { NextApiRequest, NextApiResponse } from 'next'
import { createJWT, setCookie } from '@libs/JWTVerification'
import sql, { RowDataPacket } from 'mysql2'
import {
  AuthenticateResponse,
  REQUEST_STATUSES,
  SignInRequestData,
} from '@typedef/authenticate'
import { DEV_ID_COOKIE_NAME, HOSPITAL_DASHBOARD_URL } from '@libs/constants'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

interface NextApiRequestCustom extends NextApiRequest {}

export interface GENERATE_LOCATION_LINK_RESPONSE {
  link: string
}

interface DRIVER_QUERY_RESULT extends RowDataPacket {
  driver_lat: number
  driver_lng: number
}

export interface LOCATION_LINK_TOKEN_DATA {
  dev_id: string
}

const getLink = (data: LOCATION_LINK_TOKEN_DATA) => {
  return createJWT(JSON.stringify(data).replaceAll('"', '.'))
}

export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse<GENERATE_LOCATION_LINK_RESPONSE>
) {
  const DEV_ID = req.cookies[DEV_ID_COOKIE_NAME]

  const [query_result] = await conn.query<DRIVER_QUERY_RESULT[]>(
    'SELECT id FROM REQUEST_STATUS WHERE dev_id = ? LIMIT 1',
    [DEV_ID]
  )

  if (query_result.length === 0) {
    return res.status(404).end()
  }

  const LINK = 'https://' + req.headers.host + '/api/shared-location/' + DEV_ID

  res.status(200).write(LINK)
  res.end()
}

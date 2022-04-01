import { NextApiHandler } from 'next'
import sql, { RowDataPacket } from 'mysql2'
import { REQUEST_STATUSES } from '@typedef/authenticate'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

interface HRL_Entry {
  location_lat: number
  location_lng: number
  status: REQUEST_STATUSES
  driver_id: number | null
}

interface QueryHRL extends RowDataPacket, HRL_Entry {}

/** Hospital Request List Response, contains list of paitients to serve */
export type HRL_Response = HRL_Entry[]

const handler: NextApiHandler<HRL_Response> = async (req, res) => {
  const account_id = res.getHeader('account_id')
  res.removeHeader('account_id')

  const [result] = await conn.query<QueryHRL[]>(
    'SELECT DISTINCT location_lat, location_lng, status, driver_id FROM REQUEST_STATUS WHERE hospital_id = ?',
    [account_id]
  )

  res.status(200).json(result)
}

export default handler

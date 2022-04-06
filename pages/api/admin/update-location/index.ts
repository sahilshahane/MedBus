import { getAccountID, getSQLConnection } from '@libs/server-side'
import { REQUEST_STATUSES } from '@typedef/authenticate'
import { RowDataPacket } from 'mysql2'
import { NextApiRequest, NextApiResponse } from 'next'

const conn = getSQLConnection()

export interface update_loc_res {
  req_id: number | null
}

interface CustomNextApiRequest extends NextApiRequest {
  body: any
}

interface RequestDetailsQuery extends RowDataPacket {
  req_id: number
}

const isValidRequest = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<update_loc_res>
) => {
  const driver_id = getAccountID(res)

  const [result] = await conn.query<RequestDetailsQuery[]>(
    'SELECT id AS req_id FROM REQUEST_STATUS WHERE driver_id = ? LIMIT 1',
    [driver_id]
  )

  return result.length ? result[0] : undefined
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<update_loc_res>
) => {
  const request_details = await isValidRequest(req, res)

  if (!request_details) {
    res.status(200).json({
      req_id: null,
    })
    return
  }

  res.status(200).json({
    req_id: request_details.req_id,
  })
}

export default handler

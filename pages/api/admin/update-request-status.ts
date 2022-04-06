import { getAccountID, getSQLConnection } from '@libs/server-side'
import { REQUEST_STATUSES } from '@typedef/authenticate'
import { RowDataPacket } from 'mysql2'
import { NextApiRequest, NextApiResponse } from 'next'

const conn = getSQLConnection()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const driver_id = getAccountID(res)
  const { status } = req.body

  await conn.query('UPDATE REQUEST_STATUS SET status = ? WHERE driver_id = ?', [
    status,
    driver_id,
  ])

  res.status(200).end()
}

export default handler

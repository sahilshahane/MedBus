import { NextApiHandler } from 'next'
import { getSQLConnection } from '@libs/server-side'
import { RowDataPacket } from 'mysql2'
import { TokenData } from '@libs/JWTVerification'

const conn = getSQLConnection()

const handler: NextApiHandler = async (req, res) => {
  const { uid: account_id, accountType } = req.body as TokenData

  const [result] = await conn.query<RowDataPacket[]>(
    'SELECT id, type FROM ACCOUNTS WHERE type = ? AND id = ? LIMIT 1',
    [accountType, account_id]
  )

  if (result.length > 0)
    res.status(200).json({
      result,
    })
  else res.status(404).end()
}

export default handler

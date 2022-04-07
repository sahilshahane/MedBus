import { NextApiHandler } from 'next'
import { getSQLConnection } from '@libs/server-side'
import { RowDataPacket } from 'mysql2'
import { setCookie, TokenData, verifyJWT } from '@libs/JWTVerification'
import { serialize } from 'cookie'
import { DEV_ID_COOKIE_NAME } from '@libs/constants'

const handler: NextApiHandler = async (req, res) => {
  const { DEV_ID } = req.query
  res
    .status(200)
    .setHeader(
      'Set-Cookie',
      serialize(DEV_ID_COOKIE_NAME, DEV_ID as string, {
        path: '/',
      })
    )
    .redirect('/check-request')
}

export default handler

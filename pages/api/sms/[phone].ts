import { SMS } from '@libs/server-side'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const { phone } = req.query

  SMS(Number(phone), 'hi from twilio!')
}

export default handler

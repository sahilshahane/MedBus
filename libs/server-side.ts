import sql from 'mysql2'
import { NextApiResponse } from 'next'
import { ACCOUNT_ID_HEADER } from '@libs/constants'
import twilio from 'twilio'

export const getSQLConnection = () =>
  sql.createConnection(process.env.MY_SQL_URI || '').promise()

export const getAccountID = (res: NextApiResponse) =>
  Number(res.getHeader(ACCOUNT_ID_HEADER))

export const getTwilioClient = () =>
  twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export const SMS = async (phone_no: number, text: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`SMS TO ${phone_no} : ${text}`)
    return
  }

  const client = getTwilioClient()

  await client.messages
    .create({
      body: text,
      from: process.env.TWILIO_PHONE_NO,
      to: '+91' + phone_no,
    })
    .then((val) => {
      console.log('sms sent!', val)
    })
    .catch((err) => console.error(err))
    .finally(() => console.log('sms finally method'))
}

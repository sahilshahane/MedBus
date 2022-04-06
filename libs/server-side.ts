import sql from 'mysql2'
import { NextApiResponse } from 'next'
import { ACCOUNT_ID_HEADER } from '@libs/constants'

export const getSQLConnection = () =>
  sql.createConnection(process.env.MY_SQL_URI || '').promise()

export const getAccountID = (res: NextApiResponse) =>
  Number(res.getHeader(ACCOUNT_ID_HEADER))

export const SMS = async (phone_no: number, text: string) => {
  // TODO: IMPLEMENT TWILLO API
  // FOR NOW JUST DO CONSOLE LOG

  console.log(`SMS TO ${phone_no} : ${text}`)
}

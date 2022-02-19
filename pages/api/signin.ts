import type { NextApiRequest, NextApiResponse } from 'next'
import { createJWT, setCookie, verifyJWT } from '@libs/JWTVerification'
import { nanoid } from 'nanoid'
import sql, { QueryError } from 'mysql2'
import axios from 'axios'
import { AuthenticateResponse, SignInRequestData } from '@typedef/authenticate'
import { HOSPITAL_DASHBOARD_URL } from '@libs/constants'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

const getAccountType = async (account_id: string) => {
  const [result] = (await conn.query('SELECT type from ACCOUNTS WHERE id = ?', [
    account_id,
  ])) as any

  return result[0].type
}

class IncorrectCredentials {}
interface NextApiRequestCustom extends NextApiRequest {
  body: SignInRequestData
}
export default async function handler(
  req: NextApiRequestCustom,
  res: NextApiResponse<AuthenticateResponse>
) {
  const { email, password } = req.body
  try {
    // GET UID

    const [results] = (await conn.query(
      'SELECT id, type FROM ACCOUNTS WHERE email = ? AND password = ?',
      [email, password]
    )) as any

    if (!results.length) {
      throw new IncorrectCredentials()
    }

    const accountInfo = results[0]

    // USER_ID -> results[0].id
    setCookie(res, {
      uid: results[0].id,
    })

    const accountType = await getAccountType(accountInfo.id)

    res.status(200).json({
      title: 'Signin successfull',
      message: accountType === 'hospital' ? 'Redirecting to dashboard' : '',
      redirect: accountType === 'hospital' ? HOSPITAL_DASHBOARD_URL : '',
      type: accountType,
    })
  } catch (_error) {
    let code = 400
    let message, title
    const error: any = _error

    if (error instanceof IncorrectCredentials) {
      code = 404
      message = 'Incorrect username or password'
    }

    res.status(code).json({
      message,
      title,
    })
  }
}

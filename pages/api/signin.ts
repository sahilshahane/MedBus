import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from '@libs/JWTVerification'
import sql, { RowDataPacket } from 'mysql2'
import { AuthenticateResponse, SignInRequestData } from '@typedef/authenticate'
import { DRIVER_DASHBOARD_URL, HOSPITAL_DASHBOARD_URL } from '@libs/constants'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

type AccountTypes = 'hospital' | 'driver'

interface AccountTypeQuery extends RowDataPacket {
  type: AccountTypes
}

const getAccountType = async (account_id: string) => {
  const [[result]] = await conn.query<AccountTypeQuery[]>(
    'SELECT type from ACCOUNTS WHERE id = ?',
    [account_id]
  )

  return result.type
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

    const accountType = await getAccountType(accountInfo.id)

    // USER_ID -> results[0].id
    setCookie(res, {
      uid: accountInfo.id,
      accountType,
    })

    res.status(200).json({
      title: 'Signin successfull',
      message:
        accountType === 'hospital'
          ? 'Redirecting to dashboard'
          : 'Redirecting to dashboard',
      redirect:
        accountType === 'hospital'
          ? HOSPITAL_DASHBOARD_URL
          : DRIVER_DASHBOARD_URL,
      type: accountType,
    })
  } catch (_error) {
    console.error(_error)
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

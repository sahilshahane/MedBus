import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from '@libs/JWTVerification'
import sql, { RowDataPacket } from 'mysql2'
import {
  AccountTypes,
  AuthenticateResponse,
  HospitalSignUpReqestData,
} from '@typedef/authenticate'
import getPlaceNameByPlaceID from '@libs/googleMapsAPI'
import { HOSPITAL_DASHBOARD_URL } from './constants'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

interface NextApiRequestCustom extends NextApiRequest {
  body: HospitalSignUpReqestData
}

interface AccountQuery extends RowDataPacket {
  type: AccountTypes
  id: number
}

const HospitalSignup = async (
  req: NextApiRequestCustom,
  res: NextApiResponse<AuthenticateResponse>,
  hospital_placeid: string
) => {
  const { email, password, type } = req.body
  try {
    let { geometry, name: hospital_name } = await getPlaceNameByPlaceID(
      hospital_placeid
    )
    if (!hospital_name) throw new Error('Please provide a valid hospital name')

    // [TODO] CHECK IF ACCOUNT EXISTS

    // ADD ACCOUNT
    await conn.execute(
      'INSERT INTO ACCOUNTS(email,password,type) VALUES (?,?,?);',
      [email, password, type]
    )

    // GET ACCOUNT ID
    const [[accountInfo]] = await conn.query<AccountQuery[]>(
      'SELECT id, type FROM ACCOUNTS WHERE email = ?',
      [email]
    )

    // SET HOSPITAL DATA
    await conn.execute(
      'INSERT into HOSPITALS(place_id, name, id, loc_lat, loc_lng) VALUES(?,?,?,?,?);',
      [
        hospital_placeid,
        hospital_name,
        accountInfo.id,
        geometry?.location.lat,
        geometry?.location.lng,
      ]
    )

    // SET ACCOUNT AUTHORIZATION COOKIE
    setCookie(res, {
      uid: String(accountInfo.id),
      accountType: accountInfo.type,
    })

    res.status(200).json({
      title: 'Registered successfully',
      message: 'Redirecting to dashboard',
      redirect: HOSPITAL_DASHBOARD_URL,
    })
  } catch (_error) {
    let code = 400
    let message, title
    const error: any = _error

    if (error instanceof Object) {
      console.error(error.message)
      message = error.message
      if (error.code === 'ER_DUP_ENTRY') {
        code = 409
        message = 'Account already exists'
      }
    }

    res.status(code).json({
      message,
      title,
    })
  }
}

export default HospitalSignup

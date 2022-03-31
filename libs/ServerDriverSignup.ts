import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from '@libs/JWTVerification'
import sql from 'mysql2'
import {
  AuthenticateResponse,
  DriverSignUpReqestData,
} from '@typedef/authenticate'

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

class Hospital404 extends Error {
  message = 'Hospital Does not Exists'
}

const getHospitalID = async (place_id: string) => {
  const [result] = (await conn.query(
    'SELECT id from HOSPITALS WHERE place_id = ?',
    [place_id]
  )) as any

  if (!result.length) throw new Hospital404()

  return result[0].id as string
}

interface NextApiRequestCustom extends NextApiRequest {
  body: DriverSignUpReqestData
}

const DriverSignUp = async (
  req: NextApiRequestCustom,
  res: NextApiResponse<AuthenticateResponse>
) => {
  const { email, password, type, hospital_placeid, driver_name, phone } =
    req.body
  try {
    const hospital_id = await getHospitalID(hospital_placeid)

    // ADD ACCOUNT
    await conn.execute(
      'INSERT INTO ACCOUNTS(email,password,type) VALUES (?,?,?);',
      [email, password, type]
    )

    // GET ACCOUNT ID
    const [results] = (await conn.query(
      'SELECT id FROM ACCOUNTS WHERE email = ?',
      [email]
    )) as any

    const accountInfo = results[0]

    // SET DRIVER DATA
    await conn.execute(
      'INSERT into DRIVERS(id, hospital_id, name, phone) VALUES(?,?,?,?);',
      [accountInfo.id, hospital_id, driver_name, phone]
    )

    // USER_ID -> results[0].id
    setCookie(res, {
      uid: accountInfo.id,
    })

    res.status(200).json({
      message: '',
      title: 'Registered successfully',
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

export default DriverSignUp

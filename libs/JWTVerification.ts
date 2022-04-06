import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import { USER_TOKEN, JWT_SECRETE_KEY } from '@libs/constants'
import { AccountTypes } from '@typedef/authenticate'

export interface TokenData {
  uid: string
  accountType: AccountTypes
}

export const setCookie = (res: NextApiResponse, data: TokenData) => {
  res.setHeader(
    'Set-Cookie',
    serialize(
      USER_TOKEN,
      createJWT(JSON.stringify(data).replaceAll('"', '.')),
      {
        path: '/',
      }
    )
  )
}

export const getUserData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const jwtToken = req.cookies[USER_TOKEN]

  if (!jwtToken) {
    return null
  }

  return verifyJWT(jwtToken)
}

export const createJWT = (token: any) => {
  return jwt.sign(token, process.env.JWT_SECRETE_KEY as string, {
    algorithm: 'HS384',
  })
}

export const verifyJWT = (token: string) => {
  try {
    const decoded_text = jwt
      .verify(token, JWT_SECRETE_KEY, {
        algorithms: ['HS384'],
      })
      .replaceAll('.', '"')

    return JSON.parse(decoded_text) as TokenData
  } catch (error) {}

  return null
}

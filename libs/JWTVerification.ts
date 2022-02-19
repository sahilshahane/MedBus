import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import { USER_TOKEN, JWT_SECRETE_KEY } from '@libs/constants'

interface TokenData {
  uid: string
}

export const setCookie = (res: NextApiResponse, data: TokenData) => {
  res.setHeader(
    'Set-Cookie',
    serialize(USER_TOKEN, createJWT(data), {
      path: '/',
    })
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

export const createJWT = (token: TokenData) => {
  return jwt.sign(token, process.env.JWT_SECRETE_KEY as string, {
    algorithm: 'HS384',
  })
}

export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRETE_KEY, {
      algorithms: ['HS384'],
    })
  } catch (error) {}

  return null
}

import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from '@libs/JWTVerification'
import sql from 'mysql2'
import { AuthenticateResponse } from '@typedef/authenticate'
import getPlaceNameByPlaceID from '@libs/getPlaceName'
import HospitalSignup from '@libs/ServerHospitalSignUp'
import DriverSignup from '@libs/ServerDriverSignup'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthenticateResponse>
) {
  console.log('Request Data :', req.body)
  const { type } = req.body
  if (type === 'hospital') HospitalSignup(req, res)
  else if (type === 'driver') DriverSignup(req, res)
}

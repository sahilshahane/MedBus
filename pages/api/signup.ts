import type { NextApiRequest, NextApiResponse } from 'next'
import { AuthenticateResponse } from '@typedef/authenticate'
import HospitalSignup from '@libs/ServerHospitalSignUp'
import DriverSignup from '@libs/ServerDriverSignup'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthenticateResponse>
) {
  console.log('Request Data :', req.body)
  const { type } = req.body
  if (type === 'hospital') await HospitalSignup(req, res)
  else if (type === 'driver') await DriverSignup(req, res)
}

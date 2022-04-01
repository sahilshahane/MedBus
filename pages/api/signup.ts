import type { NextApiRequest, NextApiResponse } from 'next'
import { AuthenticateResponse } from '@typedef/authenticate'
import HospitalSignup from '@libs/ServerHospitalSignUp'
import DriverSignup from '@libs/ServerDriverSignup'
import { getPlaceIDByAddress } from '@libs/googleMapsAPI'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthenticateResponse>
) {
  console.log('Request Data :', req.body)
  const { type, hospital_address } = req.body

  let { place_id } = await getPlaceIDByAddress(hospital_address)

  if (!place_id) {
    res.status(404).json({
      message: 'Hospital Not Found, enter proper address',
    })

    return
  }

  if (type === 'hospital') await HospitalSignup(req, res, place_id)
  else if (type === 'driver') await DriverSignup(req, res, place_id)
}

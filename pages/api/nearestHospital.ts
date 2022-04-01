import type { NextApiRequest, NextApiResponse } from 'next'
import { createJWT, setCookie, verifyJWT } from '@libs/JWTVerification'
import { nanoid } from 'nanoid'
import sql, { QueryError, RowDataPacket } from 'mysql2'
import axios from 'axios'
import { AuthenticateResponse, SignInRequestData } from '@typedef/authenticate'
import { HOSPITAL_DASHBOARD_URL, MAX_HOSPITAL_ENTRIES } from '@libs/constants'
import { calculateDistance } from '@libs/googleMapsAPI'
import {
  NearestHospitalRequestData,
  NearestHospitalResponseData,
} from '@typedef/googleMaps'
import { Client, LatLng } from '@googlemaps/google-maps-services-js'
const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

const gMap = new Client({})

interface HospitalData {
  place_id: string
  loc_lat: number
  loc_lng: number
  name: string
}

interface HospitalQuery extends RowDataPacket, HospitalData {}
interface NextApiRequestCustom extends NextApiRequest {
  body: NearestHospitalRequestData
}

const handler = async (
  req: NextApiRequestCustom,
  res: NextApiResponse<NearestHospitalResponseData>
) => {
  try {
    const { loc_lat, loc_lng } = req.body
    console.log(req.body)
    const [result] = await conn.query<HospitalQuery[]>(
      'SELECT name, place_id, loc_lat, loc_lng FROM HOSPITALS'
    )

    const sortedHospitals = result
      .map((place) => {
        const approxDistance = calculateDistance(
          loc_lat,
          loc_lng,
          place.loc_lat,
          place.loc_lng
        )

        return {
          name: place.name,
          hospital_placeid: place.place_id,
          approxDistance,
          hos_loc_lat: place.loc_lat,
          hos_loc_lng: place.loc_lng,
        }
      })
      .sort((a, b) => a.approxDistance - b.approxDistance)
      // GET MAXIMUM HOSPITAL LIST - 5
      .slice(0, MAX_HOSPITAL_ENTRIES)

    const hospitalCoordinates = sortedHospitals.map(
      ({ hos_loc_lat, hos_loc_lng }) => [hos_loc_lat, hos_loc_lng]
    ) as LatLng[]

    // CALCULATES DISTANCE BETWEEN GIVEN LOCATION WITH NEAREST HOSPITAL FOUND IN OUR DATABASE
    // DISTANCE MATRIX API WILL GIVE DISTANCE & TIME DURATION INFORMATION
    const gMapRes = await gMap.distancematrix({
      params: {
        key: process.env.SERVER_GOOGLE_MAPS_KEY as string,
        client_id: 'server',
        destinations: hospitalCoordinates,
        origins: [[loc_lat, loc_lng]] as LatLng[],
      },
    })

    console.log(JSON.stringify(gMapRes.data, null, 2))

    const combinedData = gMapRes.data.rows[0].elements.map(
      ({ distance, duration }, idx) => {
        return {
          ...sortedHospitals[idx],
          distance: distance?.text,
          duration: duration?.text,
        }
      }
    )

    // console.log(sortedHospitals)

    //@ts-expect-error
    res.status(200).json(combinedData)
  } catch (err) {
    res.status(400).json({
      // @ts-expect-error
      err,
    })
    console.error(err)
  }
}
export default handler

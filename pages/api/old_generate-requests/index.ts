import type { NextApiRequest, NextApiResponse } from 'next'
import { createJWT, setCookie, verifyJWT } from '@libs/JWTVerification'
import { nanoid } from 'nanoid'
import sql, { QueryError, RowDataPacket } from 'mysql2'
import axios from 'axios'
import { AuthenticateResponse, SignInRequestData } from '@typedef/authenticate'
import { DEV_ID_COOKIE_NAME, MAX_HOSPITAL_ENTRIES } from '@libs/constants'
import { calculateDistance } from '@libs/googleMapsAPI'
import {
  GenerateRequestResponse,
  NearestHospitalRequestData,
  NearestHospitalResponseData,
} from '@typedef/googleMaps'
import { Client, LatLng } from '@googlemaps/google-maps-services-js'
import { Coordinates } from '@hooks/useStaticLocation'
import genUniqueID from '@libs/genUniqueDevID'
const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

const gMap = new Client({})

interface HospitalData {
  place_id: string
  loc_lat: number
  loc_lng: number
  name: string
  id: number
}

interface HospitalQuery extends RowDataPacket, HospitalData {}

interface NextApiRequestCustom extends NextApiRequest {
  body: NearestHospitalRequestData
}

const makeRequest = async (
  req: NextApiRequestCustom,
  data: NearestHospitalResponseData
) => {
  const { loc_lat, loc_lng } = req.body
  const REQ_ID = genUniqueID(10)
  const results = await Promise.all(
    data.map((hospital) => {
      return conn.query(
        'insert into REQUEST_STATUS (hospital_id,  location_lat, location_lng, req_id, dev_id, status, brought_by) VALUES (?, ?, ?, ?, ?, "pending", "driver");',
        [hospital.id, loc_lat, loc_lng, REQ_ID, req.cookies[DEV_ID_COOKIE_NAME]]
      )
    })
  )

  return REQ_ID
}

const handler = async (
  req: NextApiRequestCustom,
  res: NextApiResponse<GenerateRequestResponse>
) => {
  try {
    const { loc_lat, loc_lng } = req.body

    const [result] = await conn.query<HospitalQuery[]>(
      'SELECT id, name, place_id, loc_lat, loc_lng FROM HOSPITALS'
    )

    const hospital_list = result
      .map((hospital) => {
        const approxDistance = calculateDistance(
          loc_lat,
          loc_lng,
          hospital.loc_lat,
          hospital.loc_lng
        )

        return {
          name: hospital.name,
          hospital_placeid: hospital.place_id,
          approxDistance,
          hos_loc_lat: hospital.loc_lat,
          hos_loc_lng: hospital.loc_lng,
          id: hospital.id,
        }
      })
      .sort((a, b) => a.approxDistance - b.approxDistance)
      // GET ONLY MAXIMUM HOSPITAL LIST ENTRIES - 1
      .slice(0, MAX_HOSPITAL_ENTRIES)

    const hospitalCoordinates = hospital_list.map(
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

    // console.log(JSON.stringify(gMapRes.data, null, 2))

    const HospitalEntryData = gMapRes.data.rows[0].elements
      .map(({ distance, duration }, idx) => {
        return {
          ...hospital_list[idx],
          distance: distance?.value,
          duration: duration?.value,
        }
      })
      .sort((p1, p2) => p1.duration - p2.duration)

    // console.log(hospital_list)
    const REQ_ID = await makeRequest(req, HospitalEntryData)

    res.status(200).json({
      REQUEST_ID: REQ_ID,
    })
  } catch (err) {
    res.status(400).json({
      // @ts-expect-error
      err,
    })
    console.error(err)
  }
}
export default handler

/*

CREATE TABLE `REQUEST_STATUS` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hospital_id` int NOT NULL,
  `driver_id` int DEFAULT NULL,
  `status` enum('pending','approved','arriving','returning','hospitalized') DEFAULT NULL,
  `brought_by` enum('helping_person','driver') NOT NULL,
  `location_lat` double NOT NULL,
  `location_lng` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


*/

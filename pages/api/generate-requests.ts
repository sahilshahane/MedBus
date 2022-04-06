import type { NextApiRequest, NextApiResponse } from 'next'
import { createJWT, setCookie, verifyJWT } from '@libs/JWTVerification'
import { nanoid } from 'nanoid'
import sql, { QueryError, RowDataPacket } from 'mysql2'
import axios from 'axios'
import { AuthenticateResponse, SignInRequestData } from '@typedef/authenticate'
import {
  DEV_ID_COOKIE_NAME,
  MAX_HOSPITAL_ENTRIES,
  MAX_HOSPITAL_RADIUS,
} from '@libs/constants'
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

const checkPreviousRequests = async (req: NextApiRequestCustom) => {
  const [result] = await conn.query(
    'SELECT id FROM REQUEST_STATUS WHERE dev_id = ? LIMIT 1',
    [req.cookies[DEV_ID_COOKIE_NAME]]
  )

  // @ts-expect-error
  return result.length
}

const handler = async (
  req: NextApiRequestCustom,
  res: NextApiResponse<GenerateRequestResponse>
) => {
  try {
    // CHECK IF USER HAS MADE PREVIOUS REQUESTS
    if (await checkPreviousRequests(req)) {
      // res.redirect('/check-request')

      res.status(200).json({
        success: true,
      })
      return
    }

    const { loc_lat, loc_lng } = req.body

    // ADD REQUEST TO DB
    await conn.query(
      'insert into REQUEST_STATUS (location_lat, location_lng, dev_id, status, brought_by) VALUES (?, ?, ?, "pending", "driver");',
      [loc_lat, loc_lng, req.cookies[DEV_ID_COOKIE_NAME]]
    )

    res.status(200).json({
      success: true,
    })

    return

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
          hos_name: hospital.name,
          hospital_placeid: hospital.place_id,
          approxDistance,
          hos_loc_lat: hospital.loc_lat,
          hos_loc_lng: hospital.loc_lng,
          id: hospital.id,
        }
      })
      .filter(({ approxDistance }) => approxDistance < MAX_HOSPITAL_RADIUS)
      .sort((a, b) => a.approxDistance - b.approxDistance)

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
    //
    const HospitalEntryData = gMapRes.data.rows[0].elements
      .map(({ distance, duration }, idx) => {
        return {
          ...hospital_list[idx],
          distance: distance?.value,
          duration: duration?.value,
        }
      })
      // GOOGLE API GIVES DISTANCE IN METERS, 1 km = 1000 m
      .filter(({ distance }) => distance / 1000 < MAX_HOSPITAL_RADIUS)
      .sort((a, b) => a.distance - b.distance)

    res.status(200).json({
      success: true,
    })
  } catch (error) {
    if (typeof error === 'object') {
      res.status(400).json({
        success: false,
        // @ts-expect-error
        message: error.message,
        // @ts-expect-error
        specific_message: error?.response?.data?.error_message,
      })
    }
  }
}
export default handler

// CREATE TABLE REQUEST_STATUS (
//  id INT AUTO_INCREMENT PRIMARY KEY,
//  hospital_id INT REFERENCES HOSPITALS(id),
//  driver_id INT REFERENCES DRIVERS(id),
//  status ENUM("pending","approved","arriving","returning","hospitalized"),
//  brought_by ENUM("helping_person","driver") NOT NULL,
//  location_lat DOUBLE NOT NULL,
//  location_lng DOUBLE NOT NULL,
//  dev_id VARCHAR(20) NOT NULL,
//  hospital_duration INT,
//  hospital_distance INT,
//  driver_loc_lat DOUBLE,
//  driver_loc_lng DOUBLE
// );

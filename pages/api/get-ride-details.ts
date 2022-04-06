import { Client, LatLng } from '@googlemaps/google-maps-services-js'
import { DEV_ID_COOKIE_NAME } from '@libs/constants'
import { calculateDistance } from '@libs/googleMapsAPI'
import { getSQLConnection } from '@libs/server-side'
import { REQUEST_STATUSES } from '@typedef/authenticate'
import { RowDataPacket } from 'mysql2'
import { NextApiRequest, NextApiResponse } from 'next'

export interface RIDE_DETAILS_RESPONSE {
  time: {
    /** Gives human readable form text of time  */
    text: string
    /** Gives value in secs */
    value: number
  }

  distance: {
    text: string
    value: number
  }
}

interface QueryResult extends RowDataPacket {
  status: REQUEST_STATUSES
  location_lat: number
  location_lng: number
  driver_loc_lat: number
  driver_loc_lng: number
  hospital_id: number
}

const conn = getSQLConnection()
const gMap = new Client({})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<RIDE_DETAILS_RESPONSE>
) => {
  const DEV_ID = req.cookies[DEV_ID_COOKIE_NAME]

  const [result] = await conn.query<QueryResult[]>(
    'SELECT status, location_lat, location_lng, driver_loc_lat, driver_loc_lng, hospital_id FROM REQUEST_STATUS WHERE dev_id = ?',
    [DEV_ID]
  )

  if (result.length === 0) {
    res.status(404).end()
  }
  const request_details = result[0]

  const {
    status,
    location_lat,
    location_lng,
    driver_loc_lat,
    driver_loc_lng,
    hospital_id,
  } = request_details

  if (
    status === 'pending' ||
    !hospital_id ||
    status === 'hospitalized' ||
    !driver_loc_lat ||
    !driver_loc_lng
  )
    return res.status(200).json({
      time: {
        text: '',
        value: 0,
      },
      distance: {
        text: '',
        value: 0,
      },
    })

  // FOR DEVELOPMENT

  if (process.env.NODE_ENV === 'development') {
    const approxDistance = calculateDistance(
      location_lat,
      location_lng,
      driver_loc_lat,
      driver_loc_lng
    )

    return res.status(200).json({
      time: { text: '[development time]', value: 0 },
      distance: {
        text: `${(approxDistance / 100).toFixed(2)} Km`,
        value: approxDistance,
      },
    })
  }

  const gMapRes = await gMap.distancematrix({
    params: {
      key: process.env.SERVER_GOOGLE_MAPS_KEY as string,
      client_id: 'server',
      destinations: [[location_lat, location_lng]] as LatLng[],
      origins: [[driver_loc_lat, driver_loc_lng]] as LatLng[],
    },
  })

  const DATA = gMapRes.data.rows[0].elements[0]

  res.status(200).json({ time: DATA.duration, distance: DATA.distance })
}

export default handler

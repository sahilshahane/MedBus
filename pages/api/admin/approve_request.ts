import { NextApiRequest, NextApiResponse } from 'next'
import sql, { ResultSetHeader, RowDataPacket } from 'mysql2'
import { getAccountID, getSQLConnection, SMS } from '@libs/server-side'
import { HRL_Entry } from './get_request_list'
import { REQUEST_STATUSES } from '@typedef/authenticate'

const conn = getSQLConnection()

export interface approve_req_data {
  req_id: number
  dev_id: number
}

export interface approve_req_res {
  message?: string
  success?: boolean
}

interface AvailDriverQuery extends RowDataPacket {
  driver_id: number
}

interface DriverDetailsQuery extends RowDataPacket {
  phone: number
  name: string
}

const getAvailableDriver = async (
  req: CustomNextApiRequest,
  hospital_id: number
) => {
  const [result] = await conn.query<AvailDriverQuery[]>(
    'SELECT id AS driver_id FROM DRIVERS WHERE id NOT IN (SELECT driver_id AS id FROM REQUEST_STATUS WHERE hospital_id = ?) AND hospital_id = ? LIMIT 1;',
    [hospital_id, hospital_id]
  )

  return {
    driver_id: (result.length && result[0].driver_id) || -1,
  }
}

interface CustomNextApiRequest extends NextApiRequest {
  body: approve_req_data
}

const NotifyDriver = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<approve_req_res>
) => {
  const { req_id } = req.body

  const [[driverDetail]] = await conn.query<DriverDetailsQuery[]>(
    'SELECT phone, name FROM DRIVERS WHERE id IN (SELECT driver_id AS id FROM REQUEST_STATUS WHERE id = ?) LIMIT 1;',
    [req_id]
  )
  const SITE_URL = res.getHeader('origin') + '/update-location/' + req_id
  const msg = `A patient has been allocated to you, Please Visit ${SITE_URL} link to track the ambulance`

  SMS(driverDetail.phone, msg)
}

const handler = async (
  req: CustomNextApiRequest,
  res: NextApiResponse<approve_req_res>
) => {
  const { req_id, dev_id } = req.body

  const hospital_id = getAccountID(res)
  const { driver_id } = await getAvailableDriver(req, hospital_id)

  if (driver_id == -1) {
    res.status(200).json({
      message: 'All drivers are allocated, please wait until driver arrives',
    })

    return
  }

  // ASSIGN DRIVER & UPDATE STATUS to approved
  const [update_result] = await conn.query<ResultSetHeader>(
    'UPDATE REQUEST_STATUS SET hospital_id = ?, driver_id = ?, status = "approved" WHERE id = ? AND hospital_id IS NULL',
    [hospital_id, driver_id, req_id]
  )

  if (update_result.affectedRows === 0) {
    res.status(200).json({
      success: false,
      message: 'Looks like patient got allotted to different hospital',
    })

    return
  }

  // [TODO] SEND SMS (LINK) TO DRIVER
  await NotifyDriver(req, res)

  res.status(200).json({
    success: true,
    message: 'Driver allocated',
  })
}

export default handler

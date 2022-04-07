import { DEV_ID_COOKIE_NAME } from '@libs/constants'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import sql, { RowDataPacket } from 'mysql2'
import { SMS } from '@libs/server-side'

interface SITUATION_NOTIFY_REQ_DATA {
  phone: string
}

interface CustomApiRequest extends NextApiRequest {
  body: SITUATION_NOTIFY_REQ_DATA
}

interface REQUEST_STATUS_QUERY_RESULT extends RowDataPacket {
  hospital_id: number
  req_id: number
}

interface HOSPITAL_DETAILS_QUERY_RESULT extends RowDataPacket {
  address: string
  phone: string
  name: string
}

const conn = sql.createConnection(process.env.MY_SQL_URI || '').promise()

const generateLink = (req: CustomApiRequest) => {
  const DEV_ID = req.cookies[DEV_ID_COOKIE_NAME]

  return 'https://' + req.headers.host + '/api/shared-location/' + DEV_ID
}

const handler = async (req: CustomApiRequest, res: NextApiResponse) => {
  const DEV_ID = req.cookies[DEV_ID_COOKIE_NAME]
  const { phone } = req.body

  const [query_result] = await conn.query<REQUEST_STATUS_QUERY_RESULT[]>(
    'SELECT hospital_id, id as req_id FROM REQUEST_STATUS WHERE dev_id = ? LIMIT 1',
    [DEV_ID]
  )

  if (query_result.length === 0) {
    res.statusMessage = 'Request / Device Not found'
    return res.status(404).end()
  }

  const { hospital_id, req_id } = query_result[0]

  const [[hospital_details]] = await conn.query<
    HOSPITAL_DETAILS_QUERY_RESULT[]
  >(
    'SELECT place_id, name, address, phone FROM HOSPITALS WHERE id = ? LIMIT 1',
    [hospital_id]
  )

  const Link = generateLink(req)
  const MSG = `One of your friend has been injured\nReal Time Tracking Link - ${Link}\nHospital name - ${hospital_details.name}\nHospital Phone no - ${hospital_details.phone}\nHospital Address - ${hospital_details.address}`

  SMS(Number(phone), MSG)
  res.status(200).end()
}

export default handler

// if (!process.env.JWT_SECRETE_KEY) {
//   throw 'Please set JWT_SECRETE_KEY variable'
// }

// if (!process.env.USER_TOKEN) {
//   throw 'Please set USER_TOKEN variable'
// }

export const USER_TOKEN = process.env.USER_TOKEN as string
export const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY as string
export const HOSPITAL_DASHBOARD_URL = '/hospital/admin/dashboard'
export const DRIVER_DASHBOARD_URL = '/update-location'
export const DEV_ID_COOKIE_NAME = 'dev_id'
export const MAX_HOSPITAL_ENTRIES = 1
export const REQ_ID_COOKIE = 'req_id'
/** MAX RADIUS FOR HOSPITAL (in meters)*/
export const MAX_HOSPITAL_RADIUS = 20_000
export const ACCOUNT_ID_HEADER = 'account-id'
export const DRIVER_LOC_UPDATE_TIME = 3000

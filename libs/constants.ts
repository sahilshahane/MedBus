if (!process.env.JWT_SECRETE_KEY) {
  throw 'Please set JWT_SECRETE_KEY variable'
}

if (!process.env.USER_TOKEN) {
  throw 'Please set USER_TOKEN variable'
}

export const USER_TOKEN = process.env.USER_TOKEN as string
export const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY as string
export const HOSPITAL_DASHBOARD_URL = '/hospital/admin/dashboard'
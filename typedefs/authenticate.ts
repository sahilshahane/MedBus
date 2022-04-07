import { NextApiRequest } from 'next'

type StatusKind = 'error' | 'loading' | 'success' | 'info'

interface Status {
  type: StatusKind
  enabled?: boolean
  message?: string
  title?: string
}

type OperationType = 'signin' | 'signup'

interface AuthenticateResponse {
  message?: string
  title?: string
  type?: AccountTypes
  redirect?: string
}
type SendDataFuncType = (
  URL: string,
  data: any,
  redirectURL?: string
) => Promise<any>

type AccountTypes = 'hospital' | 'driver'

interface HospitalSignUpReqestData {
  email: string
  password: string
  type: 'hospital'
  hospital_address: string
  phone: string
}

interface DriverSignUpReqestData {
  email: string
  password: string
  type: 'driver'
  hospital_address: string
  driver_name: string
  phone: string
}

interface SignInRequestData {
  email: string
  password: string
}

type REQUEST_STATUSES =
  | 'pending'
  | 'approved'
  | 'arriving'
  | 'returning'
  | 'hospitalized'

export type {
  HospitalSignUpReqestData,
  DriverSignUpReqestData,
  SignInRequestData,
  Status,
  OperationType,
  StatusKind,
  AuthenticateResponse,
  SendDataFuncType,
  AccountTypes,
  REQUEST_STATUSES,
}

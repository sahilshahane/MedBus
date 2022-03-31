import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { DEV_ID_COOKIE_NAME } from '@libs/constants'
import genUniqueDevID from '../libs/genUniqueDevID'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const res = NextResponse.next()

  if (!req.cookies[DEV_ID_COOKIE_NAME]) {
    res.cookie(DEV_ID_COOKIE_NAME, genUniqueDevID(10), {
      path: '/',
    })
  }

  return res
}

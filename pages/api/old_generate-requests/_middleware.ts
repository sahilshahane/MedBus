import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { REQ_ID_COOKIE } from '@libs/constants'
import genUniqueID from '@libs/genUniqueDevID'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const res = NextResponse.next()

  if (!req.cookies[REQ_ID_COOKIE]) {
    res.cookie(REQ_ID_COOKIE, genUniqueID(10), {
      path: '/',
    })
  }

  // return res
}

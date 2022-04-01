import { verifyJWT } from '@libs/JWTVerification'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { USER_TOKEN } from '@libs/constants'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const token = req.cookies[USER_TOKEN]
  const user_data = verifyJWT(token)

  if (!token || user_data === null) {
    return NextResponse.redirect(req.nextUrl.origin + '/auth')
  }
  const res = NextResponse.next()

  // @ts-expect-error
  res.headers.set('account_id', user_data.uid)

  return res
}

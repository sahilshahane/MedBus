import { verifyJWT } from '@libs/JWTVerification'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { USER_TOKEN } from '@libs/constants'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const token = req.cookies[USER_TOKEN]

  if (!token || verifyJWT(token) === null) {
    return NextResponse.redirect('/auth')
  }

  return NextResponse.next()
}

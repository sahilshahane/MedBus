import { verifyJWT } from '@libs/JWTVerification'
import { USER_TOKEN } from '@libs/constants'
// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest } from 'next/server'
import { AccountTypes } from '@typedef/authenticate'

const withAuth = async (
  req: NextRequest,
  NextResponse: any,
  accountType: AccountTypes | null = null
) => {
  const redirect = () => NextResponse.redirect(req.nextUrl.origin + '/auth')

  const token = req.cookies[USER_TOKEN]
  if (!token) return redirect()

  const data = verifyJWT(token)
  if (!data) return redirect()
  if (accountType && accountType !== data.accountType) return redirect()

  const AccExists =
    (
      await fetch(req.nextUrl.origin + '/api/account_exists', {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
          'Content-Type': ' application/json; charset=UTF-8',
        },
      })
    ).status === 200

  console.log(`[${data.accountType}] account exists : ${AccExists}`)

  if (!AccExists) return redirect()

  return NextResponse.next()
}

export default withAuth

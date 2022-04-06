import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import withAuth from '@middlewares/withAuth'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  return await withAuth(req, NextResponse)
}

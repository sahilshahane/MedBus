import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const CheckRequest: NextPage = () => {
  const router = useRouter()
  const { request_id } = router.query

  return <></>
}

export default CheckRequest

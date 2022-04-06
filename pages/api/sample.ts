import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  // throw new Error()
  res.status(200).json(['a', 'b', 'c', 'd', 'e', 'f', new Date()])
}

export default handler
